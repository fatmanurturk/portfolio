import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import '../styles/admin.css';

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        navigate('/admin', {
          replace: true,
        });
      }
    };

    checkSession();
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();

    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage(
        'Lütfen e-posta adresinizi ve şifrenizi girin.'
      );

      return;
    }

    try {
      setLoading(true);

      const { error } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (error) {
        setErrorMessage(
          'E-posta adresi veya şifre hatalı.'
        );

        return;
      }

      navigate('/admin', {
        replace: true,
      });
    } catch (error) {
      console.error(error);

      setErrorMessage(
        'Giriş sırasında beklenmeyen bir hata oluştu.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">

      <section className="admin-login-card">

        <div className="admin-logo">
          FNT.
        </div>

        <p className="admin-eyebrow">
          Portfolyo Yönetimi
        </p>

        <h1>
          Yönetici Girişi
        </h1>

        <p className="admin-login-description">
          Portfolyo içeriğini yönetmek için
          hesabınızla giriş yapın.
        </p>

        <form
          className="admin-login-form"
          onSubmit={handleLogin}
        >

          <div className="admin-field">

            <label htmlFor="admin-email">
              E-posta
            </label>

            <input
              id="admin-email"
              type="email"
              value={email}
              autoComplete="email"
              placeholder="E-posta adresiniz"
              onChange={(event) =>
                setEmail(event.target.value)
              }
            />

          </div>

          <div className="admin-field">

            <label htmlFor="admin-password">
              Şifre
            </label>

            <input
              id="admin-password"
              type="password"
              value={password}
              autoComplete="current-password"
              placeholder="Şifreniz"
              onChange={(event) =>
                setPassword(event.target.value)
              }
            />

          </div>

          {errorMessage && (
            <div className="admin-error">
              {errorMessage}
            </div>
          )}

          <button
            className="admin-login-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Giriş yapılıyor...'
              : 'Giriş Yap'}
          </button>

        </form>

        <button
          type="button"
          className="admin-back-button"
          onClick={() => navigate('/')}
        >
          ← Portfolyoya dön
        </button>

      </section>

    </main>
  );
}