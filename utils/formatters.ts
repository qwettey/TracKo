
export const formatNumberTR = (num: number): string => {
  return new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

export const formatNumberWithThousands = (num: number | string): string => {
  const numValue = typeof num === 'string' ? parseFloat(num.replace(',', '.')) : num;
  if (isNaN(numValue)) return '';
  return new Intl.NumberFormat('tr-TR').format(numValue);
};

export const parseDateTR = (dateStr: string): Date => {
  if (!dateStr) return new Date(0);
  // Hem nokta hem eğik çizgi desteği
  const [day, month, year] = dateStr.split(/[./]/).map(Number);
  if (!day || !month || !year) return new Date(0);
  return new Date(year, month - 1, day);
};

export const isWithinNext10Days = (dateStr: string): boolean => {
  const date = parseDateTR(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const next10Days = new Date();
  next10Days.setDate(today.getDate() + 10);
  next10Days.setHours(23, 59, 59, 999);
  
  return date >= today && date <= next10Days;
};

/**
 * Kullanıcı yazdıkça tarih formatlar.
 * Örn: "131122" -> "13.11.2022"
 */
export const autoFormatDate = (value: string): string => {
  // Sadece rakamları al
  let v = value.replace(/\D/g, '').slice(0, 8);

  // Eğer tam 6 hane girildiyse (GGAAyy), otomatik olarak yüzyılı ekle (20xx)
  if (v.length === 6 && !value.includes('.')) {
    const day = v.slice(0, 2);
    const month = v.slice(2, 4);
    const yearShort = v.slice(4, 6);
    v = `${day}${month}20${yearShort}`;
  }

  let formatted = '';
  if (v.length > 0) {
    formatted += v.slice(0, 2);
  }
  if (v.length > 2) {
    formatted += '.' + v.slice(2, 4);
  }
  if (v.length > 4) {
    formatted += '.' + v.slice(4, 8);
  }

  return formatted;
};
