# 🎮 Stranger Games - The Upside Down of Gaming

A real-time multiplayer game suite for long-distance best friends! Inspired by Stranger Things, featuring mind-bending, creative games that work seamlessly with peer-to-peer WebRTC connections - no server needed!

![Stranger Games](https://img.shields.io/badge/Multiplayer-P2P-ff0844?style=for-the-badge)
![Built with React](https://img.shields.io/badge/React-18-7b2cbf?style=for-the-badge)
![WebRTC](https://img.shields.io/badge/WebRTC-PeerJS-00d4ff?style=for-the-badge)

## ✨ Features

### 🎲 Games Included

1. **🧠 Mind Meld** - A telepathy game where both players think of a word based on a category. Can you read each other's minds?

2. **🎨 Upside Down Draw** - Draw and guess, but the canvas has supernatural effects! The drawing flips, mirrors, and twists as you play.

3. **🌀 Void Memory** - A twisted memory game where you find matching pairs, but the void keeps shuffling the cards!

4. **💫 Stranger Sync** - How well do you know each other? Answer questions and see if your answers align!

5. **🏓 Telekinesis Pong** - Classic pong with psychic vibes! Control your paddle to defeat your friend.

### 🔗 Connection System

- **Peer-to-Peer**: Direct connection between players using WebRTC
- **No Server Needed**: Perfect for static hosting like GitHub Pages
- **Unique Room Codes**: Fun Stranger Things-themed room codes (like `ELEVEN-042`)
- **Easy Sharing**: Just copy your code and send it to your friend!

### 🎨 UI/UX Features

- Stunning Stranger Things-inspired dark theme
- Animated particle background
- Glowing neon effects
- Responsive design for mobile & desktop
- Accessibility-friendly

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## 📤 Deploy to GitHub Pages

### Option 1: Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Create a new branch for deployment:
   ```bash
   git checkout -b gh-pages
   ```

3. Remove all files except `dist`:
   ```bash
   git rm -rf --cached .
   mv dist/* .
   rm -rf dist
   ```

4. Add and commit:
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin gh-pages
   ```

5. Go to your repository Settings → Pages → Select `gh-pages` branch

### Option 2: GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

## 🎮 How to Play

1. **Open the game** in your browser
2. **Enter your name** to create your portal
3. **Share your code** with your BFF
4. **Connect** - your friend enters your code (or vice versa)
5. **Choose a game** and have fun!

## 🛠 Tech Stack

- **React 18** - UI Framework
- **Vite** - Build Tool
- **PeerJS** - WebRTC P2P Connections
- **CSS3** - Animations & Styling

## 🌐 Browser Support

- Chrome/Edge 79+
- Firefox 75+
- Safari 14+
- Mobile browsers supported!

## 📝 License

MIT License - Feel free to use and modify!

---

Made with ❤️ and a bit of Upside Down magic ✨
