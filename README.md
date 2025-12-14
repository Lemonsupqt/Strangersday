## THE VEIL BETWEEN
A browser-based, real-time **2-player** co-op game for long-distance best friends.

- **Client**: React + Vite (deploys to **GitHub Pages**)
- **Realtime server**: Node + WebSocket (deploy separately; Pages cannot host it)

### Local development
#### 1) Start the realtime server
```bash
cd server
npm install
npm run dev
# listens on ws://localhost:8080
```

#### 2) Start the client
```bash
cd client
npm install
npm run dev
```
Open the client, then set **Server URL** to `ws://localhost:8080`.

### Deploy
#### Client → GitHub Pages
This repo includes a GitHub Actions workflow at `.github/workflows/pages.yml` that builds `client/` and deploys `client/dist`.

- In your GitHub repo settings: **Pages → Build and deployment → Source: GitHub Actions**
- Push to `main`

#### Realtime server → Render/Fly/Railway (or similar)
You need any host that supports a long-running Node process (WebSockets).

- Build the server:
```bash
cd server
npm install
npm run build
```
- Run it:
```bash
npm start
```
- Set the client’s **Server URL** to your hosted WebSocket URL (usually `wss://...`).

If you use Docker, `server/Dockerfile` expects `server/dist` to exist (run `npm run build` first).

### How to play
1. One friend creates a room.
2. Share the invite link.
3. Both click **Ready**.
4. Roles are assigned: **WITNESS** and **DIVER**.
5. Use **taps/cards/one sentence** sparingly.
