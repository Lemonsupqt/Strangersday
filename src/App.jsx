import React, { useState, useEffect } from 'react'
import { GameProvider, useGame } from './context/GameContext'
import ConnectionScreen from './screens/ConnectionScreen'
import LobbyScreen from './screens/LobbyScreen'
import GameSelectScreen from './screens/GameSelectScreen'
import MindMeld from './games/MindMeld'
import UpsideDownDraw from './games/UpsideDownDraw'
import VoidMemory from './games/VoidMemory'
import StrangerSync from './games/StrangerSync'
import TelekinesisPong from './games/TelekinesisPong'
import ShadowTyping from './games/ShadowTyping'
import SeanceCircle from './games/SeanceCircle'
import ThingHandSlap from './games/ThingHandSlap'
import DungeonEscape from './games/DungeonEscape'
import ParticleBackground from './components/ParticleBackground'

const GAMES = {
  'mind-meld': MindMeld,
  'upside-down-draw': UpsideDownDraw,
  'void-memory': VoidMemory,
  'stranger-sync': StrangerSync,
  'telekinesis-pong': TelekinesisPong,
  'shadow-typing': ShadowTyping,
  'seance-circle': SeanceCircle,
  'thing-hand-slap': ThingHandSlap,
  'dungeon-escape': DungeonEscape
}

function GameApp() {
  const { isConnected, currentGame, playerName } = useGame()
  const [screen, setScreen] = useState('connection')

  useEffect(() => {
    if (!playerName) {
      setScreen('connection')
    } else if (!isConnected) {
      setScreen('lobby')
    } else if (currentGame) {
      setScreen('game')
    } else {
      setScreen('select')
    }
  }, [isConnected, currentGame, playerName])

  const GameComponent = currentGame ? GAMES[currentGame] : null

  return (
    <div className="app-container">
      <ParticleBackground />
      
      {/* Gothic Logo - Stranger Things x Wednesday */}
      <div className="stranger-logo">
        <h1 className="logo-text">
          <span className="logo-stranger">STRANGER</span>
          <span className="logo-games">GAMES</span>
        </h1>
        <p className="logo-subtitle">
          <span className="subtitle-icon">☠️</span>
          Where the Upside Down meets Nevermore
          <span className="subtitle-icon">🖤</span>
        </p>
        <div className="logo-decoration">
          <span className="deco-bat">🦇</span>
          <span className="deco-line"></span>
          <span className="deco-skull">💀</span>
          <span className="deco-line"></span>
          <span className="deco-bat flip">🦇</span>
        </div>
      </div>

      <main className="main-content">
        {screen === 'connection' && <ConnectionScreen onComplete={() => setScreen('lobby')} />}
        {screen === 'lobby' && <LobbyScreen />}
        {screen === 'select' && <GameSelectScreen />}
        {screen === 'game' && GameComponent && <GameComponent />}
      </main>

      {/* Floating gothic elements */}
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>
      <div className="floating-orb orb-3"></div>
      
      {/* Gothic corner decorations */}
      <div className="corner-decoration top-left">
        <svg viewBox="0 0 100 100" className="corner-svg">
          <path d="M0,0 L100,0 L100,10 Q50,10 50,60 Q50,100 0,100 L0,0" fill="currentColor"/>
        </svg>
      </div>
      <div className="corner-decoration top-right">
        <svg viewBox="0 0 100 100" className="corner-svg">
          <path d="M100,0 L0,0 L0,10 Q50,10 50,60 Q50,100 100,100 L100,0" fill="currentColor"/>
        </svg>
      </div>
    </div>
  )
}

function App() {
  return (
    <GameProvider>
      <GameApp />
    </GameProvider>
  )
}

export default App
