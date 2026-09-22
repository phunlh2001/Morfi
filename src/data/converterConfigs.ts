import type { ConverterConfig } from '../types/converter';

export const CONVERTER_CONFIGS: Record<string, ConverterConfig> = {
  'docx-pdf': {
    id: 'docx-pdf',
    title: 'DOCX ↔ PDF',
    badge: 'Document',
    description: 'Convert between Microsoft Word (.docx) and Portable Document Format (.pdf) with preserved typography and layouts.',
    gradient: 'from-blue-500 via-indigo-500 to-violet-500',
    borderColor: 'hover:border-indigo-500/50',
    iconName: 'FileText',
    sourceFormat: {
      id: 'docx',
      name: 'Word Document',
      extension: '.docx',
      accept: '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      description: 'Microsoft Word Document'
    },
    targetFormat: {
      id: 'pdf',
      name: 'PDF Document',
      extension: '.pdf',
      accept: '.pdf,application/pdf',
      description: 'Portable Document Format'
    },
    supportedDirections: [
      {
        from: 'docx',
        to: 'pdf',
        fromLabel: 'DOCX',
        toLabel: 'PDF',
        description: 'Render DOCX document into a clean, print-ready PDF file.'
      },
      {
        from: 'pdf',
        to: 'docx',
        fromLabel: 'PDF',
        toLabel: 'DOCX',
        description: 'Extract text paragraphs and structure into an editable Word document.'
      }
    ]
  },

  'txt-csv': {
    id: 'txt-csv',
    title: 'TXT ↔ CSV',
    badge: 'Data & Logs',
    description: 'Transform plain text files, logs, or delimiters into tabular CSV spreadsheets and vice versa.',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    borderColor: 'hover:border-emerald-500/50',
    iconName: 'Table',
    sourceFormat: {
      id: 'txt',
      name: 'Plain Text',
      extension: '.txt',
      accept: '.txt,text/plain',
      description: 'Plain Text or Log File'
    },
    targetFormat: {
      id: 'csv',
      name: 'CSV Spreadsheet',
      extension: '.csv',
      accept: '.csv,text/csv',
      description: 'Comma-Separated Values'
    },
    supportedDirections: [
      {
        from: 'txt',
        to: 'csv',
        fromLabel: 'TXT',
        toLabel: 'CSV',
        description: 'Detect custom delimiters or regex patterns to format text lines into CSV.'
      },
      {
        from: 'csv',
        to: 'txt',
        fromLabel: 'CSV',
        toLabel: 'TXT',
        description: 'Convert CSV rows into formatted ASCII tables or tab-aligned text.'
      }
    ],
    customOptions: [
      {
        id: 'delimiter',
        label: 'Delimiter',
        type: 'select',
        defaultValue: 'auto',
        options: [
          { label: 'Auto Detect (Comma, Tab, Pipe)', value: 'auto' },
          { label: 'Comma (,)', value: ',' },
          { label: 'Tab (\\t)', value: '\t' },
          { label: 'Semicolon (;)', value: ';' },
          { label: 'Pipe (|)', value: '|' },
          { label: 'Whitespace / Space', value: 'space' }
        ]
      },
      {
        id: 'tableFormat',
        label: 'TXT Output Style (for CSV → TXT)',
        type: 'select',
        defaultValue: 'grid',
        options: [
          { label: 'ASCII Grid Table', value: 'grid' },
          { label: 'Tab Delimited', value: 'tsv' },
          { label: 'Key-Value Records', value: 'keyvalue' }
        ]
      }
    ]
  },

  'pdf-pptx': {
    id: 'pdf-pptx',
    title: 'PDF ↔ PPTX',
    badge: 'Presentation',
    description: 'Transform presentation slides between PDF documents and editable PowerPoint (.pptx) decks.',
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    borderColor: 'hover:border-orange-500/50',
    iconName: 'Presentation',
    sourceFormat: {
      id: 'pdf',
      name: 'PDF Document',
      extension: '.pdf',
      accept: '.pdf,application/pdf',
      description: 'Portable Document Presentation'
    },
    targetFormat: {
      id: 'pptx',
      name: 'PowerPoint',
      extension: '.pptx',
      accept: '.pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation',
      description: 'Microsoft PowerPoint Presentation'
    },
    supportedDirections: [
      {
        from: 'pdf',
        to: 'pptx',
        fromLabel: 'PDF',
        toLabel: 'PPTX',
        description: 'Render every PDF page into high-definition PowerPoint presentation slides.'
      },
      {
        from: 'pptx',
        to: 'pdf',
        fromLabel: 'PPTX',
        toLabel: 'PDF',
        description: 'Extract presentation slide text and visuals and compile into a unified PDF document.'
      }
    ]
  },

  'pdf-excel': {
    id: 'pdf-excel',
    title: 'PDF ↔ Excel',
    badge: 'Spreadsheet',
    description: 'Extract tables and structured reports from PDF files into Excel (.xlsx), or render Excel worksheets to PDF.',
    gradient: 'from-emerald-600 via-green-500 to-teal-400',
    borderColor: 'hover:border-green-500/50',
    iconName: 'Sheet',
    sourceFormat: {
      id: 'pdf',
      name: 'PDF Document',
      extension: '.pdf',
      accept: '.pdf,application/pdf',
      description: 'PDF Report with Tables'
    },
    targetFormat: {
      id: 'xlsx',
      name: 'Excel Workbook',
      extension: '.xlsx',
      accept: '.xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      description: 'Microsoft Excel Spreadsheet'
    },
    supportedDirections: [
      {
        from: 'pdf',
        to: 'xlsx',
        fromLabel: 'PDF',
        toLabel: 'Excel',
        description: 'Extract coordinate-mapped text and table rows into an editable Excel workbook.'
      },
      {
        from: 'xlsx',
        to: 'pdf',
        fromLabel: 'Excel',
        toLabel: 'PDF',
        description: 'Render Excel sheets and structured tabular data into a professional styled PDF.'
      }
    ]
  },

  'html-pdf': {
    id: 'html-pdf',
    title: 'HTML ↔ PDF',
    badge: 'Web & Print',
    description: 'Render modern HTML web pages with CSS into PDF, or extract structured HTML markup from PDF documents.',
    gradient: 'from-purple-500 via-pink-500 to-rose-500',
    borderColor: 'hover:border-purple-500/50',
    iconName: 'Code',
    sourceFormat: {
      id: 'html',
      name: 'HTML Document',
      extension: '.html',
      accept: '.html,.htm,text/html',
      description: 'HTML5 Web Page'
    },
    targetFormat: {
      id: 'pdf',
      name: 'PDF Document',
      extension: '.pdf',
      accept: '.pdf,application/pdf',
      description: 'Portable Document Format'
    },
    supportedDirections: [
      {
        from: 'html',
        to: 'pdf',
        fromLabel: 'HTML',
        toLabel: 'PDF',
        description: 'Render responsive HTML markup with styling into crisp vector PDF pages.'
      },
      {
        from: 'pdf',
        to: 'html',
        fromLabel: 'PDF',
        toLabel: 'HTML',
        description: 'Extract text, formatting, and layout structure into clean standalone HTML5.'
      }
    ]
  },

  'pdf-md': {
    id: 'pdf-md',
    title: 'PDF ↔ Markdown',
    badge: 'Developer Docs',
    description: 'Convert PDFs to Markdown documentation with detected headings and code blocks, or compile Markdown to PDF.',
    gradient: 'from-cyan-500 via-sky-500 to-blue-600',
    borderColor: 'hover:border-cyan-500/50',
    iconName: 'FileCode2',
    sourceFormat: {
      id: 'pdf',
      name: 'PDF Document',
      extension: '.pdf',
      accept: '.pdf,application/pdf',
      description: 'PDF Document or Article'
    },
    targetFormat: {
      id: 'md',
      name: 'Markdown',
      extension: '.md',
      accept: '.md,.markdown,text/markdown',
      description: 'Markdown Documentation'
    },
    supportedDirections: [
      {
        from: 'pdf',
        to: 'md',
        fromLabel: 'PDF',
        toLabel: 'Markdown',
        description: 'Recognize titles, headings, bullet lists, and paragraphs and convert to GitHub Markdown.'
      },
      {
        from: 'md',
        to: 'pdf',
        fromLabel: 'Markdown',
        toLabel: 'PDF',
        description: 'Compile Markdown documents into a beautifully formatted developer PDF with code styling.'
      }
    ]
  },

  'docx-html': {
    id: 'docx-html',
    title: 'DOCX ↔ HTML',
    badge: 'Rich Text',
    description: 'Transform Word documents (.docx) to clean semantic HTML with embedded images, or convert HTML back to Word.',
    gradient: 'from-rose-500 via-pink-500 to-fuchsia-500',
    borderColor: 'hover:border-rose-500/50',
    iconName: 'FileSpreadsheet',
    sourceFormat: {
      id: 'docx',
      name: 'Word Document',
      extension: '.docx',
      accept: '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      description: 'Microsoft Word Document'
    },
    targetFormat: {
      id: 'html',
      name: 'HTML Document',
      extension: '.html',
      accept: '.html,.htm,text/html',
      description: 'Clean Semantic HTML'
    },
    supportedDirections: [
      {
        from: 'docx',
        to: 'html',
        fromLabel: 'DOCX',
        toLabel: 'HTML',
        description: 'Extract Word document content, formatting, and images to clean, embeddable HTML.'
      },
      {
        from: 'html',
        to: 'docx',
        fromLabel: 'HTML',
        toLabel: 'DOCX',
        description: 'Package web content, tables, and typography into a downloadable Word (.docx) file.'
      }
    ]
  },

  'hex-bytes': {
    id: 'hex-bytes',
    title: 'PDF/HTML ↔ Hex Bytes',
    badge: 'Binary Inspection',
    description: 'Inspect and convert PDF or HTML files into hexadecimal byte streams (.txt) with xxd-style dumps, and reconstruct back.',
    gradient: 'from-violet-600 via-purple-600 to-indigo-600',
    borderColor: 'hover:border-violet-500/50',
    iconName: 'Binary',
    sourceFormat: {
      id: 'binary',
      name: 'PDF / HTML Document',
      extension: '.pdf,.html',
      accept: '.pdf,.html,.htm',
      description: 'PDF or HTML File'
    },
    targetFormat: {
      id: 'hex',
      name: 'Hex Bytes Text',
      extension: '.txt',
      accept: '.txt,text/plain',
      description: 'Hexadecimal Dump (.txt)'
    },
    supportedDirections: [
      {
        from: 'binary',
        to: 'hex',
        fromLabel: 'PDF/HTML',
        toLabel: 'Hex (.txt)',
        description: 'Export raw binary bytes into formatted hexadecimal dumps or C/Rust byte arrays saved as .txt.'
      },
      {
        from: 'hex',
        to: 'binary',
        fromLabel: 'Hex (.txt)',
        toLabel: 'PDF/HTML',
        description: 'Reconstruct valid PDF or HTML documents from hex byte text strings.'
      }
    ],
    customOptions: [
      {
        id: 'hexFormat',
        label: 'Hex Output Style',
        type: 'select',
        defaultValue: 'dump',
        options: [
          { label: 'Standard Hex Dump (Offset + Hex + ASCII like xxd)', value: 'dump' },
          { label: 'Programming Array (0x4D, 0x5A, ...)', value: 'array' },
          { label: 'Space-Separated Bytes (4D 5A 90 ...)', value: 'spaced' },
          { label: 'Continuous Raw Hex String', value: 'raw' }
        ]
      }
    ]
  },

  'pdf-jpg': {
    id: 'pdf-jpg',
    title: 'PDF ↔ JPG',
    badge: 'Images',
    description: 'Render PDF pages into high-resolution JPG images with ZIP download, or merge multiple JPG images into a PDF.',
    gradient: 'from-pink-500 via-rose-500 to-orange-400',
    borderColor: 'hover:border-pink-500/50',
    iconName: 'Image',
    sourceFormat: {
      id: 'pdf',
      name: 'PDF Document',
      extension: '.pdf',
      accept: '.pdf,application/pdf',
      description: 'PDF Document'
    },
    targetFormat: {
      id: 'jpg',
      name: 'JPG Image(s)',
      extension: '.jpg',
      accept: '.jpg,.jpeg,.png,image/jpeg,image/png',
      description: 'High-Resolution Images'
    },
    supportedDirections: [
      {
        from: 'pdf',
        to: 'jpg',
        fromLabel: 'PDF',
        toLabel: 'JPG',
        description: 'Extract every PDF page into sharp JPEG images with instant preview and ZIP export.'
      },
      {
        from: 'jpg',
        to: 'pdf',
        fromLabel: 'JPG',
        toLabel: 'PDF',
        description: 'Combine single or multiple image uploads into a unified, high-quality PDF document.'
      }
    ],
    customOptions: [
      {
        id: 'imageScale',
        label: 'Render Resolution (DPI scale)',
        type: 'select',
        defaultValue: '2',
        options: [
          { label: 'Standard (1.5x)', value: '1.5' },
          { label: 'High Quality (2x Retina)', value: '2' },
          { label: 'Ultra HD (3x Print)', value: '3' }
        ]
      }
    ]
  }
};
