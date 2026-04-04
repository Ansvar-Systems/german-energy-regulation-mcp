/**
 * Combined ingestion for all 4 German energy regulators.
 *
 * Inserts regulatory content sourced from:
 *   - Bundesnetzagentur (bundesnetzagentur.de) — Verordnungen, Festlegungen
 *   - German TSOs (netztransparenz.de) — VDE-AR-N grid codes, Redispatch 2.0
 *   - BMWK (bmwk.de) — EnWG, EEG, KWKG, Energiewende policy
 *   - BfE (bfe.bund.de) — nuclear safety, Standortauswahlgesetz
 *
 * Usage:
 *   npx tsx scripts/ingest-all.ts
 *   npx tsx scripts/ingest-all.ts --force   # drop and recreate
 */

import Database from "better-sqlite3";
import { existsSync, mkdirSync, unlinkSync } from "node:fs";
import { dirname } from "node:path";
import { SCHEMA_SQL } from "../src/db.js";

const DB_PATH = process.env["DE_ENERGY_DB_PATH"] ?? "data/de-energy.db";
const force = process.argv.includes("--force");

const dir = dirname(DB_PATH);
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
if (force && existsSync(DB_PATH)) {
  unlinkSync(DB_PATH);
  console.log(`Deleted ${DB_PATH}`);
}

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
db.exec(SCHEMA_SQL);

// ═══════════════════════════════════════════════════════════════
// REGULATORS
// ═══════════════════════════════════════════════════════════════

const regulators = [
  { id: "bnetza", name: "Bundesnetzagentur", full_name: "Bundesnetzagentur (BNetzA)", url: "https://bundesnetzagentur.de", description: "Federal Network Agency — energy market regulation, incentive regulation (Anreizregulierung), network access, tariff approvals, market monitoring, enforcement of EnWG and related Verordnungen" },
  { id: "tso", name: "German TSOs", full_name: "German TSOs (50Hertz, Amprion, TenneT DE, TransnetBW)", url: "https://netztransparenz.de", description: "Germany's four TSOs — high-voltage grid management, VDE-AR-N grid codes, Redispatch 2.0, Netzentwicklungsplan, grid connection requirements" },
  { id: "bmwk", name: "BMWK", full_name: "Bundesministerium fur Wirtschaft und Klimaschutz (BMWK)", url: "https://bmwk.de", description: "Federal Ministry for Economic Affairs and Climate Action — Energiewende policy, EnWG, EEG, KWKG, hydrogen strategy, energy efficiency, climate protection" },
  { id: "bfe", name: "BfE", full_name: "Bundesamt fur die Sicherheit der nuklearen Entsorgung (BfE)", url: "https://bfe.bund.de", description: "Federal Office for the Safety of Nuclear Waste Management — nuclear safety regulation, repository site selection (Standortauswahlgesetz), transport, decommissioning" },
];

const insertReg = db.prepare("INSERT OR IGNORE INTO regulators (id, name, full_name, url, description) VALUES (?, ?, ?, ?, ?)");
for (const r of regulators) insertReg.run(r.id, r.name, r.full_name, r.url, r.description);
console.log(`Inserted ${regulators.length} regulators`);

// ═══════════════════════════════════════════════════════════════
// REGULATIONS (BNetzA + BMWK + BfE)
// ═══════════════════════════════════════════════════════════════

db.prepare("DELETE FROM regulations").run();

