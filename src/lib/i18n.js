// ─── Tüm bileşenlerin paylaştığı UI metin çevirileri ─────────────────────────

export const ui = {
  tr: {
    hello: 'Merhaba, ben',
    heroTitle: 'Software Engineering Student',
    heroDescription:
      'Fırat Üniversitesi Yazılım Mühendisliği öğrencisiyim. C#, .NET ve veritabanı teknolojileriyle sürdürülebilir, kullanıcı odaklı yazılımlar geliştiriyor; her projede öğrenmeye ve değer üretmeye odaklanıyorum.',
    viewProjects: 'Projelerimi Gör',
    viewCv: "CV'yi Görüntüle",
    expertise: 'Öne Çıkan Uzmanlıklar',
    about: 'Hakkımda',
    aboutText:
      'Fırat Üniversitesi Yazılım Mühendisliği öğrencisiyim (2023–2027). Sürekli öğrenmeyi ve anlamlı değer üretmeyi çalışmalarımın merkezine koyuyorum.',
    aboutInternship:
      'Lila Cosmetics\u2019teki 40 iş günlük ERP stajımda C#, .NET Windows Forms, DevExpress ve SQL Server ile üretim süreçlerini yöneten masaüstü otomasyon sistemi üzerinde çalıştım.',
    teamwork: 'Ekip çalışması ve sorumluluk bilinci',
    database: 'Veritabanı tasarımı ve performans odaklı çözümler',
    userFocused: 'Kullanıcı odaklı, sürdürülebilir çözümler',
    skills: 'Yetenekler',
    projectsKicker: 'Üretim ve öğrenme',
    projects: 'Projeler',
    projectsDescription: 'CV\u2019mde yer alan seçili yazılım ve ürün çalışmalarım.',
    details: 'Proje detaylarını gör',
    career: 'Kariyer yolculuğu',
    experience: 'Deneyim Zaman Çizelgesi',
    experienceDescription: 'Profesyonel gelişimim ve üzerinde çalıştığım alanlar.',
    learning: 'Öğrenmeye devam',
    certificates: 'Sertifikalar',
    blog: 'Blog',
    contactKicker: 'Bir fikriniz mi var?',
    contact: 'Birlikte Çalışalım',
    contactDescription:
      'Yeni projelerde yer almak ve değer yaratmak için iletişime geçmekten çekinmeyin.',
    email: 'E-posta',
    location: 'Konum',
    back: '← Portfolyoya dön',
    detail: 'Proje detayı',
    features: 'Temel özellikler',
    technologies: 'Kullanılan teknolojiler',
    github: "GitHub'da Gör",
    sendMessage: 'İletişime Geç',
    footer: 'Özenle tasarlandı ve geliştirildi.',
    languageLabel: 'English diline geç',
  },
  en: {
    hello: 'Hello, I am',
    heroTitle: 'Software Engineering Student',
    heroDescription:
      'I am a Software Engineering student at Firat University. I build sustainable, user-focused software with C#, .NET, and database technologies, always centered on learning and creating meaningful value.',
    viewProjects: 'View My Projects',
    viewCv: 'View CV',
    expertise: 'Featured Expertise',
    about: 'About Me',
    aboutText:
      'I am a Software Engineering student at Firat University (2023–2027). I place continuous learning and meaningful value creation at the center of my work.',
    aboutInternship:
      'During my 40-business-day ERP internship at Lila Cosmetics, I worked on a desktop automation system for manufacturing operations using C#, .NET Windows Forms, DevExpress, and SQL Server.',
    teamwork: 'Teamwork and ownership',
    database: 'Database design and performance-focused solutions',
    userFocused: 'User-focused, sustainable solutions',
    skills: 'Skills',
    projectsKicker: 'Building and learning',
    projects: 'Projects',
    projectsDescription: 'Selected software and product work from my CV.',
    details: 'View project details',
    career: 'Career journey',
    experience: 'Experience Timeline',
    experienceDescription: 'My professional growth and the areas I have worked in.',
    learning: 'Always learning',
    certificates: 'Certificates',
    blog: 'Blog',
    contactKicker: 'Have an idea?',
    contact: "Let's Work Together",
    contactDescription:
      'Feel free to reach out for new projects and opportunities to create value together.',
    email: 'Email',
    location: 'Location',
    back: '← Back to portfolio',
    detail: 'Project details',
    features: 'Key features',
    technologies: 'Technologies used',
    github: 'View on GitHub',
    sendMessage: 'Get in touch',
    footer: 'Designed and built with care.',
    languageLabel: 'Türkçe diline geç',
  },
};

