import React, { useState } from 'react';
import { Layers, Plus, Trash2 } from 'lucide-react';
import { Order } from '../types';

interface Props {
    orders: Order[];
}

interface BlendItem {
    orderId: string;
    ratio: number;
}

interface BlendRecord {
    id: string;
    date: string;
    items: BlendItem[];
    total_kg: number;
    note: string;
}

const Blending: React.FC<Props> = ({ orders }) => {
    const [records, setRecords] = useState<BlendRecord[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ date: '', note: '', total_kg: '' });
    const [items, setItems] = useState<BlendItem[]>([{ orderId: '', ratio: 0 }]);

    const depotOrders = orders.filter(o => o.stage === 'Depoda' && !o.is_archived);

    const addItem = () => setItems(p => [...p, { orderId: '', ratio: 0 }]);
    const removeItem = (i: number) => setItems(p => p.filter((_, idx) => idx !== i));
    const updateItem = (i: number, field: keyof BlendItem, value: string | number) =>
        setItems(p => p.map((item, idx) => idx === i ? { ...item, [field]: value } : item));

    const totalRatio = items.reduce((a, i) => a + (i.ratio || 0), 0);

    const handleSave = () => {
        if (!form.date || !form.total_kg || items.some(i => !i.orderId)) return;
        setRecords(p => [{
            id: crypto.randomUUID(),
            date: form.date,
            note: form.note,
            total_kg: parseFloat(form.total_kg),
            items: [...items],
        }, ...p]);
        setShowForm(false);
        setForm({ date: '', note: '', total_kg: '' });
        setItems([{ orderId: '', ratio: 0 }]);
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Harmanlama</h2>
                    <p className="text-slate-500 mt-1">Depodaki ürünleri belirli oranlarda harmanlamak için kayıt oluşturun.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                    <Plus size={16} />
                    Harmanlama Ekle
                </button>
            </div>

            {showForm && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">Yeni Harmanlama</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Tarih</label>
                            <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Toplam Miktar (kg)</label>
                            <input type="number" value={form.total_kg} onChange={e => setForm(p => ({ ...p, total_kg: e.target.value }))}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Not</label>
                            <input type="text" value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} placeholder="İsteğe bağlı..."
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                        </div>
                    </div>

                    <div className="mb-2 font-medium text-slate-600 text-sm">Harmanlama Kalemleri</div>
                    <div className="space-y-2 mb-3">
                        {items.map((item, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                                <select
                                    value={item.orderId}
                                    onChange={e => updateItem(idx, 'orderId', e.target.value)}
                                    className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="">Sipariş seçin...</option>
                                    {depotOrders.map(o => (
                                        <option key={o.id} value={o.id}>{o.contract_no} – {o.grade}</option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={item.ratio}
                                    onChange={e => updateItem(idx, 'ratio', parseFloat(e.target.value))}
                                    placeholder="%" className="w-20 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                                <span className="text-slate-400 text-sm">%</span>
                                {items.length > 1 && (
                                    <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600 p-1">
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <button onClick={addItem} className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"><Plus size={14} />Kalem Ekle</button>
                        <span className={`text-sm font-semibold ml-auto ${totalRatio === 100 ? 'text-emerald-600' : 'text-red-500'}`}>
                            Toplam: %{totalRatio} {totalRatio !== 100 && '(100 olmalı)'}
                        </span>
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200">İptal</button>
                        <button onClick={handleSave} disabled={totalRatio !== 100}
                            className="px-4 py-2 text-sm font-semibold text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed">
                            Kaydet
                        </button>
                    </div>
                </div>
            )}

            {records.length === 0 ? (
                <div className="py-24 flex flex-col items-center text-slate-300 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                    <Layers size={64} className="opacity-20 mb-4" />
                    <p className="text-slate-400 font-medium">Henüz harmanlama kaydı eklenmedi.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {records.map(r => (
                        <div key={r.id} className="bg-white rounded-2xl border border-slate-200 p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <Layers size={18} className="text-emerald-500" />
                                    <span className="font-semibold text-slate-800">{r.date}</span>
                                    <span className="text-sm text-slate-500">{r.total_kg.toLocaleString()} kg</span>
                                </div>
                                {r.note && <span className="text-xs text-slate-400">{r.note}</span>}
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {r.items.map((item, i) => {
                                    const order = orders.find(o => o.id === item.orderId);
                                    return (
                                        <span key={i} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-xs font-medium">
                                            {order?.contract_no ?? item.orderId} – %{item.ratio}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Blending;
