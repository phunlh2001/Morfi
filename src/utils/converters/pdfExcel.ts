import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import type { ConversionResult } from '../../types/converter';
import { loadPdfDocument } from '../pdfHelper';

export async function pdfToExcel(
  pdfBuffer: ArrayBuffer,
  fileName: string,
  onProgress?: (progress: number) => void
): Promise<ConversionResult> {
  const pdfDoc = await loadPdfDocument(pdfBuffer);
  const totalPages = pdfDoc.numPages;

  const workbook = XLSX.utils.book_new();

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();

    // Group items by vertical position (Y coordinate) with 4pt tolerance
    const lineMap: Map<number, Array<{ x: number; text: string }>> = new Map();

    textContent.items.forEach((item: { str?: string; transform?: number[] }) => {
      const text = item.str?.trim();
      if (!text) return;

      const y = Math.round(item.transform?.[5] || 0);
      const x = Math.round(item.transform?.[4] || 0);

      // Find nearby Y
      let matchedY: number | null = null;
      for (const existingY of lineMap.keys()) {
        if (Math.abs(existingY - y) <= 4) {
          matchedY = existingY;
          break;
        }
      }

      if (matchedY !== null) {
        lineMap.get(matchedY)!.push({ x, text });
      } else {
        lineMap.set(y, [{ x, text }]);
      }
    });

    // Sort rows by descending Y (top to bottom)
    const sortedY = Array.from(lineMap.keys()).sort((a, b) => b - a);

    // Build 2D table grid
    const sheetData: string[][] = [];

    for (const y of sortedY) {
      const rowItems = lineMap.get(y)!.sort((a, b) => a.x - b.x);
      // Group nearby items into cells, larger gaps as new columns
      const rowCells: string[] = [];
      let currentCell = '';
      let lastX = -1;

      for (const item of rowItems) {
        if (lastX !== -1 && item.x - lastX > 30) {
          rowCells.push(currentCell.trim());
          currentCell = item.text;
        } else {
          currentCell += (currentCell ? ' ' : '') + item.text;
        }
        lastX = item.x;
      }
      if (currentCell) {
        rowCells.push(currentCell.trim());
      }
      sheetData.push(rowCells);
    }

    if (sheetData.length === 0) {
      sheetData.push(['(No text items extracted from this page)']);
    }

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, `Page_${i}`);

    if (onProgress) {
      onProgress(Math.round((i / totalPages) * 90));
    }
  }

  // Generate Excel buffer
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const outName = fileName.replace(/\.[^/.]+$/, '') + '.xlsx';

  if (onProgress) onProgress(100);

  // Text preview of first sheet
  const firstSheetName = workbook.SheetNames[0];
  const firstSheetCsv = XLSX.utils.sheet_to_csv(workbook.Sheets[firstSheetName]);

  return {
    fileName: outName,
    fileSize: blob.size,
    blob,
    downloadUrl: URL.createObjectURL(blob),
    textPreview: firstSheetCsv,
    metadata: {
      'Extracted Sheets': workbook.SheetNames.length,
      'Worksheet Names': workbook.SheetNames.join(', '),
      'Format': 'Excel (.xlsx)',
    },
  };
}

export async function excelToPdf(
  excelBuffer: ArrayBuffer,
  fileName: string,
  onProgress?: (progress: number) => void
): Promise<ConversionResult> {
  if (onProgress) onProgress(20);
  const workbook = XLSX.read(excelBuffer, { type: 'array' });
  const pdf = new jsPDF('l', 'pt', 'a4'); // Landscape for tables

  const sheetNames = workbook.SheetNames;

  for (let sIdx = 0; sIdx < sheetNames.length; sIdx++) {
    if (sIdx > 0) pdf.addPage('a4', 'l');

    const sheetName = sheetNames[sIdx];
    const sheet = workbook.Sheets[sheetName];
    const data: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    pdf.setFontSize(16);
    pdf.setTextColor(15, 23, 42);
    pdf.text(`Sheet: ${sheetName}`, 40, 40);

    pdf.setFontSize(9);
    const startY = 70;
    const colWidth = 90;
    const rowHeight = 22;

    const maxCols = Math.min(8, Math.max(...data.map((r) => r.length), 1));
    const maxRows = Math.min(data.length, 25); // Show first 25 rows per sheet preview

    for (let r = 0; r < maxRows; r++) {
      const row = data[r] || [];
      const y = startY + r * rowHeight;

      // Zebra striping
      if (r === 0) {
        pdf.setFillColor(241, 245, 249);
        pdf.rect(40, y - 14, maxCols * colWidth, rowHeight, 'F');
        pdf.setFont('helvetica', 'bold');
      } else {
        if (r % 2 === 1) {
          pdf.setFillColor(248, 250, 252);
          pdf.rect(40, y - 14, maxCols * colWidth, rowHeight, 'F');
        }
        pdf.setFont('helvetica', 'normal');
      }

      for (let c = 0; c < maxCols; c++) {
        const val = String(row[c] ?? '').substring(0, 18);
        const x = 45 + c * colWidth;
        pdf.text(val, x, y);
      }
    }

    if (onProgress) {
      onProgress(Math.round(((sIdx + 1) / sheetNames.length) * 90));
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
      'Worksheets Converted': sheetNames.length,
      'Orientation': 'Landscape Table Layout',
    },
  };
}
