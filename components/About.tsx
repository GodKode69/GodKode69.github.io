"use client";


import { useReveal } from "@/hooks/useReveal";
import styles from "./Section.module.css";

export default function About() {
  const ref = useReveal();

  return (
    <section id="about" className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>01 / The Source</h2>
        <div className={styles.grid}>
          <div ref={ref} className={`${styles.textBlock} reveal`}>
            <p>Hey there! I&apos;m <strong>GodKode</strong>, a developer figuring out how the internet works.</p>
            <br />
            <p>I usually hang out at my desk either working in vscode or enjoying some documentation reading.</p>
            <br />
            <p>I also like to occasionally listen to music, and watch anime.</p>
          </div>
        </div>
      </div>
    </section>
  );
}