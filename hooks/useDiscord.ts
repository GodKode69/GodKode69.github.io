"use client";

import { useEffect, useState } from "react";

const discordId = "563396067341631499";
const avatarCacheKey = "godkode.avatarCache";

type DiscordActivity = {
  type: number;
  name: string;
  details?: string;
  state?: string;
  application_id?: string;
  assets?: { large_image?: string };
};

type SpotifyData = {
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

const statusLabels: Record<string, string> = {
  online: "online",
  idle: "idle",
  dnd: "on do not disturb",
  offline: "offline",
};

function readAvatarCache(): { hash: string; url: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(avatarCacheKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.hash !== "string" || typeof parsed?.url !== "string") return null;
    if (!parsed.url.startsWith("https://cdn.discordapp.com/")) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeAvatarCache(hash: string, url: string) {
  try {
    window.localStorage.setItem(avatarCacheKey, JSON.stringify({ hash, url }));
  } catch {
  }
}

function parseLanyardData(data: any): DiscordData | null {
  if (!data) return null;
  const playingAct: DiscordActivity | undefined = data.activities?.find(
    (a: DiscordActivity) => a.type === 0
  );

  const avatarHash: string | null = data.discord_user?.avatar ?? null;
  const cdnUrl = avatarHash
    ? `https://cdn.discordapp.com/avatars/${discordId}/${avatarHash}.png`
    : "/assets/profile/avatar.webp";

  return {
    status: data.discord_status || "offline",
    username: data.discord_user?.username || "adhuraghav",
    globalName: data.discord_user?.global_name || data.discord_user?.username || "Raghav",
    avatarUrl: cdnUrl,
    avatarHash,
    spotify: data.listening_to_spotify ? data.spotify : null,
    activity: playingAct ?? null,
  };
}

async function fetchLanyardHTTP(signal?: AbortSignal): Promise<DiscordData | null> {
  try {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${discordId}`, {
      cache: "no-store",
      signal,
    });
    if (!res.ok) return null;
    const { data, success } = await res.json();
    if (!success) return null;
    return parseLanyardData(data);
  } catch {
    return null;
  }
}

export function useDiscord() {
  const [discord, setDiscord] = useState<DiscordData | null>(null);

  useEffect(() => {
    const cached = readAvatarCache();
    if (cached) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDiscord({
        status: "offline",
        username: "adhuraghav",
        globalName: "Raghav",
        avatarUrl: cached.url,
        avatarHash: null,
        spotify: null,
        activity: null,
      });
    }

    let mounted = true;
    let ws: WebSocket | null = null;
    let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
    let fallbackTimer: ReturnType<typeof setInterval> | null = null;

    const initHTTPFallback = () => {
      if (!mounted) return;
      void fetchLanyardHTTP().then((res) => {
        if (mounted && res) {
          if (res.avatarHash) writeAvatarCache(res.avatarHash, res.avatarUrl);
          setDiscord(res);
        }
      });
    };

    const connectWS = () => {
      if (!mounted || document.visibilityState === "hidden") return;

      try {
        ws = new WebSocket("wss://api.lanyard.rest/socket");

        ws.onmessage = (event) => {
          try {
            const packet = JSON.parse(event.data);
            const { op, t, d } = packet;

            if (op === 1) {
              const interval = d.heartbeat_interval;
              if (heartbeatTimer) clearInterval(heartbeatTimer);
              heartbeatTimer = setInterval(() => {
                if (ws && ws.readyState === WebSocket.OPEN) {
                  ws.send(JSON.stringify({ op: 3 }));
                }
              }, interval);
            } else if (op === 0 && (t === "INIT_STATE" || t === "PRESENCE_UPDATE")) {
              const parsed = parseLanyardData(d);
              if (mounted && parsed) {
                if (parsed.avatarHash) writeAvatarCache(parsed.avatarHash, parsed.avatarUrl);
                setDiscord(parsed);
              }
            }
          } catch {
          }
        };

        ws.onopen = () => {
          if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                op: 2,
                d: { subscribe_to_id: discordId },
              })
            );
          }
        };

        ws.onclose = () => {
          if (heartbeatTimer) clearInterval(heartbeatTimer);
          // Fall back to polling if socket closes
          if (mounted) {
            initHTTPFallback();
            fallbackTimer = setInterval(initHTTPFallback, 15_000);
          }
        };
      } catch {
        initHTTPFallback();
        fallbackTimer = setInterval(initHTTPFallback, 15_000);
      }
    };

    initHTTPFallback();
    connectWS();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        if (!ws || ws.readyState !== WebSocket.OPEN) {
          connectWS();
        }
        initHTTPFallback();
      } else {
        if (ws) {
          ws.close();
          ws = null;
        }
        if (heartbeatTimer) {
          clearInterval(heartbeatTimer);
          heartbeatTimer = null;
        }
        if (fallbackTimer) {
          clearInterval(fallbackTimer);
          fallbackTimer = null;
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      mounted = false;
      if (ws) ws.close();
      if (heartbeatTimer) clearInterval(heartbeatTimer);
      if (fallbackTimer) clearInterval(fallbackTimer);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const statusLabel = discord ? statusLabels[discord.status] ?? discord.status : "";

  return { discord, statusLabel };
}
