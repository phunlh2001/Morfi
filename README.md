# ⚡ Morfi — User & Feature Guide

> **Morfi** is a 100% private, in-browser file transformation studio for developers and power users. No files ever leave your device—everything processes instantly in your local browser memory.

---

## 🚀 Quick Start: Convert Any File in 3 Steps

1. **Select a Converter Studio**: Choose your format pair from the left sidebar or the Feature Showcase.
2. **Choose Direction & Add File**: 
   - Click the swap button (`⇄`) if you want the reverse direction (e.g., switch from `DOCX → PDF` to `PDF → DOCX`).
   - Drag and drop your file into the dashed dropzone (or click to browse).
3. **Convert & Download**:
   - Adjust any format settings (delimiters, hex dump styles, image resolution).
   - Click **Convert Now**.
   - Inspect the **Live Preview**, **Copy Text** to clipboard, or click **Download**.

---

## 🧭 Interface & Navigation Tour

### 1. Left Sidebar
- **Feature Showcase**: The home dashboard providing an overview of all 9 converter studios.
- **Search Bar**: Quickly type any extension (`csv`, `pdf`, `hex`, `word`) or keyword to filter tools instantly.
- **Color-Coded Tool Tabs**: Direct one-click access to each specialized studio with format status badges.
- **Collapse Toggle (`◀ / ▶`)**: Collapse the sidebar to maximize workspace on smaller screens.

### 2. Header Bar
- **Breadcrumbs**: Shows current location and quick link back to the Showcase.
- **Theme Switcher (`☀ / ☾`)**: One-click toggle between **Light Mode** (default) and **Dark Mode** (saved automatically to your browser).
- **Offline Ready Indicator**: Verifies that conversion engines run fully local with zero network latency.

---

## 🎛️ How the Universal Converter Component Works

Every converter page shares a consistent, intuitive workspace:

```
┌───────────────────────────────────────────────────────────────┐
│ [Format Badge]                          [ A → B ⇄ B → A ]     │
│ Studio Title & Description              (1-Click Direction)   │
├───────────────────────────────────────────────────────────────┤
│ ⚙️ Conversion Settings (Delimiters, DPI, Output Styles)       │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│       ☁️  Drop your file here, or browse                     │
│           (Drag-over glowing feedback)                        │
│                                                               │
├───────────────────────────────────────────────────────────────┤
│ 📄 filename.ext  (Size: 240 KB)            [Remove] [Convert] │
├───────────────────────────────────────────────────────────────┤
│ ═══ Progress Bar (100%) ═════════════════════════════════════ │
├───────────────────────────────────────────────────────────────┤
│ ✅ Ready: output_file.ext (210 KB)   [Copy Text] [Download]   │
│ 👁️ Live Preview (Gallery, HTML render, Code / Text Viewer)    │
└───────────────────────────────────────────────────────────────┘
```

1. **Direction Swap Button (`⇄`)**: Click the swap button in the top-right of the card to reverse the conversion direction at any time without leaving the page.
2. **Smart Drag-and-Drop**: Drag any accepted file over the dropzone. The border pulses with glowing feedback when ready to accept.
3. **Selected File Strip**: Displays the file name, size in KB/MB, and file type badge with a quick `Remove` button to reset.
4. **Live Progress**: A real-time progress bar tracks in-memory conversion stages.
5. **Result Actions**:
   - **Download**: Saves the converted file with the correct extension to your computer.
   - **Copy Text**: Copies text, markdown, HTML, or hex dumps directly to your clipboard in 1 click.
   - **Live Preview Drawer**: Expand or collapse to inspect rendered pages, code, or tables before saving.

---

## 📚 Complete Feature Guide (All 9 Studios)

---

### 1. DOCX ↔ PDF
*Convert between Microsoft Word documents and print-ready PDFs.*

- **DOCX → PDF**:
  - **How to use**: Upload any `.docx` file. The engine parses styles, headings, tables, and typography, compiling them into a print-ready vector PDF.
  - **Best for**: Creating finalized resumes, contracts, invoices, and reports that look identical on any device.
- **PDF → DOCX**:
  - **How to use**: Swap direction to `PDF → DOCX`, drop your PDF, and click Convert. The engine extracts paragraphs, titles, and layout structure into an editable Word document.
  - **Best for**: Reclaiming editable content from archived PDFs.

---

### 2. TXT ↔ CSV
*Transform text logs, delimited streams, and spreadsheets.*

- **TXT → CSV**:
  - **Smart Delimiter Detection**: Choose **Auto Detect** (detects tabs, commas, semicolons, or pipes) or manually pick a specific delimiter.
  - **Whitespace / Space Log Parser**: Select **Whitespace** mode to convert server log files and space-aligned terminal dumps into clean spreadsheet columns.
- **CSV → TXT**:
  - **Output Styles**:
    - **ASCII Grid Table**: Generates a formatted ASCII box table (`+---+---+`) ready to paste into GitHub issues or READMEs.
    - **Tab Delimited (TSV)**: Produces clean tab-separated records.
    - **Key-Value Records**: Formats each row into readable labeled blocks (`Field: Value`).

---

### 3. PDF ↔ PPTX
*Slide deck transformation between PDFs and editable PowerPoint presentations.*

- **PDF → PPTX**:
  - **How to use**: Drop your PDF slides. The engine renders each page into a high-definition slide inside a native 16:9 widescreen `.pptx` presentation.
  - **Compatibility**: Opens cleanly in Microsoft PowerPoint, Google Slides, and Apple Keynote.
