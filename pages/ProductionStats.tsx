
import React, { useMemo } from 'react';
import { PieChart, Box, Package, Activity, Globe2, Layers } from 'lucide-react';
import { Order, Grade } from '../types';
import { formatNumberTR } from '../utils/formatters';

interface ProductionStatsProps {
  orders: Order[];
}

const ProductionStats: React.FC<ProductionStatsProps> = ({ orders }) => {
  const activeOrders = useMemo(() => orders.filter(o => !o.is_archived), [orders]);

  const stats = useMemo(() => {
    const totalKg = activeOrders.reduce((sum, o) => sum + o.total_kg, 0);
    const totalLb = activeOrders.reduce((sum, o) => sum + o.total_lb, 0);
    const totalFcl = activeOrders.reduce((sum, o) => sum + o.fcl_count, 0);

    const gradeDist = (['WW320', 'WW240', 'WW180'] as Grade[]).map(g => {
      const kg = activeOrders.filter(o => o.grade === g).reduce((sum, o) => sum + o.total_kg, 0);
      return { grade: g, kg, percent: totalKg > 0 ? (kg / totalKg) * 100 : 0 };
    });

    const supplierDist = Array.from(new Set(activeOrders.map(o => o.supplier))).map(s => {
      const kg = activeOrders.filter(o => o.supplier === s).reduce((sum, o) => sum + o.total_kg, 0);
      return { name: s, kg, percent: totalKg > 0 ? (kg / totalKg) * 100 : 0 };
    }).sort((a, b) => b.kg - a.kg).slice(0, 5);

    return { totalKg, totalLb, totalFcl, gradeDist, supplierDist };
  }, [activeOrders]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Üretim & Stok İstatistikleri</h2>
        <p className="text-slate-500 mt-1">Grade dağılımı, tedarikçi hacmi ve aktif stok kapasite analizi.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
                 <Box size={20} />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Toplam Hacim</span>
           </div>
           <p className="text-3xl font-black text-slate-900">{formatNumberTR(stats.totalKg / 1000)} <span className="text-sm font-medium text-slate-400">Ton</span></p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                 <Layers size={20} />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Konteyner (FCL)</span>
           </div>
           <p className="text-3xl font-black text-slate-900">{stats.totalFcl} <span className="text-sm font-medium text-slate-400">Adet</span></p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                 <Globe2 size={20} />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aktif Tedarikçi</span>
           </div>
           <p className="text-3xl font-black text-slate-900">{stats.supplierDist.length} <span className="text-sm font-medium text-slate-400">Firma</span></p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                 <Activity size={20} />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Toplam LB</span>
           </div>
           <p className="text-3xl font-black text-slate-900">{formatNumberTR(stats.totalLb)} <span className="text-sm font-medium text-slate-400">LB</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
           <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <PieChart size={20} className="text-indigo-500" /> Grade Dağılımı (%)
           </h3>
           <div className="space-y-6">
              {stats.gradeDist.map(g => (
                <div key={g.grade}>
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-slate-700">{g.grade}</span>
                      <span className="text-xs font-bold text-slate-400">%{g.percent.toFixed(1)}</span>
                   </div>
                   <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          g.grade === 'WW320' ? 'bg-indigo-500' :
                          g.grade === 'WW240' ? 'bg-cyan-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${g.percent}%` }}
                      />
                   </div>
                   <p className="text-[10px] text-slate-400 mt-1 font-medium">{formatNumberTR(g.kg / 1000)} Ton toplam hacim.</p>
                </div>
              ))}
           </div>
        </div>

        {/* Top Suppliers */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
           <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Package size={20} className="text-teal-500" /> Lider Tedarikçiler
           </h3>
           <div className="overflow-x-auto">
              <table className="w-full">
                 <thead>
                    <tr className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50">
                       <th className="pb-3">Tedarikçi</th>
                       <th className="pb-3 text-center">Hacim (Ton)</th>
                       <th className="pb-3 text-right">Piyasa Payı</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {stats.supplierDist.map((s, idx) => (
                      <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                         <td className="py-4 text-sm font-semibold text-slate-700">{s.name}</td>
                         <td className="py-4 text-sm font-bold text-slate-900 text-center">{formatNumberTR(s.kg / 1000)}</td>
                         <td className="py-4 text-right">
                            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                               %{s.percent.toFixed(1)}
                            </span>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionStats;
