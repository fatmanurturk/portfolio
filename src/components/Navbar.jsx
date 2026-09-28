import { useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { ui, navItems, scrollToSection } from '../lib/i18n';

export default function Navbar({
  activeSection,
  onNavigate,
  language,
  onToggleLanguage,
  profileData,
  theme,
  onToggleTheme,
}) {
  const [open, setOpen] = useState(false);

  const navigate = (id) => {
    setOpen(false);
    if (onNavigate) {
      onNavigate(id);
    } else {
      scrollToSection(id);
    }
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

        <nav className="desktop-nav" aria-label="Ana navigasyon">
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
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'}
          title={theme === 'dark' ? 'Açık tema' : 'Koyu tema'}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
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

      <nav className="mobile-nav" aria-label="Mobil navigasyon">
        {navItems.map(([id, turkishLabel, englishLabel]) => (
          <button key={id} onClick={() => navigate(id)}>
            {language === 'tr' ? turkishLabel : englishLabel}
          </button>
        ))}
      </nav>

    </header>
  );
}
