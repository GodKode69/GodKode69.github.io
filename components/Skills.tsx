"use client";

import type { CSSProperties } from "react";
import { skillCategoryDescriptions, skills } from "@/lib/skills";
import styles from "./Skills.module.css";
import sectionStyles from "./Section.module.css";
import Image from "next/image";

function getBarPalette(level: number) {
  if (level >= 75) {
    return {
      start: "#7dffae",
      mid: "#4ade80",
      end: "#23c55e",
      glow: "rgba(74, 222, 128, 0.7)",
    };
  }

  if (level >= 50) {
    return {
      start: "#ffe56f",
      mid: "#facc15",
      end: "#eab308",
      glow: "rgba(250, 204, 21, 0.65)",
    };
  }

  if (level >= 25) {
    return {
      start: "#ffc978",
      mid: "#fb923c",
      end: "#f97316",
      glow: "rgba(249, 115, 22, 0.65)",
    };
  }

  return {
    start: "#ff9eb5",
    mid: "#fb7185",
    end: "#e11d48",
    glow: "rgba(244, 63, 94, 0.65)",
  };
}

export default function Skills() {
  const groupedSkills = Object.entries(
    skills.reduce<Record<string, typeof skills>>((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {}),
  );

  return (
    <section id="skill" className={sectionStyles.section}>
      <div className={sectionStyles.container}>
        <h2 className={sectionStyles.title}>01 / Skill Tree - {skills.length}</h2>
        <div className={styles.grid}>
          {groupedSkills.map(([category, categorySkills]) => (
            <article key={category} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{category}</h3>
                <span className={styles.cardCount}>{categorySkills.length}</span>
              </div>
              <p className={styles.cardDesc}>
                {skillCategoryDescriptions[category as keyof typeof skillCategoryDescriptions]}
              </p>
              <div className={`tech-stack ${styles.stack}`}>
                {categorySkills.map((skill) => {
                  const palette = getBarPalette(skill.level);
                  const fillStyle = {
                    "--skill-level": `${skill.level}%`,
                    "--bar-start": palette.start,
                    "--bar-mid": palette.mid,
                    "--bar-end": palette.end,
                    "--bar-glow": palette.glow,
                  } as CSSProperties;

                  return (
                    <span key={skill.name} className={`hover-link ${styles.chip}`}>
                      {skill.name}
                      <div className={styles.popup}>
                        <div className={styles.popupHeader}>
                          <Image src={skill.icon} alt={skill.name} width={24} height={24} unoptimized />
                          <span className={styles.popupTitle}>{skill.name}</span>
                        </div>
                        <p className={styles.popupDesc}>{skill.desc}</p>
                        <div className={styles.visualize}>
                          <div className={styles.proficiencyText}>Proficiency: {skill.level}%</div>
                          <div className={styles.bar}>
                            <div className={styles.fill} style={fillStyle} />
                          </div>
                        </div>
                      </div>
                    </span>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
