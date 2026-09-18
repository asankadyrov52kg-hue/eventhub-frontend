import styles from './Header.module.css';
import { useState } from 'react';



function Header() {
  const [activeTab, setActiveTab] = useState<'events' | 'my-events'>('events');

  return (
    <header className={styles.header}>
      
      <div className={styles.leftSection}>
        
        <div className={styles.logoWrapper}>
          <svg xmlns="http://w3.org" viewBox="0 0 150 40" width="130" height="35">
            <text x="0" y="28" font-size="26" letter-spacing="-0.5">
              <tspan font-weight="800" fill="#111827">Event</tspan>
              <tspan font-weight="700" fill="#2563eb">Hub</tspan>
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
          <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '20px', height: '20px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </button>

        <button className={styles.loginButton}>
          Войти
        </button>

  
        <button className={styles.registerButton}>
          Зарегистрироваться
        </button>

      </div>

    </header>
  );
}

export default Header;
