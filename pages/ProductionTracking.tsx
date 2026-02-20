import React, { useState } from 'react';
import { Truck, Plus, Calendar } from 'lucide-react';

interface ProductionEntry {
    id: string;
    date: string;
    shift: string;
    line: string;
    grade: string;
    planned_kg: number;
    actual_kg: number;
    note: string;
}

const ProductionTracking: React.FC = () => {
    const [entries, setEntries] = useState<ProductionEntry[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ date: '', shift: 'Sabah', line: '1', grade: 'WW320', planned_kg: '', actual_kg: '', note: '' });

    const handleAdd = () => {
        if (!form.date || !form.planned_kg || !form.actual_kg) return;
        setEntries(p => [{
            id: crypto.randomUUID(),
            ...form,
            planned_kg: parseFloat(form.planned_kg),
            actual_kg: parseFloat(form.actual_kg),
        }, ...p]);
        setShowForm(false);
        setForm({ date: '', shift: 'Sabah', line: '1', grade: 'WW320', planned_kg: '', actual_kg: '', note: '' });
    };

    const efficiency = (entry: ProductionEntry) =>
        entry.planned_kg > 0 ? ((entry.actual_kg / entry.planned_kg) * 100).toFixed(1) : '0.0';

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Üretim Takibi</h2>
                    <p className="text-slate-500 mt-1">Vardiya bazında üretim gerçekleşme takibi.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                    <Plus size={16} />
                    Kayıt Ekle
                </button>
            </div>

            {showForm && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">Yeni Üretim Kaydı</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                            { label: 'Tarih', field: 'date', type: 'date' },
                        ].map(f => (
                            <div key={f.field}>
                                <label className="block text-xs font-medium text-slate-500 mb-1">{f.label}</label>
                                <input type={f.type} value={(form as any)[f.field]}
                                    onChange={e => setForm(p => ({ ...p, [f.field]: e.target.value }))}
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                            </div>
                        ))}
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Vardiya</label>
                            <select value={form.shift} onChange={e => setForm(p => ({ ...p, shift: e.target.value }))}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500">
                                {['Sabah', 'Öğlen', 'Gece'].map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Hat</label>
                            <select value={form.line} onChange={e => setForm(p => ({ ...p, line: e.target.value }))}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500">
                                {['1', '2', '3'].map(l => <option key={l}>Hat {l}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Grade</label>
                            <select value={form.grade} onChange={e => setForm(p => ({ ...p, grade: e.target.value }))}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500">
                                {['WW320', 'WW240', 'WW180'].map(g => <option key={g}>{g}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Planlanan (kg)</label>
                            <input type="number" value={form.planned_kg} onChange={e => setForm(p => ({ ...p, planned_kg: e.target.value }))}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Gerçekleşen (kg)</label>
                            <input type="number" value={form.actual_kg} onChange={e => setForm(p => ({ ...p, actual_kg: e.target.value }))}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                        </div>
                        <div className="col-span-2 md:col-span-3">
                            <label className="block text-xs font-medium text-slate-500 mb-1">Not</label>
                            <input type="text" value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
                                placeholder="İsteğe bağlı..."
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4 justify-end">
                        <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200">İptal</button>
                        <button onClick={handleAdd} className="px-4 py-2 text-sm font-semibold text-white bg-emerald-500 rounded-xl hover:bg-emerald-600">Kaydet</button>
                    </div>
                </div>
            )}

            {entries.length === 0 ? (
                <div className="py-24 flex flex-col items-center text-slate-300 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                    <Truck size={64} className="opacity-20 mb-4" />
                    <p className="text-slate-400 font-medium">Henüz üretim kaydı eklenmedi.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="text-left px-4 py-3 font-semibold text-slate-600">Tarih</th>
                                <th className="text-left px-4 py-3 font-semibold text-slate-600">Vardiya</th>
                                <th className="text-left px-4 py-3 font-semibold text-slate-600">Hat</th>
                                <th className="text-left px-4 py-3 font-semibold text-slate-600">Grade</th>
                                <th className="text-right px-4 py-3 font-semibold text-slate-600">Planlanan</th>
                                <th className="text-right px-4 py-3 font-semibold text-slate-600">Gerçekleşen</th>
                                <th className="text-right px-4 py-3 font-semibold text-slate-600">Verimlilik</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map(e => {
                                const eff = parseFloat(efficiency(e));
                                return (
                                    <tr key={e.id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="px-4 py-3 flex items-center gap-2"><Calendar size={14} className="text-slate-400" />{e.date}</td>
                                        <td className="px-4 py-3 text-slate-600">{e.shift}</td>
                                        <td className="px-4 py-3 text-slate-600">{e.line}</td>
                                        <td className="px-4 py-3"><span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-semibold">{e.grade}</span></td>
                                        <td className="px-4 py-3 text-right text-slate-700">{e.planned_kg.toLocaleString()} kg</td>
                                        <td className="px-4 py-3 text-right text-slate-800 font-semibold">{e.actual_kg.toLocaleString()} kg</td>
                                        <td className="px-4 py-3 text-right">
                                            <span className={`font-bold text-sm ${eff >= 90 ? 'text-emerald-600' : eff >= 70 ? 'text-amber-600' : 'text-red-500'}`}>
                                                %{eff}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ProductionTracking;
