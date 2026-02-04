
import { Stage, Grade, Order, PackagingType, AntrepoStatus } from './types';

export const STAGES: Stage[] = ['Sipariş', 'Yüklendi', 'Yolda', 'Limanda', 'Antrepoda', 'Depoda'];
export const GRADES: Grade[] = ['WW320', 'WW240', 'WW180'];
export const PACKAGING_TYPES: PackagingType[] = ['Vakum', 'Teneke', 'Koli', 'Çuval'];
export const ANTREPO_STATUS_OPTIONS: AntrepoStatus[] = ['Hazır', 'Düşümlü Hazır', 'Kontrol', 'Analizde', 'İşlem Yapılmadı'];

export const INITIAL_ORDERS: Order[] = [
  {
    id: '1',
    contract_no: 'CONT-2024-001',
    supplier: 'Vietnam Cashew Ltd.',
    grade: 'WW320',
    packaging_type: 'Vakum',
    order_date: '01/05/2024',
    eta: '15/06/2024',
    note: 'Premium quality request.',
    stage: 'Sipariş',
    unit_price: 3.85,
    shipment_month: 'Mayıs',
    fcl_count: 1,
    container_type: "20'",
    total_kg: 16000,
    total_lb: 35274,
    total_price: 135804.9
  },
  {
    id: '2',
    contract_no: 'CONT-2024-002',
    supplier: 'India Nut Corp',
    grade: 'WW240',
    packaging_type: 'Teneke',
    order_date: '05/05/2024',
    eta: '20/06/2024',
    note: 'Standard delivery.',
    stage: 'Yolda',
    bl_no: 'MEDU123456',
    container_no: 'CNTR-8899',
    unit_price: 4.10,
    shipment_month: 'Haziran',
    fcl_count: 2,
    container_type: "40'",
    total_kg: 44000,
    total_lb: 97002,
    total_price: 397708.2
  },
  {
    id: '3',
    contract_no: 'CONT-2024-003',
    supplier: 'Africa Nut Trading',
    grade: 'WW180',
    packaging_type: 'Vakum',
    order_date: '10/04/2024',
    eta: '10/06/2024',
    note: 'Urgent stock needed.',
    stage: 'Depoda',
    bl_no: 'BL-992211',
    container_no: 'CNTR-7711',
    unit_price: 4.50,
    shipment_month: 'Nisan',
    fcl_count: 1,
    container_type: "20'",
    total_kg: 16000,
    total_lb: 35274,
    total_price: 158733
  }
];
