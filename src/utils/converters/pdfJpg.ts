import jsPDF from 'jspdf';
import JSZip from 'jszip';
import type { ConversionResult } from '../../types/converter';
import { loadPdfDocument, renderPdfPageToCanvas } from '../pdfHelper';

export async function pdfToJpg(
  pdfBuffer: ArrayBuffer,
  fileName: string,
  scale: number = 2,
  onProgress?: (progress: number) => void
): Promise<ConversionResult> {
  const pdfDoc = await loadPdfDocument(pdfBuffer);
  const totalPages = pdfDoc.numPages;
  const imagePreviews: string[] = [];
  const imageBlobs: { name: string; blob: Blob }[] = [];

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdfDoc.getPage(i);
    const canvas = await renderPdfPageToCanvas(page, scale);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    imagePreviews.push(dataUrl);

    // Create blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b || new Blob()), 'image/jpeg', 0.92);
    });

    imageBlobs.push({
      name: `page_${i.toString().padStart(2, '0')}.jpg`,
      blob,
    });

    if (onProgress) {
      onProgress(Math.round((i / totalPages) * 90));
    }
  }

  let finalBlob: Blob;
  let outName: string;

  if (totalPages === 1) {
    finalBlob = imageBlobs[0].blob;
    outName = fileName.replace(/\.[^/.]+$/, '') + '.jpg';
  } else {
    // Pack into ZIP
    const zip = new JSZip();
    imageBlobs.forEach((item) => {
      zip.file(item.name, item.blob);
    });
    finalBlob = await zip.generateAsync({ type: 'blob' });
    outName = fileName.replace(/\.[^/.]+$/, '') + '_pages.zip';
  }

  if (onProgress) onProgress(100);

  return {
    fileName: outName,
    fileSize: finalBlob.size,
    blob: finalBlob,
    downloadUrl: URL.createObjectURL(finalBlob),
    imagePreviews,
    metadata: {
      'Rendered Pages': totalPages,
      'Resolution Scale': `${scale}x (DPI)`,
      'Packaging': totalPages > 1 ? 'ZIP Archive' : 'Single JPEG',
    },
  };
}

export async function jpgToPdf(
  files: File[],
  onProgress?: (progress: number) => void
): Promise<ConversionResult> {
  if (files.length === 0) {
    throw new Error('No images selected.');
  }

  const pdf = new jsPDF({
    orientation: 'p',
    unit: 'pt',
  });

  const imagePreviews: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    imagePreviews.push(dataUrl);

    // Get image dimensions
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = dataUrl;
    });

    const imgWidth = img.naturalWidth || 612;
    const imgHeight = img.naturalHeight || 792;
    const orientation = imgWidth > imgHeight ? 'landscape' : 'portrait';

    if (i > 0) {
      pdf.addPage([imgWidth, imgHeight], orientation);
    } else {
      // First page dimensions
      pdf.deletePage(1);
      pdf.addPage([imgWidth, imgHeight], orientation);
    }

    pdf.addImage(dataUrl, 'JPEG', 0, 0, imgWidth, imgHeight);

    if (onProgress) {
      onProgress(Math.round(((i + 1) / files.length) * 100));
    }
  }

  const pdfBlob = pdf.output('blob');
  const baseName = files[0].name.replace(/\.[^/.]+$/, '');
  const outName = `${baseName}_converted.pdf`;

  return {
    fileName: outName,
    fileSize: pdfBlob.size,
    blob: pdfBlob,
    downloadUrl: URL.createObjectURL(pdfBlob),
    imagePreviews,
    metadata: {
      'Total Images': files.length,
      'Output Format': 'PDF Document',
    },
  };
}
