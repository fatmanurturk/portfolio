import { useEffect, useState } from 'react';
import { ArrowUpRight, Code2, Menu, X } from 'lucide-react';

import { supabase } from './lib/supabase';

import { profile } from './data/profile';
import { projects as staticProjects } from './data/projects';
import { experience } from './data/experience';


/* =========================================================
   GITHUB ICON
========================================================= */

function GitHubIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.419 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.014-1.699-2.782.604-3.369-1.341-3.369-1.341-.455-1.156-1.11-1.464-1.11-1.464-.908-.621.069-.608.069-.608 1.004.071 1.532 1.031 1.532 1.031.892 1.529 2.341 1.087 2.91.831.091-.646.349-1.087.635-1.337-2.221-.253-4.555-1.111-4.555-4.944 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.748-1.025 2.748-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.337 4.687-4.565 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10Z" />
    </svg>
  );
}


/* =========================================================
   LINKEDIN ICON
========================================================= */

function LinkedInIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M6.5 8.5H3.5V21H6.5V8.5ZM5 3C4.03 3 3.25 3.78 3.25 4.75S4.03 6.5 5 6.5s1.75-.78 1.75-1.75S5.97 3 5 3ZM20.75 13.75c0-3.77-2.01-5.52-4.69-5.52-2.16 0-3.13 1.19-3.67 2.02V8.5h-3V21h3v-6.19c0-1.63.31-3.21 2.33-3.21 1.99 0 2.01 1.86 2.01 3.32V21h3.02v-7.25Z" />
    </svg>
  );
}


/* =========================================================
   NAVIGATION
========================================================= */

const navItems = [
  ['home', 'Ana Sayfa', 'Home'],
  ['about', 'Hakkımda', 'About'],
  ['skills', 'Yetenekler', 'Skills'],
  ['projects', 'Projeler', 'Projects'],
  ['experience', 'Deneyim', 'Experience'],
  ['certificates', 'Sertifikalar', 'Certificates'],
  ['contact', 'İletişim', 'Contact'],
];

