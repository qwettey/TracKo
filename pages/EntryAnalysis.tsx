
import React, { useState, useMemo, useEffect } from 'react';
import { Microscope, Plus, Search, Filter, Droplets, Scissors, LayoutGrid, Info, ShieldCheck, AlertCircle, Beaker, FileText, Hash, Edit3 } from 'lucide-react';
import { Order, QualityAnalysis } from '../types';
import { formatNumberTR } from '../utils/formatters';
import { EntryAnalysisDialog } from '../components/Dialogs';

interface EntryAnalysisProps {
  orders: Order[];
  analyses?: QualityAnalysis[];
  onUpdateAnalyses?: (analyses: QualityAnalysis[]) => void;
}

const EntryAnalysis: React.FC<EntryAnalysisProps> = ({ orders, analyses: externalAnalyses, onUpdateAnalyses }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<QualityAnalysis | null>(null);

  // Eğer external analyses varsa onu kullan, yoksa local mock data
  const [localAnalyses, setLocalAnalyses] = useState<QualityAnalysis[]>([
    {
      id: '1',
      contract_no: 'CONT-2024-001',
      container_no: 'MSKU-887711',
      truck_no: '34ABC123',
      batch_no: 'B24-05-1',
      date: '10.05.2024',
      analyst: 'Ahmet Yılmaz',
      grade: 'WW320',
      moisture: 4.5,
      caliber: 310,
      halves_ratio: 12.0,
      broken_ratio: 3.5,
      total_h_b: 15.5,
      foreign_matter: 0.1,
      tip_broken: 1.2,
      skin_on: 0.5,
      spotted: 0.3,
      immature: 0.2,
      insect_bored: 0.05,
      off_color: 0.1,
      small_caliber: 2.5,
      large_caliber: 1.5,
      note: 'Yüksek kalite, standart değerler.'
    }
  ]);

  // External analyses değiştiğinde local'i güncelle
  useEffect(() => {
    if (externalAnalyses && externalAnalyses.length > 0) {
      setLocalAnalyses(externalAnalyses);
    }
  }, [externalAnalyses]);

  const analyses = externalAnalyses && externalAnalyses.length > 0 ? externalAnalyses : localAnalyses;

  const handleSaveAnalysis = (newAnalysis: QualityAnalysis) => {
    const updatedAnalyses = (() => {
      const existingIdx = analyses.findIndex(a => a.id === newAnalysis.id);
      if (existingIdx >= 0) {
        const updated = [...analyses];
        updated[existingIdx] = newAnalysis;
        return updated;
      }
      return [newAnalysis, ...analyses];
    })();

    if (onUpdateAnalyses) {
      onUpdateAnalyses(updatedAnalyses);
    } else {
      setLocalAnalyses(updatedAnalyses);
    }
    setSelectedAnalysis(null);
  };

  const handleEdit = (analysis: QualityAnalysis) => {
    setSelectedAnalysis(analysis);
    setIsDialogOpen(true);
  };

  const handleNewReport = () => {
    setSelectedAnalysis(null);
    setIsDialogOpen(true);
  };

  const filteredAnalyses = useMemo(() => {
    return analyses.filter(a =>
      a.contract_no?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.container_no?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.grade.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [analyses, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Giriş (Hammadde) Analizleri</h2>
          <p className="text-slate-500 mt-1">İthalat ve yerel alım ürünlerinin detaylı kalite raporları.</p>
        </div>
        <button
          onClick={handleNewReport}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-blue-100 transition-all active:scale-95 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          Yeni Analiz Raporu
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Droplets size={20} />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ortalama Nem</span>
          </div>
          <h3 className="text-3xl font-black text-slate-900">%4.65</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Scissors size={20} />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Şak+Kırık</span>
          </div>
          <h3 className="text-3xl font-black text-slate-900">%14.2</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <AlertCircle size={20} />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Lekeli/Urlu</span>
          </div>
          <h3 className="text-3xl font-black text-slate-900">%0.85</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <ShieldCheck size={20} />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Onay Oranı</span>
          </div>
          <h3 className="text-3xl font-black text-slate-900">%99.1</h3>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <div className="relative w-full max-sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Kontrat, Konteyner veya Grade ara..."
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm w-full outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium">Filtrele:</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase">Son 30 Gün</button>
              <button className="px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-[10px] font-bold uppercase">Hatalı Ürünler</button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[9px] font-bold uppercase tracking-wider">
                <th className="px-4 py-4">Konteyner / Parti</th>
                <th className="px-2 py-4 text-center">Grade</th>
                <th className="px-2 py-4 text-center">Nem (%)</th>
                <th className="px-2 py-4 text-center">Kalibre</th>
                <th className="px-2 py-4 text-center">Şak+Kırık (%)</th>
                <th className="px-2 py-4 text-center">Zarlı/Lekeli</th>
                <th className="px-2 py-4 text-center">Böcek (%)</th>
                <th className="px-2 py-4 text-center">Analist</th>
                <th className="px-4 py-4 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredAnalyses.map(analysis => (
                <tr key={analysis.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                        <Hash size={12} className="text-blue-500" /> {analysis.container_no}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-400 font-medium">{analysis.date}</span>
                        <span className="text-[10px] text-slate-300">•</span>
                        <span className="text-[10px] text-slate-400 font-medium">{analysis.batch_no}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-4 text-center">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-tight">
                      {analysis.grade}
                    </span>
                  </td>
                  <td className="px-2 py-4 text-center">
                    <span className={`text-sm font-bold ${analysis.moisture > 5 ? 'text-rose-500' : 'text-slate-700'}`}>
                      %{analysis.moisture}
                    </span>
                  </td>
                  <td className="px-2 py-4 text-center text-sm font-bold text-slate-700">{analysis.caliber}</td>
                  <td className="px-2 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className={`text-sm font-black ${analysis.total_h_b > 18 ? 'text-orange-500' : 'text-slate-900'}`}>%{analysis.total_h_b}</span>
                      <span className="text-[9px] text-slate-400">Ş:{analysis.halves_ratio} K:{analysis.broken_ratio}</span>
                    </div>
                  </td>
                  <td className="px-2 py-4 text-center">
                    <span className="text-xs font-bold text-slate-600">%{((analysis.skin_on || 0) + (analysis.spotted || 0)).toFixed(1)}</span>
                  </td>
                  <td className="px-2 py-4 text-center">
                    <span className={`text-xs font-bold ${analysis.insect_bored > 0.5 ? 'text-rose-600' : 'text-slate-500'}`}>
                      %{analysis.insect_bored}
                    </span>
                  </td>
                  <td className="px-2 py-4 text-center">
                    <span className="text-[10px] font-medium text-slate-500">{analysis.analyst}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => handleEdit(analysis)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      title="Analizi Düzenle"
                    >
                      <FileText size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl p-6 text-white flex items-center justify-between overflow-hidden relative">
        <div className="relative z-10 flex items-center gap-6">
          <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
            <Beaker size={32} className="text-blue-400" />
          </div>
          <div>
            <h4 className="text-lg font-bold">Kalite-Harman Korelasyonu</h4>
            <p className="text-sm opacity-60 max-w-2xl">
              Giriş analizindeki Şak/Kırık ve Nem verileri, Harman modülünde reçete hesaplamalarına baz teşkil eder.
              Kritik eşiklerin (Nem &gt; %5) üzerindeki ürünler otomatik olarak kurutma hattına yönlendirilir.
            </p>
          </div>
        </div>
        <Microscope size={120} className="absolute -right-6 -bottom-6 text-white/5 rotate-12" />
      </div>

      <EntryAnalysisDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedAnalysis(null);
        }}
        onSave={handleSaveAnalysis}
        orders={orders}
        initialData={selectedAnalysis}
      />
    </div>
  );
};

export default EntryAnalysis;
