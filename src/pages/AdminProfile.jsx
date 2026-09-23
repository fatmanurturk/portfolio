import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { supabase } from '../lib/supabase';
import '../styles/admin.css';

export default function AdminProfile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    full_name: '',
    title: '',
    short_description: '',
    about: '',
    email: '',
    location: '',
    github_url: '',
    linkedin_url: '',
  });

  const [profileId, setProfileId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('id', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(error);
      setMessage('Profil bilgileri yüklenirken bir hata oluştu.');
      setLoading(false);
      return;
    }

    if (data) {
      setProfileId(data.id);

      setProfile({
        full_name: data.full_name ?? '',
        title: data.title ?? '',
        short_description: data.short_description ?? '',
        about: data.about ?? '',
        email: data.email ?? '',
        location: data.location ?? '',
        github_url: data.github_url ?? '',
        linkedin_url: data.linkedin_url ?? '',
      });
    }

    setLoading(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!profile.full_name.trim()) {
      setMessage('Ad soyad alanı boş bırakılamaz.');
      return;
    }

    setSaving(true);
    setMessage('');

    let result;

    if (profileId) {
      result = await supabase
        .from('profiles')
        .update({
          ...profile,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profileId);
    } else {
      result = await supabase
        .from('profiles')
        .insert({
          ...profile,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
    }

    if (result.error) {
      console.error(result.error);
      setMessage('Profil kaydedilirken bir hata oluştu.');
      setSaving(false);
      return;
    }

    if (!profileId && result.data) {
      setProfileId(result.data.id);
    }

    setMessage('Profil bilgileri başarıyla kaydedildi.');
    setSaving(false);
  };

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
          <button onClick={() => navigate('/admin')}>
            Dashboard
          </button>

          <button className="active">
            Profil
          </button>

          <button
  onClick={() => navigate('/admin/projects')}
>
  Projeler
</button>

          <button
            onClick={() => navigate('/admin/skills')}
          >
            Yetenekler
          </button>

          <button
            onClick={() => navigate('/admin/experiences')}
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
            <p>Yönetim Paneli</p>
            <h1>Profil</h1>
          </div>

          <button
            className="admin-view-site"
            onClick={() => navigate('/')}
          >
            Siteyi Görüntüle
          </button>

        </header>

        <div className="admin-welcome-card">

          <h2>Profil Bilgileri</h2>

          <p>
            Portfolyo sitesinde gösterilecek kişisel
            bilgilerinizi buradan yönetebilirsiniz.
          </p>

        </div>

        {loading ? (
          <div className="admin-profile-card">
            <p>Profil bilgileri yükleniyor...</p>
          </div>
        ) : (
          <form
            className="admin-profile-card"
            onSubmit={handleSave}
          >

            <div className="admin-form-grid">

              <div className="admin-form-group">
                <label>Ad Soyad</label>

                <input
                  type="text"
                  name="full_name"
                  value={profile.full_name}
                  onChange={handleChange}
                  placeholder="Ad Soyad"
                />
              </div>

              <div className="admin-form-group">
                <label>Unvan</label>

                <input
                  type="text"
                  name="title"
                  value={profile.title}
                  onChange={handleChange}
                  placeholder="Örn. Yazılım Mühendisliği Öğrencisi"
                />
              </div>

              <div className="admin-form-group admin-form-full">
                <label>Kısa Açıklama</label>

                <textarea
                  name="short_description"
                  value={profile.short_description}
                  onChange={handleChange}
                  rows="3"
                />
              </div>

              <div className="admin-form-group admin-form-full">
                <label>Hakkımda</label>

                <textarea
                  name="about"
                  value={profile.about}
                  onChange={handleChange}
                  rows="6"
                />
              </div>

              <div className="admin-form-group">
                <label>E-posta</label>

                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-form-group">
                <label>Konum</label>

                <input
                  type="text"
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-form-group">
                <label>GitHub</label>

                <input
                  type="url"
                  name="github_url"
                  value={profile.github_url}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                />
              </div>

              <div className="admin-form-group">
                <label>LinkedIn</label>

                <input
                  type="url"
                  name="linkedin_url"
                  value={profile.linkedin_url}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>

            </div>

            {message && (
              <p className="admin-form-message">
                {message}
              </p>
            )}

            <div className="admin-form-actions">

              <button
                type="submit"
                className="admin-save-button"
                disabled={saving}
              >
                {saving
                  ? 'Kaydediliyor...'
                  : 'Değişiklikleri Kaydet'}
              </button>

            </div>

          </form>
        )}

      </section>

    </main>
  );
}