"use client";

import Link from "next/link";
import { achievements } from "@/lib/achievements";
import { useReveal } from "@/hooks/useReveal";
import styles from "./Achievements.module.css";
import sectionStyles from "./Section.module.css";

function AchievementCard({
  achievement,
}: {
  achievement: (typeof achievements)[0];
}) {
  const ref = useReveal();
  return (
    <article ref={ref} className={`${styles.card} reveal`}>
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
        <h2 className={sectionStyles.title}>
          03 / Milestones - {achievements.length}
        </h2>
        <div className={styles.grid}>
          {achievements.map((a, i) => (
            <AchievementCard key={i} achievement={a} />
          ))}
        </div>
      </div>
    </section>
  );
}
