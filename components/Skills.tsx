"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { skills, skillCategoryDescriptions, type Tier } from "@/lib/skills";
import { sectionTitle, staggerContainer, staggerItem } from "@/components/Motion";
import styles from "./Skills.module.css";
import sectionStyles from "./Section.module.css";

const TIER_CONFIG: Record<Tier, { segments: number; color: string; glow: string }> = {
  Beginner:     { segments: 1, color: "#fb7185", glow: "rgba(244, 114, 132, 0.55)" },
  Intermediate: { segments: 2, color: "#fb923c", glow: "rgba(249, 115, 22, 0.55)" },
  Advanced:     { segments: 3, color: "#facc15", glow: "rgba(250, 204, 21, 0.55)" },
  Expert:       { segments: 4, color: "#4ade80", glow: "rgba(74, 222, 128, 0.55)" },
  Master:       { segments: 5, color: "#22d3ee", glow: "rgba(34, 211, 238, 0.55)" },
};

const TOTAL_SEGMENTS = 5;

export default function Skills() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

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
    <section id="skill" className={sectionStyles.section} suppressHydrationWarning={true}><div className={sectionStyles.container}>
        <motion.h2
          className={sectionStyles.title}
          variants={sectionTitle}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          01 / Skill Tree - {skills.length}
        </motion.h2>
        <motion.div
          className={styles.grid}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {groupedSkills.map(([category, categorySkills]) => (
            <motion.article key={category} className={styles.card} variants={staggerItem}>
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
                  const isHovered = hoveredSkill === skill.name;
                  return (
                    <span
                      key={skill.name}
                      className={`hover-link ${styles.chip}`}
                      onMouseEnter={() => setHoveredSkill(skill.name)}
                      onMouseLeave={() => setHoveredSkill(null)}
                    >
                      {skill.name}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            className={styles.popup}
                            initial={{ opacity: 0, y: 12, scale: 0.92, filter: "blur(6px)" }}
                            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: 8, scale: 0.95, filter: "blur(4px)" }}
                            transition={{ type: "spring", damping: 22, stiffness: 200 }}
                          >
                            <div className={styles.popupHeader}>
                              <motion.img
                                src={skill.icon}
                                alt={skill.name}
                                width={24}
                                height={24}
                                initial={{ scale: 0, rotate: -90 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.05 }}
                              />
                              <span className={styles.popupTitle}>{skill.name}</span>
                            </div>
                            <p className={styles.popupDesc}>{skill.desc}</p>
                            <div className={styles.visualize}>
                              <div className={styles.tierLabel}>{skill.tier}</div>
                              <div className={styles.tierBar}>
                                {Array.from({ length: TOTAL_SEGMENTS }, (_, i) => {
                                  const filled = i < cfg.segments;
                                  return filled ? (
                                    <motion.div
                                      key={i}
                                      className={`${styles.tierSegment} ${styles.tierFilled}`}
                                      style={{
                                        ["--seg-color" as string]: cfg.color,
                                        ["--seg-glow" as string]: cfg.glow,
                                        ["--seg-index" as string]: i,
                                      }}
                                      initial={{ scaleY: 0, opacity: 0 }}
                                      animate={{ scaleY: 1, opacity: 1 }}
                                      transition={{
                                        type: "spring",
                                        damping: 12,
                                        stiffness: 150,
                                        delay: 0.08 + i * 0.06,
                                      }}
                                    />
                                  ) : (
                                    <div
                                      key={i}
                                      className={styles.tierSegment}
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </span>
                  );
                })}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
