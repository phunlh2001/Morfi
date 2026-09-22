import type { ConversionResult } from '../../types/converter';

export function binaryToHex(
  buffer: ArrayBuffer,
  fileName: string,
  format: string = 'dump'
): ConversionResult {
  const bytes = new Uint8Array(buffer);
  let outputText: string;

  if (format === 'dump') {
    // xxd-style formatted hex dump
    const lines: string[] = [];
    const len = bytes.length;
    for (let i = 0; i < len; i += 16) {
      const offset = i.toString(16).padStart(8, '0');
      const chunk = bytes.slice(i, i + 16);
      const hexPart: string[] = [];
      let asciiPart = '';

      for (let j = 0; j < 16; j++) {
        if (j < chunk.length) {
          const b = chunk[j];
          hexPart.push(b.toString(16).padStart(2, '0'));
          asciiPart += b >= 32 && b <= 126 ? String.fromCharCode(b) : '.';
        } else {
          hexPart.push('  ');
        }
      }

      // Group in 8 bytes
      const groupedHex =
        hexPart.slice(0, 8).join(' ') + '  ' + hexPart.slice(8).join(' ');
      lines.push(`${offset}: ${groupedHex}  |${asciiPart}|`);
    }
    outputText = lines.join('\n');
  } else if (format === 'array') {
    // C-style array
    const hexBytes: string[] = [];
    for (let i = 0; i < bytes.length; i++) {
      hexBytes.push('0x' + bytes[i].toString(16).padStart(2, '0'));
    }
    outputText = `// Length: ${bytes.length} bytes\nconst unsigned char file_data[] = {\n  ` +
      hexBytes.join(', ') +
      '\n};';
  } else if (format === 'spaced') {
    const hexBytes: string[] = [];
    for (let i = 0; i < bytes.length; i++) {
      hexBytes.push(bytes[i].toString(16).padStart(2, '0'));
    }
    outputText = hexBytes.join(' ');
  } else {
    // Raw
    const hexBytes: string[] = [];
    for (let i = 0; i < bytes.length; i++) {
      hexBytes.push(bytes[i].toString(16).padStart(2, '0'));
    }
    outputText = hexBytes.join('');
  }

  const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8;' });
  const outName = fileName.replace(/\.[^/.]+$/, '') + '_hex.txt';

  return {
    fileName: outName,
    fileSize: blob.size,
    blob,
    downloadUrl: URL.createObjectURL(blob),
    textPreview: outputText.length > 50000 ? outputText.slice(0, 50000) + '\n... (truncated preview)' : outputText,
    metadata: {
      'Source File': fileName,
      'Raw Size': `${bytes.length.toLocaleString()} bytes`,
      'Hex Format': format.toUpperCase(),
      'Output File': outName,
    },
  };
}

export function hexToBinary(
  hexText: string,
  targetExtension: 'pdf' | 'html' | 'auto' = 'auto'
): ConversionResult {
  // Extract hex digits: remove offsets, ascii dump, 0x, commas, whitespace
  // If it's a standard xxd dump (offset: hex |ascii|)
  const lines = hexText.split(/\r?\n/);
  const hexValues: number[] = [];

  for (const line of lines) {
    let cleanLine = line.trim();
    if (!cleanLine || cleanLine.startsWith('//') || cleanLine.startsWith('/*')) continue;

    // Check if line looks like "00000000: 25 50 ... |ascii|"
    const colonIdx = cleanLine.indexOf(':');
    if (colonIdx !== -1 && colonIdx <= 10) {
      const pipeIdx = cleanLine.indexOf('|', colonIdx);
      if (pipeIdx !== -1) {
        cleanLine = cleanLine.substring(colonIdx + 1, pipeIdx);
      } else {
        cleanLine = cleanLine.substring(colonIdx + 1);
      }
    }

    // Match all 2-char hex tokens or 0x[0-9a-fA-F]{1,2}
    const matches = cleanLine.match(/(?:0x)?([0-9a-fA-F]{2})/g);
    if (matches) {
      for (const m of matches) {
        const pureHex = m.replace(/^0x/i, '');
        hexValues.push(parseInt(pureHex, 16));
      }
    }
  }

  if (hexValues.length === 0) {
    throw new Error('No valid hexadecimal byte data found in text file.');
  }

  const uint8 = new Uint8Array(hexValues);

  // Auto-detect format
  let ext = targetExtension;
  if (ext === 'auto') {
    // Check for %PDF
    if (
      uint8.length >= 4 &&
      uint8[0] === 0x25 && // %
      uint8[1] === 0x50 && // P
      uint8[2] === 0x44 && // D
      uint8[3] === 0x46    // F
    ) {
      ext = 'pdf';
    } else {
      ext = 'html';
    }
  }

  const mimeType = ext === 'pdf' ? 'application/pdf' : 'text/html;charset=utf-8;';
  const blob = new Blob([uint8], { type: mimeType });
  const outName = `reconstructed_${Date.now()}.${ext}`;

  return {
    fileName: outName,
    fileSize: blob.size,
    blob,
    downloadUrl: URL.createObjectURL(blob),
    textPreview: ext === 'html' ? new TextDecoder().decode(uint8.slice(0, 10000)) : undefined,
    metadata: {
      'Extracted Bytes': `${uint8.length.toLocaleString()} bytes`,
      'Detected Format': ext.toUpperCase(),
      'Target MIME': mimeType,
    },
  };
}
