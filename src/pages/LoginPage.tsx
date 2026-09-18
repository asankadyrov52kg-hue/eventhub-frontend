import { useState, type FormEvent,  } from "react";
import "./LoginPage.css";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginPageProps {
  onSubmit?: (data: LoginFormData) => Promise<void> | void;
  onNavigateToRegister?: () => void;
}

export default function LoginPage({
  onSubmit,
  onNavigateToRegister,
}: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Заполните оба поля.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Введите корректный адрес электронной почты.");
      return;
    }

    if (onSubmit) {
      await onSubmit({ email, password });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Вход</h1>
        <p className="login-subtitle">
          Войдите в свой аккаунт, чтобы
          <br />
          управлять мероприятиями и покупать билеты
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Электронная почта</label>
            <div className="input-icon-wrapper">
              {/* Иконка конверта */}
              <svg
                className="input-icon icon-left"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <div className="input-icon-wrapper">
              {/* Иконка замка */}
              <svg
                className="input-icon icon-left"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* Иконка глазика */}
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg
                    className="input-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg
                    className="input-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                    <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                    <line x1="2" y1="2" x2="22" y2="22" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Войти
          </button>
        </form>

        <div className="divider-container">
          <span className="divider-line"></span>
          <span className="divider-text">Нет аккаунта?</span>
          <span className="divider-line"></span>
        </div>

        <button
          type="button"
          className="register-btn"
          onClick={onNavigateToRegister}
        >
          Зарегистрироваться
        </button>
      </div>
    </div>
  );
}
