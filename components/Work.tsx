"use client";

import { projects } from "@/lib/projects";
import { useReveal } from "@/hooks/useReveal";
import styles from "./Work.module.css";
import sectionStyles from "./Section.module.css";

function ProjectCard({ project }: { project: (typeof projects)[0] }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`${styles.card} reveal`}>
      <div className={styles.cardHeader}>
        <span className="mono-text">{project.year} |</span>
        <span className="mono-text">{project.type}</span>
      </div>
      <h3>{project.title}</h3>
      <p>{project.desc}</p>
      <div className={styles.links}>
        {project.links.map((l) =>
          l.href ? (
            <a key={l.label} href={l.href} className="hover-link">{l.label}</a>
          ) : (
            <span key={l.label} className="hover-link">{l.label}</span>
          )
        )}
      </div>
    </div>
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