import type { ConversionResult } from '../../types/converter';

export function txtToCsv(
  content: string,
  fileName: string,
  delimiterOption: string = 'auto'
): ConversionResult {
  const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) {
    throw new Error('Input text file is empty.');
  }

  // Detect delimiter if auto
  let delimiter: string;
  if (delimiterOption === 'auto') {
    const sample = lines.slice(0, 5).join('\n');
    const tabs = (sample.match(/\t/g) || []).length;
    const commas = (sample.match(/,/g) || []).length;
    const semicolons = (sample.match(/;/g) || []).length;
    const pipes = (sample.match(/\|/g) || []).length;

    if (tabs > commas && tabs > semicolons) delimiter = '\t';
    else if (semicolons > commas && semicolons > pipes) delimiter = ';';
    else if (pipes > commas) delimiter = '|';
    else delimiter = ',';
  } else if (delimiterOption === 'space') {
    delimiter = ' ';
  } else {
    delimiter = delimiterOption;
  }

  const csvRows: string[] = [];
  for (const line of lines) {
    const cells = delimiter === ' ' ? line.trim().split(/\s+/) : line.split(delimiter);

    const escapedCells = cells.map((cell) => {
      const trimmed = cell.trim();
      if (trimmed.includes(',') || trimmed.includes('"') || trimmed.includes('\n')) {
        return `"${trimmed.replace(/"/g, '""')}"`;
      }
      return trimmed;
    });
    csvRows.push(escapedCells.join(','));
  }

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const outName = fileName.replace(/\.[^/.]+$/, '') + '.csv';

  return {
    fileName: outName,
    fileSize: blob.size,
    blob,
    downloadUrl: URL.createObjectURL(blob),
    textPreview: csvContent,
    metadata: {
      'Detected Delimiter': delimiter === '\t' ? 'Tab' : delimiter,
      'Total Rows': lines.length,
      'Total Columns': csvRows[0]?.split(',').length || 0,
    },
  };
}

export function csvToTxt(
  content: string,
  fileName: string,
  style: string = 'grid'
): ConversionResult {
  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) {
    throw new Error('CSV file is empty.');
  }

  // Parse CSV rows safely
  const rows: string[][] = [];
  for (const line of lines) {
    // Simple CSV row parser handling quotes
    const row: string[] = [];
    let inQuotes = false;
    let current = '';
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    row.push(current.trim());
    rows.push(row);
  }

  let formattedText: string;
  if (style === 'grid') {
    // Calculate col widths
    const colCount = Math.max(...rows.map((r) => r.length));
    const colWidths = new Array(colCount).fill(0);
    for (const r of rows) {
      for (let c = 0; c < colCount; c++) {
        const len = (r[c] || '').length;
        if (len > colWidths[c]) colWidths[c] = Math.min(len, 40);
      }
    }

    const separator = '+' + colWidths.map((w) => '-'.repeat(w + 2)).join('+') + '+';
    const formattedRows = rows.map((r) => {
      const cols = colWidths.map((w, idx) => {
        const val = r[idx] || '';
        return ' ' + val.padEnd(w).substring(0, w) + ' ';
      });
      return '|' + cols.join('|') + '|';
    });

    formattedText = [separator, formattedRows[0], separator, ...formattedRows.slice(1), separator].join('\n');
  } else if (style === 'tsv') {
    formattedText = rows.map((r) => r.join('\t')).join('\n');
  } else {
    // keyvalue format
    const headers = rows[0] || [];
    formattedText = rows
      .slice(1)
      .map((r, rowIdx) => {
        const record = [`[Record #${rowIdx + 1}]`];
        headers.forEach((h, hIdx) => {
          record.push(`  ${h || `Col ${hIdx + 1}`}: ${r[hIdx] || ''}`);
        });
        return record.join('\n');
      })
      .join('\n\n');
  }

  const blob = new Blob([formattedText], { type: 'text/plain;charset=utf-8;' });
  const outName = fileName.replace(/\.[^/.]+$/, '') + '.txt';

  return {
    fileName: outName,
    fileSize: blob.size,
    blob,
    downloadUrl: URL.createObjectURL(blob),
    textPreview: formattedText,
    metadata: {
      'Output Style': style.toUpperCase(),
      'Row Count': rows.length,
      'Max Columns': Math.max(...rows.map((r) => r.length)),
    },
  };
}
