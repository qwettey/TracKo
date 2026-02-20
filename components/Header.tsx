
import React from 'react';
import { Plus, Menu, Waypoints, Upload } from 'lucide-react';
import { ProductType } from '../types';

interface HeaderProps {
  onNewOrder: () => void;
  onImport: () => void;
  onMenuToggle: () => void;
  onNavigateHome: () => void;
  productType: ProductType;
}

const Header: React.FC<HeaderProps> = ({ onNewOrder, onImport, onMenuToggle, onNavigateHome, productType }) => {
  const isCeviz = productType === 'ceviz';
  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-40 w-full">
      <div className="w-[95%] mx-auto h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-500 transition-colors border border-transparent hover:border-slate-100"
          >
            <Menu size={24} />
          </button>

          <div
            onClick={onNavigateHome}
            className="flex items-center gap-3 cursor-pointer group select-none active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200 border border-slate-800 relative overflow-hidden">
              <Waypoints className="text-teal-400" size={22} />
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl tracking-tight leading-none flex items-baseline">
                  <span className="font-medium text-slate-500">Trac</span>
                  <span className="font-extrabold text-slate-900">Ko</span>
                </h1>
                {/* Ürün tipi badge */}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider transition-all ${isCeviz
                    ? 'bg-amber-100 text-amber-700 border border-amber-200'
                    : 'bg-teal-100 text-teal-700 border border-teal-200'
                  }`}>
                  {isCeviz ? '🌰 Ceviz' : '🥜 Kaju'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-0.5 group-hover:text-teal-600 transition-colors">OPERASYON TAKİP SİSTEMİ</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onImport}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 px-4 py-2.5 rounded-xl font-semibold border border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
          >
            <Upload size={18} />
            <span className="hidden sm:inline">İçe Aktar</span>
          </button>

          <button
            onClick={onNewOrder}
            className={`flex items-center gap-2 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-all active:scale-95 group ${isCeviz
                ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-100'
                : 'bg-teal-600 hover:bg-teal-700 shadow-teal-100'
              }`}
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="hidden sm:inline">Sipariş Kaydı</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
