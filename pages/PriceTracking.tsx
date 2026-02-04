
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Info, Plus, Search, Edit2, Trash2, Download, BarChart2 } from 'lucide-react';
import { formatNumberTR } from '../utils/formatters';
import { Grade } from '../types';
import { PriceEntryDialog, EditPriceDialog, DeleteConfirmDialog } from '../components/Dialogs';

interface PriceRecord {
  id: string;
  date: string;
  grade: Grade;
  price: number;
  change: string;
  status: 'up' | 'down' | 'stable';
}

interface PriceTrackingProps {
  history: PriceRecord[];
  onUpdateHistory: React.Dispatch<React.SetStateAction<PriceRecord[]>>;
}

const PriceTracking: React.FC<PriceTrackingProps> = ({ history, onUpdateHistory }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const calculateStatus = (grade: Grade, price: number, excludeId?: string) => {
    const prevRecord = history.find(r => r.grade === grade && r.id !== excludeId);
    let status: 'up' | 'down' | 'stable' = 'stable';
    let change = '0,00';

    if (prevRecord) {
      const diff = price - prevRecord.price;
      status = diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable';
      const formattedDiff = formatNumberTR(diff);
      change = diff > 0 ? `+${formattedDiff}` : formattedDiff;
    }

    return { status, change };
  };

  const handleAddPrice = (data: { date: string; grade: Grade; price: number }) => {
    const { status, change } = calculateStatus(data.grade, data.price);
    const newRecord: PriceRecord = {
      id: crypto.randomUUID(),
      ...data,
      change,
      status
    };
    onUpdateHistory([newRecord, ...history]);
  };

  const handleUpdatePrice = (data: { date: string; grade: Grade; price: number }) => {
    if (!editingId) return;
    const { status, change } = calculateStatus(data.grade, data.price, editingId);
    
    onUpdateHistory(prev => prev.map(r => 
      r.id === editingId 
        ? { ...r, ...data, status, change }
        : r
    ));
    setEditingId(null);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      onUpdateHistory(prev => prev.filter(r => r.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const startEditing = (record: PriceRecord) => {
    setEditingId(record.id);
    setIsEditOpen(true);
  };

  const exportToCSV = () => {
    const headers = ['Tarih', 'Grade', 'Fiyat ($)', 'Değişim', 'Durum'];
    const rows = history.map(r => [
      r.date,
      r.grade,
      r.price.toString(),
      r.change,
      r.status === 'up' ? 'Artis' : r.status === 'down' ? 'Azalis' : 'Stabil'
    ]);

    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.join(';'))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `kaju_fiyat_takip_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCurrentPrice = (grade: Grade) => {
    const record = history.find(r => r.grade === grade);
    return record ? record.price : 0;
  };

  const filteredHistory = history.filter(r => 
    r.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.date.includes(searchQuery)
  );

  const editingRecord = editingId ? history.find(r => r.id === editingId) : null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Fiyat Takip</h2>
          <p className="text-slate-500 mt-1">Global kaju piyasası fiyat değişim analizi.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm mr-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-sm font-medium">
              <Info size={16} className="text-blue-500" /> Piyasa Analizi
            </div>
            <div className="text-xs text-slate-400 pr-2 italic">Son güncelleme: 1 saat önce</div>
          </div>
          <button 
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-emerald-100 transition-all active:scale-95 group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="hidden sm:inline">Fiyat Girişi</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(['WW320', 'WW240', 'WW180'] as Grade[]).map((grade) => {
          const currentPrice = getCurrentPrice(grade);
          const lastRecords = history.filter(r => r.grade === grade);
          const status = lastRecords[0]?.status || 'stable';
          
          return (
            <div key={grade} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{grade}</span>
              <div className="flex items-end justify-between mt-2">
                <h3 className="text-3xl font-bold text-slate-900">${formatNumberTR(currentPrice)}</h3>
                <div className={`flex items-center gap-1 text-sm font-bold ${status === 'up' ? 'text-rose-500' : status === 'down' ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {status === 'up' ? <TrendingUp size={16} /> : status === 'down' ? <TrendingDown size={16} /> : <Minus size={16} />}
                  {status === 'up' ? 'Artış' : status === 'down' ? 'Azalış' : 'Stabil'}
                </div>
              </div>
              <div className="mt-6 h-12 w-full bg-slate-50 rounded-xl flex items-center justify-center border border-dashed border-slate-200">
                <p className="text-[10px] text-slate-400 font-medium italic">Trend Analizi Hazırlanıyor...</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Info size={18} className="text-blue-500" /> Fiyat Hareketleri
          </h3>
          <div className="flex items-center gap-4">
             <div className="relative hidden sm:block">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Ara..." 
                  className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
             </div>
             <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
             >
               <Download size={14} /> Tümünü Dışa Aktar (CSV)
             </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Tarih</th>
                <th className="px-6 py-4">Grade</th>
                <th className="px-6 py-4">Fiyat</th>
                <th className="px-6 py-4">Değişim</th>
                <th className="px-6 py-4">Durum</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredHistory.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{row.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                      row.grade === 'WW320' ? 'bg-indigo-50 text-indigo-600' :
                      row.grade === 'WW240' ? 'bg-cyan-50 text-cyan-600' : 'bg-orange-50 text-orange-600'
                    }`}>{row.grade}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800">${formatNumberTR(row.price)}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{row.change} USD</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      row.status === 'up' ? 'bg-rose-50 text-rose-600' : 
                      row.status === 'down' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'
                    }`}>
                      {row.status === 'up' ? 'Artış' : row.status === 'down' ? 'Azalış' : 'Stabil'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => startEditing(row)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Düzenle"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => setDeleteConfirmId(row.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Sil"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Market Insight Section moved from Stats */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-slate-200">
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-md">
               <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <TrendingUp className="text-teal-400" /> Piyasa Öngörüsü
               </h3>
               <p className="text-slate-400 text-sm leading-relaxed">
                  Tedarikçi bazlı veriler ve lojistik maliyetleri göz önüne alındığında, önümüzdeki çeyrekte kaju fiyatlarında grade bazlı %2-3'lük bir stabilizasyon beklenmektedir. WW320 talebi artmaya devam ediyor.
               </p>
            </div>
            <div className="flex items-center gap-8">
               <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">VIX Endeksi</p>
                  <p className="text-xl font-black">18.4 <span className="text-emerald-400 text-xs">-1.2%</span></p>
               </div>
               <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Dolar Kuru</p>
                  <p className="text-xl font-black">32.24 <span className="text-rose-400 text-xs">+0.1%</span></p>
               </div>
            </div>
         </div>
         <BarChart2 className="absolute -right-10 -bottom-10 text-white/5 w-64 h-64 rotate-12" />
      </div>

      <PriceEntryDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onSave={handleAddPrice} 
      />

      <EditPriceDialog
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditingId(null); }}
        onSave={handleUpdatePrice}
        initialData={editingRecord ? { date: editingRecord.date, grade: editingRecord.grade, price: editingRecord.price } : null}
      />

      <DeleteConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={confirmDelete}
        title="Fiyat Kaydını Sil"
        message="Seçili fiyat kaydını silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
      />
    </div>
  );
};

export default PriceTracking;
