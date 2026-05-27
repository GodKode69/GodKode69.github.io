"use client";

import { useState } from "react";
import { useDiscord } from "@/hooks/useDiscord";
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

export default function Hero() {
  const [flipped, setFlipped] = useState(false);
  const { discord, statusLabel } = useDiscord();
  const [copied, setCopied] = useState(false);

  function stopFlip(e: React.MouseEvent) {
    e.stopPropagation();
  }

  return (
    <header className={styles.hero}>
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
                <span style={{ color: "white" }}>@{discord.username}</span> is{" "}
                <span
                  className={`${styles.statusText} ${
                    discord?.status === "online"
                      ? styles.statusOnline
                      : discord?.status === "idle"
                        ? styles.statusIdle
                        : discord?.status === "dnd"
                          ? styles.statusDnd
                          : styles.statusOffline
                  }`}
                >
                  {statusLabel}
                </span>
              </span>
            ) : (
              <span>Initializing Entity...</span>
            )}
          </div>

          <div className={styles.subtitleWrapper}>
            <span className={styles.bracket} style={{ color: "aliceblue" }}>
              ⌈<br />⌊
            </span>
            <p className={styles.subtitle}>
              <span style={{ color: "cadetblue" }}>Out of </span> Reach &amp;
              <br />
              Into <span style={{ color: "cadetblue" }}>the Breach</span>
            </p>
            <span className={styles.bracket} style={{ color: "aliceblue" }}>
              ⌉<br />⌋
            </span>
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.cardScene}>
            <div
              className={`${styles.card3d} ${flipped ? styles.flipped : ""}`}
              onClick={() => setFlipped(!flipped)}
            >
              {/* FRONT */}
              <div className={`${styles.cardFront} reveal active`}>
                <div className={styles.cardBanner}>
                  <img
                    src="/assets/profile/banner.jpeg"
                    alt="Banner"
                    className={styles.bannerImage}
                  />
                </div>

                <div className={styles.cardHeader}>
                  <div className={styles.avatarWrapper}>
                    {discord?.avatarUrl && (
                      <img
                        src={discord.avatarUrl}
                        alt="Avatar"
                        className={styles.avatar}
                      />
                    )}
                    <div
                      className={`${styles.avatarStatusDot} ${
                        discord?.status
                          ? styles[discord.status]
                          : styles.offline
                      }`}
                    />
                    <div className={styles.flipBubble}>
                      click to flip profile card
                    </div>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.userInfo}>
                    <span className={styles.name}>
                      {discord?.globalName ?? "Raghav"}
                    </span>
                    <span className={styles.tag}>adhuraghav • god</span>
                  </div>

                  <div className={styles.section}>
                    <p className={styles.sectionLabel}>ABOUT ME</p>
                    <p className={styles.aboutText}>
                      Hey there! I&apos;m{" "}
                      <strong
                        className={`${styles.statusText} ${
                          discord?.status === "online"
                            ? styles.statusOnline
                            : discord?.status === "idle"
                              ? styles.statusIdle
                              : discord?.status === "dnd"
                                ? styles.statusDnd
                                : styles.statusOffline
                        }`}
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
                      to music, gaming, or consuming digial while debugging
                      something at 2AM.
                    </p>
                  </div>

                  {discord?.spotify && (
                    <div className={styles.section}>
                      <p className={styles.sectionLabel}>
                        Listening to Spotify
                      </p>
                      <div className={styles.activityItem}>
                        <img
                          src={discord.spotify.album_art_url}
                          alt="album"
                          className={styles.activityImg}
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
                        <img
                          src={getActivityImage(discord.activity)}
                          alt="activity"
                          className={styles.activityImg}
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
                          src="/assets/icons/github.png"
                          alt="GitHub"
                          className={styles.statIcon}
                        />
                        <div>
                          <p className={styles.aboutText}>GitHub</p>
                        </div>
                      </div>
                    </a>

                    <div
                      className={`${styles.statCard} ${styles.statCardEmail}`}
                      style={{ cursor: "pointer" }}
                      onClick={async function (e: React.MouseEvent) {
                        e.stopPropagation();
                        await navigator.clipboard.writeText(
                          "godkode@godkode.xyz",
                        );
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                    >
                      <div className={styles.statTop}>
                        <img
                          src="/assets/icons/email.png"
                          alt="Email"
                          className={styles.statIcon}
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
                          src="/assets/icons/linkedin.png"
                          alt="LinkedIn"
                          className={styles.statIcon}
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
                          src="/assets/icons/twitter.png"
                          alt="X.com"
                          className={styles.statIcon}
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
                          src="/assets/icons/spotify.png"
                          alt="Spotify"
                          className={styles.statIcon}
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
                          src="/assets/icons/instagram.png"
                          alt="Instagram"
                          className={styles.statIcon}
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
        <span className={styles.scrollPath}>
          /home/adhuraghav/Documents/README.md
        </span>
      </div>
    </header>
  );
}
