import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { supabase } from '../lib/supabase';
import '../styles/admin.css';

export default function AdminExperiences() {
  const navigate = useNavigate();

  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [editingExperienceId, setEditingExperienceId] =
    useState(null);

  const [form, setForm] = useState({
    company_name: '',
    position: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('display_order', {
        ascending: true,
      })
      .order('id', {
        ascending: true,
      });

    if (error) {
      console.error(error);

      setMessage(
        'Deneyimler yüklenirken bir hata oluştu.'
      );

      setLoading(false);
      return;
    }

    setExperiences(data ?? []);
    setLoading(false);
  };

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((current) => {
      const nextForm = {
        ...current,
        [name]:
          type === 'checkbox'
            ? checked
            : value,
      };

      if (
        name === 'is_current' &&
        checked
      ) {
        nextForm.end_date = '';
      }

      return nextForm;
    });
  };

  const resetForm = () => {
    setEditingExperienceId(null);

    setForm({
      company_name: '',
      position: '',
      start_date: '',
      end_date: '',
      is_current: false,
      description: '',
      display_order: 0,
      is_active: true,
    });
  };

  const handleEdit = (experience) => {
    setMessage('');

    setEditingExperienceId(
      experience.id
    );

    setForm({
      company_name:
        experience.company_name ?? '',

      position:
        experience.position ?? '',

      start_date:
        experience.start_date ?? '',

      end_date:
        experience.end_date ?? '',

      is_current:
        experience.is_current ?? false,

      description:
        experience.description ?? '',

      display_order:
        experience.display_order ?? 0,

      is_active:
        experience.is_active ?? true,
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleCancelEdit = () => {
    resetForm();
    setMessage('');
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!form.company_name.trim()) {
      setMessage(
        'Şirket adı boş bırakılamaz.'
      );

      return;
    }

    if (!form.position.trim()) {
      setMessage(
        'Pozisyon boş bırakılamaz.'
      );

      return;
    }

    if (!form.start_date) {
      setMessage(
        'Başlangıç tarihi seçilmelidir.'
      );

      return;
    }

    if (
      !form.is_current &&
      form.end_date &&
      form.end_date < form.start_date
    ) {
      setMessage(
        'Bitiş tarihi başlangıç tarihinden önce olamaz.'
      );

      return;
    }

    setSaving(true);
    setMessage('');

    const experienceData = {
      company_name:
        form.company_name.trim(),

      position:
        form.position.trim(),

      start_date:
        form.start_date,

      end_date:
        form.is_current
          ? null
          : form.end_date || null,

      is_current:
        form.is_current,

      description:
        form.description.trim() || null,

      display_order:
        Number(form.display_order) || 0,

      is_active:
        form.is_active,

      updated_at:
        new Date().toISOString(),
    };

    if (editingExperienceId) {
      const { error } = await supabase
        .from('experiences')
        .update(experienceData)
        .eq(
          'id',
          editingExperienceId
        );

      if (error) {
        console.error(error);

        setMessage(
          'Deneyim güncellenirken bir hata oluştu.'
        );

        setSaving(false);
        return;
      }

      setMessage(
        'Deneyim başarıyla güncellendi.'
      );
    } else {
      const { error } = await supabase
        .from('experiences')
        .insert(experienceData);

      if (error) {
        console.error(error);

        setMessage(
          'Deneyim kaydedilirken bir hata oluştu.'
        );

        setSaving(false);
        return;
      }

      setMessage(
        'Deneyim başarıyla kaydedildi.'
      );
    }

    resetForm();
    await loadExperiences();

    setSaving(false);
  };

  const handleDelete = async (
    experience
  ) => {
    const shouldDelete =
      window.confirm(
        `"${experience.position} - ${experience.company_name}" deneyimini silmek istediğinize emin misiniz?`
      );

    if (!shouldDelete) {
      return;
    }

    setMessage('');

    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq(
        'id',
        experience.id
      );

    if (error) {
      console.error(error);

      setMessage(
        'Deneyim silinirken bir hata oluştu.'
      );

      return;
    }

    if (
      editingExperienceId ===
      experience.id
    ) {
      resetForm();
    }

    setMessage(
      'Deneyim başarıyla silindi.'
    );

    await loadExperiences();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();

    navigate(
      '/admin/login',
      {
        replace: true,
      }
    );
  };

  const formatDate = (date) => {
    if (!date) {
      return '';
    }

    return new Intl.DateTimeFormat(
      'tr-TR',
      {
        month: '2-digit',
        year: 'numeric',
      }
    ).format(
      new Date(
        `${date}T00:00:00`
      )
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
            onClick={() =>
              navigate('/admin')
            }
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
            className="active"
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
              Deneyimler
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
            Deneyim Yönetimi
          </h2>

          <p>
            Portfolyo sitesinde gösterilecek
            iş ve staj deneyimlerinizi
            buradan yönetebilirsiniz.
          </p>

        </div>

        <form
          className="admin-profile-card"
          onSubmit={handleSave}
        >

          <h2>
            {editingExperienceId
              ? 'Deneyimi Düzenle'
              : 'Yeni Deneyim Ekle'}
          </h2>

          <div className="admin-form-grid">

            <div className="admin-form-group">

              <label>
                Şirket Adı
              </label>

              <input
                type="text"
                name="company_name"
                value={
                  form.company_name
                }
                onChange={
                  handleChange
                }
                placeholder="Örn. Lila Cosmetics"
              />

            </div>

            <div className="admin-form-group">

              <label>
                Pozisyon
              </label>

              <input
                type="text"
                name="position"
                value={
                  form.position
                }
                onChange={
                  handleChange
                }
                placeholder="Örn. ERP Stajyeri"
              />

            </div>

            <div className="admin-form-group">

              <label>
                Başlangıç Tarihi
              </label>

              <input
                type="date"
                name="start_date"
                value={
                  form.start_date
                }
                onChange={
                  handleChange
                }
              />

            </div>

            <div className="admin-form-group">

              <label>
                Bitiş Tarihi
              </label>

              <input
                type="date"
                name="end_date"
                value={
                  form.end_date
                }
                onChange={
                  handleChange
                }
                disabled={
                  form.is_current
                }
              />

            </div>

            <div className="admin-form-group admin-form-full">

              <label>
                Açıklama
              </label>

              <textarea
                name="description"
                value={
                  form.description
                }
                onChange={
                  handleChange
                }
                rows="5"
                placeholder="Bu deneyimde yaptığınız çalışmaları açıklayın."
              />

            </div>

            <div className="admin-form-group">

              <label>
                Sıralama
              </label>

              <input
                type="number"
                name="display_order"
                value={
                  form.display_order
                }
                onChange={
                  handleChange
                }
                min="0"
              />

            </div>

            <div className="admin-form-group">

              <label>

                <input
                  type="checkbox"
                  name="is_current"
                  checked={
                    form.is_current
                  }
                  onChange={
                    handleChange
                  }
                />

                {' '}
                Hâlen Devam Ediyor

              </label>

            </div>

            <div className="admin-form-group">

              <label>

                <input
                  type="checkbox"
                  name="is_active"
                  checked={
                    form.is_active
                  }
                  onChange={
                    handleChange
                  }
                />

                {' '}
                Aktif

              </label>

            </div>

          </div>

          {message && (

            <p className="admin-form-message">
              {message}
            </p>

          )}

          <div className="admin-form-actions">

            {editingExperienceId && (

              <button
                type="button"
                className="admin-cancel-button"
                onClick={
                  handleCancelEdit
                }
                disabled={
                  saving
                }
              >
                İptal
              </button>

            )}

            <button
              type="submit"
              className="admin-save-button"
              disabled={
                saving
              }
            >

              {saving
                ? 'Kaydediliyor...'
                : editingExperienceId
                  ? 'Değişiklikleri Kaydet'
                  : 'Deneyimi Kaydet'}

            </button>

          </div>

        </form>

        <div className="admin-profile-card">

          <h2>
            Mevcut Deneyimler
          </h2>

          {loading ? (

            <p>
              Deneyimler yükleniyor...
            </p>

          ) : experiences.length === 0 ? (

            <p>
              Henüz deneyim bulunmuyor.
            </p>

          ) : (

            <div className="admin-project-list">

              {experiences.map(
                (experience) => (

                  <article
                    key={
                      experience.id
                    }
                    className="admin-project-item"
                  >

                    <div>

                      <h3>
                        {
                          experience.position
                        }
                      </h3>

                      <p>
                        {
                          experience.company_name
                        }
                      </p>

                      <p>
                        {formatDate(
                          experience.start_date
                        )}
                        {' - '}
                        {experience.is_current
                          ? 'Devam Ediyor'
                          : formatDate(
                              experience.end_date
                            )}
                      </p>

                    </div>

                    <div className="admin-project-actions">

                      <div className="admin-project-meta">

                        <span>
                          Sıra: {
                            experience.display_order
                          }
                        </span>

                        <span>
                          {experience.is_active
                            ? 'Aktif'
                            : 'Pasif'}
                        </span>

                        {experience.is_current && (

                          <span>
                            Devam Ediyor
                          </span>

                        )}

                      </div>

                      <div className="admin-project-buttons">

                        <button
                          type="button"
                          className="admin-edit-button"
                          onClick={() =>
                            handleEdit(
                              experience
                            )
                          }
                        >
                          Düzenle
                        </button>

                        <button
                          type="button"
                          className="admin-delete-button"
                          onClick={() =>
                            handleDelete(
                              experience
                            )
                          }
                        >
                          Sil
                        </button>

                      </div>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </div>

      </section>

    </main>
  );
}