- **PPTX → PDF**:
  - **How to use**: Swap direction to `PPTX → PDF`. Morfi unpacks presentation slide structures and renders them into a unified PDF document.

---

### 4. PDF ↔ Excel
*Extract tabular financial reports or render spreadsheets to PDF.*

- **PDF → Excel**:
  - **Coordinate Text Mapping**: Automatically groups table rows and columns based on vertical and horizontal coordinates on each PDF page.
  - **Multi-Page Workbooks**: Multi-page documents automatically create separate sheet tabs (`Page_1`, `Page_2`, etc.) in the generated `.xlsx` workbook.
- **Excel → PDF**:
  - **How to use**: Upload any `.xlsx` or `.xls` spreadsheet. Morfi formats the data into a professional landscape PDF with zebra-striped tables.

---

### 5. HTML ↔ PDF
*Render web pages with full CSS styling or extract semantic HTML from documents.*

- **HTML → PDF**:
  - **How to use**: Upload an `.html` file. The engine renders the content in a sandboxed DOM canvas and outputs multi-page A4 PDFs with preserved fonts, layouts, and colors.
- **PDF → HTML**:
  - **How to use**: Extracts text blocks, headings (`<h1>`, `<h2>`), paragraphs, and document structure into a clean, standalone, responsive HTML5 document.

---

### 6. PDF ↔ Markdown
*Bridge the gap between document files and developer documentation.*

- **PDF → Markdown**:
  - **Heading Recognition**: Analyzes font sizes to automatically output `# Title`, `## Heading`, and `### Subheading`.
  - **List Detection**: Recognizes bullet points (`•`, `-`, `*`) and formats them into GitHub Flavored Markdown (GFM) lists.
- **Markdown → PDF**:
  - **How to use**: Drop your `.md` file. Morfi compiles the Markdown, styles code blocks, blockquotes, and tables, and exports a clean developer PDF.

---

### 7. DOCX ↔ HTML
*Convert Word documents to web markup and vice versa.*

- **DOCX → HTML**:
  - **Embedded Images**: Embedded Word graphics are automatically extracted and encoded as inline base64 images inside clean HTML.
  - **Clean Markup**: Produces clean semantic tags (`<p>`, `<h1>`, `<table>`) without bloated Microsoft office XML junk.
- **HTML → DOCX**:
  - **How to use**: Transforms web content, headings, and bulleted lists into a standard downloadable Word `.docx` file.

---

### 8. PDF/HTML ↔ Hex Bytes (.txt)
*Low-level binary inspection and reconstruction tool for developers.*

- **PDF/HTML → Hex Bytes**:
  - **Formatting Modes**:
    - **Standard Hex Dump**: Classic `xxd` / `hexdump` format displaying offset, 16 hex bytes, and ASCII representation (`00000000: 25 50 44 46 ... |%PDF|`).
    - **Programming Array**: Outputs a ready-to-copy C / C++ / Rust / Go / JS byte array (`const unsigned char file_data[] = { 0x25, ... };`).
    - **Space-Separated**: Clean space-delimited byte stream (`25 50 44 46 ...`).
    - **Raw Hex**: Continuous hexadecimal string.
  - **Output**: Downloadable as a `.txt` file or copied to clipboard.
- **Hex Bytes (.txt) → PDF/HTML**:
  - **Reconstruction**: Reads any text file containing hex values (automatically stripping line offsets, comments, and ASCII sidebars) and rebuilds the original `.pdf` or `.html` binary file.

---

### 9. PDF ↔ JPG
*Convert document pages to high-resolution images or combine images into a PDF.*

- **PDF → JPG**:
  - **Resolution Scaling**: Choose between **Standard (1.5x)**, **High Quality (2x Retina)**, or **Ultra HD (3x Print)**.
  - **Automatic ZIP Packaging**: Multi-page PDFs automatically package all rendered page images into a single `.zip` archive for one-click downloading.
  - **Image Gallery**: View full-size thumbnails of every page directly in the browser.
- **JPG → PDF**:
  - **Multi-Image Upload**: Select or drag multiple JPG/PNG images at once. Morfi automatically arranges and compiles them into a unified multi-page PDF document.

---

## 🔒 Privacy & Offline Operation

### Why Morfi is Safe for Confidential Documents
- **Zero Server Uploads**: Traditional converter websites send your documents to unknown remote servers. Morfi performs 100% of its computation in your local browser's memory using WebAssembly and client-side JavaScript.
- **No Size or Throttle Limits**: Since no files are sent across a network, conversion speed is instantaneous and limited only by your computer's RAM.
- **Safe for Sensitive Data**: Ideal for proprietary source code, NDA agreements, banking statements, and confidential employee records.
- **Offline Compatible**: Once the page is loaded, you can disconnect from the internet and continue converting files without interruption.

---

## 💡 Pro Tips

- ⚡ **Quick Copy**: For text-based formats (CSV, Markdown, HTML, Hex), use the **Copy Text** button to paste directly into your IDE or terminal without opening downloaded files.
- 🔁 **Instant Direction Swap**: Click the `⇄` button to switch between formats without having to re-select tools from the sidebar.
- 🌙 **Eye Comfort**: Use the theme toggle in the top-right corner to switch to Dark Mode during late-night coding sessions.
