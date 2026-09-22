# ⚡ Morfi — Universal Developer File Converter

<div align="center">

**100% Private, In-Browser File Transformation Studio for Developers**

[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Security](https://img.shields.io/badge/Privacy-100%25%20Client--Side-10B981?logo=shield&logoColor=white)](#-privacy--security-first)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[**Live Demo**](https://github.com/phunlh2001/Morfi) • [**Features**](#-features) • [**Getting Started**](#-getting-started) • [**Tech Stack**](#-tech-stack)

</div>

---

## 🌟 What is Morfi?

**Morfi** is a modern, high-performance web application designed specifically for developers, analysts, and power users who need to convert documents, spreadsheets, slides, logs, and binary byte streams rapidly—without ever sending confidential files to third-party servers.

All conversions run **100% locally in your web browser** utilizing modern Web APIs, Web Workers, and lightweight client-side engines.

---

## ✨ Key Highlights

- 🔒 **100% Private & Secure**: Zero cloud uploads. Your files never touch an external server or leave your local device.
- ⚡ **Instant Processing**: Powered by local memory processing and Web Workers for zero-latency conversions.
- 🔄 **Bi-Directional by Design**: Every tool supports 1-click direction swapping (`A → B` ⇄ `B → A`).
- 🎨 **Modern Aesthetics**: Built with Tailwind CSS v4 and shadcn-ui, featuring glassmorphism cards, vibrant format-specific gradients, and an interactive HTML5 Canvas logo.
- 🌓 **Light & Dark Themes**: Cohesive theme system with Light mode as default and instant persistence in `localStorage`.
- 📁 **Intuitive Drag & Drop**: Visual dropzones with animated feedback, file validation, progress bars, and live previews.

---

## 🛠️ The 9 Bi-Directional Converter Studios

| Studio | Direction 1 | Direction 2 | Highlight Features |
|:---|:---|:---|:---|
| **DOCX ↔ PDF** | `DOCX → PDF` | `PDF → DOCX` | Preserves typography and headings; exports editable `.docx` paragraphs or print-ready PDF. |
| **TXT ↔ CSV** | `TXT → CSV` | `CSV → TXT` | Smart auto-delimiter detection (comma, tab, semicolon, pipe) and formatted ASCII grid table export. |
| **PDF ↔ PPTX** | `PDF → PPTX` | `PPTX → PDF` | Converts PDF pages into 16:9 widescreen PowerPoint slides; parses PPTX slide visuals into PDF. |
| **PDF ↔ Excel** | `PDF → Excel` | `Excel → PDF` | Extracts tabular coordinate text to multi-sheet `.xlsx`; formats spreadsheet data into landscape PDF reports. |
| **HTML ↔ PDF** | `HTML → PDF` | `PDF → HTML` | Renders HTML with CSS styles to vector PDF; extracts structured semantic HTML5 from PDF. |
| **PDF ↔ Markdown** | `PDF → MD` | `MD → PDF` | Detects titles, headings, bullet lists, and code blocks to GitHub Markdown (GFM) and vice versa. |
| **DOCX ↔ HTML** | `DOCX → HTML` | `HTML → DOCX` | Extracts Word styles and embedded images to clean semantic HTML; packages web content into `.docx`. |
| **PDF/HTML ↔ Hex Bytes** | `Doc → Hex (.txt)` | `Hex (.txt) → Doc` | Formats binary data as `xxd`-style dumps, C byte arrays, or raw hex; reconstructs valid binary `.pdf`/`.html`. |
| **PDF ↔ JPG** | `PDF → JPG` | `JPG → PDF` | High-DPI canvas page rendering with single or ZIP archive export; merges multiple images into a multi-page PDF. |

---

## 🚀 Getting Started

### Prerequisites

Ensure you have installed:
- [Node.js](https://nodejs.org/) (v18.0 or higher recommended)
- [Yarn](https://yarnpkg.com/) (or npm / pnpm)

### Installation

1. **Clone the repository:**
   ```bash
   git clone git@github.com:phunlh2001/Morfi.git
   cd Morfi
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

3. **Start the development server:**
   ```bash
   yarn dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Available Scripts

In the project directory, you can run:

| Command | Description |
|:---|:---|
| `yarn dev` | Starts the Vite local development server with Hot Module Replacement (HMR). |
| `yarn build` | Type-checks with `tsc` and builds the production-optimized bundle in `dist/`. |
| `yarn lint` | Runs ESLint to check for code quality and syntax compliance. |
| `yarn preview` | Locally previews the production build output. |

---

## 🏗️ Project Architecture

```
Morfi/
├── public/                 # Static assets and icons
├── src/
│   ├── assets/             # Branding and SVG graphics
│   ├── components/
│   │   ├── common/         # Core reusable components
│   │   │   ├── MorfiLogo.tsx          # HTML5 Canvas logo component
│   │   │   ├── Sidebar.tsx            # Collapsible colorful navigation
│   │   │   ├── ThemeToggle.tsx        # Light/Dark mode switcher
│   │   │   └── UniversalConverter.tsx # Reusable converter shell with drag & drop
│   │   ├── pages/
│   │   │   └── HomeShowcase.tsx       # Feature hub and studio grid
│   │   └── ui/             # shadcn-ui primitives (Button, Card, Badge, Progress, Tabs)
│   ├── data/
│   │   └── converterConfigs.ts        # Configuration metadata for all 9 studios
│   ├── lib/
│   │   └── utils.ts        # Tailwind class merging utility (cn)
│   ├── types/
│   │   └── converter.ts    # TypeScript interfaces and type contracts
│   ├── utils/
│   │   ├── conversionDispatcher.ts    # Central execution dispatcher
│   │   ├── pdfHelper.ts               # PDF.js worker setup & canvas rendering
│   │   └── converters/                # Modular client-side conversion engines
│   │       ├── docxHtml.ts            # Mammoth + docx packager
│   │       ├── docxPdf.ts             # DOCX ↔ PDF rendering
│   │       ├── hexBytes.ts            # Binary ↔ Hex dump engine
│   │       ├── htmlPdf.ts             # HTML ↔ PDF canvas engine
│   │       ├── pdfExcel.ts            # PDF ↔ SheetJS XLSX engine
│   │       ├── pdfJpg.ts              # PDF ↔ JPG canvas & ZIP engine
│   │       ├── pdfMarkdown.ts         # PDF ↔ GFM Markdown engine
│   │       ├── pdfPptx.ts             # PDF ↔ PptxGenJS engine
│   │       └── txtCsv.ts              # TXT ↔ CSV smart delimiter engine
│   ├── App.tsx             # Root application shell and theme state
│   ├── index.css           # Tailwind CSS v4 tokens and theme variables
│   └── main.tsx            # React application entry point
├── index.html              # HTML document template
├── package.json            # Project manifest and dependencies
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build and Tailwind plugin configuration
```

---

## 💻 Tech Stack

- **Core Framework**: [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Build Tool**: [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite`
- **UI Components**: [shadcn-ui](https://ui.shadcn.com/) patterns with `class-variance-authority`, `clsx`, and `tailwind-merge`
- **Icons**: [Lucide React](https://lucide.dev/)
- **Conversion Libraries**:
  - `pdfjs-dist`: High-performance PDF rendering and text parsing
  - `jspdf` & `html2canvas`: In-browser PDF generation and vector rendering
  - `mammoth`: Microsoft Word `.docx` parsing and HTML extraction
  - `docx`: Word `.docx` document generation
  - `xlsx`: SheetJS for Excel workbook reading and writing
  - `pptxgenjs`: Microsoft PowerPoint `.pptx` presentation generation
  - `jszip`: In-memory ZIP compression for multi-page image exports
  - `marked`: Fast Markdown parsing

---

## 🛡️ Privacy & Security First

Most online file converters upload your sensitive files to remote servers, exposing private credentials, financial reports, or internal codebases.

**Morfi guarantees total privacy:**
1. All file parsing and conversion occurs in your browser's V8 JavaScript engine.
2. No telemetry, tracking, or network requests are made with your file data.
3. Completely safe for NDAs, confidential contracts, API keys, and personal documents.
4. Operates offline once the application is loaded.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
