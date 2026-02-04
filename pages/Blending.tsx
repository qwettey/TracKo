
import React, { useState, useMemo } from 'react';
import { 
  FlaskConical, Plus, Trash2, Zap, CheckCircle2, AlertTriangle, 
  Calculator, History, Save, Settings, TrendingUp, Info, ChevronRight, Target, Cpu, 
  GripVertical, MousePointer2, ListOrdered, ChevronDown, Copy, FileDown, Truck
} from 'lucide-react';
import { Order, Grade, BlendHistory } from '../types';
import { formatNumberTR } from '../utils/formatters';

interface BlendingStock extends Order {
  analysis: {
    caliber: number;
    total_h_b: number; // This represents Şak + Kırık
    moisture: number;
  };
}

interface AiStepItem {
  orderId: string;
  contract_no: string;
  truck_no?: string;
  kgUsed: number;
  ratio: number;
  kgRemaining: number;
}

interface AiStep {
  id: string;
  title: string;
  caliber: number;
  broken: number; // Total Şak + Kırık
  totalKg: number;
  items: AiStepItem[];
}

interface AiScenario {
  id: string;
  name: string;
  isBest: boolean;
  totalProduction: number;
  avgCaliber: number;
  avgBroken: number;
  remainingStock: number;
  efficiency: number; 
  batchCount: number;
  steps: AiStep[];
}

