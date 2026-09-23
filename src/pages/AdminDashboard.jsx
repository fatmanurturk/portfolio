import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { supabase } from '../lib/supabase';

import '../styles/admin.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    projects: null,
    skills: null,
    experiences: null,
    certificates: null,
  });

  useEffect(() => {
    const loadStats = async () => {
      const tables = [
        ['projects', 'projects'],
        ['technologies', 'skills'],
        ['experiences', 'experiences'],
        ['certificates', 'certificates'],
      ];

      const results = await Promise.all(
        tables.map(async ([table, key]) => {
          const { count, error } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });

          if (error) {
            console.error(`${table} sayısı alınamadı:`, error);
            return [key, 0];
          }

          return [key, count ?? 0];
        })
      );

      setStats(Object.fromEntries(results));
    };

    loadStats();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();

    navigate(
      '/admin/login',
      {
        replace: true,
      }
    );
  };

  return (
    <main className="admin-dashboard">

      <aside className="admin-sidebar">

        <div className="admin-sidebar-logo">
          FNT.
        </div>

        <nav>

          <button
            className="active"
          >
            Dashboard
          </button>

          <button
            onClick={() =>
              navigate('/admin/profile')
            }
          >
            Profil
          </button>

          <button
            onClick={() =>
              navigate('/admin/projects')
            }
          >
            Projeler
          </button>

          <button
            onClick={() =>
              navigate('/admin/skills')
            }
          >
            Yetenekler
          </button>

          <button
            onClick={() =>
              navigate('/admin/experiences')
            }
          >
            Deneyimler
          </button>

          <button
            onClick={() => navigate('/admin/certificates')}
          >
            Sertifikalar
          </button>

          <button
            onClick={() => navigate('/admin/cv')}
          >
            CV
          </button>

        </nav>

        <button
          className="admin-logout-button"
          onClick={handleLogout}
        >
          Çıkış Yap
        </button>

      </aside>

      <section className="admin-content">

        <header className="admin-content-header">

          <div>

            <p>
              Yönetim Paneli
            </p>

            <h1>
              Dashboard
            </h1>

          </div>

          <button
            className="admin-view-site"
            onClick={() =>
              navigate('/')
            }
          >
            Siteyi Görüntüle
          </button>

        </header>

        <div className="admin-welcome-card">

          <h2>
            Portfolyo Yönetim Paneli
          </h2>

          <p>
            Buradan portfolyonuzdaki profil,
            proje, yetenek, deneyim ve sertifika
            bilgilerini yönetebilirsiniz.
          </p>

        </div>

        <div className="admin-stat-grid">

          <article
            className="admin-stat-card"
            onClick={() => navigate('/admin/projects')}
          >
            <span>Projeler</span>
            <strong>{stats.projects ?? '...'}</strong>
            <small>İçerikleri yönet</small>
          </article>

          <article
            className="admin-stat-card"
            onClick={() => navigate('/admin/skills')}
          >
            <span>Yetenekler</span>
            <strong>{stats.skills ?? '...'}</strong>
            <small>Teknolojileri yönet</small>
          </article>

          <article
            className="admin-stat-card"
            onClick={() => navigate('/admin/experiences')}
          >
            <span>Deneyimler</span>
            <strong>{stats.experiences ?? '...'}</strong>
            <small>Kariyer kayıtlarını yönet</small>
          </article>

          <article
            className="admin-stat-card"
            onClick={() => navigate('/admin/certificates')}
          >
            <span>Sertifikalar</span>
            <strong>{stats.certificates ?? '...'}</strong>
            <small>Belgeleri yönet</small>
          </article>

        </div>

        <div className="admin-dashboard-grid">

          <section className="admin-dashboard-panel">
            <div className="admin-panel-heading">
              <div>
                <p className="admin-panel-kicker">Kısayollar</p>
                <h2>Hızlı İşlemler</h2>
              </div>
              <span className="admin-panel-mark">+</span>
            </div>

            <div className="admin-quick-actions">
              <button onClick={() => navigate('/admin/projects')}>
                <strong>Yeni proje ekle</strong>
                <span>Çalışmalarını portfolyona ekle</span>
              </button>
              <button onClick={() => navigate('/admin/experiences')}>
                <strong>Deneyim ekle</strong>
                <span>Kariyer geçmişini güncelle</span>
              </button>
              <button onClick={() => navigate('/admin/profile')}>
                <strong>Profili düzenle</strong>
                <span>Hakkındaki bilgileri güncelle</span>
              </button>
              <button onClick={() => navigate('/admin/cv')}>
                <strong>CV’yi güncelle</strong>
                <span>Dosya bağlantısını yönet</span>
              </button>
            </div>
          </section>

          <section className="admin-dashboard-panel admin-status-panel">
            <div className="admin-panel-heading">
              <div>
                <p className="admin-panel-kicker">Genel Bakış</p>
                <h2>İçerik Durumu</h2>
              </div>
              <span className="admin-status-dot" />
            </div>

            <div className="admin-status-row">
              <span>Portfolyo görünürlüğü</span>
              <strong>Aktif</strong>
            </div>
            <div className="admin-status-row">
              <span>Supabase bağlantısı</span>
              <strong>Bağlı</strong>
            </div>
            <div className="admin-status-row">
              <span>Yayınlanan içerik</span>
              <strong>
                {(stats.projects ?? 0) + (stats.skills ?? 0) + (stats.experiences ?? 0) + (stats.certificates ?? 0)} kayıt
              </strong>
            </div>
          </section>

        </div>

      </section>

    </main>
  );
}
