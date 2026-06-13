"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useDiscord, type DiscordData } from "@/hooks/useDiscord";
import styles from "./Hero.module.css";

function getActivityImage(
  act: NonNullable<ReturnType<typeof useDiscord>["discord"]>["activity"],
): string {
  if (!act?.assets?.large_image) {
    return "https://cdn.discordapp.com/embed/avatars/0.png";
  }

  const img = act.assets.large_image;

  if (img.startsWith("mp:external")) {
    return img.replace(/mp:external\/.*\/https\//, "https://");
  }

  return `https://cdn.discordapp.com/app-assets/${act.application_id}/${img}.png`;
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
          <h1 className="glitch" data-text="GODKODE">
            GODKODE
          </h1>

          <div className={`${styles.systemStatus} mono-text`}>
            <span
              id="discord-dot"
              className={`${styles.inlineStatusDot} ${
                discord?.status ? styles[discord.status] : styles.offline
              }`}
            />
            {discord ? (
              <span>
                Entity{" "}
                <span style={{ color: "var(--text-primary)" }}>@{discord.username}</span> is{" "}
                <span
                  className={`${styles.statusText} ${getStatusClass(discord?.status)}`}
                >
                  {statusLabel}
                </span>
              </span>
            ) : (
              <span>Initializing Entity...</span>
            )}
          </div>

          <div className={styles.subtitleWrapper}>
            <span className={styles.bracket} style={{ color: "var(--text-primary)" }}>
              ⌈<br />⌊
            </span>
            <p className={styles.subtitle}>
              <span style={{ color: "var(--accent)" }}>Out of </span> Reach &amp;
              <br />
              Into <span style={{ color: "var(--accent)" }}>the Breach</span>
            </p>
            <span className={styles.bracket} style={{ color: "var(--text-primary)" }}>
              ⌉<br />⌋
            </span>
          </div>
        </div>

        <div className={styles.visual}>
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
                  <Image
                    src="/assets/profile/banner.webp"
                    alt="Banner"
                    className={styles.bannerImage}
                    fill
                    sizes="350px"
                    priority
                  />
                </div>

                <div className={styles.cardHeader}>
                  <div className={styles.avatarWrapper}>
                    <Image
                      src={discord?.avatarUrl ?? "/assets/profile/avatar.webp"}
                      alt="Avatar"
                      className={styles.avatar}
                      width={70}
                      height={70}
                      sizes="70px"
                      unoptimized
                    />
                    <div
                      className={`${styles.avatarStatusDot} ${
                        discord?.status
                          ? styles[discord.status]
                          : styles.offline
                      }`}
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
                          src={discord.spotify.album_art_url}
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
                        <Image
                          src="/assets/icons/github.png"
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
                        <Image
                          src="/assets/icons/email.png"
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
                        <Image
                          src="/assets/icons/linkedin.png"
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
                        <Image
                          src="/assets/icons/twitter.png"
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
                        <Image
                          src="/assets/icons/spotify.png"
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
                        <Image
                          src="/assets/icons/instagram.png"
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
                  </div>

                  <div className={styles.backFooter}>click again to return</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.scrollIndicator}>
        <span className={styles.scrollPath}>~/portfolio/README.md</span>
      </div>
    </header>
  );
}
