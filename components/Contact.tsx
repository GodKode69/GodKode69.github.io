"use client";

import { useReveal } from "@/hooks/useReveal";
import styles from "./Contact.module.css";
import sectionStyles from "./Section.module.css";

export default function Contact() {
  const ref = useReveal();

  return (
    <section id="contact" className={sectionStyles.section}>
      <div className={sectionStyles.container}>
        <h2 className={sectionStyles.title}>03 / Uplink</h2>
        <div ref={ref} className={`${styles.wrapper} reveal`}>
          <h1>Ready to build<br />a new project?</h1>
          <div className={styles.emailBlock}>
            <a href="mailto:godkode@godkode.xyz" className={`${styles.bigLink} hover-link`}>
              Email Me!
            </a>
          </div>
          
        </div>
      </div>
    </section>
  );
}