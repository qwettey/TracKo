
export type ProductType = 'kaju' | 'ceviz';

export type Grade = 'WW320' | 'WW240' | 'WW180';


export type Stage = 'Sipariş' | 'Yüklendi' | 'Yolda' | 'Limanda' | 'Antrepoda' | 'Depoda';

export type ContainerType = "20'" | "40'";

export type PackagingType = 'Vakum' | 'Teneke' | 'Koli' | 'Çuval';

export type PaymentStatus = 'Ödendi' | 'Ödeme bekliyor';

export type AntrepoStatus = 'Hazır' | 'Düşümlü Hazır' | 'Kontrol' | 'Analizde' | 'İşlem Yapılmadı';

export interface QualityAnalysis {
  id: string;
  contract_no: string;
  container_no: string;
  truck_no?: string;
  batch_no?: string;
  date: string;
  analyst: string;      // Analiz Yapan
  grade: Grade | string;

  // Physical & Chemical
  moisture: number;       // Nem (%)
  foreign_matter: number; // Yabancı Madde (%)
  caliber: number;        // Kalibre

  // Mechanical Defects
  halves_ratio: number;   // Şak (%)
  broken_ratio: number;   // Kırık (%)
  total_h_b: number;      // Şak + Kırık (%)
  tip_broken: number;     // Ucu Kırık (%)

  // Quality Defects
  skin_on: number;        // Zarlı (%)
  spotted: number;        // Lekeli (%)
  immature: number;       // Urlu (%)
  insect_bored: number;   // Böcek Yeniği (%)
  off_color: number;      // Farklı Renk (%)

  // Calibration Details
  small_caliber: number;  // Küçük Kalibre (%)
  large_caliber: number;  // Büyük Kalibre (%)

  note?: string;
}

export interface ExitAnalysis extends QualityAnalysis {
  lot: string;           // Lot
  department: string;    // Bölüm
  customer: string;      // Sevk Yeri / Müşteri

  // Additional Exit Specific
  damaged: number;       // Bozuk (%)
  dark_grain: number;    // Koyu Tane (%)
  polarization: number;  // Polarizasyon
  frying_time: string;   // Kızartma Süresi
  frying_temp: number;   // Kızartma Sıcaklığı
  salt_ratio: number;    // Tuz Oranı (%)
}

export interface Order {
  id: string;
  contract_no: string;
  supplier: string;
  grade: Grade;
  order_date: string; // dd.MM.yyyy
  eta?: string; // dd.MM.yyyy
  note: string;
  stage: Stage;
  packaging_type: PackagingType;
  is_archived?: boolean;

  // Financial and quantity tracking
  unit_price: number;       // $/lb
  shipment_month: string;   // e.g., "Haziran"
  fcl_count: number;        // Number of containers
  container_type: ContainerType;

  // New fields
  harvest_year?: string;    // Mahsul Yılı (e.g., "2024")
  fob_price?: number;       // FOB Fiyat ($/kg)
  cnf_price?: number;       // CNF Fiyat ($/kg)
  freight_price?: number;   // Navlun ($)

  // Calculated fields
  total_lb: number;
  total_kg: number;
  total_price: number;      // unit_price * total_lb

  // Document attachment
  contract_file?: {
    name: string;
    type: string;
    size: number;
  };

  // Extended fields for specific stages
  bl_no?: string;
  booking_no?: string;
  container_no?: string;
  etd?: string;
  loading_date?: string;
  vessel_name?: string;

  // Port stage fields
  payment_status?: PaymentStatus;
  port_note?: string;

  // Antrepo stage fields
  antrepo_entry_date?: string;
  antrepo_declaration_no?: string;
  agriculture_analysis_date?: string;
  is_agriculture_approved?: boolean;
  antrepo_exit_date?: string;
  antrepo_status?: AntrepoStatus;
  an_ref_no?: string;

  // Warehouse stage fields
  truck_no?: string;
  batch_no?: string;
}

export interface PriceRecord {
  id: string;
  date: string;
  grade: Grade;
  price: number;
  change: string;
  status: 'up' | 'down' | 'stable';
}

export interface FreightRecord {
  id: string;
  date: string;
  price: number;
  change: string;
  status: 'up' | 'down' | 'stable';
}

export interface BlendHistory {
  id: string;
  date: string;
  items: { id: string; contract_no: string; ratio: number; kg: number }[];
  total_kg: number;
  waste_percent: number;
  caliber: number;
  broken_total: number;
  note: string;
}
