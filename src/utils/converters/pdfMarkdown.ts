import { marked } from 'marked';
import type { ConversionResult } from '../../types/converter';
import { loadPdfDocument } from '../pdfHelper';
import { htmlToPdf } from './htmlPdf';

export async function pdfToMarkdown(
  pdfBuffer: ArrayBuffer,
  fileName: string,
  onProgress?: (progress: number) => void
): Promise<ConversionResult> {
  const pdfDoc = await loadPdfDocument(pdfBuffer);
  const totalPages = pdfDoc.numPages;

  const markdownLines: string[] = [];
  markdownLines.push(`# ${fileName.replace(/\.[^/.]+$/, '')}\n`);

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();

    markdownLines.push(`\n<!-- Page ${i} -->\n`);

    let currentLine = '';

    textContent.items.forEach((item: { str?: string; transform?: number[] }) => {
      const text = item.str || '';
      if (!text.trim()) return;

      const fontSize = Math.round(item.transform?.[0] || 12);

      if (fontSize >= 22) {
        if (currentLine) {
          markdownLines.push(currentLine.trim() + '\n');
          currentLine = '';
        }
        markdownLines.push(`## ${text}\n`);
      } else if (fontSize >= 16) {
        if (currentLine) {
          markdownLines.push(currentLine.trim() + '\n');
          currentLine = '';
        }
        markdownLines.push(`### ${text}\n`);
      } else if (text.trim().startsWith('•') || text.trim().startsWith('-')) {
        if (currentLine) {
          markdownLines.push(currentLine.trim());
          currentLine = '';
        }
        markdownLines.push(`- ${text.replace(/^[•-]\s*/, '')}`);
      } else {
        currentLine += ' ' + text;
      }
    });

    if (currentLine) {
      markdownLines.push(currentLine.trim() + '\n');
    }

    if (onProgress) {
      onProgress(Math.round((i / totalPages) * 90));
    }
  }

  const markdownContent = markdownLines.join('\n');
  const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
  const outName = fileName.replace(/\.[^/.]+$/, '') + '.md';

  if (onProgress) onProgress(100);

  return {
    fileName: outName,
    fileSize: blob.size,
    blob,
    downloadUrl: URL.createObjectURL(blob),
    textPreview: markdownContent,
    metadata: {
      'Parsed Pages': totalPages,
      'Markdown Flavor': 'GitHub Markdown (GFM)',
      'Character Count': markdownContent.length.toLocaleString(),
    },
  };
}

export async function markdownToPdf(
  markdownText: string,
  fileName: string,
  onProgress?: (progress: number) => void
): Promise<ConversionResult> {
  const parsedHtml = await marked.parse(markdownText);

  const styledHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b;">
      <style>
        h1 { color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; font-size: 26px; }
        h2 { color: #1e293b; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px; font-size: 20px; margin-top: 24px; }
        h3 { color: #334155; font-size: 16px; margin-top: 18px; }
        p { margin-bottom: 12px; }
        code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em; color: #e11d48; }
        pre { background: #0f172a; color: #f8fafc; padding: 16px; border-radius: 8px; overflow-x: auto; }
        pre code { background: transparent; color: inherit; padding: 0; }
        blockquote { border-left: 4px solid #6366f1; padding-left: 14px; color: #475569; font-style: italic; margin: 16px 0; }
        table { border-collapse: collapse; width: 100%; margin: 16px 0; }
        th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
        th { background: #f8fafc; }
        ul, ol { padding-left: 24px; margin-bottom: 12px; }
        li { margin-bottom: 4px; }
      </style>
      ${parsedHtml}
    </div>
  `;

  return await htmlToPdf(styledHtml, fileName, onProgress);
}
