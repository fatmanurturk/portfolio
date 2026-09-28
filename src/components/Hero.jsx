import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ui, scrollToSection } from '../lib/i18n';
import { GitHubIcon, LinkedInIcon } from './icons';

export default function Hero({ language, profileData, skillsData }) {
  const copy = ui[language];
  const [roleIndex, setRoleIndex] = useState(0);

  const roles =
    language === 'tr'
      ? [
          profileData.title || 'Yazılım Mühendisliği Öğrencisi',
          'Software Developer',
          'Ürün Odaklı Geliştirici',
        ]
      : [
          'Software Engineering Student',
          'Software Developer',
          'Product-minded Builder',
        ];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRoleIndex((current) => (current + 1) % roles.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [language, roles.length]);

  const featuredSkills =
    skillsData.length > 0
      ? skillsData.slice(0, 6)
      : [
          { name: 'C# / .NET', category: 'Backend' },
          { name: 'React', category: 'Frontend' },
          { name: 'SQL Server', category: 'Veritabanı' },
        ];

  return (
    <section className="hero section-shell" id="home" data-reveal>

      <div className="hero-copy">
        <p className="eyebrow">{copy.hello}</p>

        <h1>{profileData.name}</h1>

        <p className="hero-title" aria-live="polite">
          <span className="hero-role-text" key={`${language}-${roleIndex}`}>
            {roles[roleIndex]}
          </span>
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
          {language === 'tr' ? 'Öne Çıkan Yetenekler' : 'Featured Skills'}
        </p>
        <div className="hero-skills-list">
          {featuredSkills.map((skill, index) => (
            <span key={`${skill.name}-${index}`}>{skill.name}</span>
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
