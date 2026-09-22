import { useState, useEffect } from 'react';
import { Menu, X, ShieldCheck } from 'lucide-react';
import type { ConverterId } from './types/converter';
import { CONVERTER_CONFIGS } from './data/converterConfigs';
import { Sidebar } from './components/common/Sidebar';
import { HomeShowcase } from './components/pages/HomeShowcase';
import { UniversalConverter } from './components/common/UniversalConverter';
import { Button } from './components/ui/button';
import { ThemeToggle } from './components/common/ThemeToggle';
import { MorfiLogo } from './components/common/MorfiLogo';

export function App() {
  const [activeTab, setActiveTab] = useState<ConverterId>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Theme management: default to 'light'
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('morfi_theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('morfi_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const activeConfig = CONVERTER_CONFIGS[activeTab];

  return (
    <div
      data-theme={theme}
      className={`flex h-screen w-screen overflow-hidden ${
        theme === 'dark' ? 'dark bg-[#090d16] text-slate-100' : 'bg-slate-50 text-slate-900'
      } font-sans transition-colors duration-250`}
    >
      {/* Desktop & Tablet Sidebar */}
      <div className="hidden md:flex h-full">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
          }}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 dark:bg-black/70 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Mobile Drawer Content */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 md:hidden transform transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setIsMobileMenuOpen(false);
          }}
          isCollapsed={false}
          onToggleCollapse={() => setIsMobileMenuOpen(false)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/60 backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between shrink-0 z-20 transition-colors">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Mobile Logo Brand */}
            <div className="md:hidden flex items-center gap-2">
              <MorfiLogo size={28} />
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">Morfi</span>
            </div>

            {/* Breadcrumb / Title */}
            <div className="hidden sm:flex items-center gap-2">
              <span
                onClick={() => setActiveTab('overview')}
                className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-slate-200 cursor-pointer"
              >
                Morfi
              </span>
              <span className="text-slate-400 dark:text-slate-600">/</span>
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">
                {activeTab === 'overview' ? 'Feature Showcase' : activeConfig?.title}
              </span>
            </div>
          </div>

          {/* Quick Actions & Theme Toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Offline Ready</span>
            </div>

            {/* Theme Toggle Button */}
            <ThemeToggle theme={theme} onToggle={toggleTheme} />

            {activeTab !== 'overview' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('overview')}
                className="text-xs cursor-pointer"
              >
                All Features
              </Button>
            )}
          </div>
        </header>

        {/* Scrollable Main Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 space-y-8">
          {activeTab === 'overview' ? (
            <HomeShowcase onSelectConverter={(id) => setActiveTab(id)} />
          ) : (
            activeConfig && <UniversalConverter config={activeConfig} />
          )}

          {/* Bottom Footer */}
          <footer className="pt-12 pb-6 border-t border-slate-200 dark:border-slate-800/60 text-center text-xs text-slate-500 dark:text-slate-500 space-y-2">
            <div className="flex items-center justify-center gap-2">
              <MorfiLogo size={20} showBackground={false} />
              <span className="font-semibold text-slate-700 dark:text-slate-300">Morfi Studio • Built for Developers</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-600">
              100% Client-Side Processing • Your files are never transmitted across the network
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
