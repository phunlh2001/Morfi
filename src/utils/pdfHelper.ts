import * as pdfjsLib from 'pdfjs-dist';
// Vite ?url import for local worker
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
}

export { pdfjsLib };

export interface PdfDocumentProxy {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PdfPageProxy>;
}

export interface PdfPageProxy {
  getViewport: (options: { scale: number }) => { width: number; height: number };
  render: (options: { canvasContext: CanvasRenderingContext2D; viewport: unknown }) => {
    promise: Promise<void>;
  };
  getTextContent: () => Promise<{ items: Array<{ str?: string; transform?: number[] }> }>;
}

export async function loadPdfDocument(data: ArrayBuffer | Uint8Array): Promise<PdfDocumentProxy> {
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(data),
    useSystemFonts: true,
  });
  return (await loadingTask.promise) as unknown as PdfDocumentProxy;
}

export async function renderPdfPageToCanvas(
  page: PdfPageProxy,
  scale: number = 2
): Promise<HTMLCanvasElement> {
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Could not create canvas 2d context');
  }

  const renderContext = {
    canvasContext: context,
    viewport: viewport,
  };

  await page.render(renderContext).promise;
  return canvas;
}

export async function extractPdfText(pdfDoc: PdfDocumentProxy): Promise<string> {
  let fullText = '';
  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => ('str' in item && typeof item.str === 'string' ? item.str : ''))
      .join(' ');
    fullText += `--- Page ${i} ---\n` + pageText + '\n\n';
  }
  return fullText.trim();
}
