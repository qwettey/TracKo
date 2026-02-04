
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, Calculator, Truck, DollarSign, Paperclip, FileText, Calendar as CalendarIcon, Check, Hash, Info, User, Package, MapPin, Edit3, Save, RotateCcw, TrendingUp, AlertTriangle, Trash2, Ship, Bookmark, CreditCard, MessageSquare, CheckCircle2, Archive, ArchiveRestore, Droplets, Scissors, Microscope, Flame, Thermometer, Timer, Activity, Users, Zap, Search, Upload, ChevronLeft, ChevronRight } from 'lucide-react';
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
}> = ({ isOpen, onClose, onSave }) => {
  const [data, setData] = useState<Partial<Order>>({
    contract_no: '',
    supplier: '',
    grade: 'WW320',
    packaging_type: 'Vakum',
    order_date: new Date().toLocaleDateString('tr-TR'),
    unit_price: 0,
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
        unit_price: 0,
        fcl_count: 1,
        container_type: "40'",
        total_kg: 24948,
        total_lb: 55000,
        shipment_month: '',
        note: ''
      });
    }
  }, [isOpen]);

  const updateField = (field: string, val: any) => {
    setData(prev => {
      const next = { ...prev, [field]: val };
      if (field === 'total_kg') {
        next.total_lb = Math.round(Number(val) * 2.20462);
      } else if (field === 'total_lb') {
        next.total_kg = Math.round(Number(val) / 2.20462);
      }
      if (next.unit_price !== undefined && next.total_lb !== undefined) {
        next.total_price = next.unit_price * next.total_lb;
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
          <GenericField label="Birim Fiyat ($/lb)" field="unit_price" type="number" value={data.unit_price} onChange={updateField} />
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
  latestFreightPrice: number;
}> = ({ isOpen, onClose, order, onSave, latestFreightPrice }) => {
  const [data, setData] = useState<Partial<Order>>({});
  const [isEditing, setIsEditing] = useState(false);

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

      // Recalculate total price if quantities or unit price change
      const unitPrice = Number(next.unit_price) || 0;
      const totalLb = Number(next.total_lb) || 0;
      next.total_price = unitPrice * totalLb;

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
      <div className="space-y-6">
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
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <GenericField label="Kontrat No" field="contract_no" isEditing={isEditing} value={data.contract_no} onChange={updateField} />
          <GenericField label="Tedarikçi" field="supplier" isEditing={isEditing} value={data.supplier} onChange={updateField} />
          <GenericField label="Grade" field="grade" type="select" options={GRADES} isEditing={isEditing} value={data.grade} onChange={updateField} />
          <GenericField label="Birim Fiyat ($/lb)" field="unit_price" type="number" isEditing={isEditing} value={data.unit_price} onChange={updateField} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <GenericField label="Miktar (KG)" field="total_kg" type="number" isEditing={isEditing} value={data.total_kg} onChange={updateField} />
          <GenericField label="Miktar (LB)" field="total_lb" type="number" isEditing={isEditing} value={data.total_lb} onChange={updateField} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <GenericField label="Sipariş Tarihi" field="order_date" type="date" isEditing={isEditing} value={data.order_date} onChange={updateField} />
          {data.etd && (
            <GenericField label="ETD" field="etd" type="date" isEditing={isEditing} value={data.etd} onChange={updateField} />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {data.eta && (
            <GenericField label="ETA" field="eta" type="date" isEditing={isEditing} value={data.eta} onChange={updateField} />
          )}
          {data.vessel_name && (
            <GenericField label="Gemi" field="vessel_name" isEditing={isEditing} value={data.vessel_name} onChange={updateField} />
          )}
        </div>

        {['Yolda', 'Limanda', 'Antrepoda', 'Depoda'].includes(data.stage || '') && (
          <div className="space-y-4 border-t border-slate-100 pt-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lojistik & Gümrük</h4>
            <div className="grid grid-cols-2 gap-4">
              <GenericField label="B/L No" field="bl_no" isEditing={isEditing} value={data.bl_no} onChange={updateField} />
              <GenericField label="Konteyner No" field="container_no" isEditing={isEditing} value={data.container_no} onChange={updateField} />
            </div>
          </div>
        )}

        {['Antrepoda', 'Depoda'].includes(data.stage || '') && (
          <div className="space-y-4 border-t border-slate-100 pt-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Antrepo & Analiz</h4>
            <div className="grid grid-cols-2 gap-4">
              <GenericField label="Antrepo Durumu" field="antrepo_status" type="select" options={ANTREPO_STATUS_OPTIONS} isEditing={isEditing} value={data.antrepo_status} onChange={updateField} />
              <GenericField label="Tarım Onayı" field="is_agriculture_approved" type="checkbox" isEditing={isEditing} value={data.is_agriculture_approved} onChange={updateField} />
            </div>
          </div>
        )}

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

        <GenericField label="Genel Notlar" field="note" type="textarea" isEditing={isEditing} value={data.note} onChange={updateField} />
      </div>
    </Modal>
  );
};

// --- Import Dialog ---
export const ImportDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: Omit<Order, 'id' | 'stage'>[]) => void;
}> = ({ isOpen, onClose, onImport }) => {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleImport = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (Array.isArray(parsed)) {
        onImport(parsed);
        setJsonText('');
        setError(null);
        onClose();
      } else {
        setError('Lütfen bir dizi (array) formatında JSON giriniz.');
      }
    } catch (e) {
      setError('Geçersiz JSON formatı.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Verileri İçe Aktar (JSON)">
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-start gap-3">
          <Info className="text-blue-500 mt-1" size={18} />
          <p className="text-xs text-blue-800 font-medium leading-relaxed">
            Sipariş verilerini JSON formatında toplu olarak içe aktarabilirsiniz. Beklenen format bir objedir dizisidir.
          </p>
        </div>
        <textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          className="w-full h-64 p-4 bg-slate-900 text-white rounded-xl text-xs font-mono placeholder-slate-500 outline-none resize-none"
          placeholder='[{"contract_no": "CONT-001", "supplier": "A Corp", "grade": "WW320", "unit_price": 3.5, ...}]'
        />
        {error && <p className="text-rose-500 text-xs font-bold">{error}</p>}
        <button
          onClick={handleImport}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center justify-center gap-2"
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
