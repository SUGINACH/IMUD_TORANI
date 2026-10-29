# 📚 Wiki Index — Typesetter_doc

> Comprehensive documentation for the **Torah Book Typesetting System** — a web-based tool for typesetting holy books (Torah, Talmud, commentaries) according to traditional Torah printing rules. The system was developed in parallel by three different AI tools, each in its own folder, to enable comparison of approaches.

## 🎯 What is this repository?

The [`SUGINACH/Typesetter_doc`](https://github.com/SUGINACH/Typesetter_doc) repository contains all documentation for the **Torah Book Typesetting System** project — a web tool for typesetting holy books (Torah, Talmud, commentaries) according to traditional Torah printing rules. The project was developed in parallel by three leading AI tools, each in a separate folder, to enable comparison of approaches:

| AI Tool | Folder | Version Name | Index Link |
|---------|--------|--------------|------------|
| 📘 **Claude** (Anthropic) | `claude_v20/` | IMUD TORANI v20 | [Open Index](EN-Claude-V20) |
| 💚 **ChatGPT** (OpenAI) | `chatgpt_v23/` | Green V23 | [Open Index](EN-ChatGPT-V23) |
| 🥇 **z.ai** (GLM) | `zai_v21/` | Gold V21 | [Open Index](EN-ZAI-V21) |
| 🌐 **Shared** | `shared/` | Shared documents | [Open Index](EN-Shared) |
| 📦 **Archive** | `archive/` | Historical documents | [Open Index](EN-Archive) |
| 🔧 **Source Code** | `source_code/` | Source code snapshot | [Open Index](EN-source_code) |

## 📊 Overall Statistics

- **Total files:** 221
- **Total lines:** 470,318
- **Total size:** 53.23 MB
- **Total headings detected:** 22329

## 🗺 Navigation Map

### 📘 Claude — V20 (IMUD TORANI)

Documentation created by **Claude (Anthropic)** — Version V20. Contains 3 sub-folders: `transcripts/` (7 chat transcripts including V20.0–V20.5, with V20.4 split into 3 parts, plus an original chats collection), `technical/` (3 technical documents: specification, handoff document, engine guide), `qa/` (system checklist). Represents Claude's conservative, methodical approach with emphasis on precise specifications.

➡️ **[Open the full index for Claude folder](EN-Claude-V20)** (17 files)

### 💚 ChatGPT — V23 (Green)

Documentation created by **ChatGPT (OpenAI)** — Version V23. Contains 5 sub-folders: `transcripts/` (10 chat transcripts), `technical/` (3 documents: technical history, layout dependency map, consolidated engineering history), `issues/` (3 issue catalogs), `audits/` (baseline audit), `session/` (session handoffs and merged continuations). Represents a distributed approach with clear separation between management, research, and technical documentation.

➡️ **[Open the full index for ChatGPT folder](EN-ChatGPT-V23)** (25 files)

### 🥇 z.ai — V21 (Gold)

Documentation created by **z.ai (GLM)** — Version V21. Contains 5 sub-folders: `transcripts/` (7 transcripts: 4 main chats + Chat_05 which merged 3 continuations, with Chat_01 and Chat_02 each split into 2 parts), `technical/` (3 documents), `issues/` (5 issue catalogs), `audits/` (2 audits), `session/` (session handoff + operating instructions). Characterized by combining academic research with detailed technical documentation, with strong emphasis on CI/CD and GitHub Actions.

➡️ **[Open the full index for z.ai folder](EN-ZAI-V21)** (45 files)

### 🌐 Shared Documents

**Shared documents** — content not specific to one version. Contains 5 sub-folders: `research/` (13 research documents: Knuth-Plass algorithm, dual-column RTL design, deterministic typesetting engine, Torah typesetting challenges, multi-stream architecture, technical specifications, functional gaps analysis, plus 2 PDFs), `plans/` (7 work plans: master work register, work plan, working rules, workflows, issue resolution protocol, system creation plan, plan stability), `comparisons/` (4 comparison reports: version comparison, Tag software comparison, integration recommendation, upgrade plan), `prompts/` (prompt collection), `menu_spec/` (menu/theme specifications).

➡️ **[Open the full index for Shared folder](EN-Shared)** (51 files)

### 📦 Historical Archive

**Historical archive** — older documents not assigned to a specific version. Contains 4 sub-folders: `research/`, `plans/` (2 old plans), `reports/` (3 old reports: audit, software analysis, AI chats summary), `qa/` (old checklist). Represents the project's early stage before the split into three versions.

➡️ **[Open the full index for Archive folder](EN-Archive)** (11 files)

### 🔧 Source Code Snapshot

**Source code snapshot** — the original system code (HTML+CSS+JS) at a specific point in time. This is a documentation repository, but the file is kept here for historical context.

➡️ **[Open the full index for Source Code folder](EN-source_code)** (2 files)

## 🔍 How to use this index

1. **Choose a folder** from the table above or from the sidebar.
2. On each folder page, you'll find a **quick-reference table** with all files and a direct link to each.
3. Scroll down to **"Detailed Index by File"** — there, each file is listed separately with:
   - 📖 **File content summary** (click to expand)
   - 📋 **All headings in the file** in a detailed table — clicking any heading opens the exact location in the file on GitHub.
4. Each heading also shows a line number (clicking `L42` goes to the exact line).

> **Note:** The source files are in Hebrew. Heading text in the indexes is shown in its original Hebrew (since that is the actual heading in the source file). Use the English folder/file descriptions and the [Topical Index](EN-Topical-Index) for navigation in English.

## 📚 Document Types in the Repository

- **Technical documentation** — architecture specifications, system structure, typesetting engine, data model
- **Version specifications** — changes between versions (V20.1–V20.5)
- **Research reports** — Knuth-Plass research, Torah typesetting research
- **Issue catalogs and audits** — ISSUES_TABLE, AUDIT, COVERAGE_MATRIX
- **Work plans** — WORK_PLAN, MASTER_WORK_REGISTER
- **AI chat transcripts** — 10 chats with ChatGPT, 7 with z.ai, continuation chats
- **User guides** — operating instructions, engine guide, WORKFLOWS, WORKING_RULES
- **Checklists** — checklist, system checklist
- **Reports** — comparison reports, software analysis, upgrade plans
- **Prompts** — collection of prompts shared with AI tools

## 🎯 Complementary Indexes

In addition to the by-file index (below), there are two other indexes:

| Index | Description | Link |
|-------|-------------|------|
| 🎯 **Topical-Hierarchical Index** | Organized by topic from top to bottom — system purpose → architecture → engines → features → issues → comparisons | [Open Topical-Index](EN-Topical-Index) |
| 🔤 **Alphabetical Glossary** | Bilingual glossary of technical terms (Hebrew term + English equivalent + description) | [Open Glossary](EN-Glossary) |

## 🔗 External Links

- [Repository on GitHub](https://github.com/SUGINACH/Typesetter_doc)
- [Main README](https://github.com/SUGINACH/Typesetter_doc/blob/main/README.md)
- [Official Wiki (Hebrew)](https://github.com/SUGINACH/Typesetter_doc/wiki)

---

> 📌 **Note:** This English wiki is a translation of the Hebrew wiki. The source documentation files remain in Hebrew. Technical terms have been carefully translated; where ambiguity exists, clarifying words have been added in parentheses.
