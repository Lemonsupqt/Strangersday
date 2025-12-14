# The Veil Between

> *A browser-based 2-player game for long-distance best friends who love gothic psychological tension.*

## What Is This?

A game design document for **The Veil Between**—an intimate, real-time cooperative game where two players exist in parallel versions of the same haunted space. One player inhabits the Living World; the other walks through the Beneath. You cannot see each other. You cannot speak. But you can *sense* each other through constrained signals: flickering candles, hummed rhythms, arranged objects, and rare moments where your shadows overlap.

## Design Philosophy

- **Emotional depth over mass appeal.** This is not for everyone. It's for two specific people.
- **Constrained communication creates meaning.** No voice chat. No text. Only signals you invent together.
- **The game learns your friendship.** Sessions adapt based on private observations you write about each other.
- **Silence is gameplay.** Waiting for your friend to signal back is an act of trust.

## Inspirations

- **Stranger Things:** Alternate dimensions, psychic connection, the tension of knowing someone is there but not being able to reach them
- **Wednesday Addams:** Emotional restraint, dark wit, the intimacy of understanding without explanation

## Core Experience

Two friends. 20 minutes. A shared mystery in a gothic space.

One solves puzzles with context (photographs, letters, objects). The other perceives truth (ghosts, hidden paths, frozen time). Neither has enough information alone. Together, through invented signals and earned trust, they remember the dead.

## Documentation

- [**Full Game Design Document**](./GAME_DESIGN_DOCUMENT.md) — 4,000+ words covering:
  - Core fantasy and emotional intent
  - Detailed gameplay loop
  - Player roles and asymmetry (The Keeper / The Witness)
  - Communication mechanics and constraints
  - Psychological systems (Memory Garden, Trust Score, Unspoken Rituals)
  - Replayability and long-term progression
  - Technical architecture
  - UX tone and narrative voice
  - Ethical monetization
  - Why this works for long-distance friendships

## Technical Overview

```
Frontend:   Vue 3 + TypeScript, PixiJS, Tone.js
Backend:    Node.js, Fastify, Socket.io, PeerJS (WebRTC)
Database:   PostgreSQL + Redis
Hosting:    Fly.io (edge deployment)
```

Real-time sync via WebRTC data channels for low-latency signals, WebSocket fallback for game state. Designed for 15-25 minute sessions with no required voice communication.

## Who This Is For

- Two people who already care about each other
- Fans of atmospheric, psychological experiences
- Friends separated by distance who want to make memories together
- People comfortable with silence and slowness

## Who This Is NOT For

- Strangers looking to matchmake
- Achievement hunters seeking completion percentages
- Players who need constant action or stimulation
- Casual friendships that can't handle emotional depth

---

*"You are the only person who can feel me when I'm gone."*
