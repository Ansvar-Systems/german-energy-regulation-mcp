# Coverage -- German Energy Regulation MCP

Current coverage of German energy sector regulatory data.

**Last updated:** 2026-04-04

---

## Sources

| Source | Authority | Records | Content |
|--------|-----------|---------|---------|
| **BMWK** | Federal Ministry for Economic Affairs and Climate Action | 157 regulations | EnWG, EEG, KWKG, Energiewende policy, energy efficiency, hydrogen strategy |
| **BNetzA** | Federal Network Agency | 80 regulations | Incentive regulation (ARegV), network tariffs, market rules, Festlegungen |
| **TSOs** | German TSOs (50Hertz, Amprion, TenneT DE, TransnetBW) | 28 regulations | VDE-AR-N standards, Redispatch 2.0, grid development plan |
| **BfE** | Federal Office for Nuclear Waste Disposal Safety | 26 regulations | Nuclear safety, site selection, radioactive waste disposal |
| **German TSOs** | TSO grid codes | 33 grid codes | VDE-AR-N technical regulations, Redispatch 2.0, grid development plan, Einspeisemanagement |
| **BNetzA (decisions)** | Beschlusskammer decisions | 60 decisions | Revenue caps, tariff determinations, market monitoring, methodology approvals |
| **Total** | | **384 records** | ~528 KB SQLite database |

---

## Regulation Types

| Type | German Term | Count | Regulators |
|------|-------------|-------|------------|
| `gesetz` | Gesetz (Act/Law) | 129 | BMWK, BNetzA |
| `verordnung` | Verordnung (Ordinance/Regulation) | 76 | BMWK, BNetzA |
| `leitfaden` | Leitfaden (Guideline/Guide) | 47 | BNetzA, BMWK |
| `verwaltungsvorschrift` | Verwaltungsvorschrift (Administrative Rule) | 23 | BNetzA, BfE |
| `festlegung` | Festlegung (Determination) | 16 | BNetzA |

## Grid Code Types

| Type | Description | Count |
|------|-------------|-------|
| `grid_connection` | Grid connection requirements (VDE-AR-N 4105, 4110, 4120, 4130) | 14 |
| `technical_regulation` | Technical requirements for generation, storage, and consumption | 11 |
| `market_regulation` | Market rules for Redispatch 2.0, balancing energy, and trading | 4 |
| `ancillary_services` | System services (Regelleistung: FCR, aFRR, mFRR) | 3 |
| `balancing` | Balancing market rules and obligations | 1 |

## Decision Types

| Type | Description | Count |
|------|-------------|-------|
| `market_monitoring` | Market monitoring (Monitoringbericht) and surveillance reports | 22 |
| `tariff` | Network tariff (Netzentgelt) determinations | 14 |
| `methodology` | Methodology approvals for cost allocation and tariff calculation | 11 |
| `benchmark` | Benchmarking of network operator efficiency (Effizienzvergleich) | 7 |
| `revenue_cap` | Revenue cap (Erlosobergrenze) determinations for regulatory periods | 6 |

---

## What Is NOT Included

This is a seed dataset. The following are not yet covered:

- **Full text of original documents** -- records contain summaries, not complete legal text from gesetze-im-internet.de
- **Court decisions** -- OLG Dusseldorf and BGH energy rulings are not included
- **Historical and repealed regulations** -- only current in-force regulations are covered
- **EU energy directives** -- EU Electricity Directive, Gas Directive, Renewable Energy Directive, etc. are covered by the [EU Regulations MCP](https://github.com/Ansvar-Systems/EU_compliance_MCP), not this server
- **Bundestag proceedings** -- parliamentary energy debates and committee reports are not included
- **Landesrecht** -- state-level energy legislation is not covered
- **Individual tariff schedules** -- utility-specific tariff sheets are not included (only BNetzA approval decisions)

---

## Limitations

- **Seed dataset** -- 384 records across regulations, grid codes, and decisions
- **German text only** -- all regulatory content is in German. English search queries may return limited results.
- **Summaries, not full legal text** -- records contain representative summaries, not the complete official text from gesetze-im-internet.de or regulator websites.
- **Quarterly manual refresh** -- data is updated manually. Recent regulatory changes may not be reflected.
- **No real-time tracking** -- amendments and repeals are not tracked automatically.

---

## Planned Improvements

Full automated ingestion is planned from:

- **gesetze-im-internet.de** -- German legislation (EnWG, EEG, KWKG, ARegV, etc.)
- **bundesnetzagentur.de** -- BNetzA Festlegungen, Beschlusskammer decisions, monitoring reports
- **netztransparenz.de** -- TSO grid codes, Redispatch 2.0, grid development plan
- **bmwk.de** -- BMWK energy policy, Energiewende reports, hydrogen strategy
- **bfe.bund.de** -- BfE nuclear safety regulations, site selection documents

---

## Language

All content is in German. The following search terms are useful starting points:

| German Term | English Equivalent |
|-------------|-------------------|
| Energiewirtschaftsgesetz | Energy Industry Act (EnWG) |
| Erneuerbare Energien | renewable energy (EEG) |
| Netzentgelt | network tariff |
| Erlosobergrenze | revenue cap |
| Anreizregulierung | incentive regulation (ARegV) |
| Netzanschluss | grid connection |
| Redispatch | redispatch |
| Einspeisemanagement | feed-in management |
| Systemdienstleistung | ancillary services |
| Regelleistung | balancing energy |
| Wasserstoff | hydrogen |
| Netzentwicklungsplan | grid development plan |
| Kraft-Warme-Kopplung | combined heat and power (KWKG) |
| Energieeffizienz | energy efficiency |
