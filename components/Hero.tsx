"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
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

const CONTACT_ITEMS = [
  {
    label: "GitHub",
    href: "https://github.com/GodKode69",
    icon: "/assets/icons/github.webp",
  },
  {
    label: "Email",
    isEmail: true,
    icon: "/assets/icons/email.webp",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/raghav-bhati-a22349365/",
    icon: "/assets/icons/linkedin.webp",
  },
  {
    label: "X.com",
    href: "https://x.com/iskidcodes",
    icon: "/assets/icons/twitter.webp",
  },
  {
    label: "Spotify",
    href: "https://open.spotify.com/user/31qqz4epfmpqxwzmmibutb5j47be?si=09ba3e4c6d0741a1",
    icon: "/assets/icons/spotify.webp",
  },
  {
    label: "Instagram",
    href: "https://instagram.com/adhuraghav",
    icon: "/assets/icons/instagram.webp",
  },
  {
    label: "Resume",
    href: "/assets/Resume.pdf",
    icon: "/assets/icons/resume.webp",
  },
];

export default function Hero() {
  const [flipped, setFlipped] = useState(false);
  const { discord, statusLabel } = useDiscord();
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<number | null>(null);
  const [mobileWarningDismissed, setMobileWarningDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("godkode.mobileWarningDismissed") === "true";
  });

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const dismissMobileWarning = useCallback(() => {
    setMobileWarningDismissed(true);
    try {
      window.localStorage.setItem("godkode.mobileWarningDismissed", "true");
    } catch {
    }
  }, []);

  const stopFlip = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const handleCopyEmail = useCallback(async (e: React.MouseEvent) => {
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
  }, []);

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
              onClick={dismissMobileWarning}
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
              role="button"
              tabIndex={0}
              aria-label="Toggle profile card"
              onClick={() => setFlipped(!flipped)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setFlipped((f) => !f);
                }
              }}
            >
              {/* FRONT */}
              <div className={`${styles.cardFront} reveal active`}>
                <div className={styles.cardBanner}>
                  <Image
                    src="/assets/profile/banner.webp"
                    alt="Banner"
                    className={styles.bannerImage}
                    fill
                    priority
                  />
                </div>

                <div className={styles.cardHeader}>
                  <div className={styles.avatarWrapper}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
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
                    {CONTACT_ITEMS.map((item, index) => {
                      if (item.isEmail) {
                        return (
                          <div
                            key={index}
                            className={`${styles.statCard} ${styles.statCardEmail}`}
                            style={{ cursor: "pointer" }}
                            role="button"
                            tabIndex={0}
                            aria-label="Copy Email address"
                            onClick={handleCopyEmail}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handleCopyEmail(e as unknown as React.MouseEvent);
                              }
                            }}
                          >
                            <div className={styles.statTop}>
                              <Image
                                src={item.icon}
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
                        );
                      }

                      return (
                        <a
                          key={index}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.statCard}
                          onClick={stopFlip}
                        >
                          <div className={styles.statTop}>
                            <Image
                              src={item.icon}
                              alt={item.label}
                              className={styles.statIcon}
                              width={18}
                              height={18}
                            />
                            <div>
                              <p className={styles.aboutText}>{item.label}</p>
                            </div>
                          </div>
                        </a>
                      );
                    })}
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
