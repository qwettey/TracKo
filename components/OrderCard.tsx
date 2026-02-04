
import React from 'react';
import { Calendar, Wheat, Hash, Truck, Ship, Clock, AlertCircle, Archive, DollarSign, Package, Anchor } from 'lucide-react';
import { Order } from '../types';
import { formatNumberTR } from '../utils/formatters';

interface OrderCardProps {
  order: Order;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onClick: (order: Order) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onDragStart, onClick }) => {
  const handleLocalDragStart = (e: React.DragEvent) => {
    if (order.is_archived) return;
    const dragPreview = document.createElement('div');
    dragPreview.style.width = '160px';
    dragPreview.style.padding = '8px 12px';
    dragPreview.style.background = 'white';
    dragPreview.style.border = '2px solid #10b981';
    dragPreview.style.borderRadius = '12px';
    dragPreview.style.position = 'absolute';
    dragPreview.style.top = '-1000px';
    dragPreview.style.boxShadow = '0 10px 15px -3px rgb(0 0 0 / 0.1)';
    dragPreview.innerHTML = `
      <div style="font-size: 10px; font-weight: bold; color: #64748b;">${order.contract_no}</div>
      <div style="font-size: 12px; font-weight: 800; color: #064e3b;">${order.grade}</div>
    `;
    document.body.appendChild(dragPreview);
    e.dataTransfer.setDragImage(dragPreview, 80, 20);
    setTimeout(() => { document.body.removeChild(dragPreview); }, 0);
    onDragStart(e, order.id);
  };

  const isPaymentPending = order.payment_status === 'Ödeme bekliyor';

  // Hücre bileşeni - tekrar eden yapıyı basitleştirmek için
  const Cell = ({ label, value, className = '' }: { label: string; value: React.ReactNode; className?: string }) => (
    <div className={`flex flex-col ${className}`}>
      <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{label}</span>
      <span className="text-xs font-semibold text-slate-700 truncate">{value || '-'}</span>
    </div>
  );

  return (
    <div
      draggable={!order.is_archived}
      onDragStart={handleLocalDragStart}
      onClick={() => onClick(order)}
      className={`bg-white px-4 py-3 rounded-lg border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group relative ${order.is_archived ? 'opacity-70 grayscale-[0.3]' : ''}`}
    >
      {/* Sol kenar çizgisi */}
      <div className={`absolute top-0 left-0 w-1 h-full rounded-l-lg ${order.is_archived ? 'bg-slate-300' : (isPaymentPending ? 'bg-rose-500' : 'bg-emerald-500/20 group-hover:bg-emerald-500')} transition-colors`} />

      {/* Ana satır içeriği */}
      <div className="flex items-center gap-6 pl-3 overflow-x-auto">

        {/* 1. Sipariş Tarihi */}
        <Cell label="Sipariş Tarihi" value={order.order_date} className="min-w-[90px]" />

        {/* 2. Contract No */}
        <Cell label="Contract No" value={order.contract_no} className="min-w-[110px]" />

        {/* 3. Tır No */}
        <Cell label="Tır No" value={order.truck_no} className="min-w-[80px]" />

        {/* 4. Grade Badge */}
        <div className="flex flex-col min-w-[70px]">
          <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Grade</span>
          <span className={`mt-0.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase w-fit ${order.grade === 'WW320' ? 'bg-indigo-100 text-indigo-700' :
              order.grade === 'WW240' ? 'bg-cyan-100 text-cyan-700' :
                'bg-orange-100 text-orange-700'
            }`}>
            {order.grade}
          </span>
        </div>

        {/* 5. Firma */}
        <Cell label="Firma" value={order.supplier} className="min-w-[140px] max-w-[180px]" />

        {/* 6. Mahsul Yılı */}
        <Cell label="Mahsul Yılı" value={order.harvest_year} className="min-w-[70px]" />

        {/* 7. FOB Fiyat */}
        <div className="flex flex-col min-w-[80px]">
          <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">FOB Fiyat</span>
          <span className="text-xs font-semibold text-emerald-600">
            {order.fob_price ? `$${formatNumberTR(order.fob_price)}` : '-'}
          </span>
        </div>

        {/* 8. CNF Fiyat */}
        <div className="flex flex-col min-w-[80px]">
          <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">CNF Fiyat</span>
          <span className="text-xs font-semibold text-blue-600">
            {order.cnf_price ? `$${formatNumberTR(order.cnf_price)}` : '-'}
          </span>
        </div>

        {/* 9. Navlun */}
        <div className="flex flex-col min-w-[80px]">
          <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Navlun</span>
          <span className="text-xs font-semibold text-slate-600">
            {order.freight_price ? `$${formatNumberTR(order.freight_price)}` : '-'}
          </span>
        </div>

        {/* 10. Miktar (Kg) */}
        <div className="flex flex-col min-w-[90px]">
          <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Miktar (Kg)</span>
          <span className="text-xs font-bold text-slate-800">{formatNumberTR(order.total_kg)}</span>
        </div>

        {/* 11. Konteyner No */}
        <Cell label="Konteyner No" value={order.container_no} className="min-w-[100px]" />

        {/* 12. B/L No */}
        <Cell label="B/L No" value={order.bl_no} className="min-w-[100px]" />

        {/* 13. ETD */}
        <Cell label="ETD" value={order.etd} className="min-w-[80px]" />

        {/* 14. ETA */}
        <div className="flex flex-col min-w-[80px]">
          <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">ETA</span>
          <span className={`text-xs font-semibold ${order.eta ? 'text-blue-600' : 'text-slate-400'}`}>
            {order.eta || '-'}
          </span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Durum ikonları */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {isPaymentPending && !order.is_archived && (
            <div className="bg-rose-50 text-rose-600 p-1.5 rounded-full" title="Ödeme Bekliyor">
              <AlertCircle size={14} />
            </div>
          )}
          {order.is_archived && (
            <div className="bg-slate-100 text-slate-500 p-1.5 rounded-md" title="Arşivlendi">
              <Archive size={12} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