const ui = {
  tr: {
    hello: 'Merhaba, ben',
    heroTitle: 'Software Engineering Student',
    heroDescription: 'Fırat Üniversitesi Yazılım Mühendisliği öğrencisiyim. C#, .NET ve veritabanı teknolojileriyle sürdürülebilir, kullanıcı odaklı yazılımlar geliştiriyor; her projede öğrenmeye ve değer üretmeye odaklanıyorum.',
    viewProjects: 'Projelerimi Gör',
    viewCv: "CV'yi Görüntüle",
    expertise: 'Öne Çıkan Uzmanlıklar',
    about: 'Hakkımda',
    aboutText: 'Fırat Üniversitesi Yazılım Mühendisliği öğrencisiyim (2023–2027). Sürekli öğrenmeyi ve anlamlı değer üretmeyi çalışmalarımın merkezine koyuyorum.',
    aboutInternship: 'Lila Cosmetics’teki 40 iş günlük ERP stajımda C#, .NET Windows Forms, DevExpress ve SQL Server ile üretim süreçlerini yöneten masaüstü otomasyon sistemi üzerinde çalıştım.',
    teamwork: 'Ekip çalışması ve sorumluluk bilinci',
    database: 'Veritabanı tasarımı ve performans odaklı çözümler',
    userFocused: 'Kullanıcı odaklı, sürdürülebilir çözümler',
    skills: 'Yetenekler',
    projectsKicker: 'Üretim ve öğrenme',
    projects: 'Projeler',
    projectsDescription: 'CV’mde yer alan seçili yazılım ve ürün çalışmalarım.',
    details: 'Proje detaylarını gör',
    career: 'Kariyer yolculuğu',
    experience: 'Deneyim Zaman Çizelgesi',
    experienceDescription: 'Profesyonel gelişimim ve üzerinde çalıştığım alanlar.',
    learning: 'Öğrenmeye devam',
    certificates: 'Sertifikalar',
    contactKicker: 'Bir fikriniz mi var?',
    contact: 'Birlikte Çalışalım',
    contactDescription: 'Yeni projelerde yer almak ve değer yaratmak için iletişime geçmekten çekinmeyin.',
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
    heroDescription: 'I am a Software Engineering student at Firat University. I build sustainable, user-focused software with C#, .NET, and database technologies, always centered on learning and creating meaningful value.',
    viewProjects: 'View My Projects',
    viewCv: 'View CV',
    expertise: 'Featured Expertise',
    about: 'About Me',
    aboutText: 'I am a Software Engineering student at Firat University (2023–2027). I place continuous learning and meaningful value creation at the center of my work.',
    aboutInternship: 'During my 40-business-day ERP internship at Lila Cosmetics, I worked on a desktop automation system for manufacturing operations using C#, .NET Windows Forms, DevExpress, and SQL Server.',
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
    contactKicker: 'Have an idea?',
    contact: "Let's Work Together",
    contactDescription: 'Feel free to reach out for new projects and opportunities to create value together.',
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

const translatedSkills = {
  tr: ['Backend & Masaüstü', 'Veritabanı', 'Web & Araçlar', 'Geliştirme Yaklaşımı'],
  en: ['Backend & Desktop', 'Databases', 'Web & Tools', 'Development Approach'],
};

const translatedProjects = {
  'uretim-yonetim-sistemi': {
    en: { title: 'Manufacturing Production Management System', description: 'A desktop management system for end-to-end manufacturing operations, including inventory, production, recipes, procurement, quality control, warehouse, and user authorization.', features: ['User and authorization management', 'Inventory management', 'Recipe management', 'Production orders', 'Production tracking', 'Procurement', 'Material acceptance', 'Quality control', 'Visual quality control', 'Warehouse and finished goods management', 'Reporting'] },
  },
  'human-resources-management-system': {
    en: { title: 'Human Resources Management System (HRMS)', description: 'A web-based system that digitizes employee management, leave tracking, payroll, and performance evaluation processes.', features: ['Employee management', 'Leave tracking', 'Payroll processes', 'Performance evaluation'] },
  },
  'used-books-sales-platform': {
    en: { title: 'Used Books Sales Platform', description: 'A web application that enables users to buy and sell second-hand books, with smart recommendations and dynamic product management modules.', features: ['Book listings', 'Dynamic product management', 'Smart recommendation system'] },
  },
  'zirve-nature-sports-platform': {
    en: { title: 'Zirve Nature Sports Volunteering Platform', description: 'A full-stack platform connecting volunteers with organizations through event applications, club profiles, and a badge system.', features: ['Event discovery', 'Volunteer applications', 'Club profiles', 'Badges and gamification'] },
  },
};

function getProjectText(project, language) {
  const translationKey = project.slug || project.id;

  return language === 'en' && translatedProjects[translationKey]
    ? translatedProjects[translationKey].en
    : {
        title: project.shortTitle || project.title,
        description:
          project.description ||
          project.short_description ||
          '',
        features: project.features || [],
      };
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({
    behavior: 'smooth',
  });
}


/* =========================================================
   NAVBAR
========================================================= */

function Navbar({ activeSection, language, onToggleLanguage, profileData }) {
  const [open, setOpen] = useState(false);

  const navigate = (id) => {
    setOpen(false);
    scrollToSection(id);
  };

  return (
    <header className={`site-header ${open ? 'menu-open' : ''}`}>
      <div className="nav-wrap">

        <button
          className="brand"
          onClick={() => navigate('home')}
          aria-label="Ana sayfaya git"
        >
          {profileData.monogram}
        </button>

        <nav
          className="desktop-nav"
          aria-label="Ana navigasyon"
        >
          {navItems.map(([id, turkishLabel, englishLabel]) => (
            <button
              key={id}
              className={activeSection === id ? 'active' : ''}
              onClick={() => navigate(id)}
            >
              {language === 'tr' ? turkishLabel : englishLabel}
            </button>
          ))}
        </nav>

        <button
          className="language-toggle"
          onClick={onToggleLanguage}
          aria-label={ui[language].languageLabel}
        >
          {language === 'tr' ? 'EN' : 'TR'}
        </button>

        <button
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

      </div>

      <nav
        className="mobile-nav"
        aria-label="Mobil navigasyon"
      >
        {navItems.map(([id, turkishLabel, englishLabel]) => (
          <button
            key={id}
            onClick={() => navigate(id)}
          >
            {language === 'tr' ? turkishLabel : englishLabel}
          </button>
        ))}
      </nav>

    </header>
  );
}


/* =========================================================
   HERO
========================================================= */

function Hero({ language, profileData, skillsData }) {
  const copy = ui[language];
  const featuredSkills = skillsData.length > 0
    ? skillsData.slice(0, 6)
    : [
        { name: 'C# / .NET', category: 'Backend' },
        { name: 'React', category: 'Frontend' },
        { name: 'SQL Server', category: 'Veritabanı' },
      ];

  return (
    <section
      className="hero section-shell"
      id="home"
    >

      <div className="hero-copy">

        <p className="eyebrow">
          {copy.hello}
        </p>

        <h1>
          {profileData.name}
        </h1>

        <p className="hero-title">
  {profileData.title || copy.heroTitle}
          </p>

        <p className="hero-description">
          {profileData.description || copy.heroDescription}
        </p>

        <div className="hero-actions">

          <button
            className="button primary"
            onClick={() => scrollToSection('projects')}
          >
            {copy.viewProjects}
            <ArrowUpRight size={17} />
          </button>

          <a
            className="button secondary"
            href={profileData.cvPath}
            target="_blank"
            rel="noreferrer"
          >
            {copy.viewCv}
            <ArrowUpRight size={17} />
          </a>

        </div>

        <div className="social-links">

          <a
            href={profileData.github}
            aria-label="GitHub"
            target="_blank"
            rel="noreferrer"
          >
            <GitHubIcon size={18} />
            GitHub
          </a>

          <a
            href={profileData.linkedin}
            aria-label="LinkedIn"
            target="_blank"
            rel="noreferrer"
          >
            <LinkedInIcon size={18} />
            LinkedIn
          </a>

        </div>

      </div>

      <aside className="hero-skills-card">
        <p className="hero-skills-label">
          {language === 'tr'
            ? 'Öne Çıkan Yetenekler'
            : 'Featured Skills'}
        </p>

        <div className="hero-skills-list">
          {featuredSkills.map((skill, index) => (
            <span key={`${skill.name}-${index}`}>
              {skill.name}
            </span>
          ))}
        </div>
      </aside>

      <div className="hero-photo-wrap">
        <div className="hero-photo-card">
          <img
            src={profileData.profileImage || '/images/profile.jpg'}
            alt={`${profileData.name} profile photo`}
          />
        </div>
      </div>

    </section>
  );
}


/* =========================================================
   HAKKIMDA
========================================================= */

function AboutCard({ language, profileData }) {
  const copy = ui[language];

  return (
    <article
      className="info-card about-card"
      id="about"
    >

      <div className="card-heading">

        <span className="icon-box">
          ◉
        </span>

        <h2>
          {copy.about}
        </h2>

      </div>

      <p>
        {profileData.about || copy.aboutText}
      </p>

      <p>
        {copy.aboutInternship}
      </p>

      <ul className="check-list">

        <li>
          {copy.teamwork}
        </li>

        <li>
          {copy.database}
        </li>

        <li>
          {copy.userFocused}
        </li>

      </ul>

    </article>
  );
}


/* =========================================================
   YETENEKLER
========================================================= */

function SkillsCard({
  language,
  skillsData,
}) {
  const copy = ui[language];

  const groupedSkills = skillsData.reduce(
    (groups, skill) => {
      const category =
        skill.category?.trim() ||
        (language === 'tr'
          ? 'Diğer'
          : 'Other');

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(skill);

      return groups;
    },
    {}
  );

  return (
    <article
      className="info-card skills-card"
      id="skills"
    >

      <div className="card-heading">

        <span className="icon-box">
          <Code2 size={19} />
        </span>

        <h2>
          {copy.skills}
        </h2>

      </div>

      <div className="skill-groups">
        {Object.entries(groupedSkills).map(
          ([category, categorySkills]) => (
            <div
              className="skill-group"
              key={category}
            >
              <h3>
                {category}
              </h3>

              <div className="chips">
                {categorySkills.map(
                  (skill) => (
                    <span
                      className="chip"
                      key={skill.id}
                    >
                      {skill.name}
                    </span>
                  )
                )}
              </div>
            </div>
          )
        )}
      </div>

    </article>
  );
}


/* =========================================================
   FABRİKA GÖRSELİ
========================================================= */

function FactoryIllustration() {
  return (
    <div
      className="factory-illustration"
      aria-hidden="true"
    >
      <span className="factory-roof" />
      <span className="factory-building" />

      <span className="factory-window w1" />
      <span className="factory-window w2" />
      <span className="factory-window w3" />

      <span className="factory-smoke s1" />
      <span className="factory-smoke s2" />
    </div>
  );
}


/* =========================================================
   ÖNE ÇIKAN PROJE
========================================================= */

function FeaturedProject({ onOpen, projectsData }) {
  const project =
    projectsData.find((item) => item.is_featured) ||
    projectsData[0];

  if (!project) {
    return null;
  }

  return (
    <article
      className="info-card project-card"
      id="projects"
    >

      <div className="card-heading">

        <span className="icon-box">
          ✦
        </span>

        <h2>
          Öne Çıkan Proje
        </h2>

      </div>

      <FactoryIllustration />

      <p className="project-name">
        {project.title}
      </p>

      <p>
        {project.description}
      </p>

      <div className="project-tags">

        {project.technologies
          ?.slice(0, 4)
          .map((tech) => (
            <span
              className="mini-tag"
              key={tech}
            >
              {tech}
            </span>
          ))}

      </div>

      <button
        className="text-link"
        onClick={onOpen}
      >
        Proje Detaylarını Gör
        <ArrowUpRight size={16} />
      </button>

    </article>
  );
}


/* =========================================================
   DENEYİM
========================================================= */

function ExperienceTimeline({ language, experienceData }) {
  const copy = ui[language];
  const formatDate = (date) => {
    if (!date) {
      return '';
    }

    return new Intl.DateTimeFormat(
      language === 'en' ? 'en-US' : 'tr-TR',
      {
        month: '2-digit',
        year: 'numeric',
      }
    ).format(new Date(`${date}T00:00:00`));
  };

  const databaseExperience = experienceData.map((item) => ({
    period: item.is_current
      ? `${formatDate(item.start_date)} - ${language === 'en' ? 'Present' : 'Devam Ediyor'}`
      : `${formatDate(item.start_date)} - ${formatDate(item.end_date)}`,
    title: language === 'en'
      ? `${item.position} - ${item.company_name}`
      : `${item.position} - ${item.company_name}`,
    description: item.description || '',
  }));

  const experiences = databaseExperience.length > 0
    ? databaseExperience
    : experience;

  const experienceText = language === 'en'
    ? {
        period: '40 business days · Summer internship',
        title: 'ERP Intern — Lila Cosmetics',
        description: 'Worked on a desktop automation system for manufacturing operations using C#, .NET Windows Forms, DevExpress, SQL Server, and LINQ to SQL. Contributed to inventory, warehouse, production tracking, procurement, quality control, recipe management, and user authorization modules.',
      }
    : null;

  return (
    <section
      className="experience-section section-shell"
      id="experience"
    >

      <div className="section-intro">

        <p className="eyebrow">
          {copy.career}
        </p>

        <h2>
          {copy.experience}
        </h2>

        <p>
          {copy.experienceDescription}
        </p>

      </div>

      {experiences.length > 0 ? (

        experiences.map((item, index) => (

          <div
            className="timeline-item"
            key={`${item.title}-${index}`}
          >

            <span>
              {item.period}
            </span>

            <div>

              <h3>
                {language === 'en' ? experienceText.title : item.title}
              </h3>

              <p>
                {language === 'en' ? experienceText.description : item.description}
              </p>

            </div>

          </div>

        ))

      ) : (

        <div className="empty-timeline">

          <span className="timeline-dot" />

          <div>

            <span className="todo-label">
              TODO
            </span>

            <h3>
              Deneyim bilgileri yakında eklenecek
            </h3>

            <p>
              Gerçek staj ve iş deneyimleri doğrulandığında
              bu zaman çizelgesinde yer alacak.
            </p>

          </div>

        </div>

      )}

    </section>
  );
}


/* =========================================================
   PROJELER
========================================================= */

function ProjectsShowcase({ onOpen, language, projectsData }) {
  const copy = ui[language];

  return (
    <section className="projects-section section-shell" id="projects">
      <div className="section-heading-row">
        <div>
          <p className="eyebrow">{copy.projectsKicker}</p>
          <h2>{copy.projects}</h2>
          <p>{copy.projectsDescription}</p>
        </div>
      </div>

      <div className="project-grid">
        {projectsData.map((project, index) => (
          <article className={`showcase-project ${index === 0 ? 'featured' : ''}`} key={project.id}>
            <div className="project-number">0{index + 1}</div>
            <div className="project-content">
              <h3>{getProjectText(project, language).title}</h3>
              <p>{getProjectText(project, language).description}</p>
              <div className="project-tags">
                {(project.technologies || []).slice(0, 5).map((technology) => (
                  <span className="mini-tag" key={technology}>{technology}</span>
                ))}
              </div>
              <button className="text-link" onClick={() => onOpen(project)}>
                {copy.details}
                <ArrowUpRight size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}


/* =========================================================
   SERTİFİKALAR
========================================================= */

function CertificatesSection({ language, certificatesData }) {
  const copy = ui[language];
  const staticCertificates = [
    language === 'en'
      ? { title: 'YetGen – 21st Century Awareness Education Program', description: 'A training program focused on career planning, leadership, presentation skills, and algorithmic thinking through teamwork.' }
      : { title: 'YetGen – 21st Century Awareness Education Program', description: 'Kariyer planlama, liderlik, sunum becerileri ve algoritmik düşünme üzerine takım çalışmalarıyla desteklenen eğitim programı.' },
    language === 'en'
      ? { title: 'Habitat Association – Yarını Kodlayanlar', description: 'Training on Python fundamentals, data types, conditions, loops, functions, and basic data structures.' }
      : { title: 'Habitat Association – Yarını Kodlayanlar', description: 'Python temelleri, veri tipleri, koşullar, döngüler, fonksiyonlar ve temel veri yapıları üzerine eğitim.' },
  ];

  const certificates = certificatesData.length > 0
    ? certificatesData
    : staticCertificates;

  return (
    <section className="certificates-section section-shell" id="certificates">
      <div className="section-heading-row">
        <div>
          <p className="eyebrow">{copy.learning}</p>
          <h2>{copy.certificates}</h2>
        </div>
      </div>

      <div className="certificate-grid">
        {certificates.map((certificate) => (
          <article className="certificate-card" key={certificate.title}>
            <span className="certificate-mark">✦</span>
            <h3>{certificate.title}</h3>
            <p>{certificate.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}


/* =========================================================
   İLETİŞİM
========================================================= */

function ContactCard({ language, profileData }) {
  const copy = ui[language];

  return (
    <section
      className="contact-card section-shell"
      id="contact"
    >

      <div>

        <p className="eyebrow">
          {copy.contactKicker}
        </p>

        <h2>
          {copy.contact}
        </h2>

        <p>
          {copy.contactDescription}
        </p>

      </div>

      <div className="contact-side">

        <a
          className="button primary"
          href={`mailto:${profileData.email}`}
        >
            {copy.sendMessage}
          <ArrowUpRight size={17} />
        </a>

        <div className="contact-details">

          <span>
            <small>
              {copy.email}
            </small>

            {profileData.email}
          </span>

          <span>
            <small>
              {copy.location}
            </small>

            {profileData.location}
          </span>

        </div>

      </div>

    </section>
  );
}


/* =========================================================
   PROJE DETAYI
========================================================= */

function ProjectDetail({ onClose, project, language }) {
  const copy = ui[language];
  const projectText = getProjectText(project, language);

  if (!project) {
    return null;
  }

  return (
    <div className="project-detail">

      <button
        className="back-link"
        onClick={onClose}
      >
        {copy.back}
      </button>

      <p className="eyebrow">
        {copy.detail}
      </p>

      <h1>
        {projectText.title}
      </h1>

      <p className="detail-lead">
        {projectText.description}
      </p>

      <div className="detail-grid">

        <div>

          <h2>
            {copy.features}
          </h2>

          <ul className="feature-list">

            {projectText.features?.map((feature) => (
              <li key={feature}>
                {feature}
              </li>
            ))}

          </ul>

        </div>

        <div>

          <h2>
            {copy.technologies}
          </h2>

          <div className="chips">

            {project.technologies?.map((tech) => (
              <span
                className="chip"
                key={tech}
              >
                {tech}
              </span>
            ))}

          </div>

          {project.github && (
            <a
              className="button secondary detail-github"
              href={project.github}
              target="_blank"
              rel="noreferrer"
            >
              <GitHubIcon size={17} />
              {copy.github}
            </a>
          )}

          {project.liveUrl && (
            <a
              className="button secondary detail-github"
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
            >
              <ArrowUpRight size={17} />
              {language === 'tr'
                ? 'Canlı Siteyi Gör'
                : 'View Live Site'}
            </a>
          )}

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   APP
========================================================= */
export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [language, setLanguage] = useState('tr');

  const [profileData, setProfileData] = useState(profile);
  const [projectsData, setProjectsData] = useState(staticProjects);
  const [skillsData, setSkillsData] = useState([]);
  const [experienceData, setExperienceData] = useState([]);
  const [certificatesData, setCertificatesData] = useState([]);

  useEffect(() => {
    async function loadProfile() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('id', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error(
          'Profil bilgileri alınamadı:',
          error
        );

        return;
      }

      if (!data) {
        return;
      }

      setProfileData({
      name:
        data.full_name ||
        profile.name,

      monogram:
        profile.monogram,

      title:
        data.title ||
        profile.title,

      description:
        data.short_description ||
        profile.description,

      about:
        data.about ||
        '',

      email:
        data.email ||
        profile.email,

      location:
        data.location ||
        profile.location,

      github:
        data.github_url ||
        profile.github,

      linkedin:
        data.linkedin_url ||
        profile.linkedin,

      profileImage:
        data.profile_image_url ||
        '/images/profile.jpg',

      cvPath:
        data.cv_url ||
        profile.cvPath,
      });
    }

    loadProfile();
  }, []);

  useEffect(() => {
    async function loadProjects() {
      const { data: projectRows, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('id', { ascending: true });

      if (projectsError) {
        console.error(
          'Projeler alınamadı:',
          projectsError
        );
        return;
      }

      if (!projectRows || projectRows.length === 0) {
        return;
      }

      const projectIds = projectRows.map(
        (project) => project.id
      );

      const [
        technologiesResult,
        featuresResult,
        technologyCatalogResult,
      ] = await Promise.all([
        supabase
          .from('project_technologies')
          .select('project_id, technology_id')
          .in('project_id', projectIds),

        supabase
          .from('project_features')
          .select('project_id, feature_name')
          .in('project_id', projectIds),

        supabase
          .from('technologies')
          .select('id, name'),
      ]);

      if (technologiesResult.error) {
        console.error(
          'Proje teknolojileri alınamadı:',
          technologiesResult.error
        );
      }

      if (featuresResult.error) {
        console.error(
          'Proje özellikleri alınamadı:',
          featuresResult.error
        );
      }

      const technologyRows =
        technologiesResult.data || [];

      const featureRows =
        featuresResult.data || [];

      const technologyNames = new Map(
        (technologyCatalogResult.data || [])
          .map((item) => [item.id, item.name])
      );

      const mappedProjects = projectRows.map(
        (project) => ({
          id: project.slug || String(project.id),
          databaseId: project.id,
          slug: project.slug,
          title: project.title,
          shortTitle: project.title,
          short_description:
            project.short_description || '',
          description:
            project.description ||
            project.short_description ||
            '',
          image_url:
            project.image_url || '',
          github:
            project.github_url || '',
          liveUrl:
            project.live_url || '',
          is_featured:
            project.is_featured,
          is_active:
            project.is_active,
          display_order:
            project.display_order ?? 0,
          technologies: technologyRows
            .filter(
              (item) =>
                item.project_id === project.id
            )
            .map(
              (item) => technologyNames.get(item.technology_id)
            ),
          features: featureRows
            .filter(
              (item) =>
                item.project_id === project.id
            )
            .map(
              (item) => item.feature_name
            ),
        })
      );

      setProjectsData(mappedProjects);
    }

    loadProjects();
  }, []);

  useEffect(() => {
    async function loadSkills() {
      const { data, error } = await supabase
        .from('technologies')
        .select(
          'id, name, category, icon_name, display_order, is_active'
        )
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('id', { ascending: true });

      if (error) {
        console.error(
          'Yetenekler alınamadı:',
          error
        );

        return;
      }

      setSkillsData(data ?? []);
    }

    loadSkills();
  }, []);

  useEffect(() => {
    async function loadCertificates() {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('id', { ascending: true });

      if (error) {
        console.error(
          'Sertifikalar alınamadı:',
          error
        );

        return;
      }

      setCertificatesData(data ?? []);
    }

    loadCertificates();
  }, []);

  useEffect(() => {
    async function loadExperiences() {
      const { data, error } = await supabase
        .from('experiences')
        .select('company_name, position, start_date, end_date, is_current, description, display_order, is_active')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('start_date', { ascending: false });

      if (error) {
        console.error(
          'Deneyimler alınamadı:',
          error
        );

        return;
      }

      setExperienceData(data ?? []);
    }

    loadExperiences();
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {

    if (detailOpen) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {

        const visible = entries.find(
          (entry) => entry.isIntersecting
        );

        if (visible) {
          setActiveSection(visible.target.id);
        }

      },
      {
        rootMargin: '-35% 0px -55% 0px',
      }
    );

    const sectionIds = [
      'home',
      'about',
      'skills',
      'projects',
      'experience',
      'certificates',
      'contact',
    ];

    sectionIds.forEach((id) => {

      const element = document.getElementById(id);

      if (element) {
        observer.observe(element);
      }

    });

    return () => {
      observer.disconnect();
    };

  }, [detailOpen]);


  function openProject(project = projectsData[0]) {

    setSelectedProject(project);

    setDetailOpen(true);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }


  function closeProject() {

    setDetailOpen(false);
    setSelectedProject(null);

    setTimeout(() => {
      scrollToSection('projects');
    }, 100);
  }


  function handleNavigation(id) {

    if (detailOpen) {

      setDetailOpen(false);

      setTimeout(() => {
        scrollToSection(id);
      }, 100);

      return;
    }

    scrollToSection(id);
  }


  return (
    <>

      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigation}
        language={language}
        profileData={profileData}
        onToggleLanguage={() => setLanguage((current) => current === 'tr' ? 'en' : 'tr')}
      />

      {detailOpen ? (

        <main>

          <ProjectDetail
            onClose={closeProject}
            project={selectedProject}
            language={language}
          />

        </main>

      ) : (

        <main>

          <Hero
            language={language}
            profileData={profileData}
            skillsData={skillsData}
          />
          <section className="cards-grid section-shell">

            <AboutCard
              language={language}
              profileData={profileData}
            />

            <SkillsCard
              language={language}
              skillsData={skillsData}
            />

          </section>

          <ProjectsShowcase
            onOpen={openProject}
            language={language}
            projectsData={projectsData}
          />

          <ExperienceTimeline
            language={language}
            experienceData={experienceData}
          />

          <CertificatesSection
            language={language}
            certificatesData={certificatesData}
          />

          <ContactCard
            language={language}
            profileData={profileData}
          />

        </main>

      )}

      <footer>

        <div className="footer-inner">

          <span className="brand">
            {profileData.monogram}
          </span>

          <span>
            © {new Date().getFullYear()} {profileData.name}
          </span>

          <span>
            {ui[language].footer}
          </span>

        </div>

      </footer>

    </>
  );
}