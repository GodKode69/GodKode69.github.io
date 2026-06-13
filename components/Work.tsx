"use client";

import Link from "next/link";
import { projects } from "@/lib/projects";
import { useReveal } from "@/hooks/useReveal";
import styles from "./Work.module.css";
import sectionStyles from "./Section.module.css";

function getLinkMeta(href?: string) {
  if (!href) return null;

  if (/^https?:\/\//.test(href)) {
    return { href, external: true };
  }

  if (href.startsWith("/") || href.startsWith("#") || href.startsWith("mailto:")) {
    return { href, external: false };
  }

  return null;
}

function ProjectCard({ project }: { project: (typeof projects)[0] }) {
  const ref = useReveal();
  return (
    <article ref={ref} className={`${styles.card} reveal`}>
      <div className={styles.cardGlow} />
      <div className={styles.cardHeader}>
        <span className={styles.year}>{project.year}</span>
        <span className={styles.type}>{project.type}</span>
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.desc}>{project.desc}</p>
      </div>
      <div className={styles.links}>
        {project.links.map((link, i) => {
          const meta = getLinkMeta(link.href);

          if (!meta) {
            return (
              <span key={i} className={`${styles.linkChip} ${styles.linkDisabled}`}>
                {link.label}
              </span>
            );
          }

          if (meta.external) {
            return (
              <a
                key={i}
                href={meta.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.linkChip} hover-link`}
              >
                {link.label}
              </a>
            );
          }

          return (
            <Link
              key={i}
              href={meta.href}
              className={`${styles.linkChip} hover-link`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </article>
  );
}

export default function Work() {
  return (
    <section id="work" className={sectionStyles.section}>
      <div className={sectionStyles.container}>
        <h2 className={sectionStyles.title}>02 / Executables - {projects.length}</h2>
        <div className={styles.grid}>
          {projects.map((p) => <ProjectCard key={p.title} project={p} />)}
        </div>
      </div>
    </section>
  );
}
