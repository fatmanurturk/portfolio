# Fatma Nur Turk Portfolio

React + Vite ile hazirlanmis kisisel yazilim gelistirici portfolyosu.

## Kurulum

```bash
npm install
npm run dev
```

Uygulama varsayilan olarak `http://localhost:5173` adresinde acilir.

## Kisisel bilgileri degistirme

Profil adi, unvan, aciklama, e-posta, konum, GitHub, LinkedIn ve CV yolu `src/data/profile.js` dosyasinda tutulur. Bilinmeyen alanlar placeholder olarak birakilmistir.

## Yeni proje ekleme

Projeyi `src/data/projects.js` icindeki diziye ekleyin. Proje detayinda kullanilacak ozellikler ve teknolojiler ayni veri objesinde tanimlanir.

## CV

PDF dosyasini `public/cv/Fatma-Nur-Turk-CV.pdf` yoluna koyun. Dosya yoksa uygulama acilmaya devam eder; buton tarayicinin PDF yolunu acmasini dener.

## Sosyal baglantilar

GitHub ve LinkedIn URL'lerini `src/data/profile.js` icindeki `github` ve `linkedin` alanlarindan degistirin.

## Deneyim

Gercek deneyimleri `src/data/experience.js` icine ekleyebilirsiniz. Dosya su an bilinmeyen bilgileri uydurmamak icin bos TODO durumundadir.
