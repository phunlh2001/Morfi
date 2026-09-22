import mammoth from 'mammoth';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import type { ConversionResult } from '../../types/converter';

export async function docxToHtml(
  arrayBuffer: ArrayBuffer,
  fileName: string
): Promise<ConversionResult> {
  const result = await mammoth.convertToHtml({ arrayBuffer });
  const rawHtml = result.value;

  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${fileName} - Converted from DOCX</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #1e293b; }
    h1, h2, h3 { color: #0f172a; margin-top: 24px; margin-bottom: 8px; }
    p { margin-bottom: 12px; }
    table { border-collapse: collapse; width: 100%; margin: 16px 0; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; }
    img { max-width: 100%; height: auto; border-radius: 4px; }
  </style>
</head>
<body>
  ${rawHtml}
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8;' });
  const outName = fileName.replace(/\.[^/.]+$/, '') + '.html';

  return {
    fileName: outName,
    fileSize: blob.size,
    blob,
    downloadUrl: URL.createObjectURL(blob),
    htmlPreview: rawHtml,
    textPreview: fullHtml,
    metadata: {
      'Source File': fileName,
      'Conversion Engine': 'Mammoth HTML Engine',
      'HTML Size': `${blob.size.toLocaleString()} bytes`,
    },
  };
}

export async function htmlToDocx(
  htmlContent: string,
  fileName: string
): Promise<ConversionResult> {
  // Parse HTML DOM to generate docx Document elements
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');

  const children: Paragraph[] = [];
  const nodes = doc.body.childNodes;

  nodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();
      const text = el.textContent || '';

      if (tag === 'h1') {
        children.push(
          new Paragraph({
            text,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
          })
        );
      } else if (tag === 'h2') {
        children.push(
          new Paragraph({
            text,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          })
        );
      } else if (tag === 'h3') {
        children.push(
          new Paragraph({
            text,
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 160, after: 80 },
          })
        );
      } else if (tag === 'p' || tag === 'div') {
        children.push(
          new Paragraph({
            children: [new TextRun(text)],
            spacing: { before: 100, after: 100 },
          })
        );
      } else if (tag === 'ul' || tag === 'ol') {
        el.querySelectorAll('li').forEach((li) => {
          children.push(
            new Paragraph({
              text: li.textContent || '',
              bullet: { level: 0 },
            })
          );
        });
      }
    } else if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      children.push(
        new Paragraph({
          children: [new TextRun(node.textContent.trim())],
        })
      );
    }
  });

  if (children.length === 0) {
    children.push(new Paragraph({ text: doc.body.textContent || 'Empty Document' }));
  }

  const docxDoc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(docxDoc);
  const outName = fileName.replace(/\.[^/.]+$/, '') + '.docx';

  return {
    fileName: outName,
    fileSize: blob.size,
    blob,
    downloadUrl: URL.createObjectURL(blob),
    textPreview: doc.body.textContent || '',
    metadata: {
      'Generated Sections': 1,
      'Paragraphs Created': children.length,
      'Format': 'Microsoft Word (.docx)',
    },
  };
}
