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
import ParticleBackground from './components/ParticleBackground'

const GAMES = {
  'mind-meld': MindMeld,
  'upside-down-draw': UpsideDownDraw,
  'void-memory': VoidMemory,
  'stranger-sync': StrangerSync,
  'telekinesis-pong': TelekinesisPong
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
      
      {/* Stranger Things Logo */}
      <div className="stranger-logo">
        <h1 className="logo-text">
          <span className="logo-stranger">STRANGER</span>
          <span className="logo-games">GAMES</span>
        </h1>
        <p className="logo-subtitle">The Upside Down of Gaming</p>
      </div>

      <main className="main-content">
        {screen === 'connection' && <ConnectionScreen onComplete={() => setScreen('lobby')} />}
        {screen === 'lobby' && <LobbyScreen />}
        {screen === 'select' && <GameSelectScreen />}
        {screen === 'game' && GameComponent && <GameComponent />}
      </main>

      {/* Floating orbs decoration */}
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>
      <div className="floating-orb orb-3"></div>
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
