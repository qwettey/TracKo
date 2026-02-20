import React, { useMemo } from 'react';
import { Package, BarChart2 } from 'lucide-react';
import { Order } from '../types';
import { STAGES, GRADES } from '../constants';

interface Props {
    orders: Order[];
}

const ProductionStats: React.FC<Props> = ({ orders }) => {
    const activeOrders = orders.filter(o => !o.is_archived);

    const stageStats = useMemo(() =>
        STAGES.map(stage => ({
            stage,
            count: activeOrders.filter(o => o.stage === stage).length,
            totalKg: activeOrders.filter(o => o.stage === stage).reduce((a, o) => a + (o.total_kg || 0), 0),
        })), [activeOrders]);

    const gradeStats = useMemo(() =>
        GRADES.map(grade => ({
            grade,
            count: activeOrders.filter(o => o.grade === grade).length,
            totalKg: activeOrders.filter(o => o.grade === grade).reduce((a, o) => a + (o.total_kg || 0), 0),
        })), [activeOrders]);

    const totalKg = activeOrders.reduce((a, o) => a + (o.total_kg || 0), 0);

    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-800">Üretim İstatistikleri</h2>
                <p className="text-slate-500 mt-1">Aşama ve grade bazında sipariş ve miktar özeti.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <p className="text-slate-500 text-sm">Toplam Aktif Sipariş</p>
                    <p className="text-4xl font-bold text-slate-800 mt-1">{activeOrders.length}</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <p className="text-slate-500 text-sm">Toplam Miktar</p>
                    <p className="text-4xl font-bold text-slate-800 mt-1">{(totalKg / 1000).toFixed(1)} <span className="text-xl font-medium text-slate-500">ton</span></p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <p className="text-slate-500 text-sm">Arşivlenen</p>
                    <p className="text-4xl font-bold text-slate-800 mt-1">{orders.filter(o => o.is_archived).length}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><BarChart2 size={18} />Aşamaya Göre</h3>
                    <div className="space-y-3">
                        {stageStats.map(s => (
                            <div key={s.stage} className="flex items-center gap-3">
                                <span className="w-24 text-sm text-slate-600 flex-shrink-0">{s.stage}</span>
                                <div className="flex-1 bg-slate-100 rounded-full h-2">
                                    <div
                                        className="bg-emerald-500 h-2 rounded-full transition-all"
                                        style={{ width: activeOrders.length ? `${(s.count / activeOrders.length) * 100}%` : '0%' }}
                                    />
                                </div>
                                <span className="text-sm font-semibold text-slate-800 w-8 text-right">{s.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Package size={18} />Grade'e Göre</h3>
                    <div className="space-y-3">
                        {gradeStats.map(s => (
                            <div key={s.grade} className="flex items-center gap-3">
                                <span className="w-16 text-sm text-slate-600 flex-shrink-0">{s.grade}</span>
                                <div className="flex-1 bg-slate-100 rounded-full h-2">
                                    <div
                                        className="bg-teal-500 h-2 rounded-full transition-all"
                                        style={{ width: activeOrders.length ? `${(s.count / activeOrders.length) * 100}%` : '0%' }}
                                    />
                                </div>
                                <span className="text-sm font-semibold text-slate-800 w-8 text-right">{s.count}</span>
                                <span className="text-xs text-slate-400">{(s.totalKg / 1000).toFixed(1)}t</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductionStats;
