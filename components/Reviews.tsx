"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useReveal } from "@/hooks/useReveal";
import styles from "./Reviews.module.css";
import sectionStyles from "./Section.module.css";

/* --- types and interfaces --- */

type Review = {
  id: string;
  alias: string;
  authorId?: string;
  body: string;
  createdAt: string;
  replyTo: string | null;
  x: number;
  y: number;
};

type SyncState = "loading" | "ready" | "saving" | "offline";

/* --- constants --- */

const API_BASE_URL = (process.env.NEXT_PUBLIC_REVIEWS_API_BASE_URL ?? "https://api.godkode.xyz")
  .replace(/\/$/, "");
const REVIEWS_ENDPOINT = `${API_BASE_URL}/reviews`;
const ALIAS_KEY = "godkode.reviewAlias.v1";
const USER_ID_KEY = "godkode.reviewUserId.v1";
const INITIAL_REVIEWS: Review[] = [];
const POLL_INTERVAL = 3000;
const DEPTH_LABELS = ["comment", "↳ reply", "↳↳ reply", "↳↳↳ reply"];

/* --- math and helper functions --- */

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function numberValue(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function normalizeReview(value: unknown): Review | null {
  if (!isRecord(value)) return null;

  const id = stringValue(value.id) || stringValue(value._id);
  const alias = stringValue(value.alias).trim();
  const body = stringValue(value.body).trim();
  const createdAt = stringValue(value.createdAt) || new Date().toISOString();
  const replyTo = value.replyTo === null ? null : stringValue(value.replyTo) || null;

  if (!id || !alias || !body) return null;

  return {
    id,
    alias,
    authorId: stringValue(value.authorId) || undefined,
    body,
    createdAt,
    replyTo,
    x: clamp(numberValue(value.x, 50), 10, 90),
    y: clamp(numberValue(value.y, 50), 10, 90),
  };
}

/* --- api interaction services --- */

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    cache: "no-store",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Reviews API failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function extractReviews(payload: unknown) {
  const source = Array.isArray(payload)
    ? payload
    : isRecord(payload) && Array.isArray(payload.reviews)
      ? payload.reviews
      : [];

  return source
    .map(normalizeReview)
    .filter((review): review is Review => review !== null)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

async function fetchReviews() {
  return extractReviews(await requestJson<unknown>(REVIEWS_ENDPOINT));
}

async function createReview(review: Review) {
  await requestJson<unknown>(REVIEWS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(review),
  });
}

async function updateAuthorAlias(authorId: string, alias: string) {
  await requestJson<unknown>(`${REVIEWS_ENDPOINT}/alias`, {
    method: "PATCH",
    body: JSON.stringify({ authorId, alias }),
  });
}

/* --- state storage utility methods --- */

function readAlias() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(ALIAS_KEY) ?? "";
}

function readUserId() {
  if (typeof window === "undefined") return "";

  const existing = window.localStorage.getItem(USER_ID_KEY);
  if (existing) return existing;

  const next = crypto.randomUUID();
  window.localStorage.setItem(USER_ID_KEY, next);
  return next;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
  }).format(new Date(value));
}

function countReplies(parentId: string, allReviews: Review[]): number {
  return allReviews.filter((r) => r.replyTo === parentId).length;
}

/* --- reviews main react component --- */

