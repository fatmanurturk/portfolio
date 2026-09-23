import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { supabase } from '../lib/supabase';
import '../styles/admin.css';

export default function AdminSkills() {
  const navigate = useNavigate();

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [editingSkillId, setEditingSkillId] =
    useState(null);

  const [form, setForm] = useState({
    name: '',
    category: '',
    icon_name: '',
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('technologies')
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
        'Yetenekler yüklenirken bir hata oluştu.'
      );

      setLoading(false);
      return;
    }

    setSkills(data ?? []);
    setLoading(false);
  };

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((current) => ({
      ...current,

      [name]:
        type === 'checkbox'
          ? checked
          : value,
    }));
  };

  const resetForm = () => {
    setEditingSkillId(null);

    setForm({
      name: '',
      category: '',
      icon_name: '',
      display_order: 0,
      is_active: true,
    });
  };

  const handleEdit = (skill) => {
    setMessage('');

    setEditingSkillId(skill.id);

    setForm({
      name:
        skill.name ?? '',

      category:
        skill.category ?? '',

      icon_name:
        skill.icon_name ?? '',

      display_order:
        skill.display_order ?? 0,

      is_active:
        skill.is_active ?? true,
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

    if (!form.name.trim()) {
      setMessage(
        'Yetenek adı boş bırakılamaz.'
      );

      return;
    }

    setSaving(true);
    setMessage('');

    const skillData = {
      name:
        form.name.trim(),

      category:
        form.category.trim() || null,

      icon_name:
        form.icon_name.trim() || null,

      display_order:
        Number(form.display_order) || 0,

      is_active:
        form.is_active,
    };

    if (editingSkillId) {
      const { error } = await supabase
        .from('technologies')
        .update(skillData)
        .eq('id', editingSkillId);

      if (error) {
        console.error(error);

        if (
          error.code === '23505'
        ) {
          setMessage(
            'Bu yetenek zaten mevcut.'
          );
        } else {
          setMessage(
            'Yetenek güncellenirken bir hata oluştu.'
          );
        }

        setSaving(false);
        return;
      }

      setMessage(
        'Yetenek başarıyla güncellendi.'
      );
    } else {
      const { error } = await supabase
        .from('technologies')
        .insert(skillData);

      if (error) {
        console.error(error);

        if (
          error.code === '23505'
        ) {
          setMessage(
            'Bu yetenek zaten mevcut.'
          );
        } else {
          setMessage(
            'Yetenek kaydedilirken bir hata oluştu.'
          );
        }

        setSaving(false);
        return;
      }

      setMessage(
        'Yetenek başarıyla kaydedildi.'
      );
    }

    resetForm();
    await loadSkills();

    setSaving(false);
  };

  const handleDelete = async (skill) => {
    const shouldDelete =
      window.confirm(
        `"${skill.name}" yeteneğini silmek istediğinize emin misiniz?`
      );

    if (!shouldDelete) {
      return;
    }

    setMessage('');

    const { error } = await supabase
      .from('technologies')
      .delete()
      .eq('id', skill.id);

    if (error) {
      console.error(error);

      setMessage(
        'Yetenek silinirken bir hata oluştu.'
      );

      return;
    }

    if (
      editingSkillId === skill.id
    ) {
      resetForm();
    }

    setMessage(
      'Yetenek başarıyla silindi.'
    );

    await loadSkills();
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
            className="active"
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

            <p>
              Yönetim Paneli
            </p>

            <h1>
              Yetenekler
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
            Yetenek Yönetimi
          </h2>

          <p>
            Portfolyo sitesinde gösterilecek
            teknoloji ve yeteneklerinizi
            buradan yönetebilirsiniz.
          </p>

        </div>


        <form
          className="admin-profile-card"
          onSubmit={handleSave}
        >

          <h2>
            {editingSkillId
              ? 'Yeteneği Düzenle'
              : 'Yeni Yetenek Ekle'}
          </h2>

          <div className="admin-form-grid">

            <div className="admin-form-group">

              <label>
                Yetenek Adı
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Örn. C#"
              />

            </div>


            <div className="admin-form-group">

              <label>
                Kategori
              </label>

              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Örn. Backend & Masaüstü"
              />

            </div>


            <div className="admin-form-group">

              <label>
                İkon Adı
              </label>

              <input
                type="text"
                name="icon_name"
                value={form.icon_name}
                onChange={handleChange}
                placeholder="Örn. code"
              />

            </div>


            <div className="admin-form-group">

              <label>
                Sıralama
              </label>

              <input
                type="number"
                name="display_order"
                value={form.display_order}
                onChange={handleChange}
                min="0"
              />

            </div>


            <div className="admin-form-group">

              <label>

                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
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

            {editingSkillId && (

              <button
                type="button"
                className="admin-cancel-button"
                onClick={handleCancelEdit}
                disabled={saving}
              >
                İptal
              </button>

            )}

            <button
              type="submit"
              className="admin-save-button"
              disabled={saving}
            >

              {saving
                ? 'Kaydediliyor...'
                : editingSkillId
                  ? 'Değişiklikleri Kaydet'
                  : 'Yeteneği Kaydet'}

            </button>

          </div>

        </form>


        <div className="admin-profile-card">

          <h2>
            Mevcut Yetenekler
          </h2>

          {loading ? (

            <p>
              Yetenekler yükleniyor...
            </p>

          ) : skills.length === 0 ? (

            <p>
              Henüz yetenek bulunmuyor.
            </p>

          ) : (

            <div className="admin-project-list">

              {skills.map((skill) => (

                <article
                  key={skill.id}
                  className="admin-project-item"
                >

                  <div>

                    <h3>
                      {skill.name}
                    </h3>

                    <p>
                      {skill.category ||
                        'Kategori belirtilmemiş.'}
                    </p>

                  </div>


                  <div className="admin-project-actions">

                    <div className="admin-project-meta">

                      <span>
                        Sıra: {skill.display_order}
                      </span>

                      <span>
                        {skill.is_active
                          ? 'Aktif'
                          : 'Pasif'}
                      </span>

                      {skill.icon_name && (

                        <span>
                          İkon: {skill.icon_name}
                        </span>

                      )}

                    </div>


                    <div className="admin-project-buttons">

                      <button
                        type="button"
                        className="admin-edit-button"
                        onClick={() =>
                          handleEdit(skill)
                        }
                      >
                        Düzenle
                      </button>

                      <button
                        type="button"
                        className="admin-delete-button"
                        onClick={() =>
                          handleDelete(skill)
                        }
                      >
                        Sil
                      </button>

                    </div>

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