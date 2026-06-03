"use client";

import { FormEvent, PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { useReveal } from "@/hooks/useReveal";
import styles from "./Reviews.module.css";
import sectionStyles from "./Section.module.css";

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

type DragState = {
  ids: string[];
  pointerX: number;
  pointerY: number;
  start: Record<string, Pick<Review, "x" | "y">>;
  width: number;
  height: number;
};

type SyncState = "loading" | "ready" | "saving" | "offline";

const API_BASE_URL = (process.env.NEXT_PUBLIC_REVIEWS_API_BASE_URL ?? "https://api.godkode.xyz")
  .replace(/\/$/, "");
const REVIEWS_ENDPOINT = `${API_BASE_URL}/reviews`;
const ALIAS_KEY = "godkode.reviewAlias.v1";
const USER_ID_KEY = "godkode.reviewUserId.v1";
const INITIAL_REVIEWS: Review[] = [];
const POLL_INTERVAL = 3000;

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
  const alias = stringValue(value.alias);
  const body = stringValue(value.body) || stringValue(value.review);
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
    y: clamp(numberValue(value.y, 50), 14, 86),
  };
}

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

async function updateReviewPosition(review: Pick<Review, "id" | "authorId" | "x" | "y">) {
  await requestJson<unknown>(`${REVIEWS_ENDPOINT}/${encodeURIComponent(review.id)}`, {
    method: "PATCH",
    body: JSON.stringify({
      authorId: review.authorId,
      x: review.x,
      y: review.y,
    }),
  });
}

async function updateAuthorAlias(authorId: string, alias: string) {
  await requestJson<unknown>(`${REVIEWS_ENDPOINT}/alias`, {
    method: "PATCH",
    body: JSON.stringify({ authorId, alias }),
  });
}

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

export default function Reviews() {
  const ref = useReveal<HTMLDivElement>();
  const boardRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const reviewsRef = useRef<Review[]>(INITIAL_REVIEWS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [alias, setAlias] = useState("");
  const [userId, setUserId] = useState("");
  const [draftAlias, setDraftAlias] = useState("");
  const [draftReview, setDraftReview] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [isEditingAlias, setIsEditingAlias] = useState(false);
  const [activeDragIds, setActiveDragIds] = useState<string[]>([]);
  const [syncState, setSyncState] = useState<SyncState>("loading");

  useEffect(() => {
    reviewsRef.current = reviews;
  }, [reviews]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setAlias(readAlias());
      setUserId(readUserId());
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    let active = true;

    async function refresh() {
      try {
        const nextReviews = await fetchReviews();
        if (!active || dragRef.current) return;
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

  useEffect(() => {
    function onPointerMove(event: globalThis.PointerEvent) {
      const drag = dragRef.current;
      if (!drag) return;

      const dx = ((event.clientX - drag.pointerX) / drag.width) * 100;
      const dy = ((event.clientY - drag.pointerY) / drag.height) * 100;

      setReviews((current) => {
        const nextReviews = current.map((review) => {
          const start = drag.start[review.id];
          if (!start) return review;

          return {
            ...review,
            x: clamp(start.x + dx, 10, 90),
            y: clamp(start.y + dy, 14, 86),
          };
        });

        reviewsRef.current = nextReviews;
        return nextReviews;
      });
    }

    function onPointerUp() {
      const drag = dragRef.current;
      if (!drag) return;

      dragRef.current = null;
      setActiveDragIds([]);

      const movedReviews = reviewsRef.current.filter((review) => drag.ids.includes(review.id));
      setSyncState("saving");
      Promise.all(movedReviews.map(updateReviewPosition))
        .then(fetchReviews)
        .then((nextReviews) => {
          reviewsRef.current = nextReviews;
          setReviews(nextReviews);
          setSyncState("ready");
        })
        .catch(() => setSyncState("offline"));
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  const replyTarget = useMemo(
    () => reviews.find((review) => review.id === replyTo) ?? null,
    [replyTo, reviews],
  );

  const reviewById = useMemo(() => {
    const map = new Map<string, Review>();
    reviews.forEach((review) => map.set(review.id, review));
    return map;
  }, [reviews]);

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
      x: parent ? clamp(parent.x + 30, 12, 88) : 16 + Math.random() * 68,
      y: parent ? clamp(parent.y + (parent.y > 50 ? -24 : 24), 14, 86) : 18 + Math.random() * 62,
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

  function startDrag(event: PointerEvent<HTMLElement>, reviewId: string) {
    if (event.button !== 0) return;

    const board = boardRef.current;
    if (!board) return;

    const rect = board.getBoundingClientRect();
    const ids = [reviewId];
    const start = Object.fromEntries(
      reviews
        .filter((review) => ids.includes(review.id))
        .map((review) => [review.id, { x: review.x, y: review.y }]),
    );

    dragRef.current = {
      ids,
      pointerX: event.clientX,
      pointerY: event.clientY,
      start,
      width: rect.width,
      height: rect.height,
    };
    setActiveDragIds(ids);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

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

          <div ref={boardRef} className={styles.board} aria-label="Floating reviews">
            {reviews.length === 0 && (
              <div className={styles.emptyState}>
                <span>{syncState === "offline" ? "Reviews API unavailable" : "Awaiting first signal"}</span>
              </div>
            )}

            <svg className={styles.links} aria-hidden="true">
              {reviews.map((review) => {
                if (!review.replyTo) return null;
                const parent = reviewById.get(review.replyTo);
                if (!parent) return null;

                return (
                  <line
                    key={`${review.id}-${review.replyTo}`}
                    x1={`${parent.x}%`}
                    y1={`${parent.y}%`}
                    x2={`${review.x}%`}
                    y2={`${review.y}%`}
                  />
                );
              })}
            </svg>

            {reviews.map((review, index) => (
              <article
                key={review.id}
                className={`${styles.review} ${activeDragIds.includes(review.id) ? styles.active : ""}`}
                style={{
                  left: `${review.x}%`,
                  top: `${review.y}%`,
                  ["--float-delay" as string]: `${index * -0.75}s`,
                }}
                onPointerDown={(event) => startDrag(event, review.id)}
              >
                <header>
                  <strong>@{review.alias}</strong>
                  <span>{formatDate(review.createdAt)}</span>
                </header>
                <p>{review.body}</p>
                <footer>
                  {review.replyTo && <span>linked</span>}
                  <button
                    type="button"
                    className="hover-link"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={() => setReplyTo(review.id)}
                  >
                    Reply
                  </button>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