const Blending: React.FC<{ orders: Order[] }> = ({ orders }) => {
  const [activeTab, setActiveTab] = useState<'manuel' | 'ai'>('ai');
  const [aiSubTab, setAiSubTab] = useState<'auto' | 'goal'>('auto');
  
  // Settings
  const [minMixRatio, setMinMixRatio] = useState(10);
  const [minCaliber, setMinCaliber] = useState(290);
  const [maxCaliber, setMaxCaliber] = useState(320);
  const [maxBroken, setMaxBroken] = useState(5);
  const [targetProduction, setTargetProduction] = useState(50000);
  const [totalProductionLimit, setTotalProductionLimit] = useState<number | 'limitsiz'>('limitsiz');
  const [minBatchProduction, setMinBatchProduction] = useState(1000);
  
  // Results
  const [scenarios, setScenarios] = useState<AiScenario[]>([]);
  const [expandedScenarios, setExpandedScenarios] = useState<Set<string>>(new Set());
  const [isCalculating, setIsCalculating] = useState(false);

  // Manuel State
  const [wastePercent, setWastePercent] = useState<number>(0);
  const [blendNote, setBlendNote] = useState('');
  const [blendHistory, setBlendHistory] = useState<BlendHistory[]>([]);
  const [rows, setRows] = useState<{ orderId: string; ratio: number }[]>([
    { orderId: '', ratio: 0 },
    { orderId: '', ratio: 0 }
  ]);

  const availableStocks: BlendingStock[] = useMemo(() => {
    return orders
      .filter(o => o.stage === 'Depoda' && !o.is_archived)
      .map(o => ({
        ...o,
        truck_no: o.truck_no || 'Tır Yok',
        analysis: {
          caliber: o.grade === 'WW320' ? 309 : o.grade === 'WW240' ? 299 : 185,
          total_h_b: o.grade === 'WW320' ? 1.00 : 2.00, // Total Şak+Kırık
          moisture: 4.8
        }
      }));
  }, [orders]);

  const toggleScenario = (id: string) => {
    const next = new Set(expandedScenarios);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedScenarios(next);
  };

  const runAiOptimization = () => {
    setIsCalculating(true);
    setScenarios([]);
    setExpandedScenarios(new Set());

    setTimeout(() => {
      // Mocking 5 scenarios based on request
      const results: AiScenario[] = [
        {
          id: '1', name: '1. Senaryo (En Yüksek Stok İlk)', isBest: true,
          totalProduction: 70803.03, avgCaliber: 304.68, avgBroken: 1.56,
          remainingStock: 196.97, efficiency: 99.7, batchCount: 4,
          steps: [
            { id: 's1', title: '1. HARMAN', caliber: 298.55, broken: 1.82, totalKg: 29090.909, items: [
              { orderId: '104', contract_no: 'KH-2023-D', truck_no: '34ABC104', kgUsed: 16000, ratio: 55, kgRemaining: 0 },
              { orderId: '101', contract_no: 'VN-2023-A', truck_no: '34ABC101', kgUsed: 13090.909, ratio: 45, kgRemaining: 1909.091 }
            ]},
            { id: 's2', title: '2. HARMAN', caliber: 302.50, broken: 1.65, totalKg: 5454.545, items: [
              { orderId: '101', contract_no: 'VN-2023-A', truck_no: '34ABC101', kgUsed: 1909.091, ratio: 35, kgRemaining: 0 },
              { orderId: '102', contract_no: 'IV-2023-B', truck_no: '34ABC102', kgUsed: 3545.455, ratio: 65, kgRemaining: 10954.545 }
            ]},
            { id: 's3', title: '3. HARMAN', caliber: 307.40, broken: 1.40, totalKg: 18257.576, items: [
              { orderId: '102', contract_no: 'IV-2023-B', truck_no: '34ABC102', kgUsed: 10954.545, ratio: 60, kgRemaining: 0 },
              { orderId: '103', contract_no: 'VN-2023-C', truck_no: '34ABC103', kgUsed: 7303.03, ratio: 40, kgRemaining: 4696.97 }
            ]},
            { id: 's4', title: '4. HARMAN', caliber: 312.50, broken: 1.25, totalKg: 18000.000, items: [
              { orderId: '105', contract_no: 'IV-2023-E', truck_no: '34ABC105', kgUsed: 13500, ratio: 75, kgRemaining: 0 },
              { orderId: '103', contract_no: 'VN-2023-C', truck_no: '34ABC103', kgUsed: 4500, ratio: 25, kgRemaining: 196.97 }
            ]}
          ]
        },
        {
          id: '2', name: '2. Senaryo (Kullanıcı Önceliği)', isBest: false,
          totalProduction: 67500.00, avgCaliber: 304.45, avgBroken: 1.56,
          remainingStock: 3500.00, efficiency: 95.1, batchCount: 3, steps: []
        },
        {
          id: '3', name: '3. Senaryo (Düşük Kalibre İlk)', isBest: false,
          totalProduction: 63321.67, avgCaliber: 304.09, avgBroken: 1.56,
          remainingStock: 7678.32, efficiency: 89.2, batchCount: 3, steps: []
        },
        {
          id: '4', name: '4. Senaryo (Düşük Şak+Kırık İlk)', isBest: false,
          totalProduction: 57575.75, avgCaliber: 308.16, avgBroken: 1.33,
          remainingStock: 13424.24, efficiency: 81.1, batchCount: 3, steps: []
        },
        {
          id: '5', name: '5. Senaryo (Yüksek Kalibre İlk)', isBest: false,
          totalProduction: 56259.25, avgCaliber: 308.58, avgBroken: 1.30,
          remainingStock: 14740.74, efficiency: 79.2, batchCount: 3, steps: []
        }
      ];

      setScenarios(results);
      setIsCalculating(false);
      toggleScenario(results[0].id);
    }, 1000);
  };

  const updateRow = (index: number, field: 'orderId' | 'ratio', value: any) => {
    const newRows = [...rows];
    if (field === 'ratio') {
      const newVal = parseInt(value) || 0;
      newRows[index].ratio = newVal;
      const otherIndices = newRows.map((r, i) => (r.orderId !== '' && i !== index ? i : -1)).filter(i => i !== -1);
      if (otherIndices.length === 1) newRows[otherIndices[0]].ratio = Math.max(0, 100 - newVal);
    } else {
      newRows[index] = { ...newRows[index], [field]: value };
    }
    setRows(newRows);
  };

  const calculationResults = useMemo(() => {
    const selectedRows = rows.filter(r => r.orderId !== '');
    if (selectedRows.length === 0) return null;
    const totalRatio = selectedRows.reduce((sum, r) => sum + r.ratio, 0);
    const capacities = selectedRows.map(row => {
      const stock = availableStocks.find(s => s.id === row.orderId);
      if (!stock || row.ratio <= 0) return Infinity;
      return stock.total_kg / (row.ratio / 100);
    });
    const maxProduction = Math.min(...capacities);
    const bottleneckOrderId = selectedRows[capacities.indexOf(maxProduction)]?.orderId;
    let weightedCaliber = 0, weightedBroken = 0;
    selectedRows.forEach(row => {
      const stock = availableStocks.find(s => s.id === row.orderId);
      if (stock && totalRatio > 0) {
        const weight = row.ratio / totalRatio;
        weightedCaliber += weight * (stock.analysis?.caliber || 0);
        weightedBroken += weight * (stock.analysis?.total_h_b || 0);
      }
    });
    return {
      totalRatio,
      maxProduction: isFinite(maxProduction) ? maxProduction : 0,
      weightedCaliber,
      weightedBroken,
      usageDetails: selectedRows.map(row => ({
        id: row.orderId,
        contract_no: availableStocks.find(s => s.id === row.orderId)?.contract_no || '',
        truck_no: availableStocks.find(s => s.id === row.orderId)?.truck_no || 'N/A',
        usedKg: maxProduction * (row.ratio / 100),
        ratio: row.ratio,
        isBottleneck: row.orderId === bottleneckOrderId && row.ratio > 0
      })),
      isValid: Math.abs(totalRatio - 100) < 0.01
    };
  }, [rows, availableStocks]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex bg-slate-200/50 p-1 rounded-2xl w-max">
        <button onClick={() => setActiveTab('manuel')} className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'manuel' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><Calculator size={16} /> Manuel Harman</button>
        <button onClick={() => setActiveTab('ai')} className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'ai' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><Zap size={16} /> AI Otomasyon</button>
      </div>

      {activeTab === 'manuel' ? (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          <div className="xl:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FlaskConical size={20} /></div>
              <h3 className="text-lg font-bold text-slate-800">Karışım Masası</h3>
            </div>
            <div className="p-6 space-y-4">
              {rows.map((row, idx) => {
                const selectedStock = availableStocks.find(s => s.id === row.orderId);
                return (
                  <div key={idx} className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 space-y-4 transition-all hover:border-indigo-100 group">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 relative">
                        <select 
                          value={row.orderId}
                          onChange={(e) => updateRow(idx, 'orderId', e.target.value)}
                          className="w-full pl-3 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 appearance-none shadow-sm"
                        >
                          <option value="">-- Tır Seçerek Başlayın --</option>
                          {availableStocks.map(s => (
                            <option key={s.id} value={s.id}>
                              {s.truck_no} | {s.contract_no} ({s.grade})
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><Truck size={14} /></div>
                      </div>
                      <button onClick={() => { const nr = [...rows]; nr.splice(idx, 1); setRows(nr); }} className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                    </div>
                    {selectedStock && (
                      <div className="animate-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center gap-4 mb-4">
                          <input type="range" min="0" max="100" step="5" value={row.ratio} onChange={(e) => updateRow(idx, 'ratio', e.target.value)} className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900" />
                          <div className="w-20 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black text-sm">{row.ratio} <span className="text-[10px] ml-1">%</span></div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-white p-3 rounded-xl border border-slate-100 text-center"><p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Kalibre</p><p className="text-sm font-black text-slate-700">{selectedStock.analysis.caliber}</p></div>
                          <div className="bg-white p-3 rounded-xl border border-slate-100 text-center"><p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Şak-Kırık (Total)</p><p className="text-sm font-black text-slate-700">{selectedStock.analysis.total_h_b.toFixed(2)}%</p></div>
                          <div className="bg-white p-3 rounded-xl border border-slate-100 text-center"><p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Nem</p><p className="text-sm font-black text-slate-700">{selectedStock.analysis.moisture.toFixed(1)}%</p></div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              <button onClick={() => setRows([...rows, { orderId: '', ratio: 0 }])} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-slate-400 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all text-sm"><Plus size={18} /> Ürün Hattı Ekle</button>
            </div>
          </div>
          <div className="xl:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div><h4 className="font-bold text-slate-800">Harman Sonucu</h4><p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Ağırlıklı Ortalama + Fire</p></div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 transition-all ${calculationResults?.isValid ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>{calculationResults?.isValid ? <CheckCircle2 size={12}/> : <AlertTriangle size={12}/>}Toplam: %{calculationResults?.totalRatio.toFixed(0)}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-white rounded-2xl border border-slate-100 text-center shadow-sm"><p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Kalibre</p><p className="text-4xl font-black text-indigo-900">{calculationResults?.weightedCaliber.toFixed(2) || '0.00'}</p></div>
                <div className="p-5 bg-white rounded-2xl border border-slate-100 text-center shadow-sm"><p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Toplam Şak-Kırık</p><p className="text-4xl font-black text-orange-600">{calculationResults?.weightedBroken.toFixed(2) || '0.00'}%</p></div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Calculator size={16} className="text-slate-400" /><span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Max. Üretim Kapasitesi</span></div>
                  <div className="flex items-center gap-3"><span className="text-[10px] font-bold text-slate-400 uppercase">Fire (%)</span><input type="number" value={wastePercent} onChange={(e) => setWastePercent(parseFloat(e.target.value) || 0)} className="w-16 py-1.5 px-2 border border-slate-200 rounded-lg text-xs font-black text-center outline-none bg-white" placeholder="0" /></div>
                </div>
                <div className="flex items-baseline gap-2"><span className="text-3xl font-black text-slate-900">{formatNumberTR(calculationResults?.maxProduction || 0)}</span><span className="text-sm font-bold text-slate-400">kg</span></div>
                {calculationResults && (
                  <div className="pt-4 border-t border-slate-200 space-y-2">
                    {calculationResults.usageDetails.map(u => (
                      <div key={u.id} className={`p-3.5 rounded-xl flex items-center justify-between transition-all ${u.isBottleneck ? 'bg-amber-50 border border-amber-200 shadow-sm' : 'bg-white/50 border border-slate-100 hover:bg-white'}`}>
                        <div><p className="text-xs font-bold text-slate-700">{u.truck_no} | {u.contract_no}</p>{u.isBottleneck && <p className="text-[9px] font-black text-orange-600 flex items-center gap-1 uppercase tracking-tighter mt-0.5"><TrendingUp size={10}/> DARBOĞAZ (FULL TÜKETİM)</p>}</div>
                        <div className="text-right"><p className="text-sm font-black text-slate-900">{formatNumberTR(u.usedKg)} kg</p><p className="text-[10px] font-bold text-slate-400">(%{u.ratio})</p></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <textarea value={blendNote} onChange={(e) => setBlendNote(e.target.value)} className="w-full p-4 bg-slate-900 text-white rounded-xl text-xs font-medium placeholder-slate-500 outline-none h-20 resize-none shadow-inner" placeholder="Harman notu giriniz..." />
              <button disabled={!calculationResults?.isValid || (calculationResults?.maxProduction || 0) <= 0} className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${calculationResults?.isValid && (calculationResults?.maxProduction || 0) > 0 ? 'bg-emerald-600 text-white shadow-emerald-100 hover:bg-emerald-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}`}><Save size={20} /> Harmanı Kaydet</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          <div className="xl:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Zap size={20} /></div>
                <h3 className="text-lg font-bold text-slate-800">Hesaplama Ayarları</h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button onClick={() => setAiSubTab('goal')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${aiSubTab === 'goal' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><Target size={14} /> Hedef Odaklı</button>
                  <button onClick={() => setAiSubTab('auto')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${aiSubTab === 'auto' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><Cpu size={14} /> Otomatik Planlama</button>
                </div>
                <div className="space-y-4">
                  {aiSubTab === 'goal' ? (
                    <div className="flex flex-col gap-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tekil Üretim Hedefi (KG)</label><input type="number" value={targetProduction} onChange={(e) => setTargetProduction(parseInt(e.target.value) || 0)} className="w-full p-4 bg-slate-900 text-white rounded-xl font-black text-lg outline-none" /><p className="text-[10px] text-slate-400 italic">En uygun lot kombinasyonunu belirler.</p></div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Toplam Üretim Limiti (KG)</label><input type="text" value={totalProductionLimit === 'limitsiz' ? 'Limitsiz (Tüm stoğu tüket)' : totalProductionLimit} onChange={(e) => setTotalProductionLimit(e.target.value === '0' ? 'limitsiz' : parseInt(e.target.value) || 0)} className="w-full p-4 bg-slate-900 text-white rounded-xl font-black text-lg outline-none" /></div>
                      <div className="flex flex-col gap-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Min. Parti Üretimi (KG)</label><input type="number" value={minBatchProduction} onChange={(e) => setMinBatchProduction(parseInt(e.target.value) || 0)} className="w-full p-4 bg-slate-900 text-white rounded-xl font-black text-lg outline-none" /></div>
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><ListOrdered size={12}/> Tüketim Önceliği</label><span className="text-[10px] text-slate-400">{availableStocks.length} Ürün</span></div>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
                           {availableStocks.map((item, idx) => (
                             <div key={item.id} className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-2.5 rounded-xl group hover:border-purple-200 cursor-grab">
                                <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-black">{idx + 1}</div>
                                <div className="flex-1 min-w-0">
                                   <div className="flex justify-between items-center"><p className="text-[10px] font-bold text-slate-700 truncate">{item.truck_no} | {item.contract_no}</p><p className="text-[10px] font-black text-slate-800">{formatNumberTR(item.total_kg)}kg</p></div>
                                   <p className="text-[8px] text-slate-400 font-bold uppercase">K: {item.analysis.caliber} | Ş+K: %{item.analysis.total_h_b.toFixed(2)}</p>
                                </div>
                                <GripVertical size={14} className="text-slate-300" />
                             </div>
                           ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="pt-4 space-y-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest"><TrendingUp size={12}/> KALİTE & ÜRETİM KRİTERLERİ</div>
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase">Min. Karışım Oranı (%)</label><input type="number" value={minMixRatio} onChange={(e) => setMinMixRatio(parseInt(e.target.value) || 0)} className="w-full p-3 bg-slate-900 text-white rounded-xl font-black outline-none" /></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase">Min Kalibre</label><input type="number" value={minCaliber} onChange={(e) => setMinCaliber(parseInt(e.target.value) || 0)} className="w-full p-3 bg-slate-900 text-white rounded-xl font-black outline-none" /></div>
                        <div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase">Max Kalibre</label><input type="number" value={maxCaliber} onChange={(e) => setMaxCaliber(parseInt(e.target.value) || 0)} className="w-full p-3 bg-slate-900 text-white rounded-xl font-black outline-none" /></div>
                      </div>
                      <div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase">Max Şak+Kırık Oranı (%)</label><input type="number" value={maxBroken} onChange={(e) => setMaxBroken(parseInt(e.target.value) || 0)} className="w-full p-3 bg-slate-900 text-white rounded-xl font-black outline-none" /></div>
                    </div>
                  </div>
                </div>
                <button onClick={runAiOptimization} disabled={isCalculating} className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-200 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-purple-100">{isCalculating ? <Zap size={18} className="animate-pulse" /> : <Zap size={18} />} Otomatik Harmanla</button>
              </div>
            </div>
          </div>

          <div className="xl:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
              <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle2 size={20} /></div>
                <h3 className="text-lg font-bold text-slate-800">Hesaplanan Senaryolar ({scenarios.length})</h3>
              </div>
              <div className="p-6 flex-1 overflow-y-auto bg-slate-50/30">
                {scenarios.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-300 py-20"><MousePointer2 size={64} className="mb-4 opacity-10" /><p className="text-lg font-bold text-slate-400">Kriterleri girin ve hesapla butonuna basın.</p></div>
                ) : (
                  <div className="space-y-4">
                    {scenarios.map((s, idx) => {
                      const isExpanded = expandedScenarios.has(s.id);
                      return (
                        <div key={s.id} className={`bg-white border transition-all shadow-sm rounded-2xl overflow-hidden ${s.isBest ? 'border-emerald-200' : 'border-slate-200'}`}>
                          <div onClick={() => toggleScenario(s.id)} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-4">
                               <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black border-2 ${s.isBest ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>{idx + 1}</div>
                               <div>
                                  <div className="flex items-center gap-2 mb-1"><h4 className="font-bold text-slate-800">{s.name}</h4>{s.isBest && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded text-[9px] font-black uppercase tracking-widest">EN UYGUN</span>}</div>
                                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                     <span className="text-[11px] font-black text-slate-500 flex items-center gap-1.5"><TrendingUp size={12}/> {formatNumberTR(s.totalProduction)} KG Üretim</span>
                                     <span className="text-[11px] font-bold text-slate-400">•</span>
                                     <span className="text-[11px] font-black text-slate-500">Ort. Kalibre: <span className="text-blue-600">{s.avgCaliber.toFixed(2)}</span></span>
                                     <span className="text-[11px] font-bold text-slate-400">•</span>
                                     <span className="text-[11px] font-black text-slate-500">Ort. Ş+K: <span className="text-rose-600">%{s.avgBroken.toFixed(2)}</span></span>
                                  </div>
                               </div>
                            </div>
                            <div className="flex items-center gap-6">
                               <div className="text-right"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">KALAN STOK</p><p className="text-sm font-black text-rose-600">{formatNumberTR(s.remainingStock)} KG</p></div>
                               <div className={`p-2 rounded-lg transition-transform ${isExpanded ? 'rotate-180 bg-slate-100 text-slate-600' : 'text-slate-300'}`}><ChevronDown size={20} /></div>
                            </div>
                          </div>
                          {isExpanded && (
                            <div className="px-6 pb-6 pt-2 space-y-4 bg-slate-50/50 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
                               {s.steps.map(step => (
                                 <div key={step.id} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                       <div className="flex items-center gap-3">
                                          <span className="text-[11px] font-black text-purple-600 uppercase tracking-widest">{step.title}</span>
                                          <div className="flex gap-2">
                                             <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-black uppercase tracking-tight">{step.caliber.toFixed(2)} Kal.</span>
                                             <span className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded text-[9px] font-black uppercase tracking-tight">%{step.broken.toFixed(2)} Ş+K</span>
                                          </div>
                                       </div>
                                       <div className="text-right"><span className="text-sm font-black text-slate-900">{formatNumberTR(step.totalKg)} KG</span></div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                       {step.items.map((item, i) => (
                                         <div key={i} className="bg-slate-50/50 border border-slate-50 p-4 rounded-xl flex items-center justify-between group hover:bg-white hover:border-indigo-100 transition-all shadow-sm">
                                            <div className="flex items-center gap-3">
                                              <div className="p-2 bg-indigo-50 text-indigo-500 rounded-lg group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                                <Truck size={14} />
                                              </div>
                                              <div>
                                                <p className="text-xs font-bold text-slate-800">{item.truck_no} | {item.contract_no}</p>
                                                <p className="text-[10px] font-medium text-slate-400 mt-0.5 uppercase tracking-tighter">Kalan: {formatNumberTR(item.kgRemaining)} kg</p>
                                              </div>
                                            </div>
                                            <div className="text-right">
                                               <p className="text-sm font-black text-slate-900">{formatNumberTR(item.kgUsed)} kg</p>
                                               <p className="text-[11px] font-bold text-indigo-500">%{item.ratio}</p>
                                            </div>
                                         </div>
                                       ))}
                                    </div>
                                 </div>
                               ))}
                               <div className="pt-4 flex items-center justify-between border-t border-slate-100 mt-6">
                                  <div className="flex items-center gap-4">
                                     <div className="flex flex-col"><span className="text-[10px] font-bold text-slate-400 uppercase">Üretim Verimi</span><span className="text-sm font-black text-emerald-600">%{s.efficiency}</span></div>
                                     <div className="w-px h-6 bg-slate-200" />
                                     <div className="flex flex-col"><span className="text-[10px] font-bold text-slate-400 uppercase">Toplam Parti</span><span className="text-sm font-black text-slate-700">{s.batchCount}</span></div>
                                  </div>
                                  <div className="flex gap-2">
                                     <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-[11px] font-bold hover:bg-slate-50 transition-all"><FileDown size={14} /> Planı İndir</button>
                                     <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-[11px] font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"><Copy size={14} /> Üretim Planını Kopyala</button>
                                  </div>
                               </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blending;
