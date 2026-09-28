import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowUpRight, Moon, Sun } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { supabase } from '../lib/supabase';
import { profile } from '../data/profile';
import '../styles/blog.css';

function getBlogImageUrls(value) {
  if (!value) {
    return [];
  }

  if (/^https?:\/\//i.test(value)) {
    const marker = '/storage/v1/object/public/blog-images/';
    const markerIndex = value.indexOf(marker);

    if (markerIndex === -1) {
      return [value];
    }

    value = decodeURIComponent(value.slice(markerIndex + marker.length));
  }

  const paths = value.startsWith('blog/')
    ? [value, value.slice(5)]
    : [value, `blog/${value}`];

  return [...new Set(paths)].map((path) => (
    supabase.storage.from('blog-images').getPublicUrl(path).data.publicUrl
  ));
}

function handleBlogImageError(event) {
  const image = event.currentTarget;
  const fallbackIndex = Number(image.dataset.fallbackIndex || '0') + 1;
  const urls = JSON.parse(image.dataset.fallbackUrls || '[]');

  if (urls[fallbackIndex]) {
    image.dataset.fallbackIndex = String(fallbackIndex);
    image.src = urls[fallbackIndex];
    return;
  }

  const placeholder = document.createElement('div');
  placeholder.className = 'blog-image-placeholder';
  placeholder.textContent = 'Blog yazısı';
  image.replaceWith(placeholder);
}

function formatDate(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('tr-TR', { dateStyle: 'long' }).format(new Date(value));
}

function BlogNav({ theme, onToggleTheme }) {
  return (
    <header className="blog-nav">
      <div className="blog-nav-left">
        <Link to="/" className="blog-brand" aria-label="Portfolyoya git">
          {profile.monogram}
        </Link>
      </div>

      <div className="blog-nav-right">
        <Link to="/" className="blog-home-btn">
          <ArrowLeft size={16} />
          Portfolyoya Dön
        </Link>

        <button
          type="button"
          className="blog-theme-toggle"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'}
          title={theme === 'dark' ? 'Açık tema' : 'Koyu tema'}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>
    </header>
  );
}

function BlogFooter() {
  return (
    <footer className="blog-footer">
      <div className="blog-footer-inner">
        <span className="blog-footer-brand">{profile.monogram}</span>
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <Link to="/" className="blog-footer-link">
          ← Portfolyo Ana Sayfası
        </Link>
      </div>
    </footer>
  );
}

export default function Blog({ detail = false }) {
  const { slug } = useParams();
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState(() => {
    return window.localStorage.getItem('portfolio-theme') || 'dark';
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem('portfolio-theme', nextTheme);
  };

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      const query = supabase.from('blog_posts').select('*').eq('is_published', true);
      const result = detail
        ? await query.eq('slug', slug).limit(1).maybeSingle()
        : await query.order('created_at', { ascending: false });

      if (result.error) {
        console.error(result.error);
        setError('Blog yazıları şu anda yüklenemiyor.');
      } else if (detail) {
        setPost(result.data);
      } else {
        setPosts(result.data ?? []);
      }
      setLoading(false);
    }

    load();
  }, [detail, slug]);

  if (detail) {
    return (
      <main className="blog-page blog-detail-page">
        <div className="blog-page-inner">
          <BlogNav theme={theme} onToggleTheme={toggleTheme} />
          <Link className="blog-back-link" to="/blog">
            <ArrowLeft size={17} /> Bloga dön
          </Link>
          {loading ? (
            <p>Yazı yükleniyor...</p>
          ) : error ? (
            <p>{error}</p>
          ) : !post ? (
            <p>Bu yazı bulunamadı.</p>
          ) : (
            <article className="blog-detail">
              {getBlogImageUrls(post.cover_image_url).length > 0 ? (
                <img
                  src={getBlogImageUrls(post.cover_image_url)[0]}
                  data-fallback-urls={JSON.stringify(getBlogImageUrls(post.cover_image_url))}
                  alt=""
                  className="blog-detail-cover"
                  onError={handleBlogImageError}
                />
              ) : (
                <div className="blog-image-placeholder">Blog yazısı</div>
              )}
              <div className="blog-detail-header">
                {post.category && <span className="blog-category">{post.category}</span>}
                <h1>{post.title}</h1>
                <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
              </div>
              <div className="blog-content">{post.content}</div>
            </article>
          )}
          <BlogFooter />
        </div>
      </main>
    );
  }

  return (
    <main className="blog-page">
      <div className="blog-page-inner">
        <BlogNav theme={theme} onToggleTheme={toggleTheme} />
        <header className="blog-page-heading">
          <p className="eyebrow">Düşünceler ve üretim</p>
          <h1>Blog</h1>
          <p>Yazılım, öğrenme süreci ve geliştirme deneyimlerimden notlar.</p>
        </header>
        {loading ? (
          <p>Yazılar yükleniyor...</p>
        ) : error ? (
          <p>{error}</p>
        ) : posts.length === 0 ? (
          <p>Henüz yayınlanmış yazı yok.</p>
        ) : (
          <div className="blog-grid">
            {posts.map((item) => (
              <article className="blog-card" key={item.id}>
                {getBlogImageUrls(item.cover_image_url).length > 0 ? (
                  <img
                    src={getBlogImageUrls(item.cover_image_url)[0]}
                    data-fallback-urls={JSON.stringify(getBlogImageUrls(item.cover_image_url))}
                    alt=""
                    onError={handleBlogImageError}
                  />
                ) : (
                  <div className="blog-image-placeholder">Blog yazısı</div>
                )}
                <div className="blog-card-body">
                  <div className="blog-card-meta">
                    <span className="blog-category">{item.category || 'Notlar'}</span>
                    <time>{formatDate(item.created_at)}</time>
                  </div>
                  <h2>{item.title}</h2>
                  <p>{item.content?.slice(0, 150)}{item.content?.length > 150 ? '...' : ''}</p>
                  <Link to={`/blog/${item.slug}`}>
                    Yazıyı oku <ArrowUpRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
        <BlogFooter />
      </div>
    </main>
  );
}
