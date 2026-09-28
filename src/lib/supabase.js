import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabasePublishableKey &&
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

if (!isSupabaseConfigured) {
  console.warn(
    '[Supabase Uyarısı] VITE_SUPABASE_URL veya VITE_SUPABASE_PUBLISHABLE_KEY ortam değişkenleri eksik ya da tanımlanmamış.\n' +
    'Uygulama çökmeden statik verilerle çalışmaya devam ediyor.\n' +
    'Veritabanı ve admin paneli özellikleri için kök dizindeki .env.example dosyasını .env olarak kopyalayıp anahtarlarınızı girin.'
  );
}

// Ortam değişkenleri tanımlı olmadığında uygulamanın beyaz ekran verip çökmesini önlemek için
// geçerli bir URL şablonuyla güvenli fallback istemcisi oluşturulur.
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder-project.supabase.co',
  isSupabaseConfigured ? supabasePublishableKey : 'placeholder-anon-key'
);