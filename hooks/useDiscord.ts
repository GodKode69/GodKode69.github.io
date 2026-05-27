"use client";

import { useEffect, useState } from "react";

const DISCORD_ID = "1243904701318037609";

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

async function fetchLanyard(): Promise<DiscordData | null> {
  try {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
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
  } catch {
    return null;
  }
}

export function useDiscord() {
  const [discord, setDiscord] = useState<DiscordData | null>(null);

  useEffect(() => {
    fetchLanyard().then(setDiscord);
    const id = setInterval(() => fetchLanyard().then(setDiscord), 15_000);
    return () => clearInterval(id);
  }, []);

  const statusLabel = discord ? STATUS_LABEL[discord.status] ?? discord.status : "";

  return { discord, statusLabel };
}