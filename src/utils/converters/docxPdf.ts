import mammoth from 'mammoth';
import { Document, Packer, Paragraph, HeadingLevel } from 'docx';
import type { ConversionResult } from '../../types/converter';
import { htmlToPdf } from './htmlPdf';
import { loadPdfDocument } from '../pdfHelper';

export async function docxToPdf(
  docxBuffer: ArrayBuffer,
  fileName: string,
  onProgress?: (progress: number) => void
): Promise<ConversionResult> {
  if (onProgress) onProgress(20);
  const result = await mammoth.convertToHtml({ arrayBuffer: docxBuffer });
  const html = result.value;

  const styledHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 800px;">
      <style>
        h1 { color: #0f172a; font-size: 26px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 20px; }
        h2 { color: #1e293b; font-size: 20px; margin-top: 18px; }
        h3 { color: #334155; font-size: 16px; margin-top: 14px; }
        p { margin-bottom: 12px; font-size: 14px; }
        table { border-collapse: collapse; width: 100%; margin: 16px 0; }
        th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
        th { background: #f8fafc; font-weight: bold; }
        ul, ol { padding-left: 24px; margin-bottom: 12px; }
        li { margin-bottom: 4px; }
        img { max-width: 100%; height: auto; margin: 10px 0; }
      </style>
      ${html}
    </div>
  `;

  return await htmlToPdf(styledHtml, fileName, onProgress);
}

export async function pdfToDocx(
  pdfBuffer: ArrayBuffer,
  fileName: string,
  onProgress?: (progress: number) => void
): Promise<ConversionResult> {
  const pdfDoc = await loadPdfDocument(pdfBuffer);
  const totalPages = pdfDoc.numPages;

  const paragraphs: Paragraph[] = [];
  const textPreviews: string[] = [];

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();

    let currentPara = '';

    textContent.items.forEach((item: { str?: string; transform?: number[] }) => {
      const text = item.str || '';
      if (!text.trim()) return;

      const fontSize = Math.round(item.transform?.[0] || 12);

      if (fontSize >= 20) {
        if (currentPara) {
          paragraphs.push(new Paragraph({ text: currentPara.trim(), spacing: { after: 120 } }));
          textPreviews.push(currentPara.trim());
          currentPara = '';
        }
        paragraphs.push(
          new Paragraph({
            text,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
          })
        );
        textPreviews.push(text);
      } else if (fontSize >= 15) {
        if (currentPara) {
          paragraphs.push(new Paragraph({ text: currentPara.trim(), spacing: { after: 120 } }));
          textPreviews.push(currentPara.trim());
          currentPara = '';
        }
        paragraphs.push(
          new Paragraph({
            text,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 180, after: 90 },
          })
        );
        textPreviews.push(text);
      } else {
        currentPara += ' ' + text;
      }
    });

    if (currentPara) {
      paragraphs.push(new Paragraph({ text: currentPara.trim(), spacing: { after: 120 } }));
      textPreviews.push(currentPara.trim());
    }

    if (onProgress) {
      onProgress(Math.round((i / totalPages) * 85));
    }
  }

  if (paragraphs.length === 0) {
    paragraphs.push(new Paragraph({ text: 'Extracted PDF Content' }));
    textPreviews.push('Extracted PDF Content');
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const outName = fileName.replace(/\.[^/.]+$/, '') + '.docx';

  if (onProgress) onProgress(100);

  return {
    fileName: outName,
    fileSize: blob.size,
    blob,
    downloadUrl: URL.createObjectURL(blob),
    textPreview: textPreviews.slice(0, 15).join('\n\n'),
    metadata: {
      'Source Pages': totalPages,
      'Paragraphs Created': paragraphs.length,
      'Word Format': 'Office Open XML (.docx)',
    },
  };
}