const insertRegulation = db.prepare(`
  INSERT INTO regulations (regulator_id, reference, title, text, type, status, effective_date, url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

// Placeholder: populated by full ingestion pipeline
const allRegs: string[][] = [];

const insertRegBatch = db.transaction(() => {
  for (const r of allRegs) {
    insertRegulation.run(r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7]);
  }
});
insertRegBatch();
const bnetzaCount = allRegs.filter(r => r[0] === "bnetza").length;
const bmwkCount = allRegs.filter(r => r[0] === "bmwk").length;
const bfeCount = allRegs.filter(r => r[0] === "bfe").length;
console.log(`Inserted ${bnetzaCount} BNetzA + ${bmwkCount} BMWK + ${bfeCount} BfE = ${allRegs.length} regulations`);

// ═══════════════════════════════════════════════════════════════
// GRID CODES (German TSOs)
// ═══════════════════════════════════════════════════════════════

db.prepare("DELETE FROM grid_codes").run();

const insertGridCode = db.prepare(`
  INSERT INTO grid_codes (reference, title, text, code_type, version, effective_date, url) VALUES (?, ?, ?, ?, ?, ?, ?)
`);

// Placeholder: populated by full ingestion pipeline
const allGridCodes: string[][] = [];

const insertGCBatch = db.transaction(() => {
  for (const g of allGridCodes) {
    insertGridCode.run(g[0], g[1], g[2], g[3], g[4], g[5], g[6]);
  }
});
insertGCBatch();
console.log(`Inserted ${allGridCodes.length} German TSO grid codes`);

// ═══════════════════════════════════════════════════════════════
// DECISIONS (BNetzA Beschlusskammer)
// ═══════════════════════════════════════════════════════════════

db.prepare("DELETE FROM decisions").run();

const insertDecision = db.prepare(`
  INSERT INTO decisions (reference, title, text, decision_type, date_decided, parties, url) VALUES (?, ?, ?, ?, ?, ?, ?)
`);

// Placeholder: populated by full ingestion pipeline
const allDecisions: string[][] = [];

const insertDecBatch = db.transaction(() => {
  for (const d of allDecisions) {
    insertDecision.run(d[0], d[1], d[2], d[3], d[4], d[5], d[6]);
  }
});
insertDecBatch();
console.log(`Inserted ${allDecisions.length} BNetzA Beschlusskammer decisions`);

// ═══════════════════════════════════════════════════════════════
// REBUILD FTS INDEXES
// ═══════════════════════════════════════════════════════════════

db.exec("INSERT INTO regulations_fts(regulations_fts) VALUES('rebuild')");
db.exec("INSERT INTO grid_codes_fts(grid_codes_fts) VALUES('rebuild')");
db.exec("INSERT INTO decisions_fts(decisions_fts) VALUES('rebuild')");

// ═══════════════════════════════════════════════════════════════
// DB METADATA
// ═══════════════════════════════════════════════════════════════

db.exec(`CREATE TABLE IF NOT EXISTS db_metadata (
  key   TEXT PRIMARY KEY,
  value TEXT,
  last_updated TEXT DEFAULT (datetime('now'))
)`);

const stats = {
  regulators: (db.prepare("SELECT count(*) as n FROM regulators").get() as { n: number }).n,
  regulations: (db.prepare("SELECT count(*) as n FROM regulations").get() as { n: number }).n,
  grid_codes: (db.prepare("SELECT count(*) as n FROM grid_codes").get() as { n: number }).n,
  decisions: (db.prepare("SELECT count(*) as n FROM decisions").get() as { n: number }).n,
  bnetza: (db.prepare("SELECT count(*) as n FROM regulations WHERE regulator_id = 'bnetza'").get() as { n: number }).n,
  bmwk: (db.prepare("SELECT count(*) as n FROM regulations WHERE regulator_id = 'bmwk'").get() as { n: number }).n,
  bfe: (db.prepare("SELECT count(*) as n FROM regulations WHERE regulator_id = 'bfe'").get() as { n: number }).n,
};

const insertMeta = db.prepare("INSERT OR REPLACE INTO db_metadata (key, value) VALUES (?, ?)");
insertMeta.run("schema_version", "1.0");
insertMeta.run("tier", "free");
insertMeta.run("domain", "german-energy-regulation");
insertMeta.run("build_date", new Date().toISOString().split("T")[0]);
insertMeta.run("regulations_count", String(stats.regulations));
insertMeta.run("grid_codes_count", String(stats.grid_codes));
insertMeta.run("decisions_count", String(stats.decisions));
insertMeta.run("total_records", String(stats.regulations + stats.grid_codes + stats.decisions));

console.log(`\nDatabase summary:`);
console.log(`  Regulators:         ${stats.regulators}`);
console.log(`  Regulations:        ${stats.regulations} (BNetzA: ${stats.bnetza}, BMWK: ${stats.bmwk}, BfE: ${stats.bfe})`);
console.log(`  Grid codes:         ${stats.grid_codes} (German TSOs)`);
console.log(`  Decisions:          ${stats.decisions} (BNetzA Beschlusskammer)`);
console.log(`  Total documents:    ${stats.regulations + stats.grid_codes + stats.decisions}`);
console.log(`\nDone. Database at ${DB_PATH}`);

db.close();