// ─── Nav items ────────────────────────────────────────────────────────────────
export const navItems = [
  ['home', 'Ana Sayfa', 'Home'],
  ['about', 'Hakkımda', 'About'],
  ['skills', 'Yetenekler', 'Skills'],
  ['projects', 'Projeler', 'Projects'],
  ['experience', 'Deneyim', 'Experience'],
  ['certificates', 'Sertifikalar', 'Certificates'],
  ['blog', 'Blog', 'Blog'],
  ['contact', 'İletişim', 'Contact'],
];

// ─── Statik proje çevirileri (Supabase'de title_en / description_en yoksa fallback) ──
export const translatedProjects = {
  'uretim-yonetim-sistemi': {
    en: {
      title: 'Manufacturing Production Management System',
      description:
        'A desktop management system for end-to-end manufacturing operations, including inventory, production, recipes, procurement, quality control, warehouse, and user authorization.',
      features: [
        'User and authorization management',
        'Inventory management',
        'Recipe management',
        'Production orders',
        'Production tracking',
        'Procurement',
        'Material acceptance',
        'Quality control',
        'Visual quality control',
        'Warehouse and finished goods management',
        'Reporting',
      ],
    },
  },
  'human-resources-management-system': {
    en: {
      title: 'Human Resources Management System (HRMS)',
      description:
        'A web-based system that digitizes employee management, leave tracking, payroll, and performance evaluation processes.',
      features: [
        'Employee management',
        'Leave tracking',
        'Payroll processes',
        'Performance evaluation',
      ],
    },
  },
  'used-books-sales-platform': {
    en: {
      title: 'Used Books Sales Platform',
      description:
        'A web application that enables users to buy and sell second-hand books, with smart recommendations and dynamic product management modules.',
      features: [
        'Book listings',
        'Dynamic product management',
        'Smart recommendation system',
      ],
    },
  },
  'zirve-nature-sports-platform': {
    en: {
      title: 'Zirve Nature Sports Volunteering Platform',
      description:
        'A full-stack platform connecting volunteers with organizations through event applications, club profiles, and a badge system.',
      features: [
        'Event discovery',
        'Volunteer applications',
        'Club profiles',
        'Badges and gamification',
      ],
    },
  },
};

/**
 * Projenin dile göre başlık/açıklama/özelliklerini döndürür.
 * Önce projenin kendi title_en/description_en alanlarına bakar (Admin'den eklenen projeler),
 * sonra statik translatedProjects tablosuna bakar, son çare olarak Türkçe içeriği kullanır.
 */
export function getProjectText(project, language) {
  if (language === 'en') {
    // 1. Admin'den girilen İngilizce alanlar (Supabase)
    if (project.title_en || project.description_en) {
      return {
        title: project.title_en || project.shortTitle || project.title,
        description: project.description_en || project.description || '',
        features: project.features_en || project.features || [],
      };
    }
    // 2. Statik çeviri tablosu (slug'a göre)
    const translationKey = project.slug || project.id;
    if (translatedProjects[translationKey]) {
      return translatedProjects[translationKey].en;
    }
  }
  // 3. Türkçe fallback
  return {
    title: project.shortTitle || project.title,
    description: project.description || project.short_description || '',
    features: project.features || [],
  };
}

// ─── Scroll utility ───────────────────────────────────────────────────────────
export function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}
