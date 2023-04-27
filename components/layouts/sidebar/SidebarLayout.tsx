import Link from 'next/link';
import styles from './SidebarLayout.module.css';

export interface ISidebarLayout {}

const SidebarLayout: React.FC<ISidebarLayout> = () => {
  return (
    <nav className={styles.nav}>
      <input className={styles.input} placeholder="Search..." />
      <Link legacyBehavior href="/">
        <a>Home</a>
      </Link>
      <Link legacyBehavior href="/about">
        <a>About</a>
      </Link>
      <Link legacyBehavior href="/contact">
        <a>Contact</a>
      </Link>
    </nav>
  );
};

export default SidebarLayout;
