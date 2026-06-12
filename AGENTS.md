# AGENTS.md — GodKode Portfolio

## Quick Reference

| Task | Command |
|------|---------|
| Dev server | `npm run dev` |
| Build (static export) | `npm run build` |
| Lint | `npm run lint` |
| Typecheck | `npx tsc --noEmit` |

## Project Structure

```
app/              # Next.js App Router (pages, layout, globals.css)
components/       # React components (Hero, Skills, Work, Reviews, etc.)
hooks/            # Client hooks (useDiscord, useReveal)
lib/              # Data files (projects.ts, skills.ts)
public/           # Static assets (icons, images)
```

## Key Conventions

- **Static export**: `next.config.ts` has `output: "export"` — no server runtime
- **Path alias**: `@/*` maps to root (see `tsconfig.json`)
- **Client components**: Use `"use client"` directive (e.g., hooks, Nav, Cursor)
- **CSS Modules**: Component-scoped CSS in `*.module.css` files
- **Fonts**: Space Grotesk + Space Mono via `next/font/google` in `layout.tsx`

## Data-Driven Content

- **Projects**: Edit `lib/projects.ts` — `Project` type with year, type, title, desc, links
- **Skills**: Edit `lib/skills.ts` — `Skill` type with name, icon, desc, tier, category

## External Dependencies

- **Discord status**: Fetched via Lanyard API (`api.lanyard.rest`) in `hooks/useDiscord.ts`
- **Images**: `cdn.discordapp.com` allowed in `next.config.ts` remotePatterns
- **Icons**: Local PNG/WebP in `public/assets/icons/`

## Build Output

- Output goes to `out/` directory (GitHub Pages compatible)
- Do not commit `out/` — it's generated

## Testing Notes

- No test framework configured
- Manual verification: `npm run build && npx serve out` to preview static site

## Accessibility Features

- **Reduced Motion**: Right-click opens context menu with toggle. Stored in localStorage, disables CSS animations/transitions