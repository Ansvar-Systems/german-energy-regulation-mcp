# German Energy Regulation MCP

MCP server for German energy sector regulations -- BNetzA incentive regulation, TSO grid codes, BMWK Energiewende policy, BfE nuclear safety.

[![npm version](https://badge.fury.io/js/@ansvar%2Fgerman-energy-regulation-mcp.svg)](https://www.npmjs.com/package/@ansvar/german-energy-regulation-mcp)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Covers four German energy regulators with full-text search across regulations, grid codes, and regulatory decisions. All data is in German.

Built by [Ansvar Systems](https://ansvar.eu) -- Stockholm, Sweden

---

## Regulators Covered

| Regulator | Role | Website |
|-----------|------|---------|
| **Bundesnetzagentur (BNetzA)** | Federal energy regulator, incentive regulation (ARegV), network tariffs, market rules | [bundesnetzagentur.de](https://bundesnetzagentur.de) |
| **German TSOs** (50Hertz, Amprion, TenneT DE, TransnetBW) | Grid codes (VDE-AR-N), Redispatch 2.0, grid development plan, balancing | [netztransparenz.de](https://netztransparenz.de) |
| **BMWK** (Federal Ministry for Economic Affairs and Climate Action) | Energiewende policy, EEG, KWKG, hydrogen strategy, energy efficiency | [bmwk.de](https://bmwk.de) |
| **BfE** (Federal Office for Nuclear Waste Disposal Safety) | Nuclear safety, site selection, radioactive waste disposal | [bfe.bund.de](https://bfe.bund.de) |

---

## Quick Start

### Use Remotely (No Install Needed)

**Endpoint:** `https://mcp.ansvar.eu/german-energy-regulation/mcp`

| Client | How to Connect |
|--------|---------------|
| **Claude Desktop** | Add to `claude_desktop_config.json` (see below) |
| **Claude Code** | `claude mcp add german-energy-regulation --transport http https://mcp.ansvar.eu/german-energy-regulation/mcp` |

**Claude Desktop** -- add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "german-energy-regulation": {
      "type": "url",
      "url": "https://mcp.ansvar.eu/german-energy-regulation/mcp"
    }
  }
}
```

### Use Locally (npm)

```bash
npx @ansvar/german-energy-regulation-mcp
```

Or add to Claude Desktop config for stdio:

```json
{
  "mcpServers": {
    "german-energy-regulation": {
      "command": "npx",
      "args": ["-y", "@ansvar/german-energy-regulation-mcp"]
    }
  }
}
```

---

## Tools

| Tool | Description |
|------|-------------|
| `de_energy_search_regulations` | Full-text search across energy regulations from BNetzA, BMWK, and BfE |
| `de_energy_get_regulation` | Get a specific regulation by reference string (e.g., `EnWG`, `EEG 2023`) |
| `de_energy_search_grid_codes` | Search German TSO grid codes (VDE-AR-N), Redispatch 2.0 rules |
| `de_energy_get_grid_code` | Get a specific grid code document by database ID |
| `de_energy_search_decisions` | Search BNetzA Beschlusskammer decisions on network tariffs and revenue caps |
| `de_energy_about` | Return server metadata: version, regulators, tool list, data coverage |
| `de_energy_list_sources` | List data sources with record counts and provenance URLs |
| `de_energy_check_data_freshness` | Check data freshness and staleness status for each source |

Full tool documentation: [TOOLS.md](TOOLS.md)

---

## Data Coverage

| Source | Records | Content |
|--------|---------|---------|
| BMWK | 157 regulations | EnWG, EEG, KWKG, Energiewende, hydrogen strategy, energy efficiency |
| BNetzA | 80 regulations | Incentive regulation (ARegV), Festlegungen, network tariff rules |
| TSOs | 28 regulations | VDE-AR-N standards, Redispatch 2.0, grid development plan |
| BfE | 26 regulations | Nuclear safety, site selection, radioactive waste disposal |
| German TSOs | 33 grid codes | VDE-AR-N technical regulations, Redispatch 2.0, Einspeisemanagement |
| BNetzA (decisions) | 60 decisions | Revenue caps, market monitoring, tariff determinations, benchmarking |
| **Total** | **384 records** | ~528 KB database |

**Language note:** All regulatory content is in German. Search queries work best in German (e.g., `Energiewirtschaftsgesetz`, `Netzentgelt`, `Erlosobergrenze`, `Redispatch`).

Full coverage details: [COVERAGE.md](COVERAGE.md)

---

## Data Sources

See [sources.yml](sources.yml) for machine-readable provenance metadata.

---

## Docker

```bash
docker build -t german-energy-regulation-mcp .
docker run --rm -p 3000:3000 -v /path/to/data:/app/data german-energy-regulation-mcp
```

Set `DE_ENERGY_DB_PATH` to use a custom database location (default: `data/de-energy.db`).

---

## Development

```bash
npm install
npm run build
npm run seed         # populate sample data
npm run dev          # HTTP server on port 3000
```

---

## Further Reading

- [TOOLS.md](TOOLS.md) -- full tool documentation with examples
- [COVERAGE.md](COVERAGE.md) -- data coverage and limitations
- [sources.yml](sources.yml) -- data provenance metadata
- [DISCLAIMER.md](DISCLAIMER.md) -- legal disclaimer
- [PRIVACY.md](PRIVACY.md) -- privacy policy
- [SECURITY.md](SECURITY.md) -- vulnerability disclosure

---

## License

Apache-2.0 -- [Ansvar Systems AB](https://ansvar.eu)

See [LICENSE](LICENSE) for the full license text.

See [DISCLAIMER.md](DISCLAIMER.md) for important legal disclaimers about the use of this regulatory data.

---

[ansvar.ai/mcp](https://ansvar.ai/mcp) -- Full MCP server catalog
