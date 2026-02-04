import * as XLSX from 'xlsx';
import { Order, QualityAnalysis, Grade, Stage, PackagingType, ContainerType } from '../types';

// Excel serial number'ı tarihe çevir
const excelDateToTR = (serial: number | string | undefined): string => {
    if (!serial) return '';
    if (typeof serial === 'string') return serial; // Zaten string ise dön

    // Excel epoch: 1 Ocak 1900
    const date = new Date((serial - 25569) * 86400 * 1000);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
};

// Grade normalize et
const normalizeGrade = (value: string | undefined): Grade => {
    if (!value) return 'WW320';
    const v = value.toString().toUpperCase().trim();
    if (v.includes('320') || v === 'WW320') return 'WW320';
    if (v.includes('240') || v === 'WW240') return 'WW240';
    if (v.includes('180') || v === 'WW180') return 'WW180';
    return 'WW320';
};

// Packaging normalize et
const normalizePackaging = (value: string | undefined): PackagingType => {
    if (!value) return 'Vakum';
    const v = value.toString().toLowerCase().trim();
    if (v.includes('vakum') || v.includes('vacuum')) return 'Vakum';
    if (v.includes('teneke') || v.includes('tin')) return 'Teneke';
    if (v.includes('koli') || v.includes('carton')) return 'Koli';
    if (v.includes('çuval') || v.includes('bag')) return 'Çuval';
    return 'Vakum';
};

// Container type normalize et
const normalizeContainerType = (value: string | number | undefined): ContainerType => {
    if (!value) return "40'";
    const v = value.toString();
    if (v.includes('20')) return "20'";
    return "40'";
};

// Sayı değeri al
const getNumber = (value: any): number => {
    if (value === undefined || value === null || value === '') return 0;
    const num = typeof value === 'number' ? value : parseFloat(String(value).replace(',', '.'));
    return isNaN(num) ? 0 : num;
};

// String değeri al
const getString = (value: any): string => {
    if (value === undefined || value === null) return '';
    return String(value).trim();
};

// SATIN ALMA sayfası sütun eşleştirmesi
const SATIN_ALMA_MAPPING: Record<string, keyof Order | null> = {
    'Sipariş Tarihi': 'order_date',
    'Contract': 'contract_no',
    'Seller': 'supplier',
    'Product': 'grade',
    'Crop': 'harvest_year',
    'Packaging': 'packaging_type',
    'FOB\r\nPrice': 'fob_price',
    'FOB Price': 'fob_price',
    'CNF\r\nPRICE': 'cnf_price',
    'CNF PRICE': 'cnf_price',
    'Freight': 'freight_price',
    'Quantity\r\nLB': 'total_lb',
    'Quantity LB': 'total_lb',
    'Quantity\r\nKG': 'total_kg',
    'Quantity KG': 'total_kg',
    'TYPE': 'container_type',
    'FCL': 'fcl_count',
    'Konteyner No': 'container_no',
    'Antrepo Bey. No': 'antrepo_declaration_no',
    'B/L No': 'bl_no',
    'Booking No': 'booking_no',
    'Ref. No.': 'an_ref_no',
    'Tır No.': 'truck_no',
    'ETD': 'etd',
    'ETA': 'eta',
    // Aktarılmayacaklar
    'REF': null,
    'Stok Kodu': null,
    'Stok Adı': null,
    'Shipper': null,
    'Transit': null,
    'Manuel Seçilecek': null,
    'Freight\r\nPer LB': null,
};

// GİRİŞ ANALİZİ sayfası sütun eşleştirmesi
const GIRIS_ANALIZI_MAPPING: Record<string, keyof QualityAnalysis | null> = {
    'Sınıf': 'grade',
    'Kontrat No.': 'contract_no',
    'Konteyner No': 'container_no',
    'Tır No': 'truck_no',
    'Parti No': 'batch_no',
    'Analiz Tarihi': 'date',
    'Analiz Yapan': 'analyst',
    'Nem': 'moisture',
    'Yabancı Madde': 'foreign_matter',
    'Kalibre': 'caliber',
    'Şak': 'halves_ratio',
    'Kırık': 'broken_ratio',
    'Şak-Kırık': 'total_h_b',
    'Zarlı': 'skin_on',
    'Lekeli': 'spotted',
    'Urlu': 'immature',
    'Ucu Kırık': 'tip_broken',
    'Böcek Yenikli': 'insect_bored',
    'Farklı Renk': 'off_color',
    'Küçük Kal.': 'small_caliber',
    'Büyük Kal.': 'large_caliber',
    // Aktarılmayacak
    'Satın Alma Bağlantısı': null,
};

export interface ImportResult {
    orders: Omit<Order, 'id'>[];
    analyses: Omit<QualityAnalysis, 'id'>[];
    errors: string[];
}

