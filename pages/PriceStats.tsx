import React, { useMemo } from 'react';
import { BarChart2 } from 'lucide-react';
import { PriceRecord, Order, Grade } from '../types';
import { GRADES } from '../constants';

interface Props {
    history: PriceRecord[];
    orders: Order[];
}

const PriceStats: React.FC<Props> = ({ history, orders }) => {
    const statsByGrade = useMemo(() => {
        return GRADES.map(grade => {
            const records = history.filter(r => r.grade === grade);
            const prices = records.map(r => r.price);
            const orderCount = orders.filter(o => o.grade === grade && !o.is_archived).length;
            const avg = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
            const min = prices.length > 0 ? Math.min(...prices) : 0;
            const max = prices.length > 0 ? Math.max(...prices) : 0;
            const latest = records[0]?.price ?? 0;
            return { grade, avg, min, max, latest, count: records.length, orderCount };
        });
    }, [history, orders]);

    const gradeColors: Record<Grade, string> = {
        WW320: 'bg-emerald-500',
        WW240: 'bg-teal-500',
        WW180: 'bg-cyan-500',
    };

    const gradeBg: Record<Grade, string> = {
        WW320: 'bg-emerald-50 border-emerald-200',
        WW240: 'bg-teal-50 border-teal-200',
        WW180: 'bg-cyan-50 border-cyan-200',
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-800">Fiyat İstatistikleri</h2>
                <p className="text-slate-500 mt-1">Grade başına fiyat analizi ve özet istatistikler.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {statsByGrade.map(s => (
                    <div key={s.grade} className={`rounded-2xl border p-6 ${gradeBg[s.grade as Grade]}`}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-3 h-3 rounded-full ${gradeColors[s.grade as Grade]}`} />
                            <span className="font-bold text-lg text-slate-800">{s.grade}</span>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Güncel</span>
                                <span className="font-semibold text-slate-800">${s.latest.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Ort.</span>
                                <span className="font-semibold text-slate-800">${s.avg.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Min / Max</span>
                                <span className="font-semibold text-slate-800">${s.min.toFixed(2)} / ${s.max.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
                                <span className="text-slate-500">Aktif Sipariş</span>
                                <span className="font-bold text-slate-800">{s.orderCount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Kayıt Sayısı</span>
                                <span className="font-semibold text-slate-700">{s.count}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {history.length === 0 && (
                <div className="py-20 flex flex-col items-center text-slate-300">
                    <BarChart2 size={64} className="opacity-20 mb-4" />
                    <p className="text-slate-400 font-medium">Henüz fiyat kaydı eklenmemiş.</p>
                </div>
            )}
        </div>
    );
};

export default PriceStats;
