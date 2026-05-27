import styles from "./Nav.module.css";

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>_GODKODE/</div>
      <ul className={styles.links}>
        <li><a href="#skill"    className="hover-link">Skills</a></li>
        <li><a href="#work"    className="hover-link">Work</a></li>
        <li><a href="#contact" className="hover-link">Contact</a></li>
      </ul>
    </nav>
  );
}
