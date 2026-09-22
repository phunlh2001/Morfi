export type ConverterId =
  | 'overview'
  | 'docx-pdf'
  | 'txt-csv'
  | 'pdf-pptx'
  | 'pdf-excel'
  | 'html-pdf'
  | 'pdf-md'
  | 'docx-html'
  | 'hex-bytes'
  | 'pdf-jpg';

export interface ConverterFormat {
  id: string;
  name: string;
  extension: string;
  mimeType?: string;
  accept: string;
  description: string;
}

export interface ConverterConfig {
  id: ConverterId;
  title: string;
  badge: string;
  description: string;
  gradient: string;
  borderColor: string;
  iconName: string;
  sourceFormat: ConverterFormat;
  targetFormat: ConverterFormat;
  supportedDirections: Array<{
    from: string;
    to: string;
    fromLabel: string;
    toLabel: string;
    description: string;
  }>;
  customOptions?: Array<{
    id: string;
    label: string;
    type: 'select' | 'boolean' | 'number';
    defaultValue: string | boolean | number;
    options?: Array<{ label: string; value: string }>;
  }>;
}

export interface ConversionResult {
  fileName: string;
  fileSize: number;
  blob?: Blob;
  downloadUrl?: string;
  textPreview?: string;
  htmlPreview?: string;
  imagePreviews?: string[];
  metadata?: Record<string, string | number>;
}
