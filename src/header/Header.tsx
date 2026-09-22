import styles from './Header.module.css';
import { useState } from 'react';

// 1. Описываем типы для пропсов, которые принимает Header
interface HeaderProps {
  onNavigate?: (view: "login" | "register" | "create-event") => void;
}

function Header({ onNavigate }: HeaderProps) {
  const [activeTab, setActiveTab] = useState<'events' | 'my-events'>('events');

  return (
    <header className={styles.header}>
      
      <div className={styles.leftSection}>
        
        <div className={styles.logoWrapper}>
          <svg xmlns="http://www.w3.org" viewBox="0 0 150 40" width="130" height="35">
            <text x="0" y="28" fontSize="26" letterSpacing="-0.5">
              <tspan fontWeight="800" fill="#111827">Event</tspan>
              <tspan fontWeight="700" fill="#2563eb">Hub</tspan>
            </text>
          </svg>
        </div>

        <nav className={styles.nav}>
          <div 
            className={activeTab === 'events' ? styles.navItemActive : styles.navItem}
            onClick={() => setActiveTab('events')}
          >
            Мероприятия
            {activeTab === 'events' && <div className={styles.underline} />}
          </div>

          <div 
            className={activeTab === 'my-events' ? styles.navItemActive : styles.navItem}
            onClick={() => setActiveTab('my-events')}
          >
            Мои мероприятия
            {activeTab === 'my-events' && <div className={styles.underline} />}
          </div>
        </nav>
      </div>

      <div className={styles.rightSection}>
        
        <button className={styles.searchButton}>
          <svg xmlns="http://www.w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '20px', height: '20px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </button>

        {/* 2. Добавляем обработчик для кнопки Войти */}
        <button 
          className={styles.loginButton}
          onClick={() => onNavigate && onNavigate("login")}
        >
          Войти
        </button>

        {/* 3. Добавляем обработчик для кнопки Зарегистрироваться */}
        <button 
          className={styles.registerButton}
          onClick={() => onNavigate && onNavigate("register")}
        >
          Зарегистрироваться
        </button>

      </div>

    </header>
  );
}

export default Header;