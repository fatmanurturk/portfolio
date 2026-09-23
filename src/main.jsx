import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';

import App from './App.jsx';

import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminProfile from './pages/AdminProfile.jsx';
import AdminProjects from './pages/AdminProjects.jsx';
import AdminSkills from './pages/AdminSkills.jsx';
import AdminExperiences from './pages/AdminExperience.jsx';
import AdminCertificates from './pages/AdminCertificates.jsx';
import AdminCv from './pages/AdminCv.jsx';

import ProtectedRoute from './components/ProtectedRoute.jsx';

import './styles/global.css';
import './styles/admin.css';

createRoot(
  document.getElementById('root')
).render(
  <StrictMode>

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<App />}
        />

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        <Route
          element={<ProtectedRoute />}
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

        </Route>

        <Route
          path="*"
          element={<App />}
        />

      </Routes>

    </BrowserRouter>

  </StrictMode>
);
