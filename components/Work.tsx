"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { projects } from "@/lib/projects";
import { staggerContainer, staggerItem, sectionTitle } from "@/components/Motion";
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
  return (
    <article className={styles.card}>
      <div className={styles.cardGlow} />
      {project.icon && (
        <div className={styles.iconWrapper}>
          <img
            src={project.icon}
            alt=""
            className={styles.iconImage}
            loading="lazy"
            decoding="async"
          />
        </div>
      )}
      <div className={styles.cardHeader}>
        <span className={styles.year}>{project.year}</span>
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
        <motion.h2
          className={sectionStyles.title}
          variants={sectionTitle}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          02 / Executables - {projects.length}
        </motion.h2>
        <motion.div
          className={styles.grid}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {projects.map((p) => (
            <motion.div key={p.title} variants={staggerItem}>
              <ProjectCard project={p} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
