
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Info, Plus, Search, Edit2, Trash2, Download, Ship } from 'lucide-react';
import { formatNumberTR } from '../utils/formatters';
import { FreightRecord } from '../types';
import { FreightEntryDialog, EditFreightDialog, DeleteConfirmDialog } from '../components/Dialogs';

interface FreightTrackingProps {
  history: FreightRecord[];
  onUpdateHistory: React.Dispatch<React.SetStateAction<FreightRecord[]>>;
}

const FreightTracking: React.FC<FreightTrackingProps> = ({ history, onUpdateHistory }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const calculateStatus = (price: number, excludeId?: string) => {
    const prevRecord = history.find(r => r.id !== excludeId);
    let status: 'up' | 'down' | 'stable' = 'stable';
    let change = '0,00';

    if (prevRecord) {
      const diff = price - prevRecord.price;
      status = diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable';
      const formattedDiff = formatNumberTR(Math.abs(diff));
      change = diff > 0 ? `+${formattedDiff}` : diff < 0 ? `-${formattedDiff}` : '0,00';
    }

    return { status, change };
  };

  const handleAddFreight = (data: { date: string; price: number }) => {
    const { status, change } = calculateStatus(data.price);
    const newRecord: FreightRecord = {
      id: crypto.randomUUID(),
      ...data,
      change,
      status
    };
    onUpdateHistory([newRecord, ...history]);
  };

  const handleUpdateFreight = (data: { date: string; price: number }) => {
    if (!editingId) return;
    const { status, change } = calculateStatus(data.price, editingId);
    
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

  const startEditing = (record: FreightRecord) => {
    setEditingId(record.id);
    setIsEditOpen(true);
  };

  const exportToCSV = () => {
    const headers = ['Tarih', 'Fiyat ($)', 'Değişim', 'Durum'];
    const rows = history.map(r => [
      r.date,
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
    link.setAttribute('download', `kaju_navlun_takip_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentFreightPrice = history.length > 0 ? history[0].price : 0;
  const currentStatus = history.length > 0 ? history[0].status : 'stable';

  const filteredHistory = history.filter(r => 
    r.date.includes(searchQuery)
  );

  const editingRecord = editingId ? history.find(r => r.id === editingId) : null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Navlun Fiyatları</h2>
          <p className="text-slate-500 mt-1">Konteyner bazlı navlun piyasası takip sistemi.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-emerald-100 transition-all active:scale-95 group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="hidden sm:inline">Navlun Girişi</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Ship size={20} />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Güncel Piyasa Navlun Ortalaması</span>
            </div>
          <div className="flex items-end justify-between mt-4">
            <h3 className="text-4xl font-black text-slate-900">${formatNumberTR(currentFreightPrice)}</h3>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold ${
                currentStatus === 'up' ? 'bg-rose-50 text-rose-500' : 
                currentStatus === 'down' ? 'bg-emerald-50 text-emerald-500' : 
                'bg-slate-50 text-slate-400'
            }`}>
              {currentStatus === 'up' ? <TrendingUp size={18} /> : currentStatus === 'down' ? <TrendingDown size={18} /> : <Minus size={18} />}
              {currentStatus === 'up' ? 'Yükseliş Trendi' : currentStatus === 'down' ? 'Düşüş Trendi' : 'Stabil'}
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4 font-medium italic">Fiyatlar 40' HC Konteyner bazlı ortalama piyasa verileridir.</p>
        </div>
        
        <div className="bg-emerald-600 p-6 rounded-3xl shadow-lg shadow-emerald-100 flex flex-col justify-between">
            <div className="text-emerald-100">
                <h4 className="font-bold text-sm uppercase tracking-wider mb-2">Bilgi Paneli</h4>
                <p className="text-xs leading-relaxed opacity-90">Navlun fiyatlarındaki değişim, ithalat maliyet kalemlerini doğrudan etkiler. Fiyat artışları ürün birim maliyetine yansıtılmalıdır.</p>
            </div>
            <div className="mt-4 flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <TrendingDown className="text-white" size={20} />
                </div>
                <span className="text-[10px] text-white/70 font-bold uppercase">Stratejik Takip</span>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Info size={18} className="text-blue-500" /> Navlun Hareketleri
          </h3>
          <div className="flex items-center gap-4">
             <div className="relative hidden sm:block">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Tarih Ara..." 
                  className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
             </div>
             <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
             >
               <Download size={14} /> Dışa Aktar (CSV)
             </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Tarih</th>
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
              {filteredHistory.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-slate-400 font-medium italic">Kayıtlı veri bulunamadı.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <FreightEntryDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onSave={handleAddFreight} 
      />

      <EditFreightDialog
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditingId(null); }}
        onSave={handleUpdateFreight}
        initialData={editingRecord ? { date: editingRecord.date, price: editingRecord.price } : null}
      />

      <DeleteConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={confirmDelete}
        title="Navlun Kaydını Sil"
        message="Seçili navlun kaydını silmek istediğinize emin misiniz?"
      />
    </div>
  );
};

export default FreightTracking;
