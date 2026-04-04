/**
 * Seed the German Energy Regulation database with sample data for testing.
 *
 * Inserts representative regulations, grid codes, and decisions from:
 *   - Bundesnetzagentur (BNetzA) — incentive regulation, market rules
 *   - BMWK — Energiewende policy, EnWG, EEG
 *   - BfE — nuclear safety
 *   - German TSOs — VDE-AR-N grid codes, Redispatch 2.0
 *
 * Usage:
 *   npx tsx scripts/seed-sample.ts
 *   npx tsx scripts/seed-sample.ts --force   # drop and recreate
 */

import Database from "better-sqlite3";
import { existsSync, mkdirSync, unlinkSync } from "node:fs";
import { dirname } from "node:path";
import { SCHEMA_SQL } from "../src/db.js";

const DB_PATH = process.env["DE_ENERGY_DB_PATH"] ?? "data/de-energy.db";
const force = process.argv.includes("--force");

const dir = dirname(DB_PATH);
if (!existsSync(dir)) {
  mkdirSync(dir, { recursive: true });
}

if (force && existsSync(DB_PATH)) {
  unlinkSync(DB_PATH);
  console.log(`Deleted existing database at ${DB_PATH}`);
}

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
db.exec(SCHEMA_SQL);

console.log(`Database initialised at ${DB_PATH}`);

// -- Regulators --

const regulators = [
  {
    id: "bnetza",
    name: "Bundesnetzagentur",
    full_name: "Bundesnetzagentur (BNetzA)",
    url: "https://bundesnetzagentur.de",
    description:
      "Federal Network Agency — responsible for energy market regulation, incentive regulation (Anreizregulierung), network access, tariff approvals, market monitoring, and enforcement of EnWG and related Verordnungen.",
  },
  {
    id: "tso",
    name: "German TSOs",
    full_name: "German TSOs (50Hertz, Amprion, TenneT DE, TransnetBW)",
    url: "https://netztransparenz.de",
    description:
      "Germany's four transmission system operators — manage the high-voltage electricity grid, set grid codes (VDE-AR-N), Redispatch 2.0 rules, grid development plans (Netzentwicklungsplan), and grid connection requirements.",
  },
  {
    id: "bmwk",
    name: "BMWK",
    full_name: "Bundesministerium fur Wirtschaft und Klimaschutz (BMWK)",
    url: "https://bmwk.de",
    description:
      "Federal Ministry for Economic Affairs and Climate Action — responsible for energy policy (Energiewende), EnWG, EEG, KWKG, hydrogen strategy, energy efficiency, and climate protection legislation.",
  },
  {
    id: "bfe",
    name: "BfE",
    full_name: "Bundesamt fur die Sicherheit der nuklearen Entsorgung (BfE)",
    url: "https://bfe.bund.de",
    description:
      "Federal Office for the Safety of Nuclear Waste Management — responsible for nuclear safety regulation, repository site selection (Standortauswahlgesetz), transport of nuclear materials, and decommissioning oversight.",
  },
];

const insertRegulator = db.prepare(
  "INSERT OR IGNORE INTO regulators (id, name, full_name, url, description) VALUES (?, ?, ?, ?, ?)",
);

for (const r of regulators) {
  insertRegulator.run(r.id, r.name, r.full_name, r.url, r.description);
}
console.log(`Inserted ${regulators.length} regulators`);

// -- Regulations (BNetzA + BMWK + BfE) --

