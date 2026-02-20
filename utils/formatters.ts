/**
 * Türkçe tarih formatını (dd.MM.yyyy) Date nesnesine çevirir.
 */
export function parseDateTR(dateStr: string): Date {
    if (!dateStr) return new Date(0);
    const parts = dateStr.split('.');
    if (parts.length === 3) {
        const [day, month, year] = parts;
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    return new Date(dateStr);
}

/**
 * Verilen Türkçe tarih string'inin bugünden itibaren 10 gün içinde olup olmadığını kontrol eder.
 */
export function isWithinNext10Days(dateStr: string): boolean {
    if (!dateStr) return false;
    const date = parseDateTR(dateStr);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const tenDaysLater = new Date(now);
    tenDaysLater.setDate(now.getDate() + 10);
    return date >= now && date <= tenDaysLater;
}

/**
 * Sayıyı Türkçe formatında biçimlendirir (virgül ondalık ayracı).
 */
export function formatNumberTR(value: number, decimals = 2): string {
    return value.toFixed(decimals).replace('.', ',');
}

/**
 * Sayıyı binlik ayraçlı Türkçe formatında biçimlendirir.
 * Örnek: 1234567.89 → "1.234.567,89"
 */
export function formatNumberWithThousands(value: number, decimals = 2): string {
    return value.toLocaleString('tr-TR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
}

/**
 * Kullanıcı tarih girişini otomatik formatlayan yardımcı fonksiyon.
 * Sayısal girildiğinde nokta ekler (gg.aa.yyyy formatına iter).
 */
export function autoFormatDate(value: string): string {
    // Sadece rakam ve nokta
    const digits = value.replace(/[^\d]/g, '');
    let formatted = '';
    for (let i = 0; i < digits.length && i < 8; i++) {
        if (i === 2 || i === 4) formatted += '.';
        formatted += digits[i];
    }
    return formatted;
}
