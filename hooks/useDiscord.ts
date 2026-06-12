"use client";

import { useEffect, useState } from "react";

const DISCORD_ID = "1150339860725514320";

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
  spotify: SpotifyData | null;
  activity: DiscordActivity | null;
};

const STATUS_LABEL: Record<string, string> = {
  online: "online",
  idle: "idle",
  dnd: "on do not disturb",
  offline: "offline",
};

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

    return {
      status: data.discord_status,
      username: data.discord_user.username,
      globalName: data.discord_user.global_name || data.discord_user.username,
      avatarUrl: `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${data.discord_user.avatar}.png`,
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
  const [discord, setDiscord] = useState<DiscordData | null>(null);

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
