"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Nav.module.css";

export default function Nav() {
  const [showContactHint, setShowContactHint] = useState(false);
  const hideTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        window.clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  function openContactHint() {
    if (hideTimeoutRef.current) {
      window.clearTimeout(hideTimeoutRef.current);
    }

    setShowContactHint(true);
    hideTimeoutRef.current = window.setTimeout(() => {
      setShowContactHint(false);
    }, 2600);
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>_GODKODE/</div>
      <ul className={styles.links}>
        <li><a href="#skill" className="hover-link">Skills</a></li>
        <li><a href="#work" className="hover-link">Work</a></li>
        <li className={styles.contactItem}>
          <button
            type="button"
            className={`hover-link ${styles.contactButton}`}
            onClick={openContactHint}
          >
            Contact
          </button>
          {showContactHint && (
            <div className={styles.contactBubble}>
              they are behind the profile card!
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
}
