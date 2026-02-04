
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Search, Plus, Filter, LayoutGrid, Clock, Package, Archive } from 'lucide-react';
import { Order, Stage, Grade, PriceRecord, FreightRecord, QualityAnalysis } from './types';
import { STAGES, INITIAL_ORDERS, GRADES } from './constants';
import { parseDateTR, isWithinNext10Days, formatNumberTR } from './utils/formatters';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SummaryDashboard from './components/SummaryDashboard';
import OrderCard from './components/OrderCard';
import PriceTracking from './pages/PriceTracking';
import FreightTracking from './pages/FreightTracking';
import PriceStats from './pages/PriceStats';
import ProductionStats from './pages/ProductionStats';
import ProductionTracking from './pages/ProductionTracking';
import Blending from './pages/Blending';
import EntryAnalysis from './pages/EntryAnalysis';
import ExitAnalysisPage from './pages/ExitAnalysis';
import { NewOrderDialog, TransitionDialog, OrderDetailsDialog, ImportDialog } from './components/Dialogs';


const App: React.FC = () => {
  // --- NAVIGATION STATE ---
  const [currentPage, setCurrentPage] = useState<'home' | 'prices' | 'freight' | 'archived' | 'price-stats' | 'prod-stats' | 'prod-tracking' | 'blending' | 'entry-analysis' | 'exit-analysis'>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- ORDER STATE (with localStorage persistence) ---
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('tracko_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_ORDERS;
      }
    }
    return INITIAL_ORDERS;
  });
  const [activeStage, setActiveStage] = useState<Stage>('Depoda');
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<Grade | 'All'>('All');
  const [etaFilter10Days, setEtaFilter10Days] = useState(false);
  const [sortBy, setSortBy] = useState<'ETA_NEAR' | 'CONTRACT_NO'>('CONTRACT_NO');

  // --- PRICE STATE ---
  const [priceHistory, setPriceHistory] = useState<PriceRecord[]>([
    { id: '1', date: '20.05.2024', grade: 'WW320', price: 3.85, change: '+0,05', status: 'up' },
    { id: '2', date: '18.05.2024', grade: 'WW240', price: 4.10, change: '-0,10', status: 'down' },
    { id: '3', date: '15.05.2024', grade: 'WW180', price: 4.50, change: '0,00', status: 'stable' },
    { id: '4', date: '10.05.2024', grade: 'WW320', price: 3.80, change: '+0,10', status: 'up' },
    { id: '5', date: '05.05.2024', grade: 'WW240', price: 4.20, change: '+0,05', status: 'up' },
  ]);

  // --- FREIGHT STATE ---
  const [freightHistory, setFreightHistory] = useState<FreightRecord[]>([
    { id: '1', date: '22.05.2024', price: 4200, change: '+200,00', status: 'up' },
    { id: '2', date: '15.05.2024', price: 4000, change: '-150,00', status: 'down' },
    { id: '3', date: '01.05.2024', price: 4150, change: '0,00', status: 'stable' },
  ]);

  // --- ANALYSIS STATE (with localStorage persistence) ---
  const [analyses, setAnalyses] = useState<QualityAnalysis[]>(() => {
    const saved = localStorage.getItem('tracko_analyses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('tracko_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('tracko_analyses', JSON.stringify(analyses));
  }, [analyses]);

  // Latest freight for calculations
  const latestFreightPrice = useMemo(() => {
    return freightHistory.length > 0 ? freightHistory[0].price : 0;
  }, [freightHistory]);

  // Modal States
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<Order | null>(null);
  const [transitionModal, setTransitionModal] = useState<{ isOpen: boolean; orderId: string; targetStage: Stage } | null>(null);

  // --- MULTI-SELECT STATE ---
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());

  // Çoklu seçim handler
  const handleSelectOrder = useCallback((orderId: string, isCtrlPressed: boolean) => {
    if (isCtrlPressed) {
      setSelectedOrderIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(orderId)) {
          newSet.delete(orderId);
        } else {
          newSet.add(orderId);
        }
        return newSet;
      });
    }
  }, []);

  // Seçimi temizle
  const clearSelection = useCallback(() => {
    setSelectedOrderIds(new Set());
  }, []);

  // --- PRICE RECORD HELPER ---
  const addPriceToHistory = useCallback((grade: Grade, price: number, date: string) => {
    setPriceHistory(prev => {
      const sorted = [...prev].sort((a, b) => parseDateTR(b.date).getTime() - parseDateTR(a.date).getTime());
      const prevRecord = sorted.find(r => r.grade === grade);

      let status: 'up' | 'down' | 'stable' = 'stable';
      let change = '0,00';

      if (prevRecord) {
        const diff = price - prevRecord.price;
        status = diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable';
        const formattedDiff = formatNumberTR(Math.abs(diff));
        change = diff > 0 ? `+${formattedDiff}` : diff < 0 ? `-${formattedDiff}` : '0,00';
      }

      const newRecord: PriceRecord = {
        id: crypto.randomUUID(),
        date,
        grade,
        price,
        change,
        status
      };

      return [newRecord, ...prev];
    });
  }, []);

  // --- HANDLERS ---
  const handleCreateOrder = (data: Omit<Order, 'id' | 'stage'>) => {
    const newOrder: Order = {
      ...data,
      id: crypto.randomUUID(),
      stage: 'Sipariş'
    };
    addPriceToHistory(newOrder.grade, newOrder.unit_price, newOrder.order_date);
    setOrders(prev => [newOrder, ...prev]);
    setIsNewOrderModalOpen(false);
    setActiveStage('Sipariş');
    setCurrentPage('home');
  };

  const handleBulkImport = (newOrders: Omit<Order, 'id'>[], newAnalyses: QualityAnalysis[]) => {
    // Mevcut verileri sil ve yenilerini ekle
    const ordersWithId = newOrders.map(order => ({
      ...order,
      id: crypto.randomUUID(),
    }));

    // Stage'i Excel'den alınan değeri koru, yoksa Depoda yap
    const ordersWithStage = ordersWithId.map(order => ({
      ...order,
      stage: (order as any).stage || 'Depoda' as Stage
    }));

    setOrders(ordersWithStage);
    setAnalyses(newAnalyses);
    setIsImportModalOpen(false);
    setActiveStage('Depoda');
    setCurrentPage('home');
  };

  const handleUpdateOrder = (id: string, updatedData: Partial<Order>) => {
    const oldOrder = orders.find(o => o.id === id);
    if (oldOrder && updatedData.unit_price !== undefined && updatedData.unit_price !== oldOrder.unit_price) {
      addPriceToHistory(
        updatedData.grade || oldOrder.grade,
        updatedData.unit_price,
        updatedData.order_date || oldOrder.order_date
      );
    }
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updatedData } : o));
    if (selectedOrderForDetails?.id === id) {
      setSelectedOrderForDetails(prev => prev ? { ...prev, ...updatedData } : null);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    // Eğer seçili siparişler varsa ve sürüklenen bunlardan biriyse, tüm seçilileri taşı
    if (selectedOrderIds.size > 0 && selectedOrderIds.has(id)) {
      e.dataTransfer.setData('orderIds', JSON.stringify(Array.from(selectedOrderIds)));
    } else {
      e.dataTransfer.setData('orderId', id);
    }
  };

  const handleDropOnStage = (e: React.DragEvent, targetStage: Stage) => {
    e.preventDefault();

    // Çoklu seçim kontrolü
    const multipleIds = e.dataTransfer.getData('orderIds');
    if (multipleIds) {
      try {
        const ids: string[] = JSON.parse(multipleIds);
        // Toplu taşıma - sadece basit aşamalar için direkt taşı
        if (['Sipariş', 'Limanda'].includes(targetStage)) {
          ids.forEach(orderId => {
            const order = orders.find(o => o.id === orderId);
            if (order && order.stage !== targetStage) {
              updateOrderStage(orderId, targetStage);
            }
          });
          clearSelection();
        } else {
          // Diğer aşamalar için ilk siparişi kullanarak dialog aç
          // (toplu taşımada detay girişi basitleştirildi)
          ids.forEach(orderId => {
            const order = orders.find(o => o.id === orderId);
            if (order && order.stage !== targetStage) {
              updateOrderStage(orderId, targetStage);
            }
          });
          clearSelection();
        }
        return;
      } catch { }
    }

    // Tekli taşıma
    const orderId = e.dataTransfer.getData('orderId');
    const order = orders.find(o => o.id === orderId);

    if (!order || order.stage === targetStage) return;

    // Remove 'Limanda' from stages that require a transition dialog
    if (['Yüklendi', 'Yolda', 'Antrepoda', 'Depoda'].includes(targetStage)) {
      setTransitionModal({ isOpen: true, orderId, targetStage });
    } else {
      updateOrderStage(orderId, targetStage);
    }
  };

  const updateOrderStage = (id: string, stage: Stage, extraData: Partial<Order> = {}) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...extraData, stage } : o));
    setActiveStage(stage);
  };

  const handleConfirmTransition = (data: Partial<Order>) => {
    if (transitionModal) {
      updateOrderStage(transitionModal.orderId, transitionModal.targetStage, data);
      setTransitionModal(null);
    }
  };

  // --- FILTERING & SORTING ---
  const filteredOrders = useMemo(() => {
    let result = orders.filter(o => !o.is_archived && o.stage === activeStage);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(o =>
        o.contract_no.toLowerCase().includes(q) ||
        o.supplier.toLowerCase().includes(q) ||
        o.bl_no?.toLowerCase().includes(q) ||
        o.vessel_name?.toLowerCase().includes(q)
      );
    }
    if (gradeFilter !== 'All') {
      result = result.filter(o => o.grade === gradeFilter);
    }
    if (etaFilter10Days) {
      result = result.filter(o => o.eta && isWithinNext10Days(o.eta));
    }

    // Varsayılan sıralama: Sipariş tarihine göre (en yeni en üstte)
    result.sort((a, b) => {
      const dateA = a.order_date ? parseDateTR(a.order_date).getTime() : 0;
      const dateB = b.order_date ? parseDateTR(b.order_date).getTime() : 0;
      return dateB - dateA; // En yeni en üstte
    });

    // ETA yakın seçiliyse, ETA'ya göre tekrar sırala
    if (sortBy === 'ETA_NEAR') {
      result.sort((a, b) => {
        const dateA = a.eta ? parseDateTR(a.eta).getTime() : Infinity;
        const dateB = b.eta ? parseDateTR(b.eta).getTime() : Infinity;
        return dateA - dateB;
      });
    }

    return result;
  }, [orders, activeStage, searchQuery, gradeFilter, etaFilter10Days, sortBy]);

  const archivedOrders = useMemo(() => {
    let result = orders.filter(o => o.is_archived);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(o =>
        o.contract_no.toLowerCase().includes(q) ||
        o.supplier.toLowerCase().includes(q)
      );
    }
    // Sipariş tarihine göre sırala (en yeni en üstte)
    result.sort((a, b) => {
      const dateA = a.order_date ? parseDateTR(a.order_date).getTime() : 0;
      const dateB = b.order_date ? parseDateTR(b.order_date).getTime() : 0;
      return dateB - dateA;
    });
    return result;
  }, [orders, searchQuery]);

  const renderContent = () => {
    switch (currentPage) {
      case 'prices':
        return <PriceTracking history={priceHistory} onUpdateHistory={setPriceHistory} />;
      case 'freight':
        return <FreightTracking history={freightHistory} onUpdateHistory={setFreightHistory} />;
      case 'price-stats':
        return <PriceStats history={priceHistory} orders={orders} />;
      case 'prod-stats':
        return <ProductionStats orders={orders} />;
      case 'prod-tracking':
        return <ProductionTracking />;
      case 'blending':
        return <Blending orders={orders} />;
      case 'entry-analysis':
        return <EntryAnalysis orders={orders} analyses={analyses} onUpdateAnalyses={setAnalyses} />;
      case 'exit-analysis':
        return <ExitAnalysisPage />;
      case 'archived':
        return (
          <div className="animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-800">Arşivlenen Siparişler</h2>
                <p className="text-slate-500 mt-1">Süreci tamamlanmış veya pasife alınmış tüm siparişler.</p>
              </div>
            </div>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Arşivde ara: Contract No, Tedarikçi..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-400 transition-all text-sm text-slate-900 outline-none"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-3">
              {archivedOrders.length > 0 ? (
                archivedOrders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onDragStart={() => { }}
                    onClick={setSelectedOrderForDetails}
                  />
                ))
              ) : (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-300">
                  <Archive size={64} className="mb-4 opacity-10" />
                  <p className="font-medium text-lg">Arşiv boş</p>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return (
          <div className="animate-in fade-in duration-500">
            <SummaryDashboard orders={orders.filter(o => !o.is_archived)} priceHistory={priceHistory} />
            <div className="flex flex-col gap-6">
              <div className="overflow-x-auto pb-2 scrollbar-hide">
                <div className="flex bg-slate-200/50 p-1.5 rounded-2xl w-max min-w-full md:min-w-0">
                  {STAGES.map(stage => (
                    <button
                      key={stage}
                      onClick={() => setActiveStage(stage)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDropOnStage(e, stage)}
                      className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${activeStage === stage
                        ? 'bg-white text-emerald-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                      <Package size={16} className={activeStage === stage ? 'text-emerald-500' : 'text-slate-400'} />
                      {stage}
                      <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${activeStage === stage ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-300/50 text-slate-500'
                        }`}>
                        {orders.filter(o => !o.is_archived && o.stage === stage).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex flex-1 w-full gap-2 items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="Ara: Contract No, B/L, Gemi..."
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all text-sm text-slate-900 outline-none"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <select
                    className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500"
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                  >
                    <option value="ETA_NEAR">ETA Yakın</option>
                    <option value="CONTRACT_NO">Sözleşme No</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto scrollbar-hide pb-1">
                  {(['All', 'WW320', 'WW240', 'WW180'] as const).map(g => (
                    <button
                      key={g}
                      onClick={() => setGradeFilter(g)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${gradeFilter === g ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                      {g}
                    </button>
                  ))}
                  <div className="w-px h-6 bg-slate-200 mx-1 flex-shrink-0"></div>
                  <button
                    onClick={() => setEtaFilter10Days(!etaFilter10Days)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${etaFilter10Days ? 'bg-orange-500 text-white' : 'bg-white text-orange-600 border border-orange-100 hover:bg-orange-50'
                      }`}
                  >
                    <Clock size={14} />
                    ETA 10 Gün
                  </button>
                </div>
              </div>

              {/* Çoklu seçim banner'ı */}
              {selectedOrderIds.size > 0 && (
                <div className="bg-emerald-500 text-white px-4 py-3 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 rounded-lg p-2">
                      <Package size={18} />
                    </div>
                    <span className="font-semibold">{selectedOrderIds.size} sipariş seçili</span>
                    <span className="text-emerald-100 text-sm">• Başka bir aşamaya sürükleyerek toplu taşıyın</span>
                  </div>
                  <button
                    onClick={clearSelection}
                    className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    Seçimi Temizle
                  </button>
                </div>
              )}

              <div className="flex flex-col gap-3">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map(order => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onDragStart={handleDragStart}
                      onClick={setSelectedOrderForDetails}
                      isSelected={selectedOrderIds.has(order.id)}
                      onSelect={handleSelectOrder}
                      selectedCount={selectedOrderIds.size}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400 bg-white/50 border-2 border-dashed border-slate-200 rounded-3xl">
                    <LayoutGrid size={48} className="mb-4 opacity-20" />
                    <p className="font-medium text-lg text-slate-500">Kayıt Bulunamadı</p>
                    <p className="text-sm">Arama kriterlerini kontrol edin.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
      <Header
        onNewOrder={() => setIsNewOrderModalOpen(true)}
        onImport={() => setIsImportModalOpen(true)}
        onMenuToggle={() => setIsSidebarOpen(true)}
        onNavigateHome={() => setCurrentPage('home')}
      />
      <main className="w-[95%] mx-auto mt-6 px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </main>
      <NewOrderDialog
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        onSave={handleCreateOrder}
      />
      <ImportDialog
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleBulkImport}
      />
      <OrderDetailsDialog
        isOpen={!!selectedOrderForDetails}
        onClose={() => setSelectedOrderForDetails(null)}
        order={selectedOrderForDetails}
        onSave={handleUpdateOrder}
        latestFreightPrice={latestFreightPrice}
      />
      {transitionModal && (
        <TransitionDialog
          isOpen={transitionModal.isOpen}
          onClose={() => setTransitionModal(null)}
          onConfirm={handleConfirmTransition}
          targetStage={transitionModal.targetStage}
        />
      )}
    </div>
  );
};

export default App;
