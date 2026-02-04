
import React from 'react';
import { LayoutList, Plus, Search, Filter, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const ProductionTracking: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Üretim Takip</h2>
          <p className="text-slate-500 mt-1">Aktif üretim süreçleri ve iş emri yönetimi.</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-emerald-100 transition-all active:scale-95 group">
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          İş Emri Oluştur
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Clock size={20} />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Devam Eden</span>
          </div>
          <h3 className="text-3xl font-black text-slate-900">12 <span className="text-sm font-medium text-slate-400">Aktif</span></h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 size={20} />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tamamlanan</span>
          </div>
          <h3 className="text-3xl font-black text-slate-900">156 <span className="text-sm font-medium text-slate-400">Bu Ay</span></h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <AlertCircle size={20} />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Geciken</span>
          </div>
          <h3 className="text-3xl font-black text-slate-900">2 <span className="text-sm font-medium text-slate-400">Kritik</span></h3>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px] flex flex-col items-center justify-center text-slate-400 p-10">
        <LayoutList size={64} className="mb-4 opacity-10" />
        <p className="text-lg font-bold text-slate-500">Henüz aktif iş emri bulunmuyor.</p>
        <p className="text-sm">Üretimi başlatmak için yeni bir iş emri oluşturun.</p>
      </div>
    </div>
  );
};

export default ProductionTracking;
