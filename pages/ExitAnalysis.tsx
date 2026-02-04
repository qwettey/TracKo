
import React, { useState, useMemo } from 'react';
import { ClipboardCheck, Plus, Search, CheckCircle2, Flame, Cookie, Activity, Hash, Users, MapPin, Beaker, FileText, Microscope } from 'lucide-react';
import { ExitAnalysis } from '../types';
import { ExitAnalysisDialog } from '../components/Dialogs';

const ExitAnalysisPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [exitAnalyses, setExitAnalyses] = useState<ExitAnalysis[]>([
    {
      id: '1',
      lot: 'LOT-2024-05-A',
      date: '22.05.2024',
      grade: 'WW320',
      department: 'Kızartma Hattı',
      customer: 'Örnek Gıda A.Ş.',
      moisture: 2.5,
      halves_ratio: 10.5,
      broken_ratio: 2.0,
      total_h_b: 12.5,
      foreign_matter: 0.0,
      caliber: 310,
      tip_broken: 0.5,
      immature: 0.1,
      insect_bored: 0.1,
      spotted: 0.2,
      skin_on: 0.1,
      damaged: 0.0,
      off_color: 0.1,
      dark_grain: 0.3,
      polarization: 1.5,
      frying_time: '12 dk',
      frying_temp: 165,
      salt_ratio: 1.2,
      small_caliber: 0.2,
      large_caliber: 0.1,
      contract_no: 'PRD-2024',
      container_no: 'N/A',
      analyst: 'Merve Lab',
      note: 'Renk homojenliği ve tuz oranı ideal seviyede.'
    }
  ]);

  const handleSaveAnalysis = (newAnalysis: ExitAnalysis) => {
    setExitAnalyses(prev => [newAnalysis, ...prev]);
  };

  const filteredAnalyses = useMemo(() => {
    return exitAnalyses.filter(a => 
      a.lot?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.grade.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [exitAnalyses, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Çıkış (Üretilen) Analizleri</h2>
          <p className="text-slate-500 mt-1">İşlenmiş ürünlerin final kalite kontrol ve sevk öncesi raporları.</p>
        </div>
        <button 
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-indigo-100 transition-all active:scale-95 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          Final Analiz Girişi
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Flame size={20} />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Kavurma/Kızartma</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900">{exitAnalyses.length} <span className="text-sm font-medium text-slate-400">Batch</span></h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Activity size={20} />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ort. Nem</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900">%2.7 <span className="text-sm font-medium text-slate-400">İdeal</span></h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 size={20} />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Başarı Oranı</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900">100%</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Users size={20} />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aktif Sevk Yeri</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900">12 <span className="text-sm font-medium text-slate-400">Müşteri</span></h3>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="relative w-full max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Lot, Müşteri veya Grade ara..." 
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm w-full outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
             <button className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold border border-indigo-100">Bugün</button>
             <button className="px-4 py-1.5 bg-slate-50 text-slate-500 rounded-lg text-xs font-bold border border-slate-100">Kritik Nem</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[9px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Lot / Müşteri</th>
                <th className="px-2 py-4 text-center">Grade</th>
                <th className="px-2 py-4 text-center">Bölüm</th>
                <th className="px-2 py-4 text-center">Nem / Tuz (%)</th>
                <th className="px-2 py-4 text-center">Süre / Isı</th>
                <th className="px-2 py-4 text-center">Şak+Kırık (%)</th>
                <th className="px-2 py-4 text-center">Bozuk/Koyu</th>
                <th className="px-4 py-4 text-right">Rapor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredAnalyses.map(analysis => (
                <tr key={analysis.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                        <Hash size={12} className="text-indigo-500" /> {analysis.lot}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-400 font-medium">{analysis.date}</span>
                        <span className="text-[10px] text-slate-300">•</span>
                        <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                          <MapPin size={8} /> {analysis.customer}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-4 text-center">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-tight">
                      {analysis.grade}
                    </span>
                  </td>
                  <td className="px-2 py-4 text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{analysis.department}</span>
                  </td>
                  <td className="px-2 py-4 text-center">
                    <div className="flex flex-col">
                       <span className="text-sm font-bold text-slate-700">%{analysis.moisture}</span>
                       <span className="text-[9px] text-slate-400 font-bold">TUZ: %{analysis.salt_ratio}</span>
                    </div>
                  </td>
                  <td className="px-2 py-4 text-center">
                    <div className="flex flex-col">
                       <span className="text-xs font-bold text-slate-600">{analysis.frying_time || '-'}</span>
                       <span className="text-[9px] text-slate-400 font-bold">{analysis.frying_temp ? `${analysis.frying_temp}°C` : '-'}</span>
                    </div>
                  </td>
                  <td className="px-2 py-4 text-center">
                    <span className="text-sm font-black text-slate-900">%{analysis.total_h_b}</span>
                  </td>
                  <td className="px-2 py-4 text-center">
                    <div className="flex flex-col">
                       <span className={`text-[10px] font-bold ${analysis.damaged > 0.5 ? 'text-rose-500' : 'text-slate-500'}`}>B: %{analysis.damaged}</span>
                       <span className={`text-[10px] font-bold ${analysis.dark_grain > 0.5 ? 'text-orange-500' : 'text-slate-500'}`}>K: %{analysis.dark_grain}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                       <FileText size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-indigo-950 rounded-3xl p-8 text-white flex items-center justify-between overflow-hidden relative shadow-2xl">
        <div className="relative z-10 flex items-center gap-8">
          <div className="p-5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
            <Microscope size={40} className="text-teal-400" />
          </div>
          <div>
            <h4 className="text-xl font-black tracking-tight">Üretim Kalite Standardı</h4>
            <p className="text-sm opacity-60 max-w-2xl mt-1 leading-relaxed">
              Final ürün analizleri sevk onayı için kritiktir. Nem oranı sevk öncesi %3'ün altında olmalıdır. 
              Tuz oranı ve renk homojenliği müşteri spesifikasyonlarına göre doğrulanmalıdır.
            </p>
          </div>
        </div>
        <ClipboardCheck size={140} className="absolute -right-8 -bottom-8 text-white/5 rotate-12" />
      </div>

      <ExitAnalysisDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveAnalysis}
      />
    </div>
  );
};

export default ExitAnalysisPage;
