"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useDiscord, type DiscordData } from "@/hooks/useDiscord";
import { heroTitle, heroStagger, heroItem } from "@/components/Motion";
import styles from "./Hero.module.css";

const allowedImageHosts = [
  "cdn.discordapp.com",
  "i.scdn.co",
  "images.unsplash.com",
];

const defaultAvatar = "/assets/profile/avatar.webp";

function isAllowedImageUrl(url: string): boolean {
  try {
    const { hostname, protocol } = new URL(url);
    return protocol === "https:" && allowedImageHosts.includes(hostname);
  } catch {
    return false;
  }
}

function sanitizeImageUrl(url: string, fallback: string = defaultAvatar): string {
  return isAllowedImageUrl(url) ? url : fallback;
}

function getActivityImage(
  act: NonNullable<ReturnType<typeof useDiscord>["discord"]>["activity"],
): string {
  if (!act?.assets?.large_image) {
    return defaultAvatar;
  }

  if (act.application_id && !/^\d{17,20}$/.test(act.application_id)) {
    return defaultAvatar;
  }

  const img = act.assets.large_image;

  if (img.startsWith("mp:external")) {
    const extracted = img.replace(/mp:external\/.*\/https\//, "https://");
    try {
      const url = new URL(extracted);
      if (url.protocol === "https:" && isAllowedImageUrl(extracted)) {
        return extracted;
      }
    } catch {
    }
    return defaultAvatar;
  }

  const constructed = `https://cdn.discordapp.com/app-assets/${act.application_id}/${img}.png`;
  return sanitizeImageUrl(constructed);
}

function getStatusClass(status: DiscordData["status"] | undefined): string {
  switch (status) {
    case "online":
      return styles.statusOnline;
    case "idle":
      return styles.statusIdle;
    case "dnd":
      return styles.statusDnd;
    default:
      return styles.statusOffline;
  }
}

export default function Hero() {
  const [flipped, setFlipped] = useState(false);
  const { discord, statusLabel } = useDiscord();
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<number | null>(null);
  const [mobileWarningDismissed, setMobileWarningDismissed] = useState(false);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  function stopFlip(e: React.MouseEvent) {
    e.stopPropagation();
  }

  async function handleCopyEmail(e: React.MouseEvent) {
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText("godkode@godkode.xyz");
      setCopied(true);

      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current);
      }

      copyTimeoutRef.current = window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <header className={styles.hero}>
      {!mobileWarningDismissed && (
        <div className="mobile-warning-overlay">
          <div
            className="mobile-warning-content"
            onClick={(e) => e.stopPropagation()}
          >
            <p>
              This website is optimized for desktop devices and is best
              experienced on one.
            </p>
            <button
              type="button"
              className="hover-link mobile-warning-dismiss"
              onClick={() => setMobileWarningDismissed(true)}
            >
              Got it
            </button>
          </div>
        </div>
      )}
      <div className={styles.container}>
        <div className={styles.content}>
          <motion.h1
            className="glitch"
            data-text="GODKODE"
            variants={heroTitle}
            initial="hidden"
            animate="visible"
          >
            GODKODE
          </motion.h1>

          <motion.div
            className={`${styles.systemStatus} mono-text`}
            variants={heroStagger}
            initial="hidden"
            animate="visible"
          >
            <motion.span
              id="discord-dot"
              className={`${styles.inlineStatusDot} ${
                discord?.status ? styles[discord.status] : styles.offline
              }`}
              variants={heroItem}
            />
            {discord ? (
              <motion.span variants={heroItem}>
                Entity{" "}
                <span style={{ color: "var(--text-primary)" }}>@{discord.username}</span> is{" "}
                <span
                  className={`${styles.statusText} ${getStatusClass(discord?.status)}`}
                >
                  {statusLabel}
                </span>
              </motion.span>
            ) : (
              <motion.span variants={heroItem}>Initializing Entity...</motion.span>
            )}
          </motion.div>

          <motion.div
            className={styles.subtitleWrapper}
            variants={heroStagger}
            initial="hidden"
            animate="visible"
          >
            <motion.span className={styles.bracket} style={{ color: "var(--text-primary)" }} variants={heroItem}>
              ⌈<br />⌊
            </motion.span>
            <motion.p className={styles.subtitle} variants={heroItem}>
              <span style={{ color: "var(--accent)" }}>Out of </span> Reach &amp;
              <br />
              Into <span style={{ color: "var(--accent)" }}>the Breach</span>
            </motion.p>
            <motion.span className={styles.bracket} style={{ color: "var(--text-primary)" }} variants={heroItem}>
              ⌉<br />⌋
            </motion.span>
          </motion.div>
        </div>

        <motion.div
          className={styles.visual}
          initial={{ opacity: 0, x: 60, rotateY: -10 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 80,
            delay: 0.6,
          }}
          style={{ perspective: 1200 }}
        >
          <div
            className={`${styles.cardScene} ${discord?.spotify && discord?.activity ? styles.cardSceneTallBoth : discord?.spotify || discord?.activity ? styles.cardSceneTall : ""}`}
          >
            <div
              className={`${styles.card3d} ${flipped ? styles.flipped : ""}`}
              onClick={() => setFlipped(!flipped)}
            >
              {/* FRONT */}
              <div className={`${styles.cardFront} reveal active`}>
                <div className={styles.cardBanner}>
                  <img
                    src="/assets/profile/banner.webp"
                    alt="Banner"
                    className={styles.bannerImage}
                  />
                </div>

                <div className={styles.cardHeader}>
                  <div className={styles.avatarWrapper}>
                    <img
                      src={discord?.avatarUrl ? sanitizeImageUrl(discord.avatarUrl, "/assets/profile/avatar.webp") : "/assets/profile/avatar.webp"}
                      alt="Avatar"
                      className={styles.avatar}
                      width={70}
                      height={70}
                    />
                    <div
                      className={`${styles.avatarStatusDot} ${
                        discord?.status
                          ? styles[discord.status]
                          : styles.offline
                      }`}
                      style={flipped ? { opacity: 0 } : undefined}
                    />
                    <div className={styles.flipBubble}>
                      Click here to flip me!
                    </div>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.userInfo}>
                    <span className={styles.name}>
                      {discord?.globalName ?? "Raghav"}
                    </span>
                    <span className={styles.tag}>
                      {discord?.username ?? "adhuraghav"} • god
                    </span>
                  </div>

                  <div className={styles.section}>
                    <p className={styles.sectionLabel}>ABOUT ME</p>
                    <p className={styles.aboutText}>
                      Hey there! I&apos;m{" "}
                      <strong
                        className={`${styles.statusText} ${getStatusClass(discord?.status)}`}
                      >
                        GodKode
                      </strong>
                      , a developer building web and desktop apps, backend
                      systems, custom interfaces, automation tools, and
                      innovative digital experiences.
                    </p>
                    <br />
                    <p className={styles.aboutText}>
                      I mostly work with Linux, NodeJS, Python and Software
                      integrations.
                    </p>
                    <br />
                    <p className={styles.aboutText}>
                      Outside coding, I&apos;m usually reading docs, listening
                      to music, gaming, or consuming digital media while
                      debugging something at 2AM.
                    </p>
                  </div>

                  {discord?.spotify && (
                    <div className={styles.section}>
                      <p className={styles.sectionLabel}>
                        Listening to Spotify
                      </p>
                      <div className={styles.activityItem}>
                        {/* Spotify artwork host varies, so this stays a plain img. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={sanitizeImageUrl(discord.spotify.album_art_url)}
                          alt="album"
                          className={styles.activityImg}
                          loading="lazy"
                          decoding="async"
                        />
                        <div>
                          <p className={styles.activityTitle}>
                            {discord.spotify.song}
                          </p>
                          <p className={styles.activitySub}>
                            by {discord.spotify.artist}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {discord?.activity && (
                    <div className={styles.section}>
                      <p className={styles.sectionLabel}>Playing</p>
                      <div className={styles.activityItem}>
                        {/* Activity assets can come from arbitrary external providers. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getActivityImage(discord.activity)}
                          alt="activity"
                          className={styles.activityImg}
                          loading="lazy"
                          decoding="async"
                        />
                        <div>
                          <p className={styles.activityTitle}>
                            {discord.activity.name}
                          </p>
                          {discord.activity.details && (
                            <p className={styles.activitySub}>
                              {discord.activity.details}
                            </p>
                          )}
                          {discord.activity.state && (
                            <p className={styles.activitySub}>
                              {discord.activity.state}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* BACK */}
              <div className={styles.cardBack}>
                <div className={styles.backContent}>
                  <div className={styles.backHeader}>
                    <span className={styles.backTitle}>CONTACT_MATRIX.sys</span>
                    <span className={styles.backBadge}>LIVE</span>
                  </div>

                  <div className={styles.backGrid}>
                    <a
                      href="https://github.com/GodKode69"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.statCard}
                      onClick={stopFlip}
                    >
                      <div className={styles.statTop}>
                        <img
                          src="/assets/icons/github.webp"
                          alt="GitHub"
                          className={styles.statIcon}
                          width={18}
                          height={18}
                        />
                        <div>
                          <p className={styles.aboutText}>GitHub</p>
                        </div>
                      </div>
                    </a>

                    <div
                      className={`${styles.statCard} ${styles.statCardEmail}`}
                      style={{ cursor: "pointer" }}
                      onClick={handleCopyEmail}
                    >
                      <div className={styles.statTop}>
                        <img
                          src="/assets/icons/email.webp"
                          alt="Email"
                          className={styles.statIcon}
                          width={18}
                          height={18}
                        />
                        <div>
                          <p className={styles.aboutText}>
                            {copied ? "Copied!" : "Email"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <a
                      href="https://www.linkedin.com/in/raghav-bhati-a22349365/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.statCard}
                      onClick={stopFlip}
                    >
                      <div className={styles.statTop}>
                        <img
                          src="/assets/icons/linkedin.webp"
                          alt="LinkedIn"
                          className={styles.statIcon}
                          width={18}
                          height={18}
                        />
                        <div>
                          <p className={styles.aboutText}>LinkedIn</p>
                        </div>
                      </div>
                    </a>

                    <a
                      href="https://x.com/iskidcodes"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.statCard}
                      onClick={stopFlip}
                    >
                      <div className={styles.statTop}>
                        <img
                          src="/assets/icons/twitter.webp"
                          alt="X.com"
                          className={styles.statIcon}
                          width={18}
                          height={18}
                        />
                        <div>
                          <p className={styles.aboutText}>X.com</p>
                        </div>
                      </div>
                    </a>

                    <a
                      href="https://open.spotify.com/user/31qqz4epfmpqxwzmmibutb5j47be?si=09ba3e4c6d0741a1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.statCard}
                      onClick={stopFlip}
                    >
                      <div className={styles.statTop}>
                        <img
                          src="/assets/icons/spotify.webp"
                          alt="Spotify"
                          className={styles.statIcon}
                          width={18}
                          height={18}
                        />
                        <div>
                          <p className={styles.aboutText}>Spotify</p>
                        </div>
                      </div>
                    </a>

                    <a
                      href="https://instagram.com/adhuraghav"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.statCard}
                      onClick={stopFlip}
                    >
                      <div className={styles.statTop}>
                        <img
                          src="/assets/icons/instagram.webp"
                          alt="Instagram"
                          className={styles.statIcon}
                          width={18}
                          height={18}
                        />
                        <div>
                          <p className={styles.aboutText}>Instagram</p>
                        </div>
                      </div>
                    </a>

                    <a
                      href="/assets/Resume.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.statCard}
                      onClick={stopFlip}
                    >
                      <div className={styles.statTop}>
                        <img
                          src="/assets/icons/cv.webp"
                          alt="Resume"
                          className={styles.statIcon}
                          width={18}
                          height={18}
                        />
                        <div>
                          <p className={styles.aboutText}>Resume</p>
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className={styles.backFooter}>click again to return</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.8, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className={styles.scrollPath}>~/portfolio/README.md</span>
      </motion.div>
    </header>
  );
}
