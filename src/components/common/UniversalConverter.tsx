import React, { useState, useRef, useCallback } from 'react';
import {
  ArrowLeftRight,
  UploadCloud,
  FileCheck,
  Download,
  Copy,
  Check,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Eye,
  Trash2,
  Settings2,
} from 'lucide-react';
import type { ConverterConfig, ConversionResult } from '../../types/converter';
import { executeConversion } from '../../utils/conversionDispatcher';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

interface UniversalConverterProps {
  config: ConverterConfig;
}

export const UniversalConverter: React.FC<UniversalConverterProps> = ({ config }) => {
  // Current direction state (0 is from -> to, 1 is to -> from)
  const [directionIndex, setDirectionIndex] = useState<number>(0);
  const currentDirection = config.supportedDirections[directionIndex] || config.supportedDirections[0];

  // File states
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Custom options state
  const [options, setOptions] = useState<Record<string, string | number | boolean>>(() => {
    const initial: Record<string, string | number | boolean> = {};
    config.customOptions?.forEach((opt) => {
      initial[opt.id] = opt.defaultValue;
    });
    return initial;
  });

  // Processing state
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(true);

  // Accepted file types for current direction
  const acceptPattern =
    currentDirection.from === config.sourceFormat.id
      ? config.sourceFormat.accept
      : config.targetFormat.accept;

  // Handle Drag & Drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      setSelectedFiles(filesArray);
      setResult(null);
      setError(null);
    }
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(Array.from(e.target.files));
      setResult(null);
      setError(null);
    }
  };

  const handleSwapDirection = () => {
    if (config.supportedDirections.length > 1) {
      setDirectionIndex((prev) => (prev === 0 ? 1 : 0));
      setSelectedFiles([]);
      setResult(null);
      setError(null);
    }
  };

  const handleClearFiles = () => {
    setSelectedFiles([]);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConvert = async () => {
    if (selectedFiles.length === 0) return;
    setIsConverting(true);
    setProgress(15);
    setError(null);

    try {
      const res = await executeConversion({
        converterId: config.id,
        from: currentDirection.from,
        to: currentDirection.to,
        files: selectedFiles,
        options,
        onProgress: (p) => setProgress(p),
      });

      setResult(res);
      setProgress(100);
    } catch (err: unknown) {
      console.error('Conversion failed:', err);
      const message =
        err instanceof Error
          ? err.message
          : 'An error occurred during conversion. Please check file format.';
      setError(message);
    } finally {
      setIsConverting(false);
    }
  };

  const handleCopyText = async () => {
    const text = result?.textPreview || result?.htmlPreview;
    if (text) {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Banner / Card */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/60 backdrop-blur-xl overflow-hidden relative shadow-lg dark:shadow-2xl transition-colors">
        {/* Glow accent */}
        <div
          className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${config.gradient} pointer-events-none`}
        />

        <CardHeader className="pb-4 border-b border-slate-200 dark:border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <Badge variant="purple" className="font-mono text-[11px] uppercase tracking-wider font-bold">
                  {config.badge}
                </Badge>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">100% In-Browser Private</span>
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                <span>{config.title}</span>
              </CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-2xl">
                {currentDirection.description}
              </CardDescription>
            </div>

            {/* Direction Toggle button */}
            {config.supportedDirections.length > 1 && (
              <div className="flex items-center gap-2 self-start sm:self-center">
                <div className="flex items-center bg-slate-100 dark:bg-slate-800/90 rounded-xl p-1 border border-slate-200 dark:border-slate-700/80 shadow-sm">
                  <div className="px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 text-white shadow-sm">
                    {currentDirection.fromLabel}
                  </div>
                  <button
                    type="button"
                    onClick={handleSwapDirection}
                    title="Swap direction"
                    className="p-1.5 mx-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700/70 rounded-lg transition-transform active:scale-90 cursor-pointer"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                  </button>
                  <div className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 shadow-xs">
                    {currentDirection.toLabel}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Custom Options Panel if available */}
          {config.customOptions && config.customOptions.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/80 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <Settings2 className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                <span>Conversion Settings</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {config.customOptions.map((opt) => (
                  <div key={opt.id} className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{opt.label}</label>
                    {opt.type === 'select' && opt.options && (
                      <select
                        value={String(options[opt.id] ?? opt.defaultValue)}
                        onChange={(e) =>
                          setOptions((prev) => ({ ...prev, [opt.id]: e.target.value }))
                        }
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {opt.options.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
              isDragging
                ? 'border-indigo-500 bg-indigo-500/10 dropzone-active scale-[1.01]'
                : 'border-slate-300 dark:border-slate-700/80 hover:border-indigo-400 dark:hover:border-slate-500 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-100/60 dark:hover:bg-slate-900/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptPattern}
              multiple={config.id === 'pdf-jpg' && currentDirection.from === 'jpg'}
              onChange={handleFileInputChange}
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center space-y-3">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 bg-gradient-to-br ${
                  isDragging
                    ? `${config.gradient} shadow-lg shadow-indigo-500/30 scale-110 text-white`
                    : 'from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-indigo-600 dark:text-slate-300 shadow-md'
                }`}
              >
                <UploadCloud className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white">
                  Drop your <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{currentDirection.fromLabel}</span> file here, or{' '}
                  <span className="text-indigo-600 dark:text-indigo-400 underline underline-offset-4">browse</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Supports {acceptPattern.replace(/,/g, ', ')} • Converted 100% locally
                </p>
              </div>
            </div>
          </div>

          {/* Selected File Details */}
          {selectedFiles.length > 0 && (
            <div className="rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/15 dark:bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                  <FileCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-md">
                    {selectedFiles.length === 1
                      ? selectedFiles[0].name
                      : `${selectedFiles.length} files selected (Multi-image merge)`}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {selectedFiles.length === 1
                      ? formatFileSize(selectedFiles[0].size)
                      : `${formatFileSize(
                          selectedFiles.reduce((acc, f) => acc + f.size, 0)
                        )} total`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearFiles();
                  }}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                </Button>

                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConvert();
                  }}
                  disabled={isConverting}
                  size="default"
                  variant="gradient"
                  className="font-bold cursor-pointer"
                >
                  {isConverting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-1.5 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-1.5" />
                      Convert to {currentDirection.toLabel}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {isConverting && (
            <div className="space-y-2 pt-2 animate-in fade-in">
              <div className="flex justify-between text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold">
                <span>Processing in-browser...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} gradient={`bg-gradient-to-r ${config.gradient}`} />
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/40 text-red-700 dark:text-red-200 flex items-start gap-3 text-sm animate-in shake">
              <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Conversion Error:</strong> {error}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Result Section */}
      {result && (
        <Card className="border-emerald-500/40 bg-white/95 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
          <CardHeader className="pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="success" className="text-[11px] font-bold">
                      Ready
                    </Badge>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">
                      {formatFileSize(result.fileSize)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5 truncate max-w-lg">
                    {result.fileName}
                  </h3>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {(result.textPreview || result.htmlPreview) && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCopyText}
                    className="text-xs cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-500" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy Text
                      </>
                    )}
                  </Button>
                )}

                {result.downloadUrl && (
                  <a href={result.downloadUrl} download={result.fileName}>
                    <Button
                      variant="default"
                      size="default"
                      className="font-bold bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30 cursor-pointer"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download {currentDirection.toLabel}
                    </Button>
                  </a>
                )}
              </div>
            </div>

            {/* Metadata Pills */}
            {result.metadata && Object.keys(result.metadata).length > 0 && (
              <div className="flex flex-wrap gap-2 pt-3">
                {Object.entries(result.metadata).map(([key, val]) => (
                  <div
                    key={key}
                    className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300"
                  >
                    <span className="text-slate-500">{key}:</span> {val}
                  </div>
                ))}
              </div>
            )}
          </CardHeader>

          {/* Live Preview Panel */}
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                Live Result Preview
              </span>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer font-semibold"
              >
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
            </div>

            {showPreview && (
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 max-h-96 overflow-y-auto">
                {/* Image Previews (for PDF to JPG or JPG to PDF) */}
                {result.imagePreviews && result.imagePreviews.length > 0 && (
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {result.imagePreviews.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950/80 p-2 text-center"
                      >
                        <img
                          src={imgUrl}
                          alt={`Rendered Page ${idx + 1}`}
                          className="w-full h-auto rounded shadow"
                        />
                        <span className="text-[11px] font-mono text-slate-400 mt-2 block">
                          Page {idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* HTML Preview (for DOCX to HTML or PDF to HTML) */}
                {result.htmlPreview && !result.imagePreviews && (
                  <div className="p-6 bg-white text-slate-900 rounded-lg m-2">
                    <div
                      className="prose max-w-none text-xs sm:text-sm"
                      dangerouslySetInnerHTML={{ __html: result.htmlPreview }}
                    />
                  </div>
                )}

                {/* Text / Markdown / Hex Preview */}
                {result.textPreview && !result.htmlPreview && !result.imagePreviews && (
                  <pre className="p-4 text-xs font-mono text-slate-300 whitespace-pre-wrap break-all leading-relaxed">
                    {result.textPreview}
                  </pre>
                )}

                {/* Binary file preview placeholder */}
                {!result.imagePreviews && !result.htmlPreview && !result.textPreview && (
                  <div className="p-8 text-center text-slate-400 text-xs sm:text-sm space-y-2">
                    <FileCheck className="w-8 h-8 mx-auto text-emerald-400 opacity-80" />
                    <p>File converted successfully and ready for download.</p>
                    <p className="text-slate-500 font-mono text-xs">{result.fileName}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
