import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1
          className={`glitch ${styles.code}`}
          data-text="404"
        >
          404
        </h1>

        <p className={styles.message}>
          FATAL ERR0R: SECTOR N0T F0UND
        </p>

        <Link
          href="/"
          className={`${styles.btn} hover-link`}
        >
          RETURN T0 BASE
        </Link>
      </div>
    </div>
  );
}