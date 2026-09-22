import React, { useState } from 'react';
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
  LayoutGrid,
  Search,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import type { ConverterId } from '../../types/converter';
import { CONVERTER_CONFIGS } from '../../data/converterConfigs';
import { MorfiLogo } from './MorfiLogo';

interface SidebarProps {
  activeTab: ConverterId;
  onSelectTab: (tab: ConverterId) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Icon mapping
  const iconMap: Record<string, React.ReactNode> = {
    overview: <LayoutGrid className="w-4 h-4 text-indigo-500" />,
    'docx-pdf': <FileText className="w-4 h-4 text-blue-500" />,
    'txt-csv': <Table className="w-4 h-4 text-emerald-500" />,
    'pdf-pptx': <Presentation className="w-4 h-4 text-amber-500" />,
    'pdf-excel': <Sheet className="w-4 h-4 text-green-500" />,
    'html-pdf': <Code className="w-4 h-4 text-purple-500" />,
    'pdf-md': <FileCode2 className="w-4 h-4 text-cyan-500" />,
    'docx-html': <FileSpreadsheet className="w-4 h-4 text-rose-500" />,
    'hex-bytes': <Binary className="w-4 h-4 text-violet-500" />,
    'pdf-jpg': <Image className="w-4 h-4 text-pink-500" />,
  };

  const navItems = [
    {
      id: 'overview' as ConverterId,
      title: 'Feature Showcase',
      badge: 'Hub',
      gradient: 'from-indigo-500 to-purple-500',
    },
    ...Object.values(CONVERTER_CONFIGS).map((cfg) => ({
      id: cfg.id,
      title: cfg.title,
      badge: cfg.badge,
      gradient: cfg.gradient,
    })),
  ];

  const filteredItems = navItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.badge.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside
      className={`relative flex flex-col border-r border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/80 backdrop-blur-2xl transition-all duration-300 z-30 shrink-0 ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between h-16">
        <div
          onClick={() => onSelectTab('overview')}
          className="flex items-center gap-3 cursor-pointer overflow-hidden group"
        >
          <MorfiLogo size={36} className="group-hover:scale-105 transition-transform" />
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Morfi</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 font-mono font-bold">
                  PRO
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Universal File Converter</p>
            </div>
          )}
        </div>

        {/* Collapse button */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Quick Search */}
      {!isCollapsed && (
        <div className="p-3 border-b border-slate-200/80 dark:border-slate-800/60">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search converter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      )}

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {!isCollapsed && (
          <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Converter Tools ({filteredItems.length})
          </div>
        )}

        {filteredItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-medium transition-all duration-200 cursor-pointer group relative ${
                isActive
                  ? 'bg-indigo-50/80 dark:bg-slate-800/90 text-indigo-700 dark:text-white shadow-sm border border-indigo-200 dark:border-slate-700/80 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/60'
              }`}
              title={isCollapsed ? item.title : undefined}
            >
              {/* Active neon indicator strip */}
              {isActive && (
                <div
                  className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r bg-gradient-to-b ${item.gradient}`}
                />
              )}

              <div
                className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                  isActive
                    ? 'bg-white dark:bg-slate-700/60 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-900/80 group-hover:bg-slate-200/70 dark:group-hover:bg-slate-800'
                }`}
              >
                {iconMap[item.id] || <FileText className="w-4 h-4" />}
              </div>

              {!isCollapsed && (
                <div className="flex-1 overflow-hidden flex items-center justify-between">
                  <span className="truncate">{item.title}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 ml-1 ${
                      isActive
                        ? 'bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 font-bold'
                        : 'bg-slate-100 dark:bg-slate-900 text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Security Badge */}
      {!isCollapsed && (
        <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <div className="overflow-hidden">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">100% Client-Side</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate block">No files leave device</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
