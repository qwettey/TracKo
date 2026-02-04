
import React from 'react';
import { X, Home, TrendingUp, ChevronRight, Ship, Archive, Waypoints, BarChart3, PieChart, FlaskConical, LayoutList, ClipboardCheck, Microscope } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: 'home' | 'prices' | 'freight' | 'archived' | 'price-stats' | 'prod-stats' | 'prod-tracking' | 'blending' | 'entry-analysis' | 'exit-analysis';
  onNavigate: (page: 'home' | 'prices' | 'freight' | 'archived' | 'price-stats' | 'prod-stats' | 'prod-tracking' | 'blending' | 'entry-analysis' | 'exit-analysis') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, currentPage, onNavigate }) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed inset-y-0 left-0 w-72 bg-white/90 backdrop-blur-xl z-50 shadow-2xl transform transition-transform duration-300 ease-out border-r border-slate-100 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full overflow-y-auto scrollbar-thin">
          <div className="p-6 flex items-center justify-between border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-10">
            <div 
              onClick={() => { onNavigate('home'); onClose(); }}
              className="flex items-center gap-3 cursor-pointer group active:scale-95 transition-transform"
            >
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-800 group-hover:border-teal-500 transition-colors">
                <Waypoints className="text-teal-400" size={16} />
              </div>
              <h2 className="text-xl tracking-tight leading-none flex items-baseline">
                <span className="font-medium text-slate-500">Trac</span>
                <span className="font-extrabold text-slate-900">Ko</span>
              </h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <div className="pb-1 px-2">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Genel</span>
            </div>
            
            <button 
              onClick={() => { onNavigate('home'); onClose(); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${currentPage === 'home' ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-3">
                <Home size={18} />
                <span className="text-sm">Ana Sayfa</span>
              </div>
              {currentPage === 'home' && <ChevronRight size={14} />}
            </button>

            <button 
              onClick={() => { onNavigate('prices'); onClose(); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${currentPage === 'prices' ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-3">
                <TrendingUp size={18} />
                <span className="text-sm">Fiyat Takip</span>
              </div>
              {currentPage === 'prices' && <ChevronRight size={14} />}
            </button>

            <button 
              onClick={() => { onNavigate('freight'); onClose(); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${currentPage === 'freight' ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-3">
                <Ship size={18} />
                <span className="text-sm">Navlun Fiyatları</span>
              </div>
              {currentPage === 'freight' && <ChevronRight size={14} />}
            </button>

            {/* ÜRETİM SECTION */}
            <div className="pt-4 pb-1 px-2 border-t border-slate-100 mt-4">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Üretim</span>
            </div>

            <button 
              onClick={() => { onNavigate('prod-tracking'); onClose(); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${currentPage === 'prod-tracking' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-3">
                <LayoutList size={18} />
                <span className="text-sm">Üretim Takip</span>
              </div>
              {currentPage === 'prod-tracking' && <ChevronRight size={14} />}
            </button>

            <button 
              onClick={() => { onNavigate('blending'); onClose(); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${currentPage === 'blending' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-3">
                <FlaskConical size={18} />
                <span className="text-sm">Harman</span>
              </div>
              {currentPage === 'blending' && <ChevronRight size={14} />}
            </button>

            {/* ANALİZLER SECTION */}
            <div className="pt-4 pb-1 px-2 border-t border-slate-100 mt-4">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Analizler</span>
            </div>

            <button 
              onClick={() => { onNavigate('entry-analysis'); onClose(); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${currentPage === 'entry-analysis' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-3">
                <Microscope size={18} />
                <span className="text-sm">Giriş Analizleri</span>
              </div>
              {currentPage === 'entry-analysis' && <ChevronRight size={14} />}
            </button>

            <button 
              onClick={() => { onNavigate('exit-analysis'); onClose(); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${currentPage === 'exit-analysis' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-3">
                <ClipboardCheck size={18} />
                <span className="text-sm">Çıkış Analizleri</span>
              </div>
              {currentPage === 'exit-analysis' && <ChevronRight size={14} />}
            </button>

            {/* İSTATİSTİK SECTION */}
            <div className="pt-4 pb-1 px-2 border-t border-slate-100 mt-4">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">İstatistik</span>
            </div>

            <button 
              onClick={() => { onNavigate('price-stats'); onClose(); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${currentPage === 'price-stats' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-3">
                <BarChart3 size={18} />
                <span className="text-sm">Fiyat İstatistikleri</span>
              </div>
              {currentPage === 'price-stats' && <ChevronRight size={14} />}
            </button>

            <button 
              onClick={() => { onNavigate('prod-stats'); onClose(); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${currentPage === 'prod-stats' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-3">
                <PieChart size={18} />
                <span className="text-sm">Üretim İstatistikleri</span>
              </div>
              {currentPage === 'prod-stats' && <ChevronRight size={14} />}
            </button>

            <div className="pt-4 pb-1 px-2 border-t border-slate-100 mt-4">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Arşiv</span>
            </div>

            <button 
              onClick={() => { onNavigate('archived'); onClose(); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${currentPage === 'archived' ? 'bg-slate-800 text-white font-semibold shadow-lg shadow-slate-200' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-3">
                <Archive size={18} />
                <span className="text-sm">Arşivlenenler</span>
              </div>
              {currentPage === 'archived' && <ChevronRight size={14} />}
            </button>
          </nav>

          <div className="p-6 border-t border-slate-100 mt-auto">
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Sürüm</p>
              <p className="text-sm font-medium text-slate-600">v1.4.0 (Enterprise)</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
