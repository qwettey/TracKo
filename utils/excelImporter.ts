import * as XLSX from 'xlsx';
import { Order, QualityAnalysis, Stage, Grade, PackagingType, ContainerType, AntrepoStatus } from '../types';

type ImportResult = {
    orders: Omit<Order, 'id'>[];
    analyses: Omit<QualityAnalysis, 'id'>[];
    errors: string[];
};

/**
 * Türkçe tarih formatını (dd.MM.yyyy veya dd/MM/yyyy) normalize eder.
 */
function normalizeDate(val: unknown): string {
    if (!val) return '';
    if (typeof val === 'number') {
        // Excel serial date
        const date = XLSX.SSF.parse_date_code(val);
        if (date) {
            const d = String(date.d).padStart(2, '0');
            const m = String(date.m).padStart(2, '0');
            return `${d}.${m}.${date.y}`;
        }
    }
    const s = String(val).trim();
    // dd/MM/yyyy → dd.MM.yyyy
    return s.replace(/\//g, '.');
}

function normalizeStage(val: unknown): Stage {
    const s = String(val || '').trim();
    const valid: Stage[] = ['Sipariş', 'Yüklendi', 'Yolda', 'Limanda', 'Antrepoda', 'Depoda'];
    return valid.includes(s as Stage) ? (s as Stage) : 'Depoda';
}

function normalizeGrade(val: unknown): Grade {
    const s = String(val || '').trim().toUpperCase();
    if (s === 'WW320' || s === 'WW240' || s === 'WW180') return s as Grade;
    return 'WW320';
}

function normalizePackaging(val: unknown): PackagingType {
    const s = String(val || '').trim();
    const valid: PackagingType[] = ['Vakum', 'Teneke', 'Koli', 'Çuval'];
    return valid.includes(s as PackagingType) ? (s as PackagingType) : 'Vakum';
}

function normalizeContainer(val: unknown): ContainerType {
    const s = String(val || '').trim();
    if (s === "20'" || s === "40'") return s as ContainerType;
    return "40'";
}

function parseNum(val: unknown): number {
    const n = parseFloat(String(val || '0').replace(',', '.'));
    return isNaN(n) ? 0 : n;
}

function parsePurchaseSheet(ws: XLSX.WorkSheet): { orders: Omit<Order, 'id'>[]; errors: string[] } {
    const orders: Omit<Order, 'id'>[] = [];
    const errors: string[] = [];
    const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(ws, { defval: '' });

    rows.forEach((row, i) => {
        try {
            const contract_no = String(row['Kontrat No'] || row['contract_no'] || '').trim();
            if (!contract_no) return; // Boş satır atla

            const total_kg = parseNum(row['Miktar (KG)'] || row['total_kg'] || row['KG'] || 0);
            const total_lb = parseNum(row['Miktar (LB)'] || row['total_lb'] || row['LB'] || (total_kg * 2.20462));
            const fob_price = parseNum(row['FOB Fiyat'] || row['fob_price'] || row['Fiyat'] || 0);
            const freight_price = parseNum(row['Navlun'] || row['freight_price'] || 0);
            const fcl_count = parseNum(row['FCL'] || row['fcl_count'] || 1);

            orders.push({
                contract_no,
                supplier: String(row['Shipper'] || row['Tedarikçi'] || row['supplier'] || '').trim(),
                grade: normalizeGrade(row['Grade'] || row['grade']),
                packaging_type: normalizePackaging(row['Paketleme'] || row['packaging_type']),
                order_date: normalizeDate(row['Sipariş Tarihi'] || row['order_date']),
                eta: normalizeDate(row['ETA'] || row['eta']),
                etd: normalizeDate(row['ETD'] || row['etd']),
                note: String(row['Not'] || row['note'] || '').trim(),
                stage: normalizeStage(row['Aşama'] || row['stage']),
                unit_price: fob_price,
                fob_price,
                freight_price,
                cnf_price: parseNum(row['CNF'] || row['cnf_price'] || 0),
                shipment_month: String(row['Sevkiyat Ayı'] || row['shipment_month'] || '').trim(),
                fcl_count,
                container_type: normalizeContainer(row['Konteyner Tipi'] || row['container_type']),
                harvest_year: String(row['Mahsul Yılı'] || row['harvest_year'] || '').trim(),
                total_kg,
                total_lb,
                total_price: fob_price * total_lb,
                bl_no: String(row['BL No'] || row['bl_no'] || '').trim() || undefined,
                container_no: String(row['Konteyner No'] || row['container_no'] || '').trim() || undefined,
                vessel_name: String(row['Gemi'] || row['vessel_name'] || '').trim() || undefined,
                booking_no: String(row['Booking No'] || row['booking_no'] || '').trim() || undefined,
                truck_no: String(row['Tır No'] || row['truck_no'] || '').trim() || undefined,
                batch_no: String(row['Parti No'] || row['batch_no'] || '').trim() || undefined,
                antrepo_status: (String(row['Antrepo Durumu'] || '').trim() as AntrepoStatus) || undefined,
                antrepo_declaration_no: String(row['Beyanname No'] || '').trim() || undefined,
                payment_status: String(row['Ödeme'] || '').trim() as any || undefined,
                an_ref_no: String(row['AN Ref No'] || '').trim() || undefined,
                is_archived: String(row['Arşiv'] || '').trim().toLowerCase() === 'evet',
            });
        } catch (err) {
            errors.push(`Satır ${i + 2}: ${err}`);
        }
    });

    return { orders, errors };
}

function parseAnalysisSheet(ws: XLSX.WorkSheet): { analyses: Omit<QualityAnalysis, 'id'>[]; errors: string[] } {
    const analyses: Omit<QualityAnalysis, 'id'>[] = [];
    const errors: string[] = [];
    const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(ws, { defval: 0 });

    rows.forEach((row, i) => {
        try {
            const contract_no = String(row['Kontrat No'] || row['contract_no'] || '').trim();
            const container_no = String(row['Konteyner No'] || row['container_no'] || '').trim();
            if (!contract_no && !container_no) return;

            analyses.push({
                contract_no,
                container_no,
                truck_no: String(row['Tır No'] || '').trim(),
                batch_no: String(row['Parti No'] || '').trim(),
                date: normalizeDate(row['Tarih'] || row['date']),
                analyst: String(row['Analist'] || row['analyst'] || '').trim(),
                grade: String(row['Grade'] || row['grade'] || '').trim(),
                moisture: parseNum(row['Nem']),
                foreign_matter: parseNum(row['Yabancı Madde']),
                caliber: parseNum(row['Kalibre']),
                halves_ratio: parseNum(row['Şak']),
                broken_ratio: parseNum(row['Kırık']),
                total_h_b: parseNum(row['Şak+Kırık'] || row['total_h_b'] || 0),
                tip_broken: parseNum(row['Ucu Kırık']),
                skin_on: parseNum(row['Zarlı']),
                spotted: parseNum(row['Lekeli']),
                immature: parseNum(row['Urlu']),
                insect_bored: parseNum(row['Böcek Yeniği']),
                off_color: parseNum(row['Farklı Renk']),
                small_caliber: parseNum(row['Küçük Kalibre']),
                large_caliber: parseNum(row['Büyük Kalibre']),
                note: String(row['Not'] || '').trim(),
            });
        } catch (err) {
            errors.push(`Analiz satır ${i + 2}: ${err}`);
        }
    });

    return { analyses, errors };
}

/**
 * Excel dosyasını okuyup siparişleri ve analizleri parse eder.
 * Desteklenen sayfalar: "SATIN ALMA", "GİRİŞ ANALİZİ"
 */
export async function parseExcelFile(file: File): Promise<ImportResult> {
    const buffer = await file.arrayBuffer();
    const wb = XLSX.read(buffer, { type: 'array', cellDates: false });

    const result: ImportResult = { orders: [], analyses: [], errors: [] };

    // Sipariş sayfaları
    const purchaseSheetNames = ['SATIN ALMA', 'Satın Alma', 'SİPARİŞLER', 'orders'];
    for (const name of purchaseSheetNames) {
        if (wb.SheetNames.includes(name)) {
            const { orders, errors } = parsePurchaseSheet(wb.Sheets[name]);
            result.orders.push(...orders);
            result.errors.push(...errors);
        }
    }

    // Analiz sayfaları
    const analysisSheetNames = ['GİRİŞ ANALİZİ', 'Giriş Analizi', 'ANALİZ', 'analyses'];
    for (const name of analysisSheetNames) {
        if (wb.SheetNames.includes(name)) {
            const { analyses, errors } = parseAnalysisSheet(wb.Sheets[name]);
            result.analyses.push(...analyses);
            result.errors.push(...errors);
        }
    }

    // Eğer hiç bilinen sayfa bulunamadıysa, ilk sayfayı deneyebiliriz
    if (result.orders.length === 0 && result.analyses.length === 0 && wb.SheetNames.length > 0) {
        const { orders, errors } = parsePurchaseSheet(wb.Sheets[wb.SheetNames[0]]);
        result.orders.push(...orders);
        result.errors.push(...errors, `Bilinen sayfa adı bulunamadı, "${wb.SheetNames[0]}" sayfası kullanıldı.`);
    }

    return result;
}
