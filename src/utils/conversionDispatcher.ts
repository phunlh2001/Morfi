import type { ConversionResult } from '../types/converter';
import { docxToPdf, pdfToDocx } from './converters/docxPdf';
import { txtToCsv, csvToTxt } from './converters/txtCsv';
import { pdfToPptx, pptxToPdf } from './converters/pdfPptx';
import { pdfToExcel, excelToPdf } from './converters/pdfExcel';
import { htmlToPdf, pdfToHtml } from './converters/htmlPdf';
import { pdfToMarkdown, markdownToPdf } from './converters/pdfMarkdown';
import { docxToHtml, htmlToDocx } from './converters/docxHtml';
import { binaryToHex, hexToBinary } from './converters/hexBytes';
import { pdfToJpg, jpgToPdf } from './converters/pdfJpg';

export interface DispatchParams {
  converterId: string;
  from: string;
  to: string;
  files: File[];
  options?: Record<string, string | number | boolean>;
  onProgress?: (progress: number) => void;
}

export async function executeConversion(params: DispatchParams): Promise<ConversionResult> {
  const { converterId, from, to, files, options = {}, onProgress } = params;

  if (!files || files.length === 0) {
    throw new Error('Please select or drop a file to convert.');
  }

  const primaryFile = files[0];

  switch (converterId) {
    case 'docx-pdf': {
      if (from === 'docx' && to === 'pdf') {
        const buffer = await primaryFile.arrayBuffer();
        return await docxToPdf(buffer, primaryFile.name, onProgress);
      } else {
        const buffer = await primaryFile.arrayBuffer();
        return await pdfToDocx(buffer, primaryFile.name, onProgress);
      }
    }

    case 'txt-csv': {
      const text = await primaryFile.text();
      if (from === 'txt' && to === 'csv') {
        const delim = options.delimiter !== undefined ? String(options.delimiter) : 'auto';
        return txtToCsv(text, primaryFile.name, delim);
      } else {
        const style = options.tableFormat !== undefined ? String(options.tableFormat) : 'grid';
        return csvToTxt(text, primaryFile.name, style);
      }
    }

    case 'pdf-pptx': {
      const buffer = await primaryFile.arrayBuffer();
      if (from === 'pdf' && to === 'pptx') {
        return await pdfToPptx(buffer, primaryFile.name, onProgress);
      } else {
        return await pptxToPdf(buffer, primaryFile.name, onProgress);
      }
    }

    case 'pdf-excel': {
      const buffer = await primaryFile.arrayBuffer();
      if (from === 'pdf' && to === 'xlsx') {
        return await pdfToExcel(buffer, primaryFile.name, onProgress);
      } else {
        return await excelToPdf(buffer, primaryFile.name, onProgress);
      }
    }

    case 'html-pdf': {
      if (from === 'html' && to === 'pdf') {
        const text = await primaryFile.text();
        return await htmlToPdf(text, primaryFile.name, onProgress);
      } else {
        const buffer = await primaryFile.arrayBuffer();
        return await pdfToHtml(buffer, primaryFile.name, onProgress);
      }
    }

    case 'pdf-md': {
      if (from === 'pdf' && to === 'md') {
        const buffer = await primaryFile.arrayBuffer();
        return await pdfToMarkdown(buffer, primaryFile.name, onProgress);
      } else {
        const text = await primaryFile.text();
        return await markdownToPdf(text, primaryFile.name, onProgress);
      }
    }

    case 'docx-html': {
      if (from === 'docx' && to === 'html') {
        const buffer = await primaryFile.arrayBuffer();
        return await docxToHtml(buffer, primaryFile.name);
      } else {
        const text = await primaryFile.text();
        return await htmlToDocx(text, primaryFile.name);
      }
    }

    case 'hex-bytes': {
      if (to === 'hex') {
        const buffer = await primaryFile.arrayBuffer();
        const format = options.hexFormat !== undefined ? String(options.hexFormat) : 'dump';
        return binaryToHex(buffer, primaryFile.name, format);
      } else {
        const text = await primaryFile.text();
        return hexToBinary(text, 'auto');
      }
    }

    case 'pdf-jpg': {
      if (from === 'pdf' && to === 'jpg') {
        const buffer = await primaryFile.arrayBuffer();
        const scale = parseFloat(options.imageScale !== undefined ? String(options.imageScale) : '2');
        return await pdfToJpg(buffer, primaryFile.name, scale, onProgress);
      } else {
        return await jpgToPdf(files, onProgress);
      }
    }

    default:
      throw new Error(`Unsupported converter: ${converterId}`);
  }
}