export default function Reviews() {
  const ref = useReveal<HTMLDivElement>();
  const reviewsRef = useRef<Review[]>(INITIAL_REVIEWS);

  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [alias, setAlias] = useState("");
  const [userId, setUserId] = useState("");
  const [draftAlias, setDraftAlias] = useState("");
  const [draftReview, setDraftReview] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [isEditingAlias, setIsEditingAlias] = useState(false);
  const [syncState, setSyncState] = useState<SyncState>("loading");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  /* --- component lifecycle effects --- */

  useEffect(() => {
    reviewsRef.current = reviews;
  }, [reviews]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setAlias(readAlias());
      setUserId(readUserId());
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function refresh() {
      try {
        const nextReviews = await fetchReviews();
        if (!active) return;
        reviewsRef.current = nextReviews;
        setReviews(nextReviews);
        setSyncState("ready");
      } catch {
        if (active) setSyncState("offline");
      }
    }

    refresh();
    const interval = window.setInterval(refresh, POLL_INTERVAL);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  /* --- reviews logic mappings and hooks --- */

  const replyTarget = useMemo(
    () => reviews.find((review) => review.id === replyTo) ?? null,
    [replyTo, reviews],
  );

  const reviewById = useMemo(() => {
    const map = new Map<string, Review>();
    reviews.forEach((review) => map.set(review.id, review));
    return map;
  }, [reviews]);

  const topLevelReviews = useMemo(
    () => reviews.filter((r) => r.replyTo === null),
    [reviews],
  );

  /* --- form submit and update handlers --- */

  async function reloadReviews() {
    const nextReviews = await fetchReviews();
    reviewsRef.current = nextReviews;
    setReviews(nextReviews);
    setSyncState("ready");
  }

  function handleToggleReview(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const savedAlias = alias || draftAlias.trim();
    const body = draftReview.trim();
    if (!savedAlias || !body || !userId) return;

    const parent = replyTo ? reviewById.get(replyTo) : null;
    const review: Review = {
      id: crypto.randomUUID(),
      alias: savedAlias,
      authorId: userId,
      body,
      createdAt: new Date().toISOString(),
      replyTo,
      x: parent ? clamp(parent.x + (Math.random() * 20 - 10), 15, 85) : 16 + Math.random() * 68,
      y: parent ? clamp(parent.y + (parent.y > 50 ? -20 : 20), 15, 85) : 18 + Math.random() * 62,
    };

    try {
      setSyncState("saving");
      if (!alias) {
        setAlias(savedAlias);
        window.localStorage.setItem(ALIAS_KEY, savedAlias);
      }

      await createReview(review);
      await reloadReviews();
      setDraftAlias("");
      setDraftReview("");
      setReplyTo(null);
    } catch {
      setSyncState("offline");
    }
  }

  async function handleAliasChange(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextAlias = draftAlias.trim();
    if (!nextAlias || nextAlias === alias || !userId) {
      setDraftAlias("");
      setIsEditingAlias(false);
      return;
    }

    try {
      setSyncState("saving");
      setAlias(nextAlias);
      window.localStorage.setItem(ALIAS_KEY, nextAlias);
      await updateAuthorAlias(userId, nextAlias);
      await reloadReviews();
      setDraftAlias("");
      setIsEditingAlias(false);
    } catch {
      setSyncState("offline");
    }
  }

  /* --- tree rendering helper --- */

  function renderReplies(parentId: string, depth: number) {
    const children = reviews
      .filter((r) => r.replyTo === parentId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    if (children.length === 0) return null;

    return (
      <div className={styles.reviewTree}>
        {children.map((child) => {
          const isLastChild =
            children.indexOf(child) === children.length - 1;
          const depthLabel =
            DEPTH_LABELS[Math.min(depth + 1, DEPTH_LABELS.length - 1)];

          return (
            <div key={child.id} className={styles.treeItem}>
              <div className={styles.treeRow}>
                <span className={styles.treeConnector}>
                  {isLastChild ? "└──" : "├──"}
                </span>
                <span className={styles.treeAlias}>@{child.alias}</span>
                <span className={styles.treeDot}>·</span>
                <span className={styles.treeDate}>
                  {formatDate(child.createdAt)}
                </span>
              </div>
              <div className={styles.treeContent}>
                <p className={styles.treeBody}>{child.body}</p>
                <div className={styles.treeFooter}>
                  <span className={styles.depthLabel}>{depthLabel}</span>
                  <button
                    type="button"
                    className={styles.replyBtn}
                    onClick={() => setReplyTo(child.id)}
                  >
                    Reply
                  </button>
                </div>
              </div>
              {renderReplies(child.id, depth + 1)}
            </div>
          );
        })}
      </div>
    );
  }

  /* --- variables setup --- */

  const isApiLive = syncState === "ready" || syncState === "saving";
  const dotClass = isApiLive ? styles.statusDotOnline : styles.statusDotOffline;

  return (
    <section id="reviews" className={sectionStyles.section}>
      <div className={sectionStyles.container}>
        <h2 className={sectionStyles.title}>03 / Reviews - {reviews.length}</h2>
        <div ref={ref} className={`${styles.shell} reveal`}>
          <aside className={styles.composer}>
            <div>
              <p className="mono-text">signal input</p>
              <h3>Leave a review</h3>
            </div>

            <p className={styles.syncStatus}>
              <span className={`${styles.statusDot} ${dotClass}`} />
              {syncState === "loading" && "Loading shared reviews"}
              {syncState === "ready" && "Synced with api.godkode.xyz"}
              {syncState === "saving" && "Saving to shared reviews"}
              {syncState === "offline" && "Reviews API unavailable"}
            </p>

            {replyTarget && (
              <div className={styles.replyBanner}>
                <span>Replying to @{replyTarget.alias}</span>
                <button type="button" onClick={() => setReplyTo(null)} className="hover-link">
                  Clear
                </button>
              </div>
            )}

            {alias && isEditingAlias && (
              <form onSubmit={handleAliasChange} className={styles.aliasForm}>
                <label className={styles.field}>
                  <span>New alias</span>
                  <input
                    value={draftAlias}
                    onChange={(event) => setDraftAlias(event.target.value)}
                    placeholder={alias}
                    maxLength={24}
                    required
                  />
                </label>
                <div className={styles.aliasActions}>
                  <button type="submit" className="hover-link">Save</button>
                  <button
                    type="button"
                    className="hover-link"
                    onClick={() => {
                      setDraftAlias("");
                      setIsEditingAlias(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              {!alias && (
                <label className={styles.field}>
                  <span>Alias</span>
                  <input
                    value={draftAlias}
                    onChange={(event) => setDraftAlias(event.target.value)}
                    placeholder="your-alias"
                    maxLength={24}
                    required
                  />
                </label>
              )}

              {alias && (
                <div className={styles.savedAlias}>
                  <span>Posting as</span>
                  <strong>@{alias}</strong>
                  <button
                    type="button"
                    className="hover-link"
                    onClick={() => {
                      setDraftAlias(alias);
                      setIsEditingAlias(true);
                    }}
                  >
                    Edit
                  </button>
                </div>
              )}

              <label className={styles.field}>
                <span>Review</span>
                <textarea
                  value={draftReview}
                  onChange={(event) => setDraftReview(event.target.value)}
                  placeholder="Drop your signal here..."
                  maxLength={180}
                  required
                />
              </label>

              <button
                type="submit"
                className={`${styles.submit} hover-link`}
                disabled={syncState === "saving" || syncState === "loading"}
              >
                Transmit
              </button>
            </form>
          </aside>

          <div className={styles.reviewPanel}>
            <div className={styles.shellTitle}>
              <div className={styles.shellDots}>
                <span />
                <span />
                <span />
              </div>
              <span className={styles.shellPrompt}>reviews@portfolio:~$</span>
            </div>

            <div className={styles.reviewList}>
              {topLevelReviews.length === 0 && (
                <div className={styles.emptyState}>
                  <span>
                    {syncState === "offline"
                      ? "Reviews API unavailable"
                      : "Awaiting first signal"}
                  </span>
                </div>
              )}

              {topLevelReviews.map((review, index) => {
                const isExpanded = expandedId === review.id;
                const replyCount = countReplies(review.id, reviews);

                return (
                  <div key={review.id} className={`${styles.reviewItem} ${isExpanded ? styles.reviewItemExpanded : ""}`}>
                    <button
                      type="button"
                      className={`${styles.reviewRow} ${isExpanded ? styles.reviewRowActive : ""}`}
                      style={{ ["--index" as string]: `${index}` }}
                      onClick={() => handleToggleReview(review.id)}
                    >
                      <span className={styles.reviewNumber}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className={styles.reviewArrow}>
                        {isExpanded ? "▾" : "▸"}
                      </span>
                      <span className={styles.reviewAlias}>@{review.alias}</span>
                      <span className={styles.reviewDate}>
                        · {formatDate(review.createdAt)}
                      </span>
                      {replyCount > 0 && (
                        <span className={styles.reviewReplyCount}>
                          {replyCount}
                        </span>
                      )}
                    </button>

                    <div
                      className={`${styles.reviewExpand} ${isExpanded ? styles.reviewExpandOpen : ""}`}
                    >
                      <div className={styles.reviewExpandInner}>
                        <div className={styles.reviewExpandContent}>
                          <p className={styles.reviewBody}>{review.body}</p>
                          <div className={styles.reviewFooter}>
                            <span className={styles.depthLabel}>comment</span>
                            <button
                              type="button"
                              className={styles.replyBtn}
                              onClick={() => setReplyTo(review.id)}
                            >
                              Reply
                            </button>
                          </div>
                          {isExpanded && renderReplies(review.id, 0)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.replyHint}>
              {"// click a review to see the replies"}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
