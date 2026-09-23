import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { supabase } from '../lib/supabase';
import '../styles/admin.css';

const emptyForm = {
  title: '',
  description: '',
  display_order: 0,
  is_active: true,
};

export default function AdminCertificates() {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingCertificateId, setEditingCertificateId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('display_order', { ascending: true })
      .order('id', { ascending: true });

    if (error) {
      console.error(error);
      setMessage('Sertifikalar yüklenemedi. Supabase certificates tablosunu kontrol edin.');
      setLoading(false);
      return;
    }

    setCertificates(data ?? []);
    setLoading(false);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetForm = () => {
    setEditingCertificateId(null);
    setForm(emptyForm);
  };

  const handleEdit = (certificate) => {
    setEditingCertificateId(certificate.id);
    setForm({
      title: certificate.title ?? '',
      description: certificate.description ?? '',
      display_order: certificate.display_order ?? 0,
      is_active: certificate.is_active ?? true,
    });
    setMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setMessage('Sertifika başlığı boş bırakılamaz.');
      return;
    }

    setSaving(true);
    setMessage('');

    const certificateData = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      display_order: Number(form.display_order) || 0,
      is_active: form.is_active,
    };

    const result = editingCertificateId
      ? await supabase
        .from('certificates')
        .update(certificateData)
        .eq('id', editingCertificateId)
      : await supabase
        .from('certificates')
        .insert(certificateData);

    if (result.error) {
      console.error(result.error);
      setMessage('Sertifika kaydedilirken bir hata oluştu.');
      setSaving(false);
      return;
    }

    setMessage(
      editingCertificateId
        ? 'Sertifika başarıyla güncellendi.'
        : 'Sertifika başarıyla eklendi.'
    );
    resetForm();
    await loadCertificates();
    setSaving(false);
  };

  const handleDelete = async (certificate) => {
    if (!window.confirm(`"${certificate.title}" sertifikasını silmek istediğinize emin misiniz?`)) {
      return;
    }

    const { error } = await supabase
      .from('certificates')
      .delete()
      .eq('id', certificate.id);

    if (error) {
      console.error(error);
      setMessage('Sertifika silinirken bir hata oluştu.');
      return;
    }

    if (editingCertificateId === certificate.id) {
      resetForm();
    }

    setMessage('Sertifika başarıyla silindi.');
    await loadCertificates();
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
          <button className="active">Sertifikalar</button>
          <button onClick={() => navigate('/admin/cv')}>CV</button>
        </nav>

        <button className="admin-logout-button" onClick={handleLogout}>
          Çıkış Yap
        </button>
      </aside>

      <section className="admin-content">
        <header className="admin-content-header">
          <div>
            <p>Yönetim Paneli</p>
            <h1>Sertifikalar</h1>
          </div>
          <button className="admin-view-site" onClick={() => navigate('/')}>
            Siteyi Görüntüle
          </button>
        </header>

        <div className="admin-welcome-card">
          <h2>Sertifika Yönetimi</h2>
          <p>Portfolyo sitesinde gösterilecek sertifikaları buradan yönetebilirsiniz.</p>
        </div>

        <form className="admin-profile-card" onSubmit={handleSave}>
          <h2>{editingCertificateId ? 'Sertifikayı Düzenle' : 'Yeni Sertifika Ekle'}</h2>

          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label htmlFor="certificate-title">Sertifika Başlığı</label>
              <input id="certificate-title" type="text" name="title" value={form.title} onChange={handleChange} placeholder="Örn. YetGen Eğitim Programı" />
            </div>

            <div className="admin-form-group">
              <label htmlFor="certificate-order">Görüntüleme Sırası</label>
              <input id="certificate-order" type="number" name="display_order" value={form.display_order} onChange={handleChange} min="0" />
            </div>
          </div>

          <div className="admin-form-group">
            <label htmlFor="certificate-description">Açıklama</label>
            <textarea id="certificate-description" name="description" value={form.description} onChange={handleChange} rows="4" placeholder="Sertifika hakkında kısa açıklama" />
          </div>

          <label className="admin-checkbox-label">
            <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} />
            Sitede göster
          </label>

          <div className="admin-form-actions">
            <button className="admin-primary-button" type="submit" disabled={saving}>
              {saving ? 'Kaydediliyor...' : editingCertificateId ? 'Güncelle' : 'Sertifika Ekle'}
            </button>
            {editingCertificateId && (
              <button className="admin-secondary-button" type="button" onClick={resetForm}>
                İptal
              </button>
            )}
          </div>

          {message && <p className="admin-form-message">{message}</p>}
        </form>

        <div className="admin-profile-card">
          <h2>Mevcut Sertifikalar</h2>
          {loading ? (
            <p>Sertifikalar yükleniyor...</p>
          ) : certificates.length === 0 ? (
            <p>Henüz sertifika eklenmemiş.</p>
          ) : (
            <div className="admin-list">
              {certificates.map((certificate) => (
                <article className="admin-list-item" key={certificate.id}>
                  <div>
                    <strong>{certificate.title}</strong>
                    <p>{certificate.description || 'Açıklama belirtilmedi'}</p>
                  </div>
                  <div className="admin-list-actions">
                    <button type="button" onClick={() => handleEdit(certificate)}>Düzenle</button>
                    <button type="button" onClick={() => handleDelete(certificate)}>Sil</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
