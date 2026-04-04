# Tools -- German Energy Regulation MCP

8 tools for searching and retrieving German energy sector regulations.

All data is in German. Tool descriptions and parameter names are in English.

---

## 1. de_energy_search_regulations

Search across German energy regulations from BNetzA, BMWK, and BfE. Covers EnWG, EEG, KWKG, ARegV, and related Verordnungen.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `query` | string | Yes | Search query in German or English (e.g., `Energiewirtschaftsgesetz`, `Erneuerbare Energien`, `Anreizregulierung`, `Netzentgelt`, `Wasserstoff`) |
| `regulator` | string | No | Filter by regulator: `bnetza`, `bmwk`, `bfe` |
| `type` | string | No | Filter by regulation type: `gesetz`, `verordnung`, `verwaltungsvorschrift`, `leitfaden` |
| `status` | string | No | Filter by status: `in_force`, `repealed`, `draft`. Defaults to all. |
| `limit` | number | No | Maximum results (default 20, max 100) |

**Returns:** Array of matching regulations with reference, title, text, type, status, effective date, and URL.

**Example:**

```json
{
  "query": "Energiewirtschaftsgesetz",
  "regulator": "bmwk",
  "status": "in_force"
}
```

**Data sources:** BNetzA (bundesnetzagentur.de), BMWK (bmwk.de), BfE (bfe.bund.de), gesetze-im-internet.de.

**Limitations:** Summaries, not full legal text. German-language content only.

---

## 2. de_energy_get_regulation

Get a specific German energy regulation by its reference string. Returns the full record including text, metadata, and URL.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `reference` | string | Yes | Regulation reference (e.g., `EnWG`, `EEG 2023`, `ARegV`) |

**Returns:** Single regulation record with all fields, or an error if not found.

**Example:**

```json
{
  "reference": "EnWG"
}
```

**Data sources:** gesetze-im-internet.de, bundesnetzagentur.de, bmwk.de.

**Limitations:** Exact match on reference string. Partial matches are not supported -- use `de_energy_search_regulations` for fuzzy search.

---

## 3. de_energy_search_grid_codes

Search German TSO grid codes (VDE-AR-N), Redispatch 2.0 rules, and grid development plan requirements.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `query` | string | Yes | Search query (e.g., `Netzanschluss`, `Redispatch`, `Netzentwicklungsplan`, `Einspeisemanagement`, `Systemdienstleistung`) |
| `code_type` | string | No | Filter by code type: `technical_regulation`, `market_regulation`, `grid_connection`, `balancing`, `ancillary_services` |
| `limit` | number | No | Maximum results (default 20, max 100) |

**Returns:** Array of matching grid code documents with reference, title, text, code type, version, effective date, and URL.

**Example:**

```json
{
  "query": "Netzanschluss",
  "code_type": "grid_connection"
}
```

**Data sources:** German TSOs (netztransparenz.de), VDE (vde.com).

**Limitations:** Summaries of technical regulations, not the full PDF documents. German-language content only.

---

## 4. de_energy_get_grid_code

Get a specific German TSO grid code document by its database ID. The ID is returned in search results from `de_energy_search_grid_codes`.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `document_id` | number | Yes | Grid code document ID (from search results) |

**Returns:** Single grid code record with all fields, or an error if not found.

**Example:**

```json
{
  "document_id": 2
}
```

**Data sources:** German TSOs (netztransparenz.de).

**Limitations:** Requires a valid database ID. Use `de_energy_search_grid_codes` to find IDs.

---

## 5. de_energy_search_decisions

Search BNetzA Beschlusskammer decisions on network tariffs, revenue caps, market rules, and enforcement.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `query` | string | Yes | Search query (e.g., `Erlosobergrenze`, `Netzentgelt`, `Regulierungsperiode`, `Festlegung`, `Marktregeln`) |
| `decision_type` | string | No | Filter by decision type: `tariff`, `revenue_cap`, `methodology`, `benchmark`, `complaint`, `market_monitoring` |
| `limit` | number | No | Maximum results (default 20, max 100) |

**Returns:** Array of matching decisions with reference, title, text, decision type, date decided, parties, and URL.

**Example:**

```json
{
  "query": "Erlosobergrenze",
  "decision_type": "revenue_cap"
}
```

**Data sources:** Bundesnetzagentur (bundesnetzagentur.de).

**Limitations:** Summaries of decisions, not full legal text. German-language content only.

---

## 6. de_energy_about

Return metadata about this MCP server: version, list of regulators covered, tool list, and data coverage summary. Takes no parameters.

**Parameters:** None.

**Returns:** Server name, version, description, list of regulators (id, name, URL), and tool list (name, description).

**Example:**

```json
{}
```

**Data sources:** N/A (server metadata).

**Limitations:** None.

---

## 7. de_energy_list_sources

List data sources with record counts, provenance URLs, and last refresh dates.

**Parameters:** None.

**Returns:** Array of data sources with id, name, URL, record count, data type, last refresh date, and refresh frequency.

**Example:**

```json
{}
```

**Data sources:** N/A (server metadata).

**Limitations:** None.

---

## 8. de_energy_check_data_freshness

Check data freshness for each source. Reports staleness status and provides update instructions.

**Parameters:** None.

**Returns:** Freshness table with source, last refresh date, frequency, and status (Current/Due/OVERDUE).

**Example:**

```json
{}
```

**Data sources:** N/A (server metadata).

**Limitations:** None.
