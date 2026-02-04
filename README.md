<div align="center">

# 🥜 TracKo

### Kaju Tedarik Zinciri Yönetim Sistemi

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

---

*Siparişten depoya kadar tüm tedarik sürecinizi tek platformda yönetin*

</div>

---

## ✨ Özellikler

| Modül | Açıklama |
|-------|----------|
| 📦 **Sipariş Takibi** | Sipariş, yükleme, nakliye, liman, antrepo ve depo aşamalarını takip edin |
| 🔬 **Kalite Analizi** | Giriş ve çıkış kalite analizlerini kaydedin ve izleyin |
| 📊 **Fiyat Takibi** | WW320, WW240, WW180 kalibre fiyatlarını günlük takip edin |
| 🚢 **Navlun Takibi** | Nakliye maliyetlerini ve değişimlerini izleyin |
| ⚖️ **Harman (Blending)** | Farklı lotları harmanlayın ve kalite değerlerini hesaplayın |
| 📈 **Üretim İstatistikleri** | Detaylı üretim raporları ve analizler |

---

## 🚀 Kurulum

### Gereksinimler

- **Node.js** v18 veya üzeri
- **npm** veya **yarn**

### Hızlı Başlangıç

```bash
# 1. Repoyu klonlayın
git clone https://github.com/qwettey/TracKo.git

# 2. Proje klasörüne girin
cd TracKo

# 3. Bağımlılıkları yükleyin
npm install

# 4. Uygulamayı başlatın
npm run dev
```

Uygulama varsayılan olarak `http://localhost:5173` adresinde çalışacaktır.

---

## 📁 Proje Yapısı

```
TracKo/
├── 📄 App.tsx              # Ana uygulama bileşeni
├── 📄 types.ts             # TypeScript tip tanımlamaları
├── 📄 constants.ts         # Sabit değerler
├── 📂 components/          # Yeniden kullanılabilir bileşenler
├── 📂 pages/               # Sayfa bileşenleri
│   ├── Blending.tsx        # Harman modülü
│   ├── EntryAnalysis.tsx   # Giriş analizi
│   ├── ExitAnalysis.tsx    # Çıkış analizi
│   ├── FreightTracking.tsx # Navlun takibi
│   ├── PriceTracking.tsx   # Fiyat takibi
│   └── ...
└── 📂 utils/               # Yardımcı fonksiyonlar
```

---

## 🛠️ Komutlar

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Geliştirme sunucusunu başlatır |
| `npm run build` | Üretim için derler |
| `npm run preview` | Derlenen uygulamayı önizler |

---

## 📋 Takip Edilen Aşamalar

```
📝 Sipariş → 📦 Yüklendi → 🚢 Yolda → ⚓ Limanda → 🏭 Antrepoda → 🏠 Depoda
```

Her aşamada detaylı bilgi girişi yapabilirsiniz:
- **Sipariş**: Sözleşme, tedarikçi, miktar, fiyat bilgileri
- **Yükleme**: B/L no, konteyner no, ETD
- **Nakliye**: Gemi adı, ETA takibi
- **Liman**: Ödeme durumu, demuraj takibi
- **Antrepo**: Tarım analizi, gümrük işlemleri
- **Depo**: Kamyon bilgisi, lot numarası

---

## 🎨 Kalite Parametreleri

Sistem aşağıdaki kalite parametrelerini takip eder:

- **Fiziksel**: Nem, Yabancı Madde, Kalibre
- **Mekanik Kusurlar**: Şak, Kırık, Ucu Kırık
- **Kalite Kusurları**: Zarlı, Lekeli, Urlu, Böcek Yeniği, Farklı Renk
- **Kalibrasyon**: Küçük/Büyük Kalibre Oranları

---

## 📄 Lisans

Bu proje özel kullanım içindir.

---

<div align="center">

**TracKo** ile tedarik zincirinizi kontrol altına alın 🎯

</div>
