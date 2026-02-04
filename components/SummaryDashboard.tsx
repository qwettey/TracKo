
import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Activity, DollarSign, Box, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Order, Grade, Stage } from '../types';
import { STAGES, GRADES } from '../constants';
import { formatNumberTR, parseDateTR } from '../utils/formatters';

interface PriceRecord {
  id: string;
  date: string;
  grade: Grade;
  price: number;
  change: string;
  status: 'up' | 'down' | 'stable';
}

interface SummaryDashboardProps {
  orders: Order[];
  priceHistory: PriceRecord[];
}

const SummaryDashboard: React.FC<SummaryDashboardProps> = ({ orders, priceHistory }) => {
  const [isOpen, setIsOpen] = useState(true);

  const getCount = (grade: Grade | 'TOPLAM', stage: Stage) => {
    if (grade === 'TOPLAM') {
      return orders.filter(o => o.stage === stage).length;
    }
    return orders.filter(o => o.grade === grade && o.stage === stage).length;
  };

  const getRowTotal = (grade: Grade | 'TOPLAM') => {
    if (grade === 'TOPLAM') return orders.length;
    return orders.filter(o => o.grade === grade).length;
  };

  const getGradeBadgeClass = (grade: Grade | string) => {
    if (grade === 'WW320') return 'bg-indigo-50 text-indigo-600 border border-indigo-100';
    if (grade === 'WW240') return 'bg-cyan-50 text-cyan-600 border border-cyan-100';
    if (grade === 'WW180') return 'bg-orange-50 text-orange-600 border border-orange-100';
    return 'bg-slate-100 text-slate-600 border border-slate-200';
  };

  const getStageAbbreviation = (stage: Stage) => {
    switch (stage) {
      case 'Sipariş': return 'Sp.';
      case 'Yüklendi': return 'Yük.';
      case 'Yolda': return 'Yol.';
      case 'Limanda': return 'Lim.';
      case 'Antrepoda': return 'Antr.';
      case 'Depoda': return 'Depo';
      default: return (stage as string).charAt(0);
    }
  };

  // Derive price data from priceHistory prop
  const dynamicPriceData = useMemo(() => {
    return GRADES.map(grade => {
      const records = priceHistory
        .filter(r => r.grade === grade)
        .sort((a, b) => parseDateTR(b.date).getTime() - parseDateTR(a.date).getTime());
      
      const current = records[0];
      const previous = records[1];

      return {
        grade,
        old: previous ? previous.price : (current ? current.price : 0),
        current: current ? current.price : 0,
        trend: current ? current.status : 'stable'
      };
    });
  }, [priceHistory]);

  // Derive quantity data from orders prop
  const quantitySummary = useMemo(() => {
    const summary = GRADES.map(grade => {
      const gradeOrders = orders.filter(o => o.grade === grade);
      
      // Beklenen: Sipariş, Yüklendi, Yolda, Limanda aşamasındakiler
      const expected = gradeOrders
        .filter(o => ['Sipariş', 'Yüklendi', 'Yolda', 'Limanda'].includes(o.stage))
        .reduce((sum, o) => sum + (o.total_kg / 1000), 0);
        
      // Antrepo: Antrepoda aşamasındakiler
      const bonded = gradeOrders
        .filter(o => o.stage === 'Antrepoda')
        .reduce((sum, o) => sum + (o.total_kg / 1000), 0);
        
      // Depo: Depoda aşamasındakiler
      const warehouse = gradeOrders
        .filter(o => o.stage === 'Depoda')
        .reduce((sum, o) => sum + (o.total_kg / 1000), 0);
        
      return { grade, expected, bonded, warehouse };
    });

    const totals = {
      expected: summary.reduce((sum, item) => sum + item.expected, 0),
      bonded: summary.reduce((sum, item) => sum + item.bonded, 0),
      warehouse: summary.reduce((sum, item) => sum + item.warehouse, 0),
    };

    return { grades: summary, totals };
  }, [orders]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6 transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
      >
        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          Özet Dashboard
        </h2>
        {isOpen ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
      </button>

      {isOpen && (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 border-t border-slate-100 bg-slate-50/30">
          {/* Süreç Özeti */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-slate-700">
              <Activity size={18} className="text-blue-500" /> Süreç Özeti
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-slate-400 font-medium">
                    <th className="pb-2 pr-2">Grade</th>
                    {STAGES.map(s => <th key={s} className="pb-2 px-1 text-center font-normal whitespace-nowrap" title={s}>{getStageAbbreviation(s)}</th>)}
                    <th className="pb-2 pl-2 text-right">Σ</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600">
                  {[...GRADES, 'TOPLAM' as const].map(g => (
                    <tr key={g} className={g === 'TOPLAM' ? 'font-bold border-t border-slate-100' : ''}>
                      <td className="py-2 pr-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getGradeBadgeClass(g)}`}>
                          {g}
                        </span>
                      </td>
                      {STAGES.map(s => (
                        <td key={s} className="py-1.5 px-1 text-center">{getCount(g, s)}</td>
                      ))}
                      <td className="py-1.5 pl-2 text-right">{getRowTotal(g)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fiyat Özeti */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-slate-700">
              <DollarSign size={18} className="text-emerald-500" /> Fiyat Özeti
            </h3>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-slate-400 font-medium">
                  <th className="pb-2">Grade</th>
                  <th className="pb-2">Eski</th>
                  <th className="pb-2">Güncel</th>
                  <th className="pb-2 text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="text-slate-600">
                {dynamicPriceData.map(p => (
                  <tr key={p.grade} className="border-b border-slate-50 last:border-0">
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getGradeBadgeClass(p.grade)}`}>
                        {p.grade}
                      </span>
                    </td>
                    <td className="py-2.5 font-medium text-slate-500">${formatNumberTR(p.old)}</td>
                    <td className="py-2.5 font-bold text-slate-800">${formatNumberTR(p.current)}</td>
                    <td className="py-2.5 text-right">
                      <div className="flex justify-end">
                        {p.trend === 'up' && (
                          <div className="bg-rose-50 p-1 rounded-md border border-rose-100" title="Fiyat Artışı (Negatif Etki)">
                            <TrendingUp size={16} className="text-rose-600 stroke-[3]" />
                          </div>
                        )}
                        {p.trend === 'down' && (
                          <div className="bg-emerald-50 p-1 rounded-md border border-emerald-100" title="Fiyat Düşüşü (Pozitif Etki)">
                            <TrendingDown size={16} className="text-emerald-600 stroke-[3]" />
                          </div>
                        )}
                        {p.trend === 'stable' && (
                          <div className="bg-slate-50 p-1 rounded-md border border-slate-200" title="Stabil">
                            <Minus size={16} className="text-slate-400 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Miktar Özeti (Dynamic) */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-slate-700">
              <Box size={18} className="text-orange-500" /> Miktar Özeti (Ton)
            </h3>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-slate-400 font-medium">
                  <th className="pb-2">Grade</th>
                  <th className="pb-2">Beklenen</th>
                  <th className="pb-2">Antrepo</th>
                  <th className="pb-2 text-right">Depo</th>
                </tr>
              </thead>
              <tbody className="text-slate-600">
                {quantitySummary.grades.map(q => (
                  <tr key={q.grade} className="border-b border-slate-50 last:border-0">
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getGradeBadgeClass(q.grade)}`}>
                        {q.grade}
                      </span>
                    </td>
                    <td className="py-2.5 font-medium">{formatNumberTR(q.expected)}</td>
                    <td className="py-2.5 font-medium">{formatNumberTR(q.bonded)}</td>
                    <td className="py-2.5 text-right font-medium">{formatNumberTR(q.warehouse)}</td>
                  </tr>
                ))}
                <tr className="font-bold border-t border-slate-100">
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getGradeBadgeClass('TOPLAM')}`}>
                      TOPLAM
                    </span>
                  </td>
                  <td className="py-2.5">{formatNumberTR(quantitySummary.totals.expected)}</td>
                  <td className="py-2.5">{formatNumberTR(quantitySummary.totals.bonded)}</td>
                  <td className="py-2.5 text-right">{formatNumberTR(quantitySummary.totals.warehouse)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryDashboard;
