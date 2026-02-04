
import React, { useMemo, useState } from 'react';
import { TrendingUp, Calendar, ArrowUpRight, ArrowDownRight, Warehouse, Package, DollarSign, Layers } from 'lucide-react';
import { PriceRecord, Grade, Order } from '../types';
import { formatNumberTR } from '../utils/formatters';

interface PriceStatsProps {
  history: PriceRecord[];
  orders: Order[];
}

const PriceStats: React.FC<PriceStatsProps> = ({ history, orders }) => {
  const grades: Grade[] = ['WW320', 'WW240', 'WW180'];
  const [warehouseGrade, setWarehouseGrade] = useState<Grade | 'All'>('All');
  const [combinedGrade, setCombinedGrade] = useState<Grade | 'All'>('All');

  const getStatsForGrade = (grade: Grade) => {
    const records = history.filter(r => r.grade === grade);
    if (records.length === 0) return null;

    const prices = records.map(r => r.price);
    const max = Math.max(...prices);
    const min = Math.min(...prices);
    const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
    const current = records[0].price;
    const diffFromAvg = ((current - avg) / avg) * 100;

    return { max, min, avg, current, diffFromAvg };
  };

  // Inventory calculations
  const inventoryStats = useMemo(() => {
    // Only Warehouse (Depoda)
    const warehouseOrders = orders.filter(o => 
      !o.is_archived && 
      o.stage === 'Depoda' && 
      (warehouseGrade === 'All' ? true : o.grade === warehouseGrade)
    );
    const warehouseValue = warehouseOrders.reduce((sum, o) => sum + (o.unit_price * o.total_lb), 0);
    const warehouseQty = warehouseOrders.reduce((sum, o) => sum + o.total_lb, 0);
    const avgWarehousePrice = warehouseQty > 0 ? warehouseValue / warehouseQty : 0;

    // Bonded + Warehouse (Antrepoda + Depoda)
    const combinedOrders = orders.filter(o => 
      !o.is_archived && 
      (o.stage === 'Antrepoda' || o.stage === 'Depoda') &&
      (combinedGrade === 'All' ? true : o.grade === combinedGrade)
    );
    const combinedValue = combinedOrders.reduce((sum, o) => sum + (o.unit_price * o.total_lb), 0);
    const combinedQty = combinedOrders.reduce((sum, o) => sum + o.total_lb, 0);
    const avgCombinedPrice = combinedQty > 0 ? combinedValue / combinedQty : 0;

    return { avgWarehousePrice, avgCombinedPrice, warehouseQty, combinedQty };
  }, [orders, warehouseGrade, combinedGrade]);

  const GradeSelector = ({ current, onChange }: { current: string, onChange: (g: Grade | 'All') => void }) => (
    <div className="flex items-center gap-1.5 p-1 bg-white/10 rounded-xl">
      {(['All', ...grades] as const).map(g => (
        <button
          key={g}
          onClick={() => onChange(g)}
          className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
            current === g 
            ? 'bg-white text-slate-900 shadow-sm' 
            : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          {g === 'All' ? 'HEPSİ' : g}
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Fiyat İstatistikleri</h2>
          <p className="text-slate-500 mt-1">Grade bazlı stok maliyet analizi ve piyasa dalgalanmaları.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
           <Calendar size={18} className="text-slate-400" />
           <span className="text-sm font-semibold text-slate-600">Piyasa Verileri (30 Gün)</span>
        </div>
      </div>

      {/* Grade Selection Aware Inventory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-indigo-600 rounded-3xl p-8 text-white flex flex-col justify-between shadow-xl shadow-indigo-100 relative overflow-hidden group">
          <Warehouse className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform duration-500" />
          <div className="relative z-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/20 rounded-xl">
                  <DollarSign size={20} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-100">Depo Stok Ortalaması</span>
              </div>
              <GradeSelector current={warehouseGrade} onChange={setWarehouseGrade} />
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black">${formatNumberTR(inventoryStats.avgWarehousePrice)}</span>
                <span className="text-sm font-medium text-indigo-200">/ lb</span>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest text-indigo-100">
                  Miktar: {formatNumberTR(inventoryStats.warehouseQty)} LB
                </div>
                <div className="text-[10px] text-indigo-200/60 font-medium italic">
                  Ağırlıklı Ortalama
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-teal-600 rounded-3xl p-8 text-white flex flex-col justify-between shadow-xl shadow-teal-100 relative overflow-hidden group">
          <Package className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform duration-500" />
          <div className="relative z-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Layers size={20} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-teal-100">Antrepo + Depo Ortalaması</span>
              </div>
              <GradeSelector current={combinedGrade} onChange={setCombinedGrade} />
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black">${formatNumberTR(inventoryStats.avgCombinedPrice)}</span>
                <span className="text-sm font-medium text-teal-200">/ lb</span>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest text-teal-100">
                  Miktar: {formatNumberTR(inventoryStats.combinedQty)} LB
                </div>
                <div className="text-[10px] text-teal-200/60 font-medium italic">
                  Toplam Stok Maliyeti
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {grades.map(grade => {
          const stats = getStatsForGrade(grade);
          if (!stats) return null;

          return (
            <div key={grade} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-50">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    grade === 'WW320' ? 'bg-indigo-50 text-indigo-600' :
                    grade === 'WW240' ? 'bg-cyan-50 text-cyan-600' : 'bg-orange-50 text-orange-600'
                  }`}>{grade}</span>
                  <div className={`flex items-center gap-1 text-xs font-bold ${stats.diffFromAvg > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {stats.diffFromAvg > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    %{Math.abs(stats.diffFromAvg).toFixed(1)} (Ort.)
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                   <span className="text-4xl font-black text-slate-900">${formatNumberTR(stats.current)}</span>
                   <span className="text-xs text-slate-400 font-medium">Güncel $/lb</span>
                </div>
              </div>
              
              <div className="p-6 bg-slate-50/50 flex-1 grid grid-cols-3 gap-4">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">En Düşük</span>
                    <span className="text-sm font-bold text-slate-700">${formatNumberTR(stats.min)}</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">En Yüksek</span>
                    <span className="text-sm font-bold text-slate-700">${formatNumberTR(stats.max)}</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">Ortalama</span>
                    <span className="text-sm font-bold text-slate-700">${formatNumberTR(stats.avg)}</span>
                 </div>
              </div>

              <div className="px-6 pb-6 pt-2 h-24 flex items-end gap-1.5 bg-slate-50/50">
                {[40, 65, 55, 80, 70, 90, 85].map((h, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 rounded-t-md transition-all duration-500 ${grade === 'WW320' ? 'bg-indigo-200' : grade === 'WW240' ? 'bg-cyan-200' : 'bg-orange-200'}`} 
                    style={{ height: `${h}%` }} 
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PriceStats;
