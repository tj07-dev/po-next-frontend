import { useState } from 'react';

import Link from 'next/link';
import styles from './Header.module.css';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={styles.navbar}>
      {' '}
      <div className={styles['navbar-left']}>
        {' '}
        <Link href="/" className={styles['navbar-brand']}>
          Purchase Order{' '}
        </Link>{' '}
      </div>{' '}
      <button className={styles['navbar-toggle-button']} onClick={toggleMenu}>
        <span className={styles['navbar-toggle-icon']}></span>{' '}
      </button>{' '}
      <div
        className={`${styles['navbar-right']} ${isOpen ? styles['open'] : ''}`}
      >
        {' '}
        <Link href="/" className={styles['navbar-link']} onClick={toggleMenu}>
          Home{' '}
        </Link>{' '}
        <Link
          href="/evc"
          className={styles['navbar-link']}
          onClick={toggleMenu}
        >
          EVC{' '}
        </Link>{' '}
        <Link
          href="/dmr"
          className={styles['navbar-link']}
          onClick={toggleMenu}
        >
          Raise DMR{' '}
        </Link>{' '}
      </div>{' '}
    </nav>
  );
};

export default Header;
