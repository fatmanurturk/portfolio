import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ui } from '../lib/i18n';
import { supabase } from '../lib/supabase';

function getBlogImageUrls(value) {
  if (!value) return [];

  if (/^https?:\/\//i.test(value)) {
    const marker = '/storage/v1/object/public/blog-images/';
    const markerIndex = value.indexOf(marker);
    if (markerIndex === -1) return [value];
    value = decodeURIComponent(value.slice(markerIndex + marker.length));
  }

  const paths = value.startsWith('blog/')
    ? [value, value.slice(5)]
    : [value, `blog/${value}`];

  return [...new Set(paths)].map(
    (path) => supabase.storage.from('blog-images').getPublicUrl(path).data.publicUrl
  );
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

export default function BlogPreviewSection({ language, posts }) {
  const copy = ui[language];

  return (
    <section
      className="blog-preview-section section-shell"
      id="blog"
      data-reveal
    >
      <div className="section-heading-row">
        <div>
          <p className="eyebrow">
            {language === 'tr' ? 'Düşünceler ve üretim' : 'Thoughts and building'}
          </p>
          <h2>{copy.blog}</h2>
        </div>
        <Link className="text-link" to="/blog">
          {language === 'tr' ? 'Tüm yazıları gör' : 'View all posts'}
          <ArrowUpRight size={16} />
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="blog-preview-empty">
          {language === 'tr'
            ? 'Yakında yeni yazılar burada olacak.'
            : 'New posts will be here soon.'}
        </p>
      ) : (
        <div className="blog-preview-grid">
          {posts.map((post) => {
            const imageUrls = getBlogImageUrls(post.cover_image_url);
            return (
              <article className="blog-preview-card" key={post.id}>
                {imageUrls.length > 0 ? (
                  <img
                    src={imageUrls[0]}
                    data-fallback-urls={JSON.stringify(imageUrls)}
                    alt=""
                    onError={handleBlogImageError}
                  />
                ) : (
                  <div className="blog-image-placeholder">Blog yazısı</div>
                )}
                <div>
                  <span>
                    {post.category || (language === 'tr' ? 'Notlar' : 'Notes')}
                  </span>
                  <h3>{post.title}</h3>
                  <p>
                    {post.content?.slice(0, 120)}
                    {post.content?.length > 120 ? '...' : ''}
                  </p>
                  <Link className="text-link" to={`/blog/${post.slug}`}>
                    {language === 'tr' ? 'Yazıyı oku' : 'Read post'}
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
