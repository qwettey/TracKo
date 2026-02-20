import React, { useState } from 'react';
import { FlaskConical, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { Order, QualityAnalysis } from '../types';

interface Props {
    orders: Order[];
    analyses: QualityAnalysis[];
    onUpdateAnalyses: (analyses: QualityAnalysis[]) => void;
}

const EMPTY_FORM: Omit<QualityAnalysis, 'id'> = {
    contract_no: '', container_no: '', truck_no: '', batch_no: '', date: '', analyst: '', grade: 'WW320',
    moisture: 0, foreign_matter: 0, caliber: 0, halves_ratio: 0, broken_ratio: 0, total_h_b: 0,
    tip_broken: 0, skin_on: 0, spotted: 0, immature: 0, insect_bored: 0, off_color: 0,
    small_caliber: 0, large_caliber: 0, note: '',
};

const EntryAnalysis: React.FC<Props> = ({ orders, analyses, onUpdateAnalyses }) => {
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState<Omit<QualityAnalysis, 'id'>>({ ...EMPTY_FORM });
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const depotOrders = orders.filter(o => (o.stage === 'Depoda' || o.stage === 'Antrepoda') && !o.is_archived);

    const handleField = (field: string, value: string | number) =>
        setForm(p => ({ ...p, [field]: value }));

    const handleSave = () => {
        if (!form.contract_no || !form.date) return;
        const newAnalysis: QualityAnalysis = { id: crypto.randomUUID(), ...form };
        onUpdateAnalyses([newAnalysis, ...analyses]);
        setShowForm(false);
        setForm({ ...EMPTY_FORM });
    };

    const numField = (label: string, field: string, unit = '%') => (
        <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">{label} ({unit})</label>
            <input type="number" step="0.01" value={(form as any)[field]}
                onChange={e => handleField(field, parseFloat(e.target.value) || 0)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
    );

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Giriş Analizi</h2>
                    <p className="text-slate-500 mt-1">Depoya giren ürünlerin kalite analiz kayıtları.</p>
                </div>
                <button onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                    <Plus size={16} />Analiz Ekle
                </button>
            </div>

            {showForm && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">Yeni Analiz Kaydı</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Kontrat No</label>
                            <select value={form.contract_no} onChange={e => handleField('contract_no', e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500">
                                <option value="">Seçin...</option>
                                {depotOrders.map(o => <option key={o.id} value={o.contract_no}>{o.contract_no}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Konteyner No</label>
                            <input type="text" value={form.container_no} onChange={e => handleField('container_no', e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Tarih</label>
                            <input type="date" value={form.date} onChange={e => handleField('date', e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Analist</label>
                            <input type="text" value={form.analyst} onChange={e => handleField('analyst', e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {numField('Nem', 'moisture')}
                        {numField('Yabancı Madde', 'foreign_matter')}
                        {numField('Kalibre', 'caliber', 'no')}
                        {numField('Şak', 'halves_ratio')}
                        {numField('Kırık', 'broken_ratio')}
                        {numField('Ucu Kırık', 'tip_broken')}
                        {numField('Zarlı', 'skin_on')}
                        {numField('Lekeli', 'spotted')}
                        {numField('Urlu', 'immature')}
                        {numField('Böcek Yeniği', 'insect_bored')}
                        {numField('Farklı Renk', 'off_color')}
                        {numField('Küçük Kalibre', 'small_caliber')}
                    </div>
                    <div className="mb-4">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Not</label>
                        <input type="text" value={form.note} onChange={e => handleField('note', e.target.value)} placeholder="İsteğe bağlı..."
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div className="flex gap-3 justify-end">
                        <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200">İptal</button>
                        <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold text-white bg-emerald-500 rounded-xl hover:bg-emerald-600">Kaydet</button>
                    </div>
                </div>
            )}

            {analyses.length === 0 ? (
                <div className="py-24 flex flex-col items-center text-slate-300 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                    <FlaskConical size={64} className="opacity-20 mb-4" />
                    <p className="text-slate-400 font-medium">Henüz analiz kaydı eklenmedi.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {analyses.map(a => (
                        <div key={a.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <button
                                className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
                                onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
                            >
                                <div className="flex items-center gap-4 text-left">
                                    <FlaskConical size={18} className="text-emerald-500 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-slate-800">{a.contract_no}</p>
                                        <p className="text-xs text-slate-400">{a.date} · {a.analyst} · {a.container_no}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden sm:block">
                                        <span className="text-xs text-slate-500">Nem: </span>
                                        <span className="text-sm font-semibold text-slate-700">%{a.moisture}</span>
                                        <span className="mx-2 text-slate-200">|</span>
                                        <span className="text-xs text-slate-500">Kırık: </span>
                                        <span className="text-sm font-semibold text-slate-700">%{a.broken_ratio}</span>
                                    </div>
                                    {expandedId === a.id ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                                </div>
                            </button>
                            {expandedId === a.id && (
                                <div className="border-t border-slate-100 px-6 py-4">
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                                        {[
                                            ['Nem', a.moisture], ['Yabancı Madde', a.foreign_matter], ['Şak', a.halves_ratio],
                                            ['Kırık', a.broken_ratio], ['Ucu Kırık', a.tip_broken], ['Zarlı', a.skin_on],
                                            ['Lekeli', a.spotted], ['Urlu', a.immature], ['Böcek Yeniği', a.insect_bored],
                                            ['Farklı Renk', a.off_color], ['Küçük Kalibre', a.small_caliber], ['Kalibre', a.caliber],
                                        ].map(([label, val]) => (
                                            <div key={label as string} className="bg-slate-50 rounded-xl p-3">
                                                <p className="text-xs text-slate-500">{label}</p>
                                                <p className="font-bold text-slate-800">%{val}</p>
                                            </div>
                                        ))}
                                    </div>
                                    {a.note && <p className="mt-3 text-sm text-slate-500 italic">Not: {a.note}</p>}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EntryAnalysis;
