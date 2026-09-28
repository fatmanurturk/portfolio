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

## Proje gorselleri

Admin panelinden proje gorseli yuklemek icin Supabase Dashboard icinde `Storage` > `New bucket` yoluyla `project-images` adinda bir bucket olusturun ve `Public bucket` secenegini etkinlestirin. Uygulama bu bucket icindeki gorselleri public URL ile kullanir.

## Blog

Blog yonetimi `/admin/blog`, public blog `/blog` adresindedir. `blog_posts` tablosunda `title`, `slug`, `content`, `cover_image_url`, `category`, `is_published`, `created_at` ve `updated_at` alanlari bulunmalidir. `is_published` boolean alani taslak/yayin durumunu belirler.

Kapak gorseli yuklemek icin Supabase Dashboard icinde `Storage` > `New bucket` yoluyla `blog-images` adinda public bir bucket olusturun. Public tarafta yalnizca `is_published = true` olan yazilar gosterilir.

Bucket daha once olusturulduysa public okuma policy'si de gereklidir:

```sql
create policy "Public can read blog images"
on storage.objects for select
using (bucket_id = 'blog-images');
```

## CV

PDF dosyasini `public/cv/Fatma-Nur-Turk-CV.pdf` yoluna koyun. Dosya yoksa uygulama acilmaya devam eder; buton tarayicinin PDF yolunu acmasini dener.

## Sosyal baglantilar

GitHub ve LinkedIn URL'lerini `src/data/profile.js` icindeki `github` ve `linkedin` alanlarindan degistirin.

## Deneyim

Gercek deneyimleri `src/data/experience.js` icine ekleyebilirsiniz. Dosya su an bilinmeyen bilgileri uydurmamak icin bos TODO durumundadir.
