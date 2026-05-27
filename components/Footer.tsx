import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className="mono-text">
          © {year} GodKode / Raghav. |{" "}
          <a href="https://icons8.com" target="_blank" rel="noopener noreferrer" className="hover-link">
            Icons by Icons8
          </a>
        </p>
      </div>
    </footer>
  );
}
