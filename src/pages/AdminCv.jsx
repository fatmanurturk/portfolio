import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { supabase } from '../lib/supabase';
import '../styles/admin.css';

const defaultCvPath = '/cv/Fatma-Nur-Turk-CV.pdf';

export default function AdminCv() {
  const navigate = useNavigate();
  const [profileId, setProfileId] = useState(null);
  const [cvUrl, setCvUrl] = useState(defaultCvPath);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadCv();
  }, []);

  const loadCv = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('profiles')
      .select('id, cv_url')
      .order('id', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(error);
      setMessage('CV bilgisi yüklenirken bir hata oluştu.');
      setLoading(false);
      return;
    }

    if (data) {
      setProfileId(data.id);
      setCvUrl(data.cv_url || defaultCvPath);
    }

    setLoading(false);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const nextCvUrl = cvUrl.trim();

    if (!nextCvUrl) {
      setMessage('CV bağlantısı boş bırakılamaz.');
      return;
    }

    setSaving(true);
    setMessage('');

    const profileData = {
      cv_url: nextCvUrl,
      updated_at: new Date().toISOString(),
    };

    const result = profileId
      ? await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', profileId)
      : await supabase
        .from('profiles')
        .insert(profileData)
        .select('id')
        .single();

    if (result.error) {
      console.error(result.error);
      setMessage('CV bağlantısı kaydedilirken bir hata oluştu.');
      setSaving(false);
      return;
    }

    if (!profileId && result.data) {
      setProfileId(result.data.id);
    }

    setCvUrl(nextCvUrl);
    setMessage('CV bağlantısı başarıyla kaydedildi.');
    setSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <main className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">FNT.</div>

        <nav>
          <button onClick={() => navigate('/admin')}>Dashboard</button>
          <button onClick={() => navigate('/admin/profile')}>Profil</button>
          <button onClick={() => navigate('/admin/projects')}>Projeler</button>
          <button onClick={() => navigate('/admin/skills')}>Yetenekler</button>
          <button onClick={() => navigate('/admin/experiences')}>Deneyimler</button>
          <button onClick={() => navigate('/admin/certificates')}>Sertifikalar</button>
          <button className="active">CV</button>
        </nav>

        <button className="admin-logout-button" onClick={handleLogout}>
          Çıkış Yap
        </button>
      </aside>

      <section className="admin-content">
        <header className="admin-content-header">
          <div>
            <p>Yönetim Paneli</p>
            <h1>CV</h1>
          </div>
          <button className="admin-view-site" onClick={() => navigate('/')}>
            Siteyi Görüntüle
          </button>
        </header>

        <div className="admin-welcome-card">
          <h2>CV Yönetimi</h2>
          <p>Portfolyo sitesinde kullanılacak CV dosyasının bağlantısını buradan güncelleyebilirsiniz.</p>
        </div>

        {loading ? (
          <div className="admin-profile-card">
            <p>CV bilgisi yükleniyor...</p>
          </div>
        ) : (
          <form className="admin-profile-card" onSubmit={handleSave}>
            <h2>CV Bağlantısı</h2>

            <div className="admin-form-group">
              <label htmlFor="cv-url">PDF dosyası veya herkese açık CV bağlantısı</label>
              <input id="cv-url" type="text" value={cvUrl} onChange={(event) => setCvUrl(event.target.value)} placeholder="/cv/Fatma-Nur-Turk-CV.pdf" />
            </div>

            <div className="admin-form-actions">
              <button className="admin-primary-button" type="submit" disabled={saving}>
                {saving ? 'Kaydediliyor...' : 'CV Bağlantısını Kaydet'}
              </button>
              <a className="admin-secondary-button" href={cvUrl || defaultCvPath} target="_blank" rel="noreferrer">
                CV’yi Görüntüle
              </a>
            </div>

            {message && <p className="admin-form-message">{message}</p>}
          </form>
        )}

        <div className="admin-profile-card">
          <h2>CV Önizleme</h2>
          <iframe className="admin-cv-preview" src={cvUrl || defaultCvPath} title="CV önizleme" />
        </div>
      </section>
    </main>
  );
}
