import React, { useState } from 'react';
import { FlaskConical, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { ExitAnalysis } from '../types';

const EMPTY_FORM: Omit<ExitAnalysis, 'id'> = {
    contract_no: '', container_no: '', truck_no: '', batch_no: '', date: '', analyst: '', grade: 'WW320',
    moisture: 0, foreign_matter: 0, caliber: 0, halves_ratio: 0, broken_ratio: 0, total_h_b: 0,
    tip_broken: 0, skin_on: 0, spotted: 0, immature: 0, insect_bored: 0, off_color: 0,
    small_caliber: 0, large_caliber: 0, note: '',
    lot: '', department: '', customer: '', damaged: 0, dark_grain: 0, polarization: 0,
    frying_time: '', frying_temp: 0, salt_ratio: 0,
};

const ExitAnalysisPage: React.FC = () => {
    const [records, setRecords] = useState<ExitAnalysis[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState<Omit<ExitAnalysis, 'id'>>({ ...EMPTY_FORM });
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const handleField = (field: string, value: string | number) =>
        setForm(p => ({ ...p, [field]: value }));

    const handleSave = () => {
        if (!form.contract_no || !form.date) return;
        setRecords(p => [{ id: crypto.randomUUID(), ...form }, ...p]);
        setShowForm(false);
        setForm({ ...EMPTY_FORM });
    };

    const numField = (label: string, field: string, unit = '%') => (
        <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">{label} ({unit})</label>
            <input type="number" step="0.01" value={(form as any)[field]}
                onChange={e => handleField(field, parseFloat(e.target.value) || 0)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500" />
        </div>
    );

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Çıkış Analizi</h2>
                    <p className="text-slate-500 mt-1">Üretimde kullanılan ürünlerin çıkış kalite analiz kayıtları.</p>
                </div>
                <button onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                    <Plus size={16} />Analiz Ekle
                </button>
            </div>

            {showForm && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">Yeni Çıkış Analizi</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {[
                            { label: 'Kontrat No', field: 'contract_no', type: 'text' },
                            { label: 'Lot', field: 'lot', type: 'text' },
                            { label: 'Bölüm', field: 'department', type: 'text' },
                            { label: 'Müşteri', field: 'customer', type: 'text' },
                            { label: 'Tarih', field: 'date', type: 'date' },
                            { label: 'Analist', field: 'analyst', type: 'text' },
                            { label: 'Kamyon No', field: 'truck_no', type: 'text' },
                            { label: 'Parti No', field: 'batch_no', type: 'text' },
                        ].map(f => (
                            <div key={f.field}>
                                <label className="block text-xs font-medium text-slate-500 mb-1">{f.label}</label>
                                <input type={f.type} value={(form as any)[f.field]} onChange={e => handleField(f.field, e.target.value)}
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500" />
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {numField('Nem', 'moisture')}
                        {numField('Kırık', 'broken_ratio')}
                        {numField('Zarlı', 'skin_on')}
                        {numField('Lekeli', 'spotted')}
                        {numField('Bozuk', 'damaged')}
                        {numField('Koyu Tane', 'dark_grain')}
                        {numField('Polarizasyon', 'polarization', 'no')}
                        {numField('Tuz Oranı', 'salt_ratio')}
                        {numField('Kızartma Sıcaklığı', 'frying_temp', '°C')}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Kızartma Süresi</label>
                            <input type="text" value={form.frying_time} onChange={e => handleField('frying_time', e.target.value)} placeholder="ör: 3 dk"
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Not</label>
                            <input type="text" value={form.note} onChange={e => handleField('note', e.target.value)} placeholder="İsteğe bağlı..."
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500" />
                        </div>
                    </div>
                    <div className="flex gap-3 justify-end">
                        <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200">İptal</button>
                        <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold text-white bg-teal-500 rounded-xl hover:bg-teal-600">Kaydet</button>
                    </div>
                </div>
            )}

            {records.length === 0 ? (
                <div className="py-24 flex flex-col items-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
                    <FlaskConical size={64} className="opacity-20 text-slate-300 mb-4" />
                    <p className="text-slate-400 font-medium">Henüz çıkış analizi eklenmedi.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {records.map(r => (
                        <div key={r.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <button
                                className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50"
                                onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                            >
                                <div className="flex items-center gap-4 text-left">
                                    <FlaskConical size={18} className="text-teal-500 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-slate-800">{r.contract_no} · {r.customer}</p>
                                        <p className="text-xs text-slate-400">{r.date} · Lot: {r.lot} · {r.department}</p>
                                    </div>
                                </div>
                                {expandedId === r.id ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                            </button>
                            {expandedId === r.id && (
                                <div className="border-t border-slate-100 px-6 py-4">
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                                        {[
                                            ['Nem', r.moisture, '%'], ['Kırık', r.broken_ratio, '%'],
                                            ['Bozuk', r.damaged, '%'], ['Koyu Tane', r.dark_grain, '%'],
                                            ['Zarlı', r.skin_on, '%'], ['Lekeli', r.spotted, '%'],
                                            ['Polarizasyon', r.polarization, ''], ['Tuz', r.salt_ratio, '%'],
                                            ['Kızartma Sıcaklığı', r.frying_temp, '°C'], ['Kızartma Süresi', r.frying_time, ''],
                                        ].map(([label, val]) => (
                                            <div key={label as string} className="bg-slate-50 rounded-xl p-3">
                                                <p className="text-xs text-slate-500">{label}</p>
                                                <p className="font-bold text-slate-800">{val}</p>
                                            </div>
                                        ))}
                                    </div>
                                    {r.note && <p className="mt-3 text-sm text-slate-500 italic">Not: {r.note}</p>}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExitAnalysisPage;