export const parseExcelFile = async (file: File): Promise<ImportResult> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });

                const result: ImportResult = {
                    orders: [],
                    analyses: [],
                    errors: []
                };

                // SATIN ALMA sayfasını işle
                if (workbook.SheetNames.includes('SATIN ALMA')) {
                    const sheet = workbook.Sheets['SATIN ALMA'];
                    const jsonData = XLSX.utils.sheet_to_json(sheet) as Record<string, any>[];

                    jsonData.forEach((row, index) => {
                        try {
                            const order: Partial<Order> = {
                                stage: 'Depoda' as Stage, // Tüm kayıtlar Depoda aşamasında
                                note: '',
                            };

                            // Her sütunu eşleştir
                            Object.keys(row).forEach(excelCol => {
                                const mappedField = SATIN_ALMA_MAPPING[excelCol];
                                if (mappedField === null) return; // Aktarılmayacak

                                const value = row[excelCol];

                                switch (mappedField) {
                                    case 'order_date':
                                    case 'etd':
                                    case 'eta':
                                        (order as any)[mappedField] = excelDateToTR(value);
                                        break;
                                    case 'grade':
                                        order.grade = normalizeGrade(value);
                                        break;
                                    case 'packaging_type':
                                        order.packaging_type = normalizePackaging(value);
                                        break;
                                    case 'container_type':
                                        order.container_type = normalizeContainerType(value);
                                        break;
                                    case 'fob_price':
                                    case 'cnf_price':
                                    case 'freight_price':
                                    case 'total_lb':
                                    case 'total_kg':
                                    case 'fcl_count':
                                        (order as any)[mappedField] = getNumber(value);
                                        break;
                                    case 'harvest_year':
                                        order.harvest_year = String(value);
                                        break;
                                    default:
                                        if (mappedField) {
                                            (order as any)[mappedField] = getString(value);
                                        }
                                }
                            });

                            // unit_price hesapla (FOB veya CNF)
                            order.unit_price = order.fob_price || order.cnf_price || 0;

                            // total_price hesapla
                            order.total_price = (order.unit_price || 0) * (order.total_lb || 0);

                            // Varsayılan değerler
                            if (!order.fcl_count) order.fcl_count = 1;
                            if (!order.total_kg && order.total_lb) {
                                order.total_kg = Math.round(order.total_lb / 2.20462);
                            }
                            if (!order.total_lb && order.total_kg) {
                                order.total_lb = Math.round(order.total_kg * 2.20462);
                            }

                            // Geçerli sipariş kontrolü (en azından contract_no olmalı)
                            if (order.contract_no) {
                                result.orders.push(order as Omit<Order, 'id'>);
                            }
                        } catch (err) {
                            result.errors.push(`SATIN ALMA satır ${index + 2}: ${err}`);
                        }
                    });
                }

                // GİRİŞ ANALİZİ sayfasını işle
                if (workbook.SheetNames.includes('GİRİŞ ANALİZİ')) {
                    const sheet = workbook.Sheets['GİRİŞ ANALİZİ'];
                    const jsonData = XLSX.utils.sheet_to_json(sheet) as Record<string, any>[];

                    jsonData.forEach((row, index) => {
                        try {
                            const analysis: Partial<QualityAnalysis> = {};

                            Object.keys(row).forEach(excelCol => {
                                const mappedField = GIRIS_ANALIZI_MAPPING[excelCol];
                                if (mappedField === null) return;

                                const value = row[excelCol];

                                switch (mappedField) {
                                    case 'date':
                                        analysis.date = excelDateToTR(value);
                                        break;
                                    case 'grade':
                                        analysis.grade = normalizeGrade(value);
                                        break;
                                    case 'moisture':
                                    case 'foreign_matter':
                                    case 'caliber':
                                    case 'halves_ratio':
                                    case 'broken_ratio':
                                    case 'total_h_b':
                                    case 'skin_on':
                                    case 'spotted':
                                    case 'immature':
                                    case 'tip_broken':
                                    case 'insect_bored':
                                    case 'off_color':
                                    case 'small_caliber':
                                    case 'large_caliber':
                                        (analysis as any)[mappedField] = getNumber(value);
                                        break;
                                    default:
                                        if (mappedField) {
                                            (analysis as any)[mappedField] = getString(value);
                                        }
                                }
                            });

                            // total_h_b hesapla (eğer yoksa)
                            if (!analysis.total_h_b) {
                                analysis.total_h_b = (analysis.halves_ratio || 0) + (analysis.broken_ratio || 0);
                            }

                            // Geçerli analiz kontrolü
                            if (analysis.contract_no || analysis.container_no) {
                                result.analyses.push(analysis as Omit<QualityAnalysis, 'id'>);
                            }
                        } catch (err) {
                            result.errors.push(`GİRİŞ ANALİZİ satır ${index + 2}: ${err}`);
                        }
                    });
                }

                resolve(result);
            } catch (err) {
                reject(err);
            }
        };

        reader.onerror = () => reject(new Error('Dosya okunamadı'));
        reader.readAsArrayBuffer(file);
    });
};

export const getSheetNames = async (file: File): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                resolve(workbook.SheetNames);
            } catch (err) {
                reject(err);
            }
        };

        reader.onerror = () => reject(new Error('Dosya okunamadı'));
        reader.readAsArrayBuffer(file);
    });
};
