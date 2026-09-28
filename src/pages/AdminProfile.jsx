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
    instagram_url: '',
    profile_image_url: '',
  });

  const [profileId, setProfileId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
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
        instagram_url: data.instagram_url ?? '',
        profile_image_url: data.profile_image_url ?? '',
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

  const uploadProfileImage = async () => {
    if (!imageFile) {
      return profile.profile_image_url.trim() || null;
    }

    if (!imageFile.type.startsWith('image/')) {
      throw new Error('Lütfen geçerli bir görsel dosyası seçin.');
    }

    if (imageFile.size > 5 * 1024 * 1024) {
      throw new Error('Görsel dosyası 5 MB boyutundan küçük olmalıdır.');
    }

    const extension = imageFile.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filePath = `profile/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(filePath, imageFile, {
        cacheControl: '3600',
        contentType: imageFile.type,
        upsert: false,
      });

    if (uploadError) {
      throw new Error(
        uploadError.message.includes('Bucket not found')
          ? 'project-images Storage bucket bulunamadı. Supabase Storage bölümünde public bir project-images bucket oluşturun.'
          : `Görsel yüklenemedi: ${uploadError.message}`
      );
    }

    const { data } = supabase.storage
      .from('project-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!profile.full_name.trim()) {
      setMessage('Ad soyad alanı boş bırakılamaz.');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      let finalImageUrl = profile.profile_image_url.trim();

      if (imageFile) {
        finalImageUrl = await uploadProfileImage();
      }

      const payload = {
        ...profile,
        profile_image_url: finalImageUrl || null,
        updated_at: new Date().toISOString(),
      };

      let result;

      if (profileId) {
        result = await supabase
          .from('profiles')
          .update(payload)
          .eq('id', profileId);
      } else {
        result = await supabase
          .from('profiles')
          .insert(payload)
          .select()
          .single();
      }

      if (result.error) {
        console.error(result.error);
        setMessage(`Profil kaydedilirken bir hata oluştu: ${result.error.message}`);
        setSaving(false);
        return;
      }

      if (!profileId && result.data) {
        setProfileId(result.data.id);
      }

      setProfile((current) => ({
        ...current,
        profile_image_url: finalImageUrl || '',
      }));
      setImageFile(null);

      setMessage('Profil bilgileri başarıyla kaydedildi.');
    } catch (error) {
      console.error(error);
      setMessage(error.message || 'Profil kaydedilirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
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

          <button onClick={() => navigate('/admin/projects')}>
            Projeler
          </button>

          <button onClick={() => navigate('/admin/skills')}>
            Yetenekler
          </button>

          <button onClick={() => navigate('/admin/experiences')}>
            Deneyimler
          </button>

          <button onClick={() => navigate('/admin/certificates')}>
            Sertifikalar
          </button>

          <button onClick={() => navigate('/admin/blog')}>
            Blog
          </button>

          <button onClick={() => navigate('/admin/cv')}>
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
            bilgilerinizi, profil fotoğrafınızı ve sosyal bağlantılarınızı buradan yönetebilirsiniz.
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

              {/* PROFİL FOTOĞRAFI YÜKLEME VE ÖNİZLEME */}
              <div className="admin-form-group admin-form-full admin-image-upload-group">
                <label htmlFor="profile-image-file">Profil Fotoğrafı</label>
                <input
                  id="profile-image-file"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    setImageFile(event.target.files?.[0] ?? null);
                  }}
                />
                <small className="admin-field-hint">
                  PNG, JPG veya WEBP. En fazla 5 MB.
                </small>

                {(profile.profile_image_url || imageFile) && (
                  <div className="admin-image-preview">
                    <img
                      src={imageFile ? URL.createObjectURL(imageFile) : (profile.profile_image_url || '/images/profile.jpg')}
                      alt="Profil fotoğrafı önizleme"
                    />
                    <span>
                      {imageFile
                        ? imageFile.name
                        : profile.profile_image_url || 'Varsayılan profil fotoğrafı (/images/profile.jpg)'}
                    </span>
                  </div>
                )}
              </div>

              <div className="admin-form-group admin-form-full">
                <label>Profil Fotoğrafı URL veya Dosya Yolu</label>
                <input
                  type="text"
                  name="profile_image_url"
                  value={profile.profile_image_url}
                  onChange={handleChange}
                  placeholder="Örn. /images/profile.jpg veya https://..."
                />
                <small className="admin-field-hint">
                  Doğrudan görsel bağlantısı girebilir veya yukarıdaki alandan yeni bir fotoğraf yükleyebilirsiniz.
                </small>
              </div>

              <div className="admin-form-group admin-form-full">
                <label>Kısa Açıklama (Hero Bölümü)</label>
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
                  placeholder="ornek@domain.com"
                />
              </div>

              <div className="admin-form-group">
                <label>Konum</label>
                <input
                  type="text"
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                  placeholder="Örn. Elazığ, Türkiye"
                />
              </div>

              <div className="admin-form-group">
                <label>GitHub Bağlantısı</label>
                <input
                  type="url"
                  name="github_url"
                  value={profile.github_url}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                />
              </div>

              <div className="admin-form-group">
                <label>LinkedIn Bağlantısı</label>
                <input
                  type="url"
                  name="linkedin_url"
                  value={profile.linkedin_url}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>

              <div className="admin-form-group">
                <label>Instagram Bağlantısı</label>
                <input
                  type="url"
                  name="instagram_url"
                  value={profile.instagram_url}
                  onChange={handleChange}
                  placeholder="https://instagram.com/..."
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