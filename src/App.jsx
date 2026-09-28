import { useEffect, useState } from 'react';

import { supabase } from './lib/supabase';
import { scrollToSection } from './lib/i18n';

import { profile } from './data/profile';
import { projects as staticProjects } from './data/projects';

// ─── Bileşenler ───────────────────────────────────────────────────────────────
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutCard from './components/AboutCard';
import SkillsCard from './components/SkillsCard';
import ProjectsShowcase from './components/ProjectsShowcase';
import ExperienceTimeline from './components/ExperienceTimeline';
import CertificatesSection from './components/CertificatesSection';
import BlogPreviewSection from './components/BlogPreviewSection';
import ContactCard from './components/ContactCard';
import ProjectDetail from './components/ProjectDetail';
import { ui } from './lib/i18n';

export default function App() {
  // ── UI state ────────────────────────────────────────────────────────────────
  const [activeSection, setActiveSection] = useState('home');
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [language, setLanguage] = useState('tr');
  const [theme, setTheme] = useState(
    () => window.localStorage.getItem('portfolio-theme') || 'dark'
  );

  // ── Veri state ──────────────────────────────────────────────────────────────
  const [profileData, setProfileData] = useState(profile);
  const [projectsData, setProjectsData] = useState(staticProjects);
  const [skillsData, setSkillsData] = useState([]);
  const [experienceData, setExperienceData] = useState([]);
  const [certificatesData, setCertificatesData] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);

  // ── Veri yükleme ────────────────────────────────────────────────────────────

  useEffect(() => {
    async function loadProfile() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('id', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Profil bilgileri alınamadı:', error);
        return;
      }
      if (!data) return;

      setProfileData({
        name: data.full_name || profile.name,
        monogram: profile.monogram,
        title: data.title || profile.title,
        description: data.short_description || profile.description,
        about: data.about || '',
        email: data.email || profile.email,
        location: data.location || profile.location,
        github: data.github_url || profile.github,
        linkedin: data.linkedin_url || profile.linkedin,
        instagram: data.instagram_url || profile.instagram,
        profileImage: data.profile_image_url || '/images/profile.jpg',
        cvPath: data.cv_url || profile.cvPath,
      });
    }

    loadProfile();
  }, []);

  useEffect(() => {
    async function loadProjects() {
      const { data: projectRows, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true })
        .order('id', { ascending: true });

      if (projectsError) {
        console.error('Projeler alınamadı:', projectsError);
        return;
      }
      if (!projectRows || projectRows.length === 0) return;

      const activeProjectRows = projectRows.filter(
        (project) => project.is_active !== false
      );
      const projectIds = activeProjectRows.map((project) => project.id);
      if (activeProjectRows.length === 0) {
        setProjectsData([]);
        return;
      }

      const [technologiesResult, featuresResult, technologyCatalogResult] =
        await Promise.all([
          supabase
            .from('project_technologies')
            .select('project_id, technology_id')
            .in('project_id', projectIds),
          supabase
            .from('project_features')
            .select('project_id, feature_name')
            .in('project_id', projectIds),
          supabase.from('technologies').select('id, name'),
        ]);

      if (technologiesResult.error)
        console.error('Proje teknolojileri alınamadı:', technologiesResult.error);
      if (featuresResult.error)
        console.error('Proje özellikleri alınamadı:', featuresResult.error);

      const technologyRows = technologiesResult.data || [];
      const featureRows = featuresResult.data || [];
      const technologyNames = new Map(
        (technologyCatalogResult.data || []).map((item) => [item.id, item.name])
      );

      const mappedProjects = activeProjectRows.map((project) => ({
        id: project.slug || String(project.id),
        databaseId: project.id,
        slug: project.slug,
        title: project.title,
        shortTitle: project.title,
        // i18n alanları — Admin'den girilen İngilizce değerler (opsiyonel)
        title_en: project.title_en || '',
        description_en: project.description_en || '',
        short_description: project.short_description || '',
        description: project.description || project.short_description || '',
        image_url: project.image_url || '',
        github: project.github_url || '',
        liveUrl: project.live_url || '',
        is_featured: project.is_featured,
        is_active: project.is_active,
        display_order: project.display_order ?? 0,
        technologies: technologyRows
          .filter((item) => item.project_id === project.id)
          .map((item) => technologyNames.get(item.technology_id)),
        features: featureRows
          .filter((item) => item.project_id === project.id)
          .map((item) => item.feature_name),
      }));

      setProjectsData(mappedProjects);
    }

    loadProjects();
  }, []);

  useEffect(() => {
    async function loadSkills() {
      const { data, error } = await supabase
        .from('technologies')
        .select('id, name, category, icon_name, display_order, is_active')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('id', { ascending: true });

      if (error) {
        console.error('Yetenekler alınamadı:', error);
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
        console.error('Sertifikalar alınamadı:', error);
        return;
      }
      setCertificatesData(data ?? []);
    }

    loadCertificates();
  }, []);

  useEffect(() => {
    async function loadBlogPosts() {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, content, cover_image_url, category, created_at')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Blog yazıları alınamadı:', error);
        return;
      }
      setBlogPosts(data ?? []);
    }

    loadBlogPosts();
  }, []);

  useEffect(() => {
    async function loadExperiences() {
      const { data, error } = await supabase
        .from('experiences')
        .select(
          'company_name, position, start_date, end_date, is_current, description, display_order, is_active'
        )
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('start_date', { ascending: false });

      if (error) {
        console.error('Deneyimler alınamadı:', error);
        return;
      }
      setExperienceData(data ?? []);
    }

    loadExperiences();
  }, []);

  // ── Yan etkiler (tema, dil, pointer, scroll spy) ────────────────────────────

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handlePointerMove = (event) => {
      document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`);
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  useEffect(() => {
    if (detailOpen) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: '-35% 0px -55% 0px' }
    );

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px' }
    );

    const sectionIds = [
      'home', 'about', 'skills', 'projects',
      'experience', 'certificates', 'blog', 'contact',
    ];
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    document.querySelectorAll('[data-reveal]').forEach((element) => {
      revealObserver.observe(element);
    });

    return () => {
      observer.disconnect();
      revealObserver.disconnect();
    };
  }, [detailOpen, projectsData]);

  // ── Aksiyonlar ──────────────────────────────────────────────────────────────

  function openProject(project = projectsData[0]) {
    setSelectedProject(project);
    setDetailOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function closeProject() {
    setDetailOpen(false);
    setSelectedProject(null);
    setTimeout(() => scrollToSection('projects'), 100);
  }

  function handleNavigation(id) {
    if (detailOpen) {
      setDetailOpen(false);
      setSelectedProject(null);
      setTimeout(() => scrollToSection(id), 100);
      return;
    }
    scrollToSection(id);
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigation}
        language={language}
        profileData={profileData}
        onToggleLanguage={() =>
          setLanguage((current) => (current === 'tr' ? 'en' : 'tr'))
        }
        theme={theme}
        onToggleTheme={() =>
          setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
        }
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

          <section className="cards-grid section-shell" data-reveal>
            <AboutCard language={language} profileData={profileData} />
            <SkillsCard language={language} skillsData={skillsData} />
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

          <BlogPreviewSection language={language} posts={blogPosts} />

          <ContactCard language={language} profileData={profileData} />
        </main>
      )}

      <footer>
        <div className="footer-inner">
          <span className="brand">{profileData.monogram}</span>
          <span>
            © {new Date().getFullYear()} {profileData.name}
          </span>
          <span>{ui[language].footer}</span>
        </div>
      </footer>
    </>
  );
}