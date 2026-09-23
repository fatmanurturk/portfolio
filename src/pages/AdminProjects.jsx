import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { supabase } from '../lib/supabase';
import '../styles/admin.css';

export default function AdminProjects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [editingProjectId, setEditingProjectId] = useState(null);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    short_description: '',
    description: '',
    image_url: '',
    github_url: '',
    live_url: '',
    is_featured: false,
    is_active: true,
    display_order: 0,
  });

  const [technologies, setTechnologies] = useState('');
  const [features, setFeatures] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true })
      .order('id', { ascending: true });

    if (error) {
      console.error(error);
      setMessage('Projeler yüklenirken bir hata oluştu.');
      setLoading(false);
      return;
    }

    setProjects(data ?? []);
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

  const generateSlug = (text) => {
    return text
      .toLocaleLowerCase('tr-TR')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (event) => {
    const value = event.target.value;

    setForm((current) => ({
      ...current,
      title: value,
      slug:
        editingProjectId
          ? current.slug
          : generateSlug(value),
    }));
  };

  const resetForm = () => {
    setEditingProjectId(null);

    setForm({
      title: '',
      slug: '',
      short_description: '',
      description: '',
      image_url: '',
      github_url: '',
      live_url: '',
      is_featured: false,
      is_active: true,
      display_order: 0,
    });

    setTechnologies('');
    setFeatures('');
  };

  const loadProjectDetails = async (project) => {
    setMessage('');

    // Önce temel proje bilgilerini hemen forma doldur.
    // Teknoloji veya özellik sorgusunda sorun olsa bile
    // düzenleme formu boş kalmasın.
    setEditingProjectId(project.id);

    setForm({
      title: project.title ?? '',
      slug: project.slug ?? '',
      short_description:
        project.short_description ?? '',
      description:
        project.description ?? '',
      image_url:
        project.image_url ?? '',
      github_url:
        project.github_url ?? '',
      live_url:
        project.live_url ?? '',
      is_featured:
        project.is_featured ?? false,
      is_active:
        project.is_active ?? true,
      display_order:
        project.display_order ?? 0,
    });

    setTechnologies('');
    setFeatures('');

    const [
      technologiesResult,
      featuresResult,
    ] = await Promise.all([
      supabase
        .from('project_technologies')
        .select('*')
        .eq('project_id', project.id),

      supabase
        .from('project_features')
        .select('*')
        .eq('project_id', project.id),
    ]);

    if (technologiesResult.error) {
      console.error(
        'Proje teknolojileri yüklenemedi:',
        technologiesResult.error
      );

      setMessage(
        'Proje bilgileri yüklendi ancak teknolojiler getirilemedi.'
      );
    } else {
      const technologyIds = (technologiesResult.data ?? [])
        .map((item) => item.technology_id)
        .filter(Boolean);

      const { data: technologyRows, error: technologyError } = await supabase
        .from('technologies')
        .select('id, name')
        .in('id', technologyIds);

      if (technologyError) {
        throw technologyError;
      }

      const technologyNames = new Map(
        (technologyRows ?? []).map((item) => [item.id, item.name])
      );

      setTechnologies(
        (technologiesResult.data ?? [])
          .map((item) => technologyNames.get(item.technology_id))
          .filter(Boolean)
          .join(', ')
      );
    }

    if (featuresResult.error) {
      console.error(
        'Proje özellikleri yüklenemedi:',
        featuresResult.error
      );

      setMessage((current) =>
        current
          ? `${current} Proje özellikleri de getirilemedi.`
          : 'Proje bilgileri yüklendi ancak proje özellikleri getirilemedi.'
      );
    } else {
      setFeatures(
        (featuresResult.data ?? [])
          .map((item) => item.feature)
          .join('\n')
      );
    }

    // Form sayfanın üst kısmında olduğu için yukarı taşı.
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const saveTechnologies = async (projectId) => {
    const { error: deleteError } = await supabase
      .from('project_technologies')
      .delete()
      .eq('project_id', projectId);

    if (deleteError) {
      throw deleteError;
    }

    const technologyList = technologies
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    if (technologyList.length === 0) {
      return;
    }

    const { data: technologyRecords, error: technologyLookupError } = await supabase
      .from('technologies')
      .select('id, name')
      .in('name', technologyList);

    if (technologyLookupError) {
      throw technologyLookupError;
    }

    const technologyIds = new Map(
      (technologyRecords ?? []).map((item) => [item.name.toLowerCase(), item.id])
    );

    const missingTechnology = technologyList.find(
      (technology) => !technologyIds.has(technology.toLowerCase())
    );

    if (missingTechnology) {
      throw new Error(
        `Yetenekler bölümünde "${missingTechnology}" kaydı bulunamadı.`
      );
    }

    const technologyRows = technologyList.map((technology) => ({
      project_id: projectId,
      technology_id: technologyIds.get(technology.toLowerCase()),
    }));

    const { error: insertError } = await supabase
      .from('project_technologies')
      .insert(technologyRows);

    if (insertError) {
      throw insertError;
    }
  };

  const saveFeatures = async (projectId) => {
    const { error: deleteError } = await supabase
      .from('project_features')
      .delete()
      .eq('project_id', projectId);

    if (deleteError) {
      throw deleteError;
    }

    const featureList = features
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);

    if (featureList.length === 0) {
      return;
    }

    const featureRows = featureList.map((feature) => ({
      project_id: projectId,
      feature_name: feature,
    }));

    const { error: insertError } = await supabase
      .from('project_features')
      .insert(featureRows);

    if (insertError) {
      throw insertError;
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setMessage('Proje adı boş bırakılamaz.');
      return;
    }

    if (!form.slug.trim()) {
      setMessage('Slug alanı boş bırakılamaz.');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      let projectSlug = form.slug.trim();
      let slugSuffix = 1;

      while (true) {
        const { data: existingProject, error: slugError } = await supabase
          .from('projects')
          .select('id')
          .eq('slug', projectSlug)
          .neq('id', editingProjectId ?? -1)
          .limit(1)
          .maybeSingle();

        if (slugError) {
          throw slugError;
        }

        if (!existingProject) {
          break;
        }

        slugSuffix += 1;
        projectSlug = `${form.slug.trim()}-${slugSuffix}`;
      }

      let projectId = editingProjectId;

      if (editingProjectId) {
        const { error: updateError } = await supabase
          .from('projects')
          .update({
            title: form.title.trim(),
            slug: projectSlug,
            short_description:
              form.short_description.trim() || null,
            description:
              form.description.trim() || null,
            image_url:
              form.image_url.trim() || null,
            github_url:
              form.github_url.trim() || null,
            live_url:
              form.live_url.trim() || null,
            is_featured:
              form.is_featured,
            is_active:
              form.is_active,
            display_order:
              Number(form.display_order) || 0,
            updated_at:
              new Date().toISOString(),
          })
          .eq('id', editingProjectId);

        if (updateError) {
          throw updateError;
        }
      } else {
        const {
          data: projectData,
          error: projectError,
        } = await supabase
          .from('projects')
          .insert({
            title: form.title.trim(),
            slug: projectSlug,
            short_description:
              form.short_description.trim() || null,
            description:
              form.description.trim() || null,
            image_url:
              form.image_url.trim() || null,
            github_url:
              form.github_url.trim() || null,
            live_url:
              form.live_url.trim() || null,
            is_featured:
              form.is_featured,
            is_active:
              form.is_active,
            display_order:
              Number(form.display_order) || 0,
            updated_at:
              new Date().toISOString(),
          })
          .select()
          .single();

        if (projectError) {
          throw projectError;
        }

        projectId = projectData.id;
      }

      await saveTechnologies(projectId);
      await saveFeatures(projectId);

      setMessage(
        editingProjectId
          ? 'Proje başarıyla güncellendi.'
          : 'Proje başarıyla kaydedildi.'
      );

      resetForm();
      await loadProjects();
    } catch (error) {
      console.error(error);

      setMessage(
        editingProjectId
          ? 'Proje güncellenirken bir hata oluştu.'
          : 'Proje kaydedilirken bir hata oluştu.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (project) => {
    const shouldDelete = window.confirm(
      `"${project.title}" projesini silmek istediğinize emin misiniz?`
    );

    if (!shouldDelete) {
      return;
    }

    setMessage('');

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', project.id);

    if (error) {
      console.error(error);
      setMessage(
        'Proje silinirken bir hata oluştu.'
      );
      return;
    }

    if (editingProjectId === project.id) {
      resetForm();
    }

    setMessage('Proje başarıyla silindi.');
    await loadProjects();
  };

  const handleCancelEdit = () => {
    resetForm();
    setMessage('');
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

          <button
            onClick={() => navigate('/admin')}
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate('/admin/profile')}
          >
            Profil
          </button>

          <button className="active">
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

            <h1>
              Projeler
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
            Proje Yönetimi
          </h2>

          <p>
            Portfolyo sitesinde gösterilecek projeleri
            buradan ekleyebilir, düzenleyebilir ve silebilirsiniz.
          </p>

        </div>

        <form
          className="admin-profile-card"
          onSubmit={handleSave}
        >

          <h2>
            {editingProjectId
              ? 'Projeyi Düzenle'
              : 'Yeni Proje Ekle'}
          </h2>

          <div className="admin-form-grid">

            <div className="admin-form-group">
              <label>Proje Adı</label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleTitleChange}
                placeholder="Örn. Üretim Yönetim Sistemi"
              />
            </div>

            <div className="admin-form-group">
              <label>Slug</label>

              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="uretim-yonetim-sistemi"
              />
            </div>

            <div className="admin-form-group admin-form-full">
              <label>Kısa Açıklama</label>

              <textarea
                name="short_description"
                value={form.short_description}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="admin-form-group admin-form-full">
              <label>Detaylı Açıklama</label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="5"
              />
            </div>

            <div className="admin-form-group">
              <label>Proje Görsel URL</label>

              <input
                type="url"
                name="image_url"
                value={form.image_url}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label>GitHub URL</label>

              <input
                type="url"
                name="github_url"
                value={form.github_url}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label>Canlı Site URL</label>

              <input
                type="url"
                name="live_url"
                value={form.live_url}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label>Sıralama</label>

              <input
                type="number"
                name="display_order"
                value={form.display_order}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className="admin-form-group admin-form-full">
              <label>Teknolojiler</label>

              <input
                type="text"
                value={technologies}
                onChange={(event) =>
                  setTechnologies(event.target.value)
                }
                placeholder="C#, .NET, DevExpress, SQL Server"
              />
            </div>

            <div className="admin-form-group admin-form-full">
              <label>
                Proje Özellikleri
              </label>

              <textarea
                value={features}
                onChange={(event) =>
                  setFeatures(event.target.value)
                }
                rows="6"
                placeholder={
                  'Her özelliği ayrı satıra yazın.\n' +
                  'Stok yönetimi\n' +
                  'Üretim takibi\n' +
                  'Kalite kontrol'
                }
              />
            </div>

            <div className="admin-form-group">
              <label>
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={form.is_featured}
                  onChange={handleChange}
                />

                {' '}
                Öne Çıkan Proje
              </label>
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

            {editingProjectId && (
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
                : editingProjectId
                  ? 'Değişiklikleri Kaydet'
                  : 'Projeyi Kaydet'}
            </button>

          </div>

        </form>

        <div className="admin-profile-card">

          <h2>
            Mevcut Projeler
          </h2>

          {loading ? (

            <p>Projeler yükleniyor...</p>

          ) : projects.length === 0 ? (

            <p>Henüz proje bulunmuyor.</p>

          ) : (

            <div className="admin-project-list">

              {projects.map((project) => (

                <article
                  key={project.id}
                  className="admin-project-item"
                >

                  <div>

                    <h3>
                      {project.title}
                    </h3>

                    <p>
                      {project.short_description ||
                        'Kısa açıklama bulunmuyor.'}
                    </p>

                  </div>

                  <div className="admin-project-actions">

                    <div className="admin-project-meta">

                      <span>
                        Sıra: {project.display_order}
                      </span>

                      <span>
                        {project.is_active
                          ? 'Aktif'
                          : 'Pasif'}
                      </span>

                      {project.is_featured && (
                        <span>
                          Öne Çıkan
                        </span>
                      )}

                    </div>

                    <div className="admin-project-buttons">

                      <button
                        type="button"
                        className="admin-edit-button"
                        onClick={() =>
                          loadProjectDetails(project)
                        }
                      >
                        Düzenle
                      </button>

                      <button
                        type="button"
                        className="admin-delete-button"
                        onClick={() =>
                          handleDelete(project)
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
