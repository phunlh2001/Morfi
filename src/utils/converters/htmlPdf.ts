import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { ConversionResult } from '../../types/converter';
import { loadPdfDocument } from '../pdfHelper';

export async function htmlToPdf(
  htmlContent: string,
  fileName: string,
  onProgress?: (progress: number) => void
): Promise<ConversionResult> {
  if (onProgress) onProgress(20);

  // Create isolated sandbox container
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '800px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#1a1a1a';
  container.style.padding = '40px';
  container.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  container.innerHTML = htmlContent;

  document.body.appendChild(container);

  try {
    if (onProgress) onProgress(45);
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    if (onProgress) onProgress(75);

    const imgWidth = 595.28; // A4 pt
    const pageHeight = 841.89; // A4 pt
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    const pdf = new jsPDF('p', 'pt', 'a4');
    let position = 0;

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    if (onProgress) onProgress(95);

    const pdfBlob = pdf.output('blob');
    const outName = fileName.replace(/\.[^/.]+$/, '') + '.pdf';

    return {
      fileName: outName,
      fileSize: pdfBlob.size,
      blob: pdfBlob,
      downloadUrl: URL.createObjectURL(pdfBlob),
      htmlPreview: htmlContent,
      metadata: {
        'Source File': fileName,
        'Rendered Pages': Math.ceil(imgHeight / pageHeight),
        'Paper Size': 'A4 (Print Ready)',
      },
    };
  } finally {
    document.body.removeChild(container);
    if (onProgress) onProgress(100);
  }
}

export async function pdfToHtml(
  pdfBuffer: ArrayBuffer,
  fileName: string,
  onProgress?: (progress: number) => void
): Promise<ConversionResult> {
  const pdfDoc = await loadPdfDocument(pdfBuffer);
  const totalPages = pdfDoc.numPages;

  let bodyHtml = '';

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();

    let pageHtml = `<section class="pdf-page" id="page-${i}">\n  <header class="page-num">Page ${i}</header>\n  <div class="page-content">\n`;

    let currentParagraph = '';

    textContent.items.forEach((item: { str?: string; transform?: number[] }) => {
      const text = item.str || '';
      if (!text.trim()) return;

      const fontSize = Math.round(item.transform?.[0] || 12);
      if (fontSize >= 18) {
        if (currentParagraph) {
          pageHtml += `    <p>${currentParagraph.trim()}</p>\n`;
          currentParagraph = '';
        }
        pageHtml += `    <h1 style="font-size: ${fontSize}px;">${text}</h1>\n`;
      } else if (fontSize >= 14) {
        if (currentParagraph) {
          pageHtml += `    <p>${currentParagraph.trim()}</p>\n`;
          currentParagraph = '';
        }
        pageHtml += `    <h2 style="font-size: ${fontSize}px;">${text}</h2>\n`;
      } else {
        currentParagraph += ' ' + text;
      }
    });

    if (currentParagraph) {
      pageHtml += `    <p>${currentParagraph.trim()}</p>\n`;
    }

    pageHtml += `  </div>\n</section>\n`;
    bodyHtml += pageHtml;

    if (onProgress) {
      onProgress(Math.round((i / totalPages) * 90));
    }
  }

  const completeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${fileName} - Converted from PDF</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; max-width: 850px; margin: 40px auto; padding: 0 20px; color: #222; background: #fafafa; }
    .pdf-page { background: #ffffff; padding: 48px; border-radius: 8px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); margin-bottom: 32px; }
    .page-num { font-size: 11px; text-transform: uppercase; color: #888; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 24px; font-weight: 600; letter-spacing: 0.5px; }
    h1 { color: #0f172a; margin-top: 16px; margin-bottom: 8px; }
    h2 { color: #334155; margin-top: 14px; margin-bottom: 6px; }
    p { margin-bottom: 14px; text-align: justify; }
  </style>
</head>
<body>
  ${bodyHtml}
</body>
</html>`;

  const blob = new Blob([completeHtml], { type: 'text/html;charset=utf-8;' });
  const outName = fileName.replace(/\.[^/.]+$/, '') + '.html';

  if (onProgress) onProgress(100);

  return {
    fileName: outName,
    fileSize: blob.size,
    blob,
    downloadUrl: URL.createObjectURL(blob),
    htmlPreview: completeHtml,
    textPreview: completeHtml,
    metadata: {
      'Extracted Pages': totalPages,
      'Document Type': 'Semantic HTML5',
    },
  };
}
