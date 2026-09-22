import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import '../styles/admin.css';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();

    navigate('/admin/login', {
      replace: true,
    });
  };

  return (
    <main className="admin-dashboard">

      <aside className="admin-sidebar">

        <div className="admin-sidebar-logo">
          FNT.
        </div>

        <nav>
          <button className="active">
            Dashboard
          </button>

          <button>
            Profil
          </button>

          <button>
            Projeler
          </button>

          <button>
            Yetenekler
          </button>

          <button>
            Deneyimler
          </button>

          <button>
            Sertifikalar
          </button>

          <button>
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
            onClick={() => navigate('/')}
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
            bilgilerini yönetebileceksiniz.
          </p>

        </div>

        <div className="admin-stat-grid">

          <article>
            <span>Projeler</span>
            <strong>—</strong>
          </article>

          <article>
            <span>Yetenekler</span>
            <strong>—</strong>
          </article>

          <article>
            <span>Deneyimler</span>
            <strong>—</strong>
          </article>

          <article>
            <span>Sertifikalar</span>
            <strong>—</strong>
          </article>

        </div>

      </section>

    </main>
  );
}