"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { achievements } from "@/lib/achievements";
import { staggerContainer, staggerItem, sectionTitle } from "@/components/Motion";
import styles from "./Achievements.module.css";
import sectionStyles from "./Section.module.css";

function AchievementCard({
  achievement,
}: {
  achievement: (typeof achievements)[0];
}) {
  return (
    <article className={styles.card}>
      <div className={styles.cardGlow} />
      <div className={styles.cardHeader}>
        <span className={styles.date}>{achievement.date}</span>
        {achievement.icon && (
          <div className={styles.iconWrapper}>
            {achievement.icon.startsWith("/") ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={achievement.icon}
                alt=""
                className={styles.iconImage}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <span>{achievement.icon}</span>
            )}
          </div>
        )}
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.title}>{achievement.title}</h3>
        <p className={styles.desc}>{achievement.description}</p>
      </div>
      {achievement.link && (
        <Link href={achievement.link.href} className={`${styles.link} hover-link`}>
          {achievement.link.label}
        </Link>
      )}
    </article>
  );
}

export default function Achievements() {
  return (
    <section id="achievements" className={sectionStyles.section}>
      <div className={sectionStyles.container}>
        <motion.h2
          className={sectionStyles.title}
          variants={sectionTitle}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          03 / Milestones - {achievements.length}
        </motion.h2>
        <motion.div
          className={styles.grid}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {achievements.map((a) => (
            <motion.div key={a.id} variants={staggerItem}>
              <AchievementCard achievement={a} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
