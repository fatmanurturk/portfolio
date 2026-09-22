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

        <Route element={<ProtectedRoute />}>
          <Route
            path="/admin"
            element={<AdminDashboard />}
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