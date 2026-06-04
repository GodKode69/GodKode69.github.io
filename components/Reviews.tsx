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

function getDepth(review: Review, byId: Map<string, Review>): number {
  let depth = 0;
  let current = review;
  while (current.replyTo) {
    const parent = byId.get(current.replyTo);
    if (!parent) break;
    depth++;
    current = parent;
  }
  return depth;
}

function getChainIds(
  startId: string,
  byId: Map<string, Review>,
  allReviews: Review[],
): Set<string> {
  const chain = new Set<string>();

  let current = byId.get(startId);
  while (current) {
    chain.add(current.id);
    if (!current.replyTo) break;
    current = byId.get(current.replyTo);
  }

  const queue = [...chain];
  while (queue.length > 0) {
    const id = queue.shift()!;
    for (const r of allReviews) {
      if (r.replyTo === id && !chain.has(r.id)) {
        chain.add(r.id);
        queue.push(r.id);
      }
    }
  }

  return chain;
}

/* --- reviews main react component --- */

export default function Reviews() {
  const ref = useReveal<HTMLDivElement>();
  const reviewsRef = useRef<Review[]>(INITIAL_REVIEWS);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [alias, setAlias] = useState("");
  const [userId, setUserId] = useState("");
  const [draftAlias, setDraftAlias] = useState("");
  const [draftReview, setDraftReview] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [isEditingAlias, setIsEditingAlias] = useState(false);
  const [syncState, setSyncState] = useState<SyncState>("loading");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
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

  const expandedIds = useMemo(() => {
    if (!hoveredId) return new Set<string>();
    return getChainIds(hoveredId, reviewById, reviews);
  }, [hoveredId, reviewById, reviews]);

  const visibleReviews = useMemo(() => {
    return reviews.filter((review) => {
      return !review.replyTo || expandedIds.has(review.id);
    });
  }, [reviews, expandedIds]);

  const positionedReviews = useMemo(() => {
    let coords = visibleReviews.map((r) => ({
      ...r,
      currX: r.x,
      currY: r.y,
      isExpanded: expandedIds.has(r.id),
    }));

    for (let iter = 0; iter < 3; iter++) {
      for (let i = 0; i < coords.length; i++) {
        const c1 = coords[i];
        const w1 = c1.isExpanded ? 44 : 18;
        const h1 = c1.isExpanded ? 22 : 8;
        const hw1 = w1 / 2;
        const hh1 = h1 / 2;

        for (let j = 0; j < coords.length; j++) {
          if (i === j) continue;
          const c2 = coords[j];
          const w2 = c2.isExpanded ? 44 : 18;
          const h2 = c2.isExpanded ? 22 : 8;
          const hw2 = w2 / 2;
          const hh2 = h2 / 2;

          const minDx = hw1 + hw2 + 4.0;
          const minDy = hh1 + hh2 + 4.0;

          let diffX = c1.currX - c2.currX;
          let diffY = c1.currY - c2.currY;

          if (diffX === 0 && diffY === 0) {
            diffX = (i % 2 === 0 ? 1 : -1) * 0.5;
            diffY = (i % 3 === 0 ? 1 : -1) * 0.5;
          }

          const overlapX = minDx - Math.abs(diffX);
          const overlapY = minDy - Math.abs(diffY);

          if (overlapX > 0 && overlapY > 0) {
            if (overlapX < overlapY) {
              const pushX = Math.sign(diffX) * overlapX * 0.5;
              c1.currX += pushX;
              c2.currX -= pushX;
            } else {
              const pushY = Math.sign(diffY) * overlapY * 0.5;
              c1.currY += pushY;
              c2.currY -= pushY;
            }
          }
        }
      }
    }

    return coords.map((c) => {
      const minX = c.isExpanded ? 24 : 10;
      const maxX = c.isExpanded ? 76 : 90;
      const minY = c.isExpanded ? 16 : 10;
      const maxY = c.isExpanded ? 84 : 90;

      return {
        ...c,
        displayX: clamp(c.currX, minX, maxX),
        displayY: clamp(c.currY, minY, maxY),
      };
    });
  }, [visibleReviews, expandedIds]);

  /* --- form submit and update handlers --- */

  async function reloadReviews() {
    const nextReviews = await fetchReviews();
    reviewsRef.current = nextReviews;
    setReviews(nextReviews);
    setSyncState("ready");
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

  /* --- mouse hover timeout handlers --- */

  function handleMouseEnter(id: string) {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredId(id);
    }, 200);
  }

  function handleMouseLeave() {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredId(null);
  }

  /* --- variables setup --- */

  const isApiLive = syncState === "ready" || syncState === "saving";
  const dotClass = isApiLive ? styles.statusDotOnline : styles.statusDotOffline;
  const hasActiveChain = expandedIds.size > 0;

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

          <div className={styles.board} aria-label="Floating reviews">
            {reviews.length === 0 && (
              <div className={styles.emptyState}>
                <span>{syncState === "offline" ? "Reviews API unavailable" : "Awaiting first signal"}</span>
              </div>
            )}

            <svg className={styles.links} aria-hidden="true">
              <defs>
                <marker
                  id="arrowhead-active"
                  markerWidth="8"
                  markerHeight="6"
                  refX="8"
                  refY="3"
                  orient="auto"
                  markerUnits="userSpaceOnUse"
                >
                  <polygon points="0 0, 8 3, 0 6" fill="rgba(95, 158, 160, 0.85)" />
                </marker>
                <marker
                  id="arrowhead-dimmed"
                  markerWidth="8"
                  markerHeight="6"
                  refX="8"
                  refY="3"
                  orient="auto"
                  markerUnits="userSpaceOnUse"
                >
                  <polygon points="0 0, 8 3, 0 6" fill="rgba(95, 158, 160, 0.15)" />
                </marker>
              </defs>
              {positionedReviews.map((review) => {
                if (!review.replyTo) return null;
                const parent = reviewById.get(review.replyTo);
                if (!parent) return null;

                const parentPositioned = positionedReviews.find((r) => r.id === parent.id);
                if (!parentPositioned) return null;

                const isActive = expandedIds.has(review.id) && expandedIds.has(parent.id);

                return (
                  <line
                    key={`${review.id}-${review.replyTo}`}
                    x1={`${parentPositioned.displayX}%`}
                    y1={`${parentPositioned.displayY}%`}
                    x2={`${review.displayX}%`}
                    y2={`${review.displayY}%`}
                    className={isActive ? styles.activeLink : styles.dimmedLink}
                    markerEnd={isActive ? "url(#arrowhead-active)" : "url(#arrowhead-dimmed)"}
                  />
                );
              })}
            </svg>

            {positionedReviews.map((review, index) => {
              const depth = getDepth(review, reviewById);
              const depthLabel = DEPTH_LABELS[Math.min(depth, DEPTH_LABELS.length - 1)];

              return (
                <article
                  key={review.id}
                  className={[
                    styles.reviewCard,
                    review.isExpanded ? styles.expanded : "",
                    hasActiveChain && !review.isExpanded ? styles.dimmed : "",
                  ].filter(Boolean).join(" ")}
                  style={{
                    left: `${review.displayX}%`,
                    top: `${review.displayY}%`,
                    ["--float-delay" as string]: `${index * -0.75}s`,
                  }}
                  onMouseEnter={() => handleMouseEnter(review.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <header className={styles.cardHeader}>
                    <strong>@{review.alias}</strong>
                    <span className={styles.cardDate}>{formatDate(review.createdAt)}</span>
                  </header>
                  <div className={styles.cardDetails}>
                    <div className={styles.cardDetailsInner}>
                      <p className={styles.cardBody}>{review.body}</p>
                      <footer className={styles.cardFooter}>
                        <span className={styles.depthLabel}>{depthLabel}</span>
                        <button
                          type="button"
                          className="hover-link"
                          onClick={() => setReplyTo(review.id)}
                        >
                          Reply
                        </button>
                      </footer>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
