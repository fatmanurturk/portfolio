import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { supabase } from '../lib/supabase';
import '../styles/admin.css';

const emptyForm = {
  title: '',
  slug: '',
  content: '',
  cover_image_url: '',
  category: '',
  status: 'draft',
};

function slugify(value) {
  return value
    .toLocaleLowerCase('tr-TR')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function AdminBlog() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingPostId, setEditingPostId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      setMessage(`Blog yazıları yüklenemedi: ${error.message}`);
      setLoading(false);
      return;
    }

    setPosts(data ?? []);
    setLoading(false);
  };

  const resetForm = () => {
    setEditingPostId(null);
    setForm(emptyForm);
    setImageFile(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleTitleChange = (event) => {
    const { value } = event.target;
    setForm((current) => ({
      ...current,
      title: value,
      slug: editingPostId ? current.slug : slugify(value),
    }));
  };

  const handleEdit = (post) => {
    setEditingPostId(post.id);
    setForm({
      title: post.title ?? '',
      slug: post.slug ?? '',
      content: post.content ?? '',
      cover_image_url: post.cover_image_url ?? '',
      category: post.category ?? '',
      status: post.is_published ? 'published' : 'draft',
    });
    setImageFile(null);
    setMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const uploadCoverImage = async () => {
    if (!imageFile) {
      return form.cover_image_url.trim() || null;
    }

    if (!imageFile.type.startsWith('image/')) {
      throw new Error('Lütfen geçerli bir kapak görseli seçin.');
    }

    if (imageFile.size > 5 * 1024 * 1024) {
      throw new Error('Kapak görseli 5 MB boyutundan küçük olmalıdır.');
    }

    const extension = imageFile.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filePath = `blog/${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage
      .from('blog-images')
      .upload(filePath, imageFile, {
        cacheControl: '3600',
        contentType: imageFile.type,
        upsert: false,
      });

    if (error) {
      throw new Error(
        error.message.includes('Bucket not found')
          ? 'blog-images Storage bucket bulunamadı. Supabase Storage bölümünde public bir blog-images bucket oluşturun.'
          : error.message.includes('row-level security')
            ? 'blog-images bucket için Storage INSERT policy eksik. Supabase Storage policy ayarlarını kontrol edin.'
          : `Kapak görseli yüklenemedi: ${error.message}`
      );
    }

    return supabase.storage.from('blog-images').getPublicUrl(filePath).data.publicUrl;
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.content.trim()) {
      setMessage('Başlık ve içerik alanları boş bırakılamaz.');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const coverImageUrl = await uploadCoverImage();
      const baseSlug = form.slug.trim() || slugify(form.title);
      let postSlug = baseSlug;
      let slugSuffix = 1;

      while (true) {
        const { data: existingPost, error: slugError } = await supabase
          .from('blog_posts')
          .select('id')
          .eq('slug', postSlug)
          .neq('id', editingPostId ?? -1)
          .limit(1)
          .maybeSingle();

        if (slugError) {
          throw slugError;
        }

        if (!existingPost) {
          break;
        }

        slugSuffix += 1;
        postSlug = `${baseSlug}-${slugSuffix}`;
      }

      const postData = {
        title: form.title.trim(),
        slug: postSlug,
        content: form.content.trim(),
        cover_image_url: coverImageUrl,
        category: form.category.trim() || null,
        is_published: form.status === 'published',
        updated_at: new Date().toISOString(),
      };

      let result;

      for (let attempt = 0; attempt < 10; attempt += 1) {
        const saveData = {
          ...postData,
          slug: postSlug,
        };

        result = editingPostId
          ? await supabase.from('blog_posts').update(saveData).eq('id', editingPostId)
          : await supabase.from('blog_posts').insert(saveData);

        if (!result.error) {
          break;
        }

        if (result.error.code !== '23505') {
          break;
        }

        slugSuffix += 1;
        postSlug = `${baseSlug}-${slugSuffix}`;
      }

      if (result.error) {
        throw result.error;
      }

      setMessage(editingPostId ? 'Yazı güncellendi.' : 'Yazı oluşturuldu.');
      resetForm();
      await loadPosts();
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : 'Blog yazısı kaydedilemedi.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (post) => {
    if (!window.confirm(`"${post.title}" yazısını silmek istediğinize emin misiniz?`)) {
      return;
    }

    const { error } = await supabase.from('blog_posts').delete().eq('id', post.id);
    if (error) {
      setMessage(`Yazı silinemedi: ${error.message}`);
      return;
    }

    if (editingPostId === post.id) {
      resetForm();
    }

    setMessage('Yazı silindi.');
    await loadPosts();
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
          <button className="active">Blog</button>
          <button onClick={() => navigate('/admin/cv')}>CV</button>
        </nav>
        <button className="admin-logout-button" onClick={handleLogout}>Çıkış Yap</button>
      </aside>

      <section className="admin-content">
        <header className="admin-content-header">
          <div>
            <p>Yönetim Paneli</p>
            <h1>Blog</h1>
          </div>
          <button className="admin-view-site" onClick={() => navigate('/blog')}>Blogu Görüntüle</button>
        </header>

        <form className="admin-profile-card" onSubmit={handleSave}>
          <h2>{editingPostId ? 'Yazıyı Düzenle' : 'Yeni Yazı Ekle'}</h2>
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label htmlFor="blog-title">Başlık</label>
              <input id="blog-title" name="title" value={form.title} onChange={handleTitleChange} placeholder="Yazı başlığı" />
            </div>
            <div className="admin-form-group">
              <label htmlFor="blog-category">Kategori</label>
              <input id="blog-category" name="category" value={form.category} onChange={handleChange} placeholder="Örn. Yazılım" />
            </div>
          </div>
          <div className="admin-form-group">
            <label htmlFor="blog-slug">Slug</label>
            <input id="blog-slug" name="slug" value={form.slug} onChange={handleChange} placeholder="yazi-basligi" />
          </div>
          <div className="admin-form-group">
            <label htmlFor="blog-content">İçerik</label>
            <textarea id="blog-content" name="content" value={form.content} onChange={handleChange} rows="12" placeholder="Blog yazınız..." />
          </div>
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label htmlFor="blog-image">Kapak görseli</label>
              <input id="blog-image" type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] ?? null)} />
              <small>İsterseniz mevcut bir görsel URL'si de kullanabilirsiniz.</small>
              <input name="cover_image_url" value={form.cover_image_url} onChange={handleChange} placeholder="https://..." />
            </div>
            <div className="admin-form-group">
              <label htmlFor="blog-status">Yayın durumu</label>
              <select id="blog-status" name="status" value={form.status} onChange={handleChange}>
                <option value="draft">Taslak</option>
                <option value="published">Yayınlandı</option>
              </select>
            </div>
          </div>
          <div className="admin-form-actions">
            <button className="admin-primary-button" type="submit" disabled={saving}>{saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}</button>
            {editingPostId && <button className="admin-secondary-button" type="button" onClick={resetForm}>İptal</button>}
          </div>
          {message && <p className="admin-form-message">{message}</p>}
        </form>

        <div className="admin-profile-card">
          <h2>Mevcut Yazılar</h2>
          {loading ? <p>Yazılar yükleniyor...</p> : posts.length === 0 ? <p>Henüz blog yazısı eklenmemiş.</p> : (
            <div className="admin-list">
              {posts.map((post) => (
                <article className="admin-list-item" key={post.id}>
                  <div>
                    <strong>{post.title}</strong>
                    <p>{post.category || 'Kategorisiz'} · {post.is_published ? 'Yayınlandı' : 'Taslak'}</p>
                  </div>
                  <div className="admin-list-actions">
                    <button type="button" onClick={() => handleEdit(post)}>Düzenle</button>
                    <button type="button" onClick={() => handleDelete(post)}>Sil</button>
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
