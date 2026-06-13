"use client";

import { useEffect, useState } from "react";

const DISCORD_ID = "1150339860725514320";
const AVATAR_CACHE_KEY = "godkode.avatarCache";

export type DiscordActivity = {
  type: number;
  name: string;
  details?: string;
  state?: string;
  application_id?: string;
  assets?: { large_image?: string };
};

export type SpotifyData = {
  song: string;
  artist: string;
  album_art_url: string;
};

export type DiscordData = {
  status: "online" | "idle" | "dnd" | "offline";
  username: string;
  globalName: string;
  avatarUrl: string;
  avatarHash: string | null;
  spotify: SpotifyData | null;
  activity: DiscordActivity | null;
};

const STATUS_LABEL: Record<string, string> = {
  online: "online",
  idle: "idle",
  dnd: "on do not disturb",
  offline: "offline",
};

function readAvatarCache(): { hash: string; url: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AVATAR_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeAvatarCache(hash: string, url: string) {
  try {
    window.localStorage.setItem(AVATAR_CACHE_KEY, JSON.stringify({ hash, url }));
  } catch {
    // storage full or unavailable
  }
}

async function fetchLanyard(signal?: AbortSignal): Promise<DiscordData | null> {
  try {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`, {
      cache: "no-store",
      signal,
    });
    if (!res.ok) return null;

    const { data, success } = await res.json();
    if (!success) return null;

    const playingAct: DiscordActivity | undefined = data.activities?.find(
      (a: DiscordActivity) => a.type === 0
    );

    const avatarHash: string | null = data.discord_user.avatar ?? null;
    const cdnUrl = `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${data.discord_user.avatar}.png`;

    return {
      status: data.discord_status,
      username: data.discord_user.username,
      globalName: data.discord_user.global_name || data.discord_user.username,
      avatarUrl: cdnUrl,
      avatarHash,
      spotify: data.listening_to_spotify ? data.spotify : null,
      activity: playingAct ?? null,
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return null;
    }
    return null;
  }
}

export function useDiscord() {
  const [discord, setDiscord] = useState<DiscordData | null>(() => {
    const cached = readAvatarCache();
    return cached
      ? {
          status: "offline",
          username: "adhuraghav",
          globalName: "Raghav",
          avatarUrl: cached.url,
          avatarHash: null,
          spotify: null,
          activity: null,
        }
      : null;
  });

  useEffect(() => {
    let mounted = true;
    let inFlight = false;
    let controller: AbortController | null = null;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const poll = async () => {
      if (inFlight || document.visibilityState === "hidden") return;

      inFlight = true;
      controller?.abort();
      controller = new AbortController();

      const nextDiscord = await fetchLanyard(controller.signal);
      if (mounted && nextDiscord) {
        const cached = readAvatarCache();

        if (cached && cached.hash && nextDiscord.avatarHash && cached.hash !== nextDiscord.avatarHash) {
          writeAvatarCache(nextDiscord.avatarHash, nextDiscord.avatarUrl);
          nextDiscord.avatarUrl = nextDiscord.avatarUrl;
        } else if (!cached || cached.hash !== nextDiscord.avatarHash) {
          if (nextDiscord.avatarHash) {
            writeAvatarCache(nextDiscord.avatarHash, nextDiscord.avatarUrl);
          }
        } else {
          nextDiscord.avatarUrl = cached.url;
        }

        setDiscord(nextDiscord);
      }

      inFlight = false;
    };

    const startInterval = () => {
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(() => void poll(), 15_000);
    };

    void poll();
    startInterval();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void poll();
        startInterval();
      } else {
        if (intervalId) clearInterval(intervalId);
        intervalId = null;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      mounted = false;
      if (intervalId) clearInterval(intervalId);
      controller?.abort();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const statusLabel = discord ? STATUS_LABEL[discord.status] ?? discord.status : "";

  return { discord, statusLabel };
}
