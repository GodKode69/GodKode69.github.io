import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className="mono-text">
          © 2025 GodKode / Raghav. |{" "}
          <a href="https://icons8.com" target="_blank" rel="noopener" className="hover-link">
            Icons by Icons8
          </a>
        </p>
      </div>
    </footer>
  );
}