const regulations = [
  // BMWK — core energy legislation
  {
    regulator_id: "bmwk",
    reference: "EnWG",
    title: "Energiewirtschaftsgesetz (EnWG) — Gesetz uber die Elektrizitaets- und Gasversorgung",
    text: "Das Energiewirtschaftsgesetz (EnWG) regelt die leitungsgebundene Versorgung mit Elektrizitaet und Gas in Deutschland. Zweck des Gesetzes ist eine moeglichst sichere, preiswuerdige, verbraucherfreundliche, effiziente und umweltvertraegliche Versorgung der Allgemeinheit mit Elektrizitaet und Gas. Das Gesetz regelt die Entflechtung von Netzbetrieb und Erzeugung/Vertrieb (Unbundling), den Zugang zu Energieversorgungsnetzen, die Regulierung der Netzentgelte durch die Bundesnetzagentur, und die Organisation des Energiemarktes. Die Bundesnetzagentur ueberwacht die Einhaltung des EnWG.",
    type: "gesetz",
    status: "in_force",
    effective_date: "2005-07-07",
    url: "https://www.gesetze-im-internet.de/enwg_2005/",
  },
  {
    regulator_id: "bmwk",
    reference: "EEG 2023",
    title: "Erneuerbare-Energien-Gesetz 2023 (EEG 2023)",
    text: "Das Erneuerbare-Energien-Gesetz (EEG) ist das zentrale Steuerungsinstrument fuer den Ausbau der erneuerbaren Energien in Deutschland. Das EEG 2023 setzt das Ziel, den Anteil erneuerbarer Energien am Bruttostromverbrauch bis 2030 auf mindestens 80 Prozent zu steigern. Es regelt die Einspeiseverguetung und Marktpraemie fuer Strom aus Wind, Solar, Biomasse und Wasserkraft, das Ausschreibungsverfahren fuer grosse Anlagen, die EEG-Umlage (seit Juli 2022 auf null gesetzt), den Netzanschluss und die Abnahme von EE-Strom, sowie die Direktvermarktung. Das Gesetz wurde mehrfach novelliert und durch das Osterpaket 2022 grundlegend reformiert.",
    type: "gesetz",
    status: "in_force",
    effective_date: "2023-01-01",
    url: "https://www.gesetze-im-internet.de/eeg_2014/",
  },
  {
    regulator_id: "bmwk",
    reference: "KWKG 2023",
    title: "Kraft-Waerme-Kopplungsgesetz (KWKG 2023)",
    text: "Das Kraft-Waerme-Kopplungsgesetz (KWKG) foerdert die Stromerzeugung aus Kraft-Waerme-Kopplung (KWK) zur Erhoehung der Energieeffizienz und zur Reduzierung von CO2-Emissionen. Das Gesetz sieht Zuschlagszahlungen fuer KWK-Strom, Foerderung von Waermenetzen und Waermespeichern, sowie Ausschreibungen fuer grosse KWK-Anlagen vor. Der KWK-Zuschlag wird ueber eine Umlage auf den Strompreis finanziert. KWK-Anlagen muessen hocheffizient sein und einen bestimmten Nutzungsgrad erreichen.",
    type: "gesetz",
    status: "in_force",
    effective_date: "2023-01-01",
    url: "https://www.gesetze-im-internet.de/kwkg_2016/",
  },
  // BNetzA — Verordnungen
  {
    regulator_id: "bnetza",
    reference: "ARegV",
    title: "Anreizregulierungsverordnung (ARegV)",
    text: "Die Anreizregulierungsverordnung (ARegV) regelt die Anreizregulierung fuer Strom- und Gasnetzbetreiber in Deutschland. Sie legt die Methodik zur Bestimmung der Erlosobergrenzen fuer Netzbetreiber fest, einschliesslich des Effizienzvergleichs (Benchmarking), des Produktivitaetsfaktors, der Qualitaetsregulierung und der Behandlung von Investitionen. Die Regulierungsperioden betragen jeweils fuenf Jahre. Die Bundesnetzagentur setzt die Erlosobergrenzen auf Basis der Vorgaben der ARegV fest.",
    type: "verordnung",
    status: "in_force",
    effective_date: "2007-10-29",
    url: "https://www.gesetze-im-internet.de/aregv/",
  },
  {
    regulator_id: "bnetza",
    reference: "StromNEV",
    title: "Stromnetzentgeltverordnung (StromNEV)",
    text: "Die Stromnetzentgeltverordnung (StromNEV) regelt die Methodik zur Bestimmung der Netzentgelte fuer die Nutzung des Stromnetzes. Sie legt die Grundsaetze der Entgeltbildung fest, einschliesslich der Kostenrechnung, der Kapitalverzinsung, der Abschreibungen und der Behandlung von Verlusten. Die Netzentgelte muessen verursachungsgerecht, transparent und nicht-diskriminierend sein. Sonderregelungen gelten fuer stromintensive Unternehmen (individuelle Netzentgelte nach Paragraph 19 Absatz 2 StromNEV).",
    type: "verordnung",
    status: "in_force",
    effective_date: "2005-07-25",
    url: "https://www.gesetze-im-internet.de/stromnev/",
  },
  // BfE — nuclear safety
  {
    regulator_id: "bfe",
    reference: "StandAG",
    title: "Standortauswahlgesetz (StandAG) — Gesetz zur Suche und Auswahl eines Standortes fuer ein Endlager fuer hochradioaktive Abfaelle",
    text: "Das Standortauswahlgesetz (StandAG) regelt das Verfahren zur Suche und Auswahl eines Standortes fuer ein Endlager fuer hochradioaktive Abfaelle in Deutschland. Das Verfahren ist ergebnisoffen und umfasst drei Phasen: Ermittlung von Teilgebieten, uebertaegige Erkundung, und untertaegige Erkundung. Die Standortentscheidung soll bis 2031 getroffen werden. Das Bundesamt fuer die Sicherheit der nuklearen Entsorgung (BfE) ist die Regulierungsbehoerde, die Bundesgesellschaft fuer Endlagerung (BGE) fuehrt das Standortauswahlverfahren durch. Oeffentlichkeitsbeteiligung ist in allen Phasen vorgesehen.",
    type: "gesetz",
    status: "in_force",
    effective_date: "2017-07-23",
    url: "https://www.gesetze-im-internet.de/standag_2017/",
  },
];

