import styles from './Header.module.css';

export type View =
  | "login"
  | "register"
  | "events"
  | "my-events"
  | "create-event";

interface HeaderProps {
  currentView: View;
  isLoggedIn: boolean;
  onNavigate: (view: View) => void;
  onLogout: () => void;
}

function Header({ currentView, isLoggedIn, onNavigate, onLogout }: HeaderProps) {
  return (
    <header className={styles.header}>
      
      <div className={styles.leftSection}>
        
        <div className={styles.logoWrapper} onClick={() => onNavigate("events")}>
          <svg xmlns="http:www.w3.org" viewBox="0 0 150 40" width="130" height="35">
            <text x="0" y="28" fontSize="26" letterSpacing="-0.5">
              <tspan fontWeight="800" fill="#111827">Event</tspan>
              <tspan fontWeight="700" fill="#2563eb">Hub</tspan>
            </text>
          </svg>
        </div>

        <nav className={styles.nav}>
          <div 
            className={currentView === 'events' ? styles.navItemActive : styles.navItem}
            onClick={() => onNavigate("events")}
          >
            Мероприятия
            {currentView === 'events' && <div className={styles.underline} />}
          </div>

          <div 
            className={currentView === 'my-events' ? styles.navItemActive : styles.navItem}
            onClick={() => onNavigate("my-events")}
          >
            Мои мероприятия
            {currentView === 'my-events' && <div className={styles.underline} />}
          </div>
        </nav>
      </div>

      <div className={styles.rightSection}>
        
        <button className={styles.searchButton}>
          <svg xmlns="http:www.w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '20px', height: '20px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </button>

        {isLoggedIn ? (
          <>
            <button
              className={styles.loginButton}
              onClick={onLogout}
            >
              Выйти
            </button>

            <button
              className={styles.registerButton}
              onClick={() => onNavigate("create-event")}
            >
              Создать мероприятие
            </button>
          </>
        ) : (
          <>
            <button 
              className={styles.loginButton}
              onClick={() => onNavigate("login")}
            >
              Войти
            </button>

            <button 
              className={styles.registerButton}
              onClick={() => onNavigate("register")}
            >
              Зарегистрироваться
            </button>
          </>
        )}

      </div>

    </header>
  );
}

export default Header;
