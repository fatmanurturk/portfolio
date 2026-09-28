import { StrictMode, Suspense, lazy, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';

import App from './App.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Blog sayfası: normal kullanıcılar göreceği için eager yüklenir
import Blog from './pages/Blog.jsx';

// ─── Admin sayfaları — sadece /admin/* rotasına gidildiğinde yüklenir ─────────
const AdminLogin       = lazy(() => import('./pages/AdminLogin.jsx'));
const AdminDashboard   = lazy(() => import('./pages/AdminDashboard.jsx'));
const AdminProfile     = lazy(() => import('./pages/AdminProfile.jsx'));
const AdminProjects    = lazy(() => import('./pages/AdminProjects.jsx'));
const AdminSkills      = lazy(() => import('./pages/AdminSkills.jsx'));
const AdminExperiences = lazy(() => import('./pages/AdminExperience.jsx'));
const AdminCertificates = lazy(() => import('./pages/AdminCertificates.jsx'));
const AdminCv          = lazy(() => import('./pages/AdminCv.jsx'));
const AdminBlog        = lazy(() => import('./pages/AdminBlog.jsx'));

import './styles/global.css';
import './styles/admin.css';
import './styles/blog.css';

function ThemeSync() {
  useEffect(() => {
    const applyTheme = () => {
      const theme = window.localStorage.getItem('portfolio-theme') || 'dark';
      document.documentElement.dataset.theme = theme;
    };

    applyTheme();
    window.addEventListener('storage', applyTheme);
    return () => window.removeEventListener('storage', applyTheme);
  }, []);

  return null;
}

/** Admin rotaları yüklenirken gösterilen basit yükleme ekranı */
function AdminLoadingFallback() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
        fontSize: '0.9rem',
        opacity: 0.5,
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      Yükleniyor…
    </div>
  );
}

createRoot(
  document.getElementById('root')
).render(
  <StrictMode>

    <ThemeSync />

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<App />}
        />

        <Route
          path="/blog"
          element={<Blog />}
        />

        <Route
          path="/blog/:slug"
          element={<Blog detail />}
        />

        {/* ── Admin rotaları — lazy bundle ───────────────────────────────── */}
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <AdminLogin />
            </Suspense>
          }
        />

        <Route
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute />
            </Suspense>
          }
        >

          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/profile"
            element={<AdminProfile />}
          />

          <Route
            path="/admin/projects"
            element={<AdminProjects />}
          />

          <Route
            path="/admin/skills"
            element={<AdminSkills />}
          />

          <Route
            path="/admin/experiences"
            element={<AdminExperiences />}
          />

          <Route
            path="/admin/certificates"
            element={<AdminCertificates />}
          />

          <Route
            path="/admin/cv"
            element={<AdminCv />}
          />

          <Route
            path="/admin/blog"
            element={<AdminBlog />}
          />

        </Route>

        <Route
          path="*"
          element={<App />}
        />

      </Routes>

    </BrowserRouter>

  </StrictMode>
);
