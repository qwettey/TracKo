import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Plus } from 'lucide-react';
import { PriceRecord, Grade } from '../types';
import { GRADES } from '../constants';

interface Props {
    history: PriceRecord[];
    onUpdateHistory: (records: PriceRecord[]) => void;
}

const PriceTracking: React.FC<Props> = ({ history, onUpdateHistory }) => {
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ date: '', grade: 'WW320' as Grade, price: '' });

    const handleAdd = () => {
        if (!form.date || !form.price) return;
        const newRecord: PriceRecord = {
            id: crypto.randomUUID(),
            date: form.date,
            grade: form.grade,
            price: parseFloat(form.price),
            change: '0,00',
            status: 'stable',
        };
        onUpdateHistory([newRecord, ...history]);
        setShowForm(false);
        setForm({ date: '', grade: 'WW320', price: '' });
    };

    const statusIcon = (status: PriceRecord['status']) => {
        if (status === 'up') return <TrendingUp size={16} className="text-emerald-500" />;
        if (status === 'down') return <TrendingDown size={16} className="text-red-500" />;
        return <Minus size={16} className="text-slate-400" />;
    };

    const statusColor = (status: PriceRecord['status']) => {
        if (status === 'up') return 'text-emerald-600 bg-emerald-50';
        if (status === 'down') return 'text-red-600 bg-red-50';
        return 'text-slate-600 bg-slate-100';
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Fiyat Takibi</h2>
                    <p className="text-slate-500 mt-1">Kaju kuru meyve fiyat geçmişi ve güncel fiyatlar.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                    <Plus size={16} />
                    Fiyat Ekle
                </button>
            </div>

            {showForm && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">Yeni Fiyat Kaydı</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Tarih</label>
                            <input
                                type="date"
                                value={form.date}
                                onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Grade</label>
                            <select
                                value={form.grade}
                                onChange={e => setForm(p => ({ ...p, grade: e.target.value as Grade }))}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                {GRADES.map(g => <option key={g}>{g}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Fiyat ($/kg)</label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={form.price}
                                onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4 justify-end">
                        <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">İptal</button>
                        <button onClick={handleAdd} className="px-4 py-2 text-sm font-semibold text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition-colors">Kaydet</button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="text-left px-6 py-3 font-semibold text-slate-600">Tarih</th>
                            <th className="text-left px-6 py-3 font-semibold text-slate-600">Grade</th>
                            <th className="text-right px-6 py-3 font-semibold text-slate-600">Fiyat ($/kg)</th>
                            <th className="text-right px-6 py-3 font-semibold text-slate-600">Değişim</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-12 text-slate-400">Henüz kayıt yok.</td>
                            </tr>
                        )}
                        {history.map(r => (
                            <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 text-slate-700">{r.date}</td>
                                <td className="px-6 py-4">
                                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg font-semibold text-xs">{r.grade}</span>
                                </td>
                                <td className="px-6 py-4 text-right font-semibold text-slate-800">${r.price.toFixed(2)}</td>
                                <td className="px-6 py-4 text-right">
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold ${statusColor(r.status)}`}>
                                        {statusIcon(r.status)}
                                        {r.change}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PriceTracking;