const insertRegulation = db.prepare(`
  INSERT INTO regulations (regulator_id, reference, title, text, type, status, effective_date, url)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertRegsAll = db.transaction(() => {
  for (const r of regulations) {
    insertRegulation.run(
      r.regulator_id, r.reference, r.title, r.text, r.type, r.status, r.effective_date, r.url,
    );
  }
});
insertRegsAll();
console.log(`Inserted ${regulations.length} regulations`);

// -- Grid codes (German TSOs) --

const gridCodes = [
  {
    reference: "VDE-AR-N 4105",
    title: "Erzeugungsanlagen am Niederspannungsnetz — Technische Mindestanforderungen fuer Anschluss und Parallelbetrieb",
    text: "Die VDE-Anwendungsregel VDE-AR-N 4105 legt die technischen Mindestanforderungen fuer den Anschluss und den Parallelbetrieb von Erzeugungsanlagen am Niederspannungsnetz fest. Sie gilt fuer alle Erzeugungsanlagen (Photovoltaik, kleine Windkraftanlagen, BHKW, Batteriespeicher) mit einer Anschlussleistung bis 135 kW. Die Anforderungen umfassen Wirkleistungssteuerung, Blindleistungsbereitstellung, Frequenzabhaengige Leistungsreduzierung, Spannungshaltung, Netz- und Anlagenschutz, sowie Anforderungen an den Netzanschlusspunkt.",
    code_type: "technical_regulation",
    version: "2018-11",
    effective_date: "2018-11-01",
    url: "https://www.vde.com/de/fnn/themen/tar/tar-niederspannung/erzeugungsanlagen-am-niederspannungsnetz",
  },
  {
    reference: "VDE-AR-N 4110",
    title: "Technische Anschlussregeln Mittelspannung (TAR Mittelspannung)",
    text: "Die VDE-Anwendungsregel VDE-AR-N 4110 regelt die technischen Anforderungen fuer den Anschluss von Erzeugungsanlagen, Speichern und Verbrauchern am Mittelspannungsnetz (1 kV bis 36 kV). Die Anforderungen umfassen Wirkleistungssteuerung, Blindleistungsbereitstellung, Frequenz- und Spannungshaltung, Fault-Ride-Through (FRT), Netz- und Anlagenschutz, Kommunikationsanbindung (IEC 61850), sowie Anforderungen an die Netzvertraeglichkeit. Der Netzbetreiber fuehrt vor Anschluss eine Netzvertraeglichkeitspruefung durch.",
    code_type: "technical_regulation",
    version: "2018-11",
    effective_date: "2018-11-01",
    url: "https://www.vde.com/de/fnn/themen/tar/tar-mittelspannung",
  },
  {
    reference: "Redispatch 2.0",
    title: "Redispatch 2.0 — Einspeisemanagement und Redispatch fuer alle Erzeugungsanlagen",
    text: "Redispatch 2.0 regelt seit dem 1. Oktober 2021 das Engpassmanagement im deutschen Stromnetz. Im Gegensatz zum bisherigen Einspeisemanagement werden nun alle Erzeugungsanlagen ab 100 kW sowie steuerbare Verbrauchseinrichtungen in das Redispatch-Verfahren einbezogen. Die vier Uebertragungsnetzbetreiber koordinieren den Prozess und koennen Erzeugungsanlagen hoch- oder herunterfahren, um Netzengpaesse zu beheben. Betroffene Anlagenbetreiber erhalten eine finanzielle Kompensation. Die Regelung basiert auf dem NABEG (Netzausbaubeschleunigungsgesetz) und erfordert den Datenaustausch ueber die Connect+-Plattform.",
    code_type: "market_regulation",
    version: "2.0",
    effective_date: "2021-10-01",
    url: "https://www.netztransparenz.de/EnWG/Redispatch",
  },
];

const insertGridCode = db.prepare(`
  INSERT INTO grid_codes (reference, title, text, code_type, version, effective_date, url)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const insertGridAll = db.transaction(() => {
  for (const g of gridCodes) {
    insertGridCode.run(g.reference, g.title, g.text, g.code_type, g.version, g.effective_date, g.url);
  }
});
insertGridAll();
console.log(`Inserted ${gridCodes.length} grid codes`);

// -- Decisions (BNetzA Beschlusskammer) --

const decisions = [
  {
    reference: "BK4-22-123",
    title: "Festlegung der Erlosobergrenzen fuer die vierte Regulierungsperiode Strom (2024-2028)",
    text: "Die Beschlusskammer 4 der Bundesnetzagentur hat die Erlosobergrenzen fuer die vierte Regulierungsperiode Strom (2024-2028) festgelegt. Die Erlosobergrenzen bestimmen die maximal zulaessigen Erloese, die Stromnetzbetreiber aus Netzentgelten erzielen duerfen. Die Festlegung basiert auf dem Effizienzvergleich (Benchmarking) der Netzbetreiber, dem generellen sektoralen Produktivitaetsfaktor, und den anerkannten Investitionskosten. Die Erlosobergrenzen werden jaehrlich angepasst unter Beruecksichtigung des Verbraucherpreisindex und des Erweiterungsfaktors.",
    decision_type: "revenue_cap",
    date_decided: "2023-12-15",
    parties: "Alle Stromnetzbetreiber",
    url: "https://www.bundesnetzagentur.de/DE/Beschlusskammern/BK04/BK4_node.html",
  },
  {
    reference: "BK6-22-300",
    title: "Festlegung zur Marktkommunikation im Rahmen von Redispatch 2.0",
    text: "Die Beschlusskammer 6 der Bundesnetzagentur hat Festlegungen zur Marktkommunikation im Rahmen von Redispatch 2.0 getroffen. Die Festlegung regelt die Kommunikationsprozesse zwischen Uebertragungsnetzbetreibern, Verteilnetzbetreibern und Anlagenbetreibern bei Redispatch-Massnahmen. Sie definiert die Datenformate, Fristen und Verantwortlichkeiten fuer die Abwicklung von Redispatch-Massnahmen und deren finanzieller Kompensation.",
    decision_type: "methodology",
    date_decided: "2023-06-01",
    parties: "50Hertz, Amprion, TenneT DE, TransnetBW, Verteilnetzbetreiber",
    url: "https://www.bundesnetzagentur.de/DE/Beschlusskammern/BK06/BK6_node.html",
  },
  {
    reference: "BK8-23-001",
    title: "Festlegung individueller Netzentgelte nach Paragraph 19 Abs. 2 StromNEV",
    text: "Die Beschlusskammer 8 der Bundesnetzagentur hat ueber die Genehmigung individueller Netzentgelte fuer stromintensive Unternehmen entschieden. Unternehmen mit einer Benutzungsstundenzahl von mehr als 7.000 Stunden pro Jahr und einem Stromverbrauch von mehr als 10 GWh koennen reduzierte Netzentgelte beantragen. Die Reduzierung soll die internationale Wettbewerbsfaehigkeit stromintensiver Industrien sichern. Die Kosten der Netzentgeltreduzierung werden ueber die Paragraph-19-StromNEV-Umlage auf alle Stromverbraucher umgelegt.",
    decision_type: "tariff",
    date_decided: "2024-01-15",
    parties: "Stromintensive Industrieunternehmen, Stromnetzbetreiber",
    url: "https://www.bundesnetzagentur.de/DE/Beschlusskammern/BK08/BK8_node.html",
  },
];

const insertDecision = db.prepare(`
  INSERT INTO decisions (reference, title, text, decision_type, date_decided, parties, url)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const insertDecAll = db.transaction(() => {
  for (const d of decisions) {
    insertDecision.run(d.reference, d.title, d.text, d.decision_type, d.date_decided, d.parties, d.url);
  }
});
insertDecAll();
console.log(`Inserted ${decisions.length} decisions`);

// -- Summary --

const stats = {
  regulators: (db.prepare("SELECT count(*) as cnt FROM regulators").get() as { cnt: number }).cnt,
  regulations: (db.prepare("SELECT count(*) as cnt FROM regulations").get() as { cnt: number }).cnt,
  grid_codes: (db.prepare("SELECT count(*) as cnt FROM grid_codes").get() as { cnt: number }).cnt,
  decisions: (db.prepare("SELECT count(*) as cnt FROM decisions").get() as { cnt: number }).cnt,
  regulations_fts: (db.prepare("SELECT count(*) as cnt FROM regulations_fts").get() as { cnt: number }).cnt,
  grid_codes_fts: (db.prepare("SELECT count(*) as cnt FROM grid_codes_fts").get() as { cnt: number }).cnt,
  decisions_fts: (db.prepare("SELECT count(*) as cnt FROM decisions_fts").get() as { cnt: number }).cnt,
};

console.log(`\nDatabase summary:`);
console.log(`  Regulators:       ${stats.regulators}`);
console.log(`  Regulations:      ${stats.regulations} (FTS: ${stats.regulations_fts})`);
console.log(`  Grid codes:       ${stats.grid_codes} (FTS: ${stats.grid_codes_fts})`);
console.log(`  Decisions:        ${stats.decisions} (FTS: ${stats.decisions_fts})`);
console.log(`\nDone. Database ready at ${DB_PATH}`);

db.close();
