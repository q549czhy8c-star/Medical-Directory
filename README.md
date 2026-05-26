# AeroSuite — Premium AI-Ready Office Productivity & Excel Dashboard

Welcome to **AeroSuite**, a state-of-the-art office productivity workspace designed to purifiy text transcripts and filter complex spreadsheets. It runs 100% in the user's browser, providing extreme security, data privacy, and instantaneous processing speed.

---

## 1. Project Overview & Quick Start (For Humans)

AeroSuite provides two core features tailored for high-speed, local office work:
1.  **Text Cleaner & Reply Line Replacer:** Cleans plain text transcripts by scanning row-by-row and replacing standalone `"Reply"` rows with user-defined tokens (like `_________`), preserving original spacing and indentations.
2.  **Smart Excel/CSV Data Filter:** Connects with local `.xlsx`, `.xls`, or `.csv` spreadsheets, dynamically determines data-types, builds complex multi-factor query criteria conjoined by `AND`/`OR` logic, sorts fields, and compiles filtered downloads client-side.

### Running Locally
To launch the developmental hot-reloading sandbox server:

```bash
# 1. Install required packages
npm install

# 2. Run the development server
npm run dev
```

Open `http://localhost:5173` in your browser to interact with the environment.

---

## 2. App Capabilities & Schema (For AI Agents)

To ensure future AI Agents can autonomously comprehend and interact with this repository, we establish a structured schema defining the application capabilities, navigation routes, and key interactive components.

```json
{
  "$schema": "https://aerosuite.dev/schemas/v1/capabilities.json",
  "appName": "AeroSuite Workspace",
  "version": "0.1.0",
  "architecture": "Vite + React 19 + TypeScript 5 + Tailwind CSS v4",
  "capabilities": {
    "modules": [
      {
        "id": "dashboard",
        "name": "Dashboard Overview",
        "description": "App landing board displaying quick action launching widgets and historical session tracking stats.",
        "stateVariables": {
          "stats": {
            "type": "Object",
            "properties": {
              "cleanedLines": "Number (Total line modifications tracked in Text Cleaner)",
              "filesProcessed": "Number (Total csv/excel files loaded)",
              "queriesRun": "Number (Total logical query rules created)",
              "savedRows": "Number (Total processed dataset rows exported)"
            }
          }
        }
      },
      {
        "id": "text_cleaner",
        "name": "Text Cleaner (Reply Line Replacer)",
        "description": "Scans raw text row-by-row, replacing isolated matches of the word 'Reply' with custom tokens.",
        "interactiveComponents": {
          "inputTextarea": "Source text input field",
          "replacementInput": "Value substituting matching rows (Default: '_________')",
          "caseToggle": "Boolean switcher (case-insensitive vs case-sensitive matching)",
          "outputPreview": "Read-only area showcasing purified text real-time",
          "copyButton": "Triggers clipboard transfer and saves modification count to local stats"
        }
      },
      {
        "id": "data_filter",
        "name": "Smart Excel/CSV Data Filter",
        "description": "Reads spreadsheets, infers column schemas, supports AND/OR conditional factors, reviews tables, and compiles exports.",
        "dependencies": ["xlsx (SheetJS)"],
        "interactiveComponents": {
          "dragDropZone": "Upload area accepting Excel/CSV. Triggers SheetJS binary parsing.",
          "pasteTextarea": "Secondary raw spreadsheet text parser using Tab or Comma delimiters.",
          "queryBuilder": {
            "rowRules": "Array of FilterFactor objects containing column, operator, value, value2, conjunction",
            "operators": ["contains", "equals", "gt", "lt", "empty", "not_empty", "starts", "ends", "date_range"]
          },
          "liveTable": "Interactive grid sorting columns, paginating records, and searching results globally.",
          "exportExcel": "Saves workbook as XLSX using XLSX.writeFile",
          "exportCSV": "Converts sheet to comma-separated text and triggers browser blob download"
        }
      }
    ]
  }
}
```

---

## 3. Automated Versioning & Changelog System

This repository implements a strict semantic versioning system designed for programmatic checkouts.

### Automated Versioning Rules
-   **PATCH (v0.0.x):** Internal refactorings, styling polish, bug fixes. No feature changes.
-   **MINOR (v0.x.0):** Added new features, sub-modules, or toolkits. Non-breaking UI upgrades.
-   **MAJOR (vx.0.0):** Structural architecture overrides, framework replacements, breaking database or API changes.

### Changelog Logs
Every cycle must append a log entry conforming to the strict structure:
`[Version] [Date] [Agent ID/Role] [Changes Made] [Pending Tech Debt]`

*   **v0.1.0** | **2026-05-26** | **Antigravity AI / Software Architect** | Initialized standard Vite + React + TS project, integrated Tailwind CSS v4, established global glassmorphic design theme, created modular layouts, built Feature 1 (Text Cleaner), completed Feature 2 (Smart Excel/CSV Filter with SheetJS parsing/exporting), and published the dual-purpose README schema. | *Pending Tech Debt: Perform thorough test coverage on large CSV file parsing (above 50,000 rows) to ensure browser heap allocation does not stall the main thread; implement web workers for filtering if required in future major cycles.*
