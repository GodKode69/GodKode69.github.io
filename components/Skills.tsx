"use client";

import { skills, skillCategoryDescriptions, type Tier } from "@/lib/skills";
import styles from "./Skills.module.css";
import sectionStyles from "./Section.module.css";
import Image from "next/image";

const TIER_CONFIG: Record<Tier, { segments: number; color: string; glow: string }> = {
  Beginner:     { segments: 1, color: "#fb7185", glow: "rgba(244, 114, 132, 0.55)" },
  Intermediate: { segments: 2, color: "#fb923c", glow: "rgba(249, 115, 22, 0.55)" },
  Advanced:     { segments: 3, color: "#facc15", glow: "rgba(250, 204, 21, 0.55)" },
  Expert:       { segments: 4, color: "#4ade80", glow: "rgba(74, 222, 128, 0.55)" },
  Master:       { segments: 5, color: "#22d3ee", glow: "rgba(34, 211, 238, 0.55)" },
};

const TOTAL_SEGMENTS = 5;

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
                  const cfg = TIER_CONFIG[skill.tier];
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
                          <div className={styles.tierLabel}>{skill.tier}</div>
                          <div className={styles.tierBar}>
                            {Array.from({ length: TOTAL_SEGMENTS }, (_, i) => (
                              <div
                                key={i}
                                className={`${styles.tierSegment} ${i < cfg.segments ? styles.tierFilled : ""}`}
                                style={{
                                  ["--seg-color" as string]: cfg.color,
                                  ["--seg-glow" as string]: cfg.glow,
                                }}
                              />
                            ))}
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
