import pptxgen from 'pptxgenjs';
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import type { ConversionResult } from '../../types/converter';
import { loadPdfDocument, renderPdfPageToCanvas } from '../pdfHelper';

export async function pdfToPptx(
  pdfBuffer: ArrayBuffer,
  fileName: string,
  onProgress?: (progress: number) => void
): Promise<ConversionResult> {
  const pdfDoc = await loadPdfDocument(pdfBuffer);
  const totalPages = pdfDoc.numPages;

  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdfDoc.getPage(i);
    const canvas = await renderPdfPageToCanvas(page, 2);
    const imgData = canvas.toDataURL('image/jpeg', 0.9);

    const slide = pptx.addSlide();
    slide.addImage({
      data: imgData,
      x: 0,
      y: 0,
      w: '100%',
      h: '100%',
    });

    if (onProgress) {
      onProgress(Math.round((i / totalPages) * 85));
    }
  }

  const pptxBlob = (await pptx.write({ outputType: 'blob' })) as Blob;
  const outName = fileName.replace(/\.[^/.]+$/, '') + '.pptx';

  if (onProgress) onProgress(100);

  return {
    fileName: outName,
    fileSize: pptxBlob.size,
    blob: pptxBlob,
    downloadUrl: URL.createObjectURL(pptxBlob),
    metadata: {
      'Generated Slides': totalPages,
      'Slide Aspect Ratio': '16:9 Widescreen',
      'Format': 'Microsoft PowerPoint (.pptx)',
    },
  };
}

export async function pptxToPdf(
  pptxBuffer: ArrayBuffer,
  fileName: string,
  onProgress?: (progress: number) => void
): Promise<ConversionResult> {
  if (onProgress) onProgress(20);
  const zip = await JSZip.loadAsync(pptxBuffer);

  // Find all slide XML files
  const slideFiles = Object.keys(zip.files).filter((path) =>
    path.match(/^ppt\/slides\/slide\d+\.xml$/i)
  );

  // Natural sort slides: slide1.xml, slide2.xml ...
  slideFiles.sort((a, b) => {
    const numA = parseInt(a.match(/slide(\d+)\.xml/i)?.[1] || '0', 10);
    const numB = parseInt(b.match(/slide(\d+)\.xml/i)?.[1] || '0', 10);
    return numA - numB;
  });

  const pdf = new jsPDF('l', 'pt', [960, 540]); // 16:9 widescreen pt

  for (let i = 0; i < slideFiles.length; i++) {
    if (i > 0) pdf.addPage([960, 540], 'l');

    const xmlContent = await zip.files[slideFiles[i]].async('text');
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, 'application/xml');

    // Extract text nodes <a:t>
    const textNodes = xmlDoc.getElementsByTagName('a:t');
    const texts: string[] = [];
    for (let t = 0; t < textNodes.length; t++) {
      const val = textNodes[t].textContent?.trim();
      if (val) texts.push(val);
    }

    // Clean slide background
    pdf.setFillColor(15, 23, 42); // Dark slate
    pdf.rect(0, 0, 960, 540, 'F');

    // Header badge
    pdf.setFillColor(99, 102, 241);
    pdf.roundedRect(60, 45, 110, 26, 4, 4, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(12);
    pdf.text(`SLIDE ${i + 1}`, 90, 62);

    // Title & Text
    pdf.setTextColor(248, 250, 252);
    let currentY = 120;

    if (texts.length > 0) {
      // First text as Title
      pdf.setFontSize(26);
      pdf.text(texts[0].substring(0, 70), 60, currentY);
      currentY += 50;

      pdf.setFontSize(15);
      pdf.setTextColor(203, 213, 225);
      for (let j = 1; j < Math.min(texts.length, 9); j++) {
        pdf.text(`• ${texts[j].substring(0, 100)}`, 80, currentY);
        currentY += 32;
      }
    } else {
      pdf.setFontSize(18);
      pdf.setTextColor(148, 163, 184);
      pdf.text('(Slide Visual Content)', 60, currentY);
    }

    if (onProgress) {
      onProgress(Math.round(((i + 1) / Math.max(slideFiles.length, 1)) * 90));
    }
  }

  const pdfBlob = pdf.output('blob');
  const outName = fileName.replace(/\.[^/.]+$/, '') + '.pdf';

  if (onProgress) onProgress(100);

  return {
    fileName: outName,
    fileSize: pdfBlob.size,
    blob: pdfBlob,
    downloadUrl: URL.createObjectURL(pdfBlob),
    metadata: {
      'Extracted Slides': slideFiles.length,
      'Presentation Ratio': '16:9 PDF Widescreen',
    },
  };
}
