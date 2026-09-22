import React from 'react';
import {
  FileText,
  Table,
  Presentation,
  Sheet,
  Code,
  FileCode2,
  FileSpreadsheet,
  Binary,
  Image,
  ArrowRight,
  Shield,
  Zap,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';
import type { ConverterId } from '../../types/converter';
import { CONVERTER_CONFIGS } from '../../data/converterConfigs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { MorfiLogo } from '../common/MorfiLogo';

interface HomeShowcaseProps {
  onSelectConverter: (id: ConverterId) => void;
}

export const HomeShowcase: React.FC<HomeShowcaseProps> = ({ onSelectConverter }) => {
  const iconMap: Record<string, React.ReactNode> = {
    'docx-pdf': <FileText className="w-5 h-5 text-blue-500" />,
    'txt-csv': <Table className="w-5 h-5 text-emerald-500" />,
    'pdf-pptx': <Presentation className="w-5 h-5 text-amber-500" />,
    'pdf-excel': <Sheet className="w-5 h-5 text-green-500" />,
    'html-pdf': <Code className="w-5 h-5 text-purple-500" />,
    'pdf-md': <FileCode2 className="w-5 h-5 text-cyan-500" />,
    'docx-html': <FileSpreadsheet className="w-5 h-5 text-rose-500" />,
    'hex-bytes': <Binary className="w-5 h-5 text-violet-500" />,
    'pdf-jpg': <Image className="w-5 h-5 text-pink-500" />,
  };

  const featureConfigs = Object.values(CONVERTER_CONFIGS);

  return (
    <div className="space-y-12 max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* Hero Section */}
      <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-slate-200 dark:border-slate-800/80 bg-gradient-to-b from-indigo-50/80 via-white to-slate-50/50 dark:from-slate-900/90 dark:via-slate-950/90 dark:to-slate-950 shadow-xl dark:shadow-2xl transition-colors">
        {/* Colorful background glowing orbs */}
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-indigo-500/15 dark:bg-indigo-600/20 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-pink-500/15 dark:bg-pink-600/20 blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-emerald-500/10 blur-[90px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="flex items-center gap-3">
            <MorfiLogo size={52} />
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 text-xs font-bold text-indigo-600 dark:text-indigo-300 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
              <span>Morfi Developer Converter Suite</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Transform <span className="gradient-text-indigo">Everything</span> You Need,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400">
              100% In Browser
            </span>
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl">
            Lightning-fast, zero-server document and data transformation engine. Built with modern Web APIs and lightweight client-side libraries. Your files never touch an external server.
          </p>

          {/* Key Advantages */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="p-3 rounded-xl bg-white/90 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-white">100% Private</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Zero cloud upload</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/90 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-white">Instant Speed</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Direct memory</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/90 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2.5">
              <Cpu className="w-4 h-4 text-cyan-500 dark:text-cyan-400 shrink-0" />
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-white">Bi-Directional</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">1-click swap</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/90 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-purple-500 dark:text-purple-400 shrink-0" />
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-white">9 Pro Tools</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">All essential formats</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Grid Introduction */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <span>All 9 Converter Studios</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 font-mono font-bold">
                Both Directions
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Select any studio to start converting documents, tabular data, code, and binary streams.
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featureConfigs.map((cfg) => {
            return (
              <Card
                key={cfg.id}
                onClick={() => onSelectConverter(cfg.id)}
                className={`group cursor-pointer glass-card border-slate-200 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-slate-600 relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10`}
              >
                {/* Glow accent strip on top */}
                <div
                  className={`h-1.5 w-full bg-gradient-to-r ${cfg.gradient} transition-all duration-300 group-hover:h-2`}
                />

                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                      {iconMap[cfg.id] || <FileText className="w-5 h-5 text-indigo-500" />}
                    </div>
                    <Badge variant="secondary" className="font-mono text-[10px]">
                      {cfg.badge}
                    </Badge>
                  </div>

                  <CardTitle className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors flex items-center justify-between">
                    <span>{cfg.title}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-indigo-500" />
                  </CardTitle>

                  <CardDescription className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 mt-1">
                    {cfg.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-5 pt-0">
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      {cfg.sourceFormat.extension} ⇄ {cfg.targetFormat.extension}
                    </span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold group-hover:underline">Launch Studio →</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
