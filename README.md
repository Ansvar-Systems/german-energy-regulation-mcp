# German Energy Regulation MCP

<!-- ANSVAR-CTA-BEGIN -->
> ### ▶ Try this MCP instantly via Ansvar Gateway
> **50 free queries/day · no card required · OAuth signup at [ansvar.eu/gateway](https://ansvar.eu/gateway)**
>
> One endpoint, one OAuth signup, access from any MCP-compatible client.

### Connect

**Claude Code** (one line):

```bash
claude mcp add ansvar --transport http https://gateway.ansvar.eu/mcp
```

**Claude Desktop / Cursor** — add to `claude_desktop_config.json` (or `mcp.json`):

```json
{
  "mcpServers": {
    "ansvar": {
      "type": "url",
      "url": "https://gateway.ansvar.eu/mcp"
    }
  }
}
```

**Claude.ai** — Settings → Connectors → Add custom connector → paste `https://gateway.ansvar.eu/mcp`

First request opens an OAuth flow at [ansvar.eu/gateway](https://ansvar.eu/gateway). After signup, your client is bound to your account; tier (free / premium / team / company) determines fan-out, quota, and which downstream MCPs are reachable.

---

## Self-host this MCP

You can also clone this repo and build the corpus yourself. The schema,
fetcher, and tool implementations all live here. What is not in the repo is
the pre-built database — TDM and standards-licensing constraints on the
upstream sources mean we host the corpus on Ansvar infrastructure rather
than redistribute it as a public artifact.

Build your own: run this repo's ingestion script (entry-point varies per
repo — typically `scripts/ingest.sh`, `npm run ingest`, or `make ingest`;
check the repo root).
<!-- ANSVAR-CTA-END -->


MCP server for German energy sector regulations -- BNetzA incentive regulation, TSO grid codes, BMWK Energiewende policy, BfE nuclear safety.

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
