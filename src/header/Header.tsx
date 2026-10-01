import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from './Header.module.css';

interface HeaderProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

function Header({ isLoggedIn, onLogout }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const currentView = location.pathname;

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        
        <div className={styles.leftSection}>
          <div className={styles.logoWrapper} onClick={() => handleNavigation("/events")}>
            <svg xmlns="http://w3.org" viewBox="0 0 150 40" width="130" height="35">
              <text x="0" y="28" fontSize="26" letterSpacing="-0.5">
                <tspan fontWeight="800" fill="#111827">Event</tspan>
                <tspan fontWeight="700" fill="#2563eb">Hub</tspan>
              </text>
            </svg>
          </div>

          <nav className={styles.navDesktop}>
            <div 
              className={currentView === '/events' ? styles.navItemActive : styles.navItem}
              onClick={() => handleNavigation("/events")}
            >
              Мероприятия
              {currentView === '/events' && <div className={styles.underline} />}
            </div>

            <div 
              className={currentView === '/my-events' ? styles.navItemActive : styles.navItem}
              onClick={() => handleNavigation("/my-events")}
            >
              Мои мероприятия
              {currentView === '/my-events' && <div className={styles.underline} />}
            </div>
          </nav>
        </div>

        <div className={styles.rightSection}>
          <button className={styles.searchButton}>
            <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '20px', height: '20px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>

          <div className={styles.authDesktop}>
            {isLoggedIn ? (
              <>
                <button className={styles.loginButton} onClick={() => { onLogout(); handleNavigation("/login"); }}>
                  Выйти
                </button>
                <button className={styles.registerButton} onClick={() => handleNavigation("/create-event")}>
                  Создать мероприятие
                </button>
              </>
            ) : (
              <>
                <button className={styles.loginButton} onClick={() => handleNavigation("/login")}>
                  Войти
                </button>
                <button className={styles.registerButton} onClick={() => handleNavigation("/register")}>
                  Зарегистрироваться
                </button>
              </>
            )}
          </div>

          <button className={styles.burgerButton} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? (
              <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '24px', height: '24px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '24px', height: '24px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

      </div>

      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <nav className={styles.navMobile}>
            <div 
              className={currentView === '/events' ? styles.mobileNavItemActive : styles.mobileNavItem}
              onClick={() => handleNavigation("/events")}
            >
              Мероприятия
            </div>
            <div 
              className={currentView === '/my-events' ? styles.mobileNavItemActive : styles.mobileNavItem}
              onClick={() => handleNavigation("/my-events")}
            >
              Мои мероприятия
            </div>
            
            <div className={styles.mobileDivider} />

            {isLoggedIn ? (
              <>
                <div className={styles.mobileNavItem} onClick={() => handleNavigation("/create-event")}>
                  Создать мероприятие
                </div>
                <button className={styles.mobileLogoutButton} onClick={() => { onLogout(); handleNavigation("/login"); }}>
                  Выйти
                </button>
              </>
            ) : (
              <>
                <div className={styles.mobileNavItem} onClick={() => handleNavigation("/login")}>
                  Войти
                </div>
                <div className={styles.mobileRegisterItem} onClick={() => handleNavigation("/register")}>
                  Зарегистрироваться
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
