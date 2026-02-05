
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, Calculator, Truck, DollarSign, Paperclip, FileText, Calendar as CalendarIcon, Check, Hash, Info, User, Package, MapPin, Edit3, Save, RotateCcw, TrendingUp, AlertTriangle, Trash2, Ship, Bookmark, CreditCard, MessageSquare, CheckCircle2, Archive, ArchiveRestore, Droplets, Scissors, Microscope, Flame, Thermometer, Timer, Activity, Users, Zap, Search, Upload, ChevronLeft, ChevronRight, FileSpreadsheet, CheckCircle } from 'lucide-react';
import { Grade, Stage, ContainerType, Order, PackagingType, PaymentStatus, AntrepoStatus, QualityAnalysis, ExitAnalysis } from '../types';
import { GRADES, STAGES, PACKAGING_TYPES, ANTREPO_STATUS_OPTIONS } from '../constants';
import { formatNumberTR, autoFormatDate, formatNumberWithThousands } from '../utils/formatters';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<BaseModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-white/20">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>
        <div className="p-6 max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
          {children}
        </div>
      </div>
    </div>
  );
};

export const DeleteConfirmDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}> = ({ isOpen, onClose, onConfirm, title = "Kaydı Sil", message = "Bu kaydı silmek istediğinize emin misiniz? Bu işlem geri alınamaz." }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Enter') {
        e.preventDefault();
        onConfirm();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onConfirm, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-rose-100">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500">
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">{message}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={onConfirm}
              className="w-full py-3.5 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
            >
              <Trash2 size={16} /> Silmeyi Onayla (Enter)
            </button>
            <button
              onClick={onClose}
              className="w-full py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all uppercase tracking-widest text-xs"
            >
              Vazgeç
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Compact Date Picker Component ---
const CompactDatePicker: React.FC<{
  value: string;
  onChange: (date: string) => void;
  onClose: () => void;
}> = ({ value, onChange, onClose }) => {
  const parseDate = (dateStr: string) => {
    if (!dateStr) return new Date();
    const parts = dateStr.split('.');
    if (parts.length === 3) {
      return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    }
    return new Date();
  };

  const [currentDate, setCurrentDate] = useState(parseDate(value));
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  const dayNames = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pa'];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const selected = new Date(year, month, day);
    const formatted = `${day.toString().padStart(2, '0')}.${(month + 1).toString().padStart(2, '0')}.${year}`;
    onChange(formatted);
    onClose();
  };

  const renderDays = () => {
    const days = [];
    const today = new Date();
    const selectedParts = value.split('.');
    const selectedDay = selectedParts.length === 3 ? parseInt(selectedParts[0]) : -1;
    const selectedMonth = selectedParts.length === 3 ? parseInt(selectedParts[1]) - 1 : -1;
    const selectedYear = selectedParts.length === 3 ? parseInt(selectedParts[2]) : -1;

    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(<div key={`empty-${i}`} className="text-center"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
      const isSelected = day === selectedDay && month === selectedMonth && year === selectedYear;

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`
            w-7 h-7 text-xs font-semibold rounded-lg transition-all
            ${isSelected ? 'bg-slate-800 text-white' : isToday ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-100 text-slate-700'}
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div ref={pickerRef} className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-3 w-64">
      <div className="flex items-center justify-between mb-3">
        <button onClick={handlePrevMonth} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
          <ChevronLeft size={16} className="text-slate-600" />
        </button>
        <div className="flex items-center gap-1">
          <select
            value={month}
            onChange={(e) => setCurrentDate(new Date(year, parseInt(e.target.value), 1))}
            className="text-xs font-bold text-slate-800 bg-transparent border-none outline-none cursor-pointer"
          >
            {monthNames.map((name, idx) => (
              <option key={idx} value={idx}>{name} {year}</option>
            ))}
          </select>
        </div>
        <button onClick={handleNextMonth} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
          <ChevronRight size={16} className="text-slate-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-[10px] font-bold text-slate-400 text-center">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex gap-2">
        <button
          onClick={() => {
            const today = new Date();
            const formatted = `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth() + 1).toString().padStart(2, '0')}.${today.getFullYear()}`;
            onChange(formatted);
            onClose();
          }}
          className="flex-1 text-xs font-bold text-blue-600 py-1.5 hover:bg-blue-50 rounded-lg transition-colors"
        >
          Bugün
        </button>
      </div>
    </div>
  );
};

interface OrderFieldProps {
  label: string;
  field: string;
  type?: 'text' | 'number' | 'select' | 'date' | 'textarea' | 'checkbox';
  options?: string[];
  isEditing?: boolean;
  value: any;
  onChange: (field: string, value: any) => void;
  className?: string;
  placeholder?: string;
}

const GenericField: React.FC<OrderFieldProps> = ({ label, field, type = 'text', options, isEditing = true, value, onChange, className, placeholder }) => {
  const [displayValue, setDisplayValue] = useState<string>(
    value?.toString().replace('.', ',') || ''
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (type === 'number' && value != null && value !== '') {
      const numValue = typeof value === 'string' ? parseFloat(value) : value;
      if (!isNaN(numValue) && numValue !== 0) {
        setDisplayValue(formatNumberWithThousands(numValue));
      } else {
        setDisplayValue('');
      }
    } else {
      setDisplayValue(value?.toString().replace('.', ',') || '');
    }
  }, [value, type]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    let rawVal = e.target.value;

    if (e.target.type === 'checkbox') {
      onChange(field, (e.target as HTMLInputElement).checked);
      return;
    }

    if (type === 'number') {
      // 1. Sadece izin verilen karakterleri tut (Rakam, virgül, nokta, eksi)
      let cleanVal = rawVal.replace(/[^0-9.,-]/g, '');

      // 2. Virgülü noktaya çevirmeden önce, formatlama için analiz et
      // Kullanıcı ',' tuşuna bastığında görüntünün bozulmaması lazım.

      // Eksi işareti kontrolü (sadece başta olabilir)
      const isNegative = cleanVal.startsWith('-');
      cleanVal = cleanVal.replace(/-/g, '');

      // Birden fazla virgül/nokta varsa engelle (basitçe ilkini al veya temizle)
      // Burada nokta binlik ayracı olarak da girilmiş olabilir, o yüzden sadece son ayırıcıyı ondalık kabul etmemiz lazım ama TR formatında '.' binlik, ',' ondalık.
      // Kullanıcı '.' giremez (sildikçe format bozulabilir), biz sadece ',' e izin verelim ondalık için.

      // Binlik ayraçlarını (noktaları) temizle
      let rawNumber = cleanVal.replace(/\./g, '');

      // Virgül kontrolü
      const parts = rawNumber.split(',');
      let integerPart = parts[0];
      let decimalPart = parts.length > 1 ? parts[1] : null;

      // Tam kısım için binlik ayraç ekle
      let formattedInteger = '';
      if (integerPart !== '') {
        formattedInteger = new Intl.NumberFormat('tr-TR').format(Number(integerPart));
      }

      // Sonuç stringini oluştur
      let finalDisplay = (isNegative ? '-' : '') + formattedInteger;

      if (decimalPart !== null) {
        finalDisplay += ',' + decimalPart;
      } else if (rawVal.endsWith(',')) {
        finalDisplay += ',';
      }

      setDisplayValue(finalDisplay);

      // Parent'a numeric değer gönder
      // Ondalık kısmı '.' ile birleştirip parseFloat yap
      let numericString = (isNegative ? '-' : '') + integerPart;
      if (decimalPart !== null) {
        numericString += '.' + decimalPart;
      }

      const numericVal = numericString === '' || numericString === '-' ? 0 : parseFloat(numericString);
      onChange(field, numericVal);

    } else {
      onChange(field, rawVal);
    }
  };

  const handleDateChange = (dateStr: string) => {
    onChange(field, dateStr);
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    onChange(field, autoFormatDate(rawValue));
  };

  return (
    <div className={`flex flex-col ${className} ${type === 'date' ? 'relative' : ''}`}>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1">{label}</span>
      {!isEditing ? (
        <div className="w-full text-sm font-semibold text-slate-900 bg-slate-50 border border-slate-100 rounded-lg px-2 py-1.5 min-h-[32px] flex items-center">
          {type === 'number' ? formatNumberTR(Number(value) || 0) : (value || '-')}
        </div>
      ) : type === 'select' && options ? (
        <select className="w-full text-sm font-semibold text-slate-900 bg-white border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:ring-1 focus:ring-emerald-500" value={value || ''} onChange={handleChange}>
          <option value="">Seçiniz</option>
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea className="w-full text-sm font-semibold text-slate-900 bg-white border border-slate-200 rounded-lg px-2 py-1.5 outline-none min-h-[60px] focus:ring-1 focus:ring-emerald-500" value={value || ''} onChange={handleChange} />
      ) : type === 'checkbox' ? (
        <label className="flex items-center gap-2 cursor-pointer py-1.5">
          <input type="checkbox" className="w-4 h-4 accent-emerald-600" checked={!!value} onChange={handleChange} />
          <span className="text-xs font-bold text-slate-600 uppercase">Onaylı</span>
        </label>
      ) : type === 'date' ? (
        <>
          <div className="relative">
            <input
              type="text"
              className="w-full text-sm font-semibold text-slate-900 bg-white border border-slate-200 rounded-lg pl-8 pr-2 py-1.5 outline-none focus:ring-1 focus:ring-emerald-500"
              value={value || ''}
              onChange={handleDateInputChange}
              placeholder="gg.aa.yyyy"
            />
            <button
              type="button"
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-slate-100 rounded transition-colors"
            >
              <CalendarIcon size={14} className="text-slate-400 hover:text-emerald-500" />
            </button>
          </div>
          {showDatePicker && (
            <CompactDatePicker
              value={value || ''}
              onChange={handleDateChange}
              onClose={() => setShowDatePicker(false)}
            />
          )}
        </>
      ) : (
        <input
          type="text"
          className="w-full text-sm font-semibold text-slate-900 bg-white border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:ring-1 focus:ring-emerald-500"
          value={type === 'number' ? displayValue : (value || '')}
          onChange={handleChange}
          placeholder={placeholder || (type === 'number' ? '0,00' : '')}
        />
      )}
    </div>
  );
};

// --- New Order Dialog ---
export const NewOrderDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Order, 'id' | 'stage'>) => void;
  latestFreightPrice: number;
}> = ({ isOpen, onClose, onSave, latestFreightPrice }) => {
  const [data, setData] = useState<Partial<Order>>({
    contract_no: '',
    supplier: '',
    grade: 'WW320',
    packaging_type: 'Vakum',
    order_date: new Date().toLocaleDateString('tr-TR'),
    fob_price: 0,
    freight_price: 0,
    cnf_price: 0,
    fcl_count: 1,
    container_type: "40'",
    total_kg: 24948,
    total_lb: 55000,
    shipment_month: '',
    note: ''
  });

  // Formu modal her açıldığında temizle
  useEffect(() => {
    if (isOpen) {
      setData({
        contract_no: '',
        supplier: '',
        grade: 'WW320',
        packaging_type: 'Vakum',
        order_date: new Date().toLocaleDateString('tr-TR'),
        fob_price: 0,
        freight_price: latestFreightPrice,
        cnf_price: 0,
        fcl_count: 1,
        container_type: "40'",
        total_kg: 24948,
        total_lb: 55000,
        shipment_month: '',
        note: ''
      });
    }
  }, [isOpen, latestFreightPrice]);

  const updateField = (field: string, val: any) => {
    setData(prev => {
      const next = { ...prev, [field]: val };
      if (field === 'total_kg') {
        next.total_lb = Math.round(Number(val) * 2.20462);
      } else if (field === 'total_lb') {
        next.total_kg = Math.round(Number(val) / 2.20462);
      }
      // FOB değişirse CNF hesapla
      if (field === 'fob_price' || field === 'freight_price') {
        const fob = field === 'fob_price' ? Number(val) : (next.fob_price || 0);
        const freight = field === 'freight_price' ? Number(val) : (next.freight_price || 0);
        const totalLb = next.total_lb || 55000;
        next.cnf_price = fob + (freight / totalLb);
      }
      // total_price hesapla (fob_price * total_lb)
      if (next.fob_price !== undefined && next.total_lb !== undefined) {
        next.total_price = next.fob_price * next.total_lb;
      }
      return next;
    });
  };

  const handleSave = () => {
    onSave(data as Omit<Order, 'id' | 'stage'>);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Yeni Sipariş Kaydı">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <GenericField label="Kontrat No" field="contract_no" value={data.contract_no} onChange={updateField} />
          <GenericField label="Tedarikçi" field="supplier" value={data.supplier} onChange={updateField} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <GenericField label="Grade" field="grade" type="select" options={GRADES} value={data.grade} onChange={updateField} />
          <GenericField label="Paketleme" field="packaging_type" type="select" options={PACKAGING_TYPES} value={data.packaging_type} onChange={updateField} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <GenericField label="Sipariş Tarihi" field="order_date" type="date" value={data.order_date} onChange={updateField} />
          <GenericField label="Sevkiyat Ayı" field="shipment_month" value={data.shipment_month} onChange={updateField} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <GenericField label="FCL Adet" field="fcl_count" type="number" value={data.fcl_count} onChange={updateField} />
          <GenericField label="Boyut" field="container_type" type="select" options={["20'", "40'"]} value={data.container_type} onChange={updateField} />
          <GenericField label="FOB Fiyat ($/lb)" field="fob_price" type="number" value={data.fob_price} onChange={updateField} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <GenericField label="Navlun ($)" field="freight_price" type="number" value={data.freight_price} onChange={updateField} />
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CNF Fiyat ($/lb)</label>
            <div className="p-3 bg-slate-100 rounded-xl text-sm font-bold text-slate-700">
              ${(data.cnf_price || 0).toFixed(2)}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <GenericField label="Toplam KG" field="total_kg" type="number" value={data.total_kg} onChange={updateField} />
          <GenericField label="Toplam LB" field="total_lb" type="number" value={data.total_lb} onChange={updateField} />
        </div>
        <GenericField label="Not" field="note" type="textarea" value={data.note} onChange={updateField} />
        <button onClick={handleSave} className="w-full py-4 bg-teal-600 text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-teal-100 transition-all active:scale-95">Siparişi Oluştur</button>
      </div>
    </Modal>
  );
};

// --- Order Details Dialog ---
export const OrderDetailsDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onSave: (id: string, data: Partial<Order>) => void;
  onDelete: (id: string) => void;
  latestFreightPrice: number;
}> = ({ isOpen, onClose, order, onSave, onDelete, latestFreightPrice }) => {
  const [data, setData] = useState<Partial<Order>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    if (order) {
      setData(order);
      setIsEditing(false);
    }
  }, [order]);

  const updateField = (field: string, val: any) => {
    setData(prev => {
      const next = { ...prev, [field]: val };
      if (field === 'total_kg') {
        next.total_lb = Math.round(Number(val) * 2.20462);
      } else if (field === 'total_lb') {
        next.total_kg = Math.round(Number(val) / 2.20462);
      }

      const totalLb = Number(next.total_lb) || 55000;
      const freight = Number(next.freight_price) || 0;

      // FOB değişirse CNF hesapla
      if (field === 'fob_price') {
        const fob = Number(val) || 0;
        next.cnf_price = fob + (freight / totalLb);
      }
      // CNF değişirse FOB hesapla (ters yön)
      else if (field === 'cnf_price') {
        const cnf = Number(val) || 0;
        next.fob_price = cnf - (freight / totalLb);
      }
      // Navlun değişirse CNF güncelle (FOB sabit kalarak)
      else if (field === 'freight_price') {
        const fob = Number(next.fob_price) || 0;
        const newFreight = Number(val) || 0;
        next.cnf_price = fob + (newFreight / totalLb);
      }

      // total_price hesapla (fob_price * total_lb)
      const fobPrice = Number(next.fob_price) || 0;
      next.total_price = fobPrice * totalLb;

      return next;
    });
  };

  const handleSave = () => {
    if (order) {
      onSave(order.id, data);
      setIsEditing(false);
    }
  };

  const toggleArchive = () => {
    if (order) {
      onSave(order.id, { is_archived: !data.is_archived });
      onClose();
    }
  };

  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${order.contract_no} - Detaylar`}>
      <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${isEditing ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {isEditing ? 'Düzenleme Modu' : data.stage}
            </span>
            {data.is_archived && <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-slate-100 text-slate-500 flex items-center gap-1"><Archive size={12} /> Arşivlendi</span>}
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase px-3 py-1.5 hover:bg-blue-50 rounded-lg transition-colors"><Edit3 size={14} /> Düzenle</button>
            ) : (
              <button onClick={handleSave} className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase px-3 py-1.5 hover:bg-emerald-50 rounded-lg transition-colors"><Save size={14} /> Kaydet</button>
            )}
            <button onClick={toggleArchive} className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase px-3 py-1.5 hover:bg-slate-50 rounded-lg transition-colors">
              {data.is_archived ? <ArchiveRestore size={14} /> : <Archive size={14} />} {data.is_archived ? 'Arşivden Çıkar' : 'Arşive Gönder'}
            </button>
            <button
              onClick={() => setIsDeleteConfirmOpen(true)}
              className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase px-3 py-1.5 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <Trash2 size={14} /> Sil
            </button>
          </div>
        </div>

        {/* Temel Bilgiler */}
        <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Temel Bilgiler</h4>
          <div className="grid grid-cols-2 gap-4">
            <GenericField label="Kontrat No" field="contract_no" isEditing={isEditing} value={data.contract_no} onChange={updateField} />
            <GenericField label="Tedarikçi" field="supplier" isEditing={isEditing} value={data.supplier} onChange={updateField} />
            <GenericField label="Grade" field="grade" type="select" options={GRADES} isEditing={isEditing} value={data.grade} onChange={updateField} />
            <GenericField label="Mahsul Yılı" field="harvest_year" isEditing={isEditing} value={data.harvest_year} onChange={updateField} />
            <GenericField label="Ambalaj" field="packaging_type" type="select" options={PACKAGING_TYPES} isEditing={isEditing} value={data.packaging_type} onChange={updateField} />
            <GenericField label="Konteyner Tipi" field="container_type" type="select" options={['20DC', '40DC', '40HC']} isEditing={isEditing} value={data.container_type} onChange={updateField} />
          </div>
        </div>

        {/* Fiyat Bilgileri */}
        <div className="space-y-4 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
          <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Fiyat Bilgileri</h4>
          <div className="grid grid-cols-3 gap-4">
            <GenericField label="FOB Fiyat ($/lb)" field="fob_price" type="number" isEditing={isEditing} value={data.fob_price} onChange={updateField} />
            <GenericField label="Navlun ($)" field="freight_price" type="number" isEditing={isEditing} value={data.freight_price} onChange={updateField} />
            <GenericField label="CNF Fiyat ($/lb)" field="cnf_price" type="number" isEditing={isEditing} value={data.cnf_price} onChange={updateField} />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <GenericField label="Toplam Tutar ($)" field="total_price" type="number" isEditing={false} value={data.total_price} onChange={updateField} />
          </div>
        </div>

        {/* Miktar Bilgileri */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Miktar Bilgileri</h4>
          <div className="grid grid-cols-3 gap-4">
            <GenericField label="Miktar (KG)" field="total_kg" type="number" isEditing={isEditing} value={data.total_kg} onChange={updateField} />
            <GenericField label="Miktar (LB)" field="total_lb" type="number" isEditing={isEditing} value={data.total_lb} onChange={updateField} />
            <GenericField label="FCL Sayısı" field="fcl_count" type="number" isEditing={isEditing} value={data.fcl_count} onChange={updateField} />
          </div>
        </div>

        {/* Tarih Bilgileri */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tarih Bilgileri</h4>
          <div className="grid grid-cols-3 gap-4">
            <GenericField label="Sipariş Tarihi" field="order_date" type="date" isEditing={isEditing} value={data.order_date} onChange={updateField} />
            <GenericField label="ETD" field="etd" type="date" isEditing={isEditing} value={data.etd} onChange={updateField} />
            <GenericField label="ETA" field="eta" type="date" isEditing={isEditing} value={data.eta} onChange={updateField} />
          </div>
        </div>

        {/* Lojistik Bilgileri */}
        <div className="space-y-4 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
          <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Lojistik & Nakliye</h4>
          <div className="grid grid-cols-2 gap-4">
            <GenericField label="Gemi Adı" field="vessel_name" isEditing={isEditing} value={data.vessel_name} onChange={updateField} />
            <GenericField label="Booking No" field="booking_no" isEditing={isEditing} value={data.booking_no} onChange={updateField} />
            <GenericField label="B/L No" field="bl_no" isEditing={isEditing} value={data.bl_no} onChange={updateField} />
            <GenericField label="Konteyner No" field="container_no" isEditing={isEditing} value={data.container_no} onChange={updateField} />
            <GenericField label="Tır No" field="truck_no" isEditing={isEditing} value={data.truck_no} onChange={updateField} />
            <GenericField label="AN Ref No" field="an_ref_no" isEditing={isEditing} value={data.an_ref_no} onChange={updateField} />
          </div>
        </div>

        {/* Antrepo & Gümrük */}
        <div className="space-y-4 bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
          <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Antrepo & Gümrük</h4>
          <div className="grid grid-cols-2 gap-4">
            <GenericField label="Antrepo Beyan No" field="antrepo_declaration_no" isEditing={isEditing} value={data.antrepo_declaration_no} onChange={updateField} />
            <GenericField label="Antrepo Durumu" field="antrepo_status" type="select" options={ANTREPO_STATUS_OPTIONS} isEditing={isEditing} value={data.antrepo_status} onChange={updateField} />
            <GenericField label="Tarım Onayı" field="is_agriculture_approved" type="checkbox" isEditing={isEditing} value={data.is_agriculture_approved} onChange={updateField} />
            <GenericField label="Ödeme Durumu" field="payment_status" type="select" options={['Ödendi', 'Ödeme bekliyor', 'Kısmi ödeme']} isEditing={isEditing} value={data.payment_status} onChange={updateField} />
          </div>
        </div>

        {/* Özet Hesaplama */}
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><Calculator size={20} className="text-teal-400" /><span className="text-xs font-bold uppercase tracking-widest">Tahmini Tahakkuk</span></div>
            <div className="text-right"><p className="text-[10px] font-bold text-slate-500 uppercase">Güncel Navlun: ${formatNumberTR(latestFreightPrice)}</p></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div><p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Toplam Maliyet ($)</p><p className="text-2xl font-black">${formatNumberTR(data.total_price || 0)}</p></div>
            <div><p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Miktar (KG)</p><p className="text-2xl font-black">{formatNumberTR(data.total_kg || 0)} kg</p></div>
          </div>
        </div>

        {/* Notlar */}
        <GenericField label="Genel Notlar" field="note" type="textarea" isEditing={isEditing} value={data.note} onChange={updateField} />
      </div>

      <DeleteConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={() => {
          if (order) {
            onDelete(order.id);
            setIsDeleteConfirmOpen(false);
            onClose(); // Detay penceresini de kapat
          }
        }}
        title="Siparişi Sil"
        message={`"${order.contract_no}" numaralı siparişi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
      />
    </Modal>
  );
};

// --- Import Dialog ---
export const ImportDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onImport: (orders: Omit<Order, 'id'>[], analyses: QualityAnalysis[]) => void;
}> = ({ isOpen, onClose, onImport }) => {
  const [file, setFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<{
    orders: Omit<Order, 'id'>[];
    analyses: Omit<QualityAnalysis, 'id'>[];
    errors: string[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal kapandığında state'i temizle
  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setImportResult(null);
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
      setError('Lütfen bir Excel dosyası (.xlsx veya .xls) seçin.');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setIsLoading(true);

    try {
      // Dinamik import ile xlsx modülünü yükle
      const { parseExcelFile } = await import('../utils/excelImporter');
      const result = await parseExcelFile(selectedFile);
      setImportResult(result);

      if (result.errors.length > 0) {
        console.warn('Import uyarıları:', result.errors);
      }
    } catch (err) {
      setError(`Dosya okunamadı: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = () => {
    if (!importResult) return;

    // Analyses için id ekle
    const analysesWithId = importResult.analyses.map(a => ({
      ...a,
      id: crypto.randomUUID()
    })) as QualityAnalysis[];

    onImport(importResult.orders, analysesWithId);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Excel'den İçe Aktar">
      <div className="space-y-4">
        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex items-start gap-3">
          <FileSpreadsheet className="text-emerald-500 mt-1" size={18} />
          <div className="text-xs text-emerald-800 font-medium leading-relaxed">
            <p className="font-bold mb-1">Desteklenen Sayfalar:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li><strong>SATIN ALMA</strong> → Siparişler</li>
              <li><strong>GİRİŞ ANALİZİ</strong> → Kalite Analizleri</li>
            </ul>
          </div>
        </div>

        {/* Dosya Seçimi */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${file ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 hover:border-emerald-400 hover:bg-slate-50'
            }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileSelect}
            className="hidden"
          />
          {isLoading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-slate-500">Dosya işleniyor...</p>
            </div>
          ) : file ? (
            <div className="flex flex-col items-center gap-2">
              <FileSpreadsheet size={32} className="text-emerald-500" />
              <p className="text-sm font-bold text-slate-700">{file.name}</p>
              <p className="text-xs text-slate-400">Başka dosya seçmek için tıklayın</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload size={32} className="text-slate-300" />
              <p className="text-sm font-bold text-slate-500">Excel Dosyası Seçin</p>
              <p className="text-xs text-slate-400">.xlsx veya .xls</p>
            </div>
          )}
        </div>

        {/* Sonuç Özeti */}
        {importResult && (
          <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider">İçe Aktarılacak Veriler</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800 p-3 rounded-xl">
                <p className="text-2xl font-black text-emerald-400">{importResult.orders.length}</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Sipariş</p>
              </div>
              <div className="bg-slate-800 p-3 rounded-xl">
                <p className="text-2xl font-black text-blue-400">{importResult.analyses.length}</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Giriş Analizi</p>
              </div>
            </div>
            {importResult.errors.length > 0 && (
              <div className="bg-orange-500/20 p-2 rounded-lg">
                <p className="text-[10px] text-orange-300 font-bold">{importResult.errors.length} uyarı (konsola bakın)</p>
              </div>
            )}
          </div>
        )}

        {error && <p className="text-rose-500 text-xs font-bold">{error}</p>}

        <button
          onClick={handleImport}
          disabled={!importResult || (importResult.orders.length === 0 && importResult.analyses.length === 0)}
          className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-emerald-100 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload size={16} /> Verileri İçe Aktar
        </button>
      </div>
    </Modal>
  );
};

export const TransitionDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: Partial<Order>) => void;
  targetStage: Stage;
}> = ({ isOpen, onClose, onConfirm, targetStage }) => {
  const [data, setData] = useState<Partial<Order>>({});

  useEffect(() => {
    setData({});
  }, [isOpen, targetStage]);

  const updateField = (field: string, val: any) => setData(prev => ({ ...prev, [field]: val }));

  const handleSubmit = () => {
    onConfirm(data);
  };

  const renderFields = () => {
    switch (targetStage) {
      case 'Yüklendi':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <GenericField label="ETD (Tahmini Yükleme)" field="etd" type="date" value={data.etd} onChange={updateField} />
              <GenericField label="ETA (Tahmini Varış)" field="eta" type="date" value={data.eta} onChange={updateField} />
            </div>
            <GenericField label="Yükleme Tarihi (Fiili)" field="loading_date" type="date" value={data.loading_date} onChange={updateField} />
            <GenericField label="Booking No" field="booking_no" value={data.booking_no} onChange={updateField} />
          </>
        );
      case 'Yolda':
        return (
          <>
            <GenericField label="B/L No" field="bl_no" value={data.bl_no} onChange={updateField} />
            <GenericField label="Konteyner No" field="container_no" value={data.container_no} onChange={updateField} />
            <GenericField label="Gemi Adı" field="vessel_name" value={data.vessel_name} onChange={updateField} />
            <GenericField label="Tahmini Varış (ETA)" field="eta" type="date" value={data.eta} onChange={updateField} />
          </>
        );
      case 'Limanda':
        return (
          <>
            <GenericField label="Ödeme Durumu" field="payment_status" type="select" options={['Ödendi', 'Ödeme bekliyor']} value={data.payment_status} onChange={updateField} />
            <GenericField label="Liman Notu" field="port_note" type="textarea" value={data.port_note} onChange={updateField} />
          </>
        );
      case 'Antrepoda':
        return (
          <>
            <GenericField label="Antrepo Giriş Tarihi" field="antrepo_entry_date" type="date" value={data.antrepo_entry_date} onChange={updateField} />
            <GenericField label="Beyanname No" field="antrepo_declaration_no" value={data.antrepo_declaration_no} onChange={updateField} />
            <GenericField label="Antrepo Durumu" field="antrepo_status" type="select" options={ANTREPO_STATUS_OPTIONS} value={data.antrepo_status} onChange={updateField} />
          </>
        );
      case 'Depoda':
        return (
          <>
            <GenericField label="Batch No" field="batch_no" value={data.batch_no} onChange={updateField} />
            <GenericField label="Tır No" field="truck_no" value={data.truck_no} onChange={updateField} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${targetStage} Aşama Geçişi`}>
      <div className="space-y-6">
        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex items-start gap-3">
          <Info className="text-emerald-500 mt-1" size={18} />
          <p className="text-xs text-emerald-800 font-medium leading-relaxed">
            Siparişi <strong>{targetStage}</strong> aşamasına taşıyorsunuz. Bu aşama için gerekli bilgileri aşağıda tanımlayabilirsiniz.
          </p>
        </div>
        <div className="space-y-4">
          {renderFields()}
        </div>
        <button onClick={handleSubmit} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-slate-200 transition-all active:scale-95">Geçişi Tamamla</button>
      </div>
    </Modal>
  );
};

// --- Price Entry Dialogs ---
export const PriceEntryDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { date: string; grade: Grade; price: number }) => void;
}> = ({ isOpen, onClose, onSave }) => {
  const [data, setData] = useState({ date: new Date().toLocaleDateString('tr-TR'), grade: 'WW320' as Grade, price: 0 });
  const updateField = (f: string, v: any) => setData(p => ({ ...p, [f]: v }));
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Yeni Fiyat Kaydı">
      <div className="space-y-4">
        <GenericField label="Tarih" field="date" type="date" value={data.date} onChange={updateField} />
        <GenericField label="Grade" field="grade" type="select" options={GRADES} value={data.grade} onChange={updateField} />
        <GenericField label="Fiyat ($/lb)" field="price" type="number" value={data.price} onChange={updateField} />
        <button onClick={() => { onSave(data); onClose(); }} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold uppercase tracking-widest text-xs">Fiyatı Kaydet</button>
      </div>
    </Modal>
  );
};

export const EditPriceDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { date: string; grade: Grade; price: number }) => void;
  initialData: { date: string; grade: Grade; price: number } | null;
}> = ({ isOpen, onClose, onSave, initialData }) => {
  const [data, setData] = useState({ date: '', grade: 'WW320' as Grade, price: 0 });
  useEffect(() => { if (initialData) setData(initialData); }, [initialData]);
  const updateField = (f: string, v: any) => setData(p => ({ ...p, [f]: v }));
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Fiyat Kaydını Düzenle">
      <div className="space-y-4">
        <GenericField label="Tarih" field="date" type="date" value={data.date} onChange={updateField} />
        <GenericField label="Grade" field="grade" type="select" options={GRADES} value={data.grade} onChange={updateField} />
        <GenericField label="Fiyat ($/lb)" field="price" type="number" value={data.price} onChange={updateField} />
        <button onClick={() => { onSave(data); onClose(); }} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold uppercase tracking-widest text-xs">Değişiklikleri Kaydet</button>
      </div>
    </Modal>
  );
};

// --- Freight Entry Dialogs ---
export const FreightEntryDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { date: string; price: number }) => void;
}> = ({ isOpen, onClose, onSave }) => {
  const [data, setData] = useState({ date: new Date().toLocaleDateString('tr-TR'), price: 0 });
  const updateField = (f: string, v: any) => setData(p => ({ ...p, [f]: v }));
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Yeni Navlun Kaydı">
      <div className="space-y-4">
        <GenericField label="Tarih" field="date" type="date" value={data.date} onChange={updateField} />
        <GenericField label="Navlun Fiyatı ($)" field="price" type="number" value={data.price} onChange={updateField} />
        <button onClick={() => { onSave(data); onClose(); }} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold uppercase tracking-widest text-xs">Navlunu Kaydet</button>
      </div>
    </Modal>
  );
};

export const EditFreightDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { date: string; price: number }) => void;
  initialData: { date: string; price: number } | null;
}> = ({ isOpen, onClose, onSave, initialData }) => {
  const [data, setData] = useState({ date: '', price: 0 });
  useEffect(() => { if (initialData) setData(initialData); }, [initialData]);
  const updateField = (f: string, v: any) => setData(p => ({ ...p, [f]: v }));
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Navlun Kaydını Düzenle">
      <div className="space-y-4">
        <GenericField label="Tarih" field="date" type="date" value={data.date} onChange={updateField} />
        <GenericField label="Navlun Fiyatı ($)" field="price" type="number" value={data.price} onChange={updateField} />
        <button onClick={() => { onSave(data); onClose(); }} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold uppercase tracking-widest text-xs">Değişiklikleri Kaydet</button>
      </div>
    </Modal>
  );
};

// --- Entry Analysis Dialog ---
export const EntryAnalysisDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: QualityAnalysis) => void;
  orders: Order[];
  initialData?: QualityAnalysis | null;
}> = ({ isOpen, onClose, onSave, orders, initialData }) => {
  const [data, setData] = useState<Partial<QualityAnalysis>>({
    date: new Date().toLocaleDateString('tr-TR'),
    grade: '',
    contract_no: '',
    container_no: '',
    truck_no: '',
    batch_no: '',
    analyst: '',
    moisture: 0,
    foreign_matter: 0,
    caliber: 0,
    halves_ratio: 0,
    broken_ratio: 0,
    total_h_b: 0,
    skin_on: 0,
    spotted: 0,
    immature: 0,
    tip_broken: 1.2,
    insect_bored: 0,
    off_color: 0,
    small_caliber: 0,
    large_caliber: 0
  });

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    } else {
      setData({
        date: new Date().toLocaleDateString('tr-TR'),
        grade: '',
        contract_no: '',
        container_no: '',
        truck_no: '',
        batch_no: '',
        analyst: '',
        moisture: 0,
        foreign_matter: 0,
        caliber: 0,
        halves_ratio: 0,
        broken_ratio: 0,
        total_h_b: 0,
        skin_on: 0,
        spotted: 0,
        immature: 0,
        tip_broken: 1.2,
        insect_bored: 0,
        off_color: 0,
        small_caliber: 0,
        large_caliber: 0
      });
    }
  }, [initialData, isOpen]);

  const availableContainers = useMemo(() => {
    return Array.from(new Set(orders.map(o => o.container_no).filter(Boolean))) as string[];
  }, [orders]);

  useEffect(() => {
    if (data.container_no && !initialData) {
      const order = orders.find(o => o.container_no === data.container_no);
      if (order) {
        setData(prev => ({
          ...prev,
          contract_no: order.contract_no,
          grade: order.grade,
          truck_no: order.truck_no || prev.truck_no,
          batch_no: order.batch_no || prev.batch_no
        }));
      }
    }
  }, [data.container_no, orders, initialData]);

  useEffect(() => {
    const halves = Number(data.halves_ratio) || 0;
    const broken = Number(data.broken_ratio) || 0;
    setData(prev => ({ ...prev, total_h_b: halves + broken }));
  }, [data.halves_ratio, data.broken_ratio]);

  const updateField = (field: string, val: any) => setData(prev => ({ ...prev, [field]: val }));

  const handleSave = () => {
    onSave({ ...data, id: data.id || crypto.randomUUID() } as QualityAnalysis);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Analiz Raporunu Düzenle" : "Yeni Giriş Analiz Raporu"}>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <GenericField label="Konteyner No" field="container_no" type="select" options={availableContainers} isEditing={!initialData} value={data.container_no} onChange={updateField} />
          <GenericField label="Grade" field="grade" isEditing={false} value={data.grade} onChange={updateField} />
          <GenericField label="Kontrat No" field="contract_no" isEditing={false} value={data.contract_no} onChange={updateField} />
          <GenericField label="Analiz Tarihi" field="date" type="date" isEditing={true} value={data.date} onChange={updateField} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <GenericField label="Tır No" field="truck_no" isEditing={true} value={data.truck_no} onChange={updateField} />
          <GenericField label="Parti No" field="batch_no" isEditing={true} value={data.batch_no} onChange={updateField} />
          <GenericField label="Analiz Yapan" field="analyst" isEditing={true} value={data.analyst} onChange={updateField} />
        </div>
        <div className="border-t border-slate-100 pt-4 grid grid-cols-3 gap-4">
          <GenericField label="Nem (%)" field="moisture" type="number" isEditing={true} value={data.moisture} onChange={updateField} />
          <GenericField label="Yabancı Madde (%)" field="foreign_matter" type="number" isEditing={true} value={data.foreign_matter} onChange={updateField} />
          <GenericField label="Kalibre" field="caliber" type="number" isEditing={true} value={data.caliber} onChange={updateField} />
        </div>
        <div className="grid grid-cols-3 gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <GenericField label="Şak (%)" field="halves_ratio" type="number" isEditing={true} value={data.halves_ratio} onChange={updateField} />
          <GenericField label="Kırık (%)" field="broken_ratio" type="number" isEditing={true} value={data.broken_ratio} onChange={updateField} />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1">Şak + Kırık</span>
            <span className="text-sm font-black text-indigo-600 py-1.5 px-2 bg-indigo-50 rounded-lg">%{data.total_h_b?.toFixed(2)}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <GenericField label="Zarlı (%)" field="skin_on" type="number" isEditing={true} value={data.skin_on} onChange={updateField} />
          <GenericField label="Lekeli (%)" field="spotted" type="number" isEditing={true} value={data.spotted} onChange={updateField} />
          <GenericField label="Urlu (%)" field="immature" type="number" isEditing={true} value={data.immature} onChange={updateField} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <GenericField label="Ucu Kırık (%)" field="tip_broken" type="number" isEditing={true} value={data.tip_broken} onChange={updateField} />
          <GenericField label="Böcek Yeniği (%)" field="insect_bored" type="number" isEditing={true} value={data.insect_bored} onChange={updateField} />
          <GenericField label="Farklı Renk (%)" field="off_color" type="number" isEditing={true} value={data.off_color} onChange={updateField} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <GenericField label="Küçük Kalibre (%)" field="small_caliber" type="number" isEditing={true} value={data.small_caliber} onChange={updateField} />
          <GenericField label="Büyük Kalibre (%)" field="large_caliber" type="number" isEditing={true} value={data.large_caliber} onChange={updateField} />
        </div>
        <button onClick={handleSave} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-blue-100 transition-all active:scale-95">
          {initialData ? "Değişiklikleri Kaydet" : "Analiz Raporunu Kaydet"}
        </button>
      </div>
    </Modal>
  );
};

// --- Exit Analysis Dialog ---
export const ExitAnalysisDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ExitAnalysis) => void;
}> = ({ isOpen, onClose, onSave }) => {
  const [data, setData] = useState<Partial<ExitAnalysis>>({
    date: new Date().toLocaleDateString('tr-TR'),
    grade: '',
    lot: '',
    analyst: '',
    department: '',
    customer: '',
    moisture: 0,
    foreign_matter: 0,
    caliber: 0,
    halves_ratio: 0,
    broken_ratio: 0,
    total_h_b: 0,
    tip_broken: 0,
    immature: 0,
    insect_bored: 0,
    spotted: 0,
    skin_on: 0,
    damaged: 0,
    dark_grain: 0,
    polarization: 0,
    frying_time: '',
    frying_temp: 0,
    salt_ratio: 0
  });

  useEffect(() => {
    const halves = Number(data.halves_ratio) || 0;
    const broken = Number(data.broken_ratio) || 0;
    setData(prev => ({ ...prev, total_h_b: halves + broken }));
  }, [data.halves_ratio, data.broken_ratio]);

  const updateField = (field: string, val: any) => setData(prev => ({ ...prev, [field]: val }));

  const handleSave = () => {
    onSave({ ...data, id: crypto.randomUUID() } as ExitAnalysis);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Yeni Çıkış (Üretilen) Analiz Raporu">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <GenericField label="Grade" field="grade" type="select" options={GRADES} isEditing={true} value={data.grade} onChange={updateField} />
          <GenericField label="Lot" field="lot" isEditing={true} value={data.lot} onChange={updateField} />
          <GenericField label="Analiz Tarihi" field="date" type="date" isEditing={true} value={data.date} onChange={updateField} />
          <GenericField label="Analiz Yapan" field="analyst" isEditing={true} value={data.analyst} onChange={updateField} />
          <GenericField label="Bölüm" field="department" isEditing={true} value={data.department} onChange={updateField} />
          <GenericField label="Sevk Yeri / Müşteri" field="customer" isEditing={true} value={data.customer} onChange={updateField} />
        </div>
        <div className="border-t border-slate-100 pt-4 grid grid-cols-3 gap-4">
          <GenericField label="Nem (%)" field="moisture" type="number" isEditing={true} value={data.moisture} onChange={updateField} />
          <GenericField label="Yabancı Madde (%)" field="foreign_matter" type="number" isEditing={true} value={data.foreign_matter} onChange={updateField} />
          <GenericField label="Kalibre" field="caliber" type="number" isEditing={true} value={data.caliber} onChange={updateField} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <GenericField label="Şak (%)" field="halves_ratio" type="number" isEditing={true} value={data.halves_ratio} onChange={updateField} />
          <GenericField label="Kırık (%)" field="broken_ratio" type="number" isEditing={true} value={data.broken_ratio} onChange={updateField} />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1">Şak + Kırık</span>
            <span className="text-sm font-black text-indigo-600 py-1.5 px-2 bg-indigo-50 rounded-lg">%{data.total_h_b?.toFixed(2)}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <GenericField label="Ucu Kırık (%)" field="tip_broken" type="number" isEditing={true} value={data.tip_broken} onChange={updateField} />
          <GenericField label="Urlu (%)" field="immature" type="number" isEditing={true} value={data.immature} onChange={updateField} />
          <GenericField label="Böcek Yeniği (%)" field="insect_bored" type="number" isEditing={true} value={data.insect_bored} onChange={updateField} />
        </div>
        <div className="grid grid-cols-4 gap-4">
          <GenericField label="Lekeli (%)" field="spotted" type="number" isEditing={true} value={data.spotted} onChange={updateField} />
          <GenericField label="Zarlı (%)" field="skin_on" type="number" isEditing={true} value={data.skin_on} onChange={updateField} />
          <GenericField label="Bozuk (%)" field="damaged" type="number" isEditing={true} value={data.damaged} onChange={updateField} />
          <GenericField label="Koyu Tane (%)" field="dark_grain" type="number" isEditing={true} value={data.dark_grain} onChange={updateField} />
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 grid grid-cols-2 gap-4">
          <GenericField label="Polarizasyon" field="polarization" type="number" isEditing={true} value={data.polarization} onChange={updateField} />
          <GenericField label="Tuz Oranı (%)" field="salt_ratio" type="number" isEditing={true} value={data.salt_ratio} onChange={updateField} />
          <GenericField label="Kızartma Süresi" field="frying_time" isEditing={true} value={data.frying_time} onChange={updateField} />
          <GenericField label="Kızartma Sıcaklığı (°C)" field="frying_temp" type="number" isEditing={true} value={data.frying_temp} onChange={updateField} />
        </div>
        <button onClick={handleSave} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-indigo-100 transition-all active:scale-95">
          Final Analiz Raporunu Kaydet
        </button>
      </div>
    </Modal>
  );
};
