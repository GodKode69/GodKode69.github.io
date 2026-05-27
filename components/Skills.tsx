"use client";

import { skillCategoryDescriptions, skills } from "@/lib/skills";
import styles from "./Skills.module.css";
import sectionStyles from "./Section.module.css";
import Image from "next/image";

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
                {categorySkills.map((skill) => (
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
                          <div className={styles.fill} style={{ width: `${skill.level}%` }} />
                        </div>
                      </div>
                    </div>
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
