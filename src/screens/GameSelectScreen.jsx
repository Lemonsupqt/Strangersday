import React from 'react'
import { useGame } from '../context/GameContext'

const games = [
  {
    id: 'mind-meld',
    name: 'Mind Meld',
    description: 'Think alike! Both type a word, then find the connection. Can you read each other\'s minds?',
    icon: '🧠',
    color: '#ff6b9d',
    difficulty: 'Medium',
    players: '2 Players',
    theme: 'Eleven\'s Telepathy'
  },
  {
    id: 'upside-down-draw',
    name: 'Upside Down Draw',
    description: 'Draw and guess, but the canvas has a mind of its own! Watch as your drawings transform.',
    icon: '🎨',
    color: '#7b2cbf',
    difficulty: 'Easy',
    players: '2 Players',
    theme: 'The Upside Down'
  },
  {
    id: 'void-memory',
    name: 'Void Memory',
    description: 'A twisted memory game. Find matching pairs, but the void keeps shifting the cards!',
    icon: '🌀',
    color: '#00d4ff',
    difficulty: 'Hard',
    players: '2 Players',
    theme: 'The Mind Flayer'
  },
  {
    id: 'stranger-sync',
    name: 'Stranger Sync',
    description: 'How well do you know each other? Answer questions and see if your answers align!',
    icon: '💫',
    color: '#20e3b2',
    difficulty: 'Easy',
    players: '2 Players',
    theme: 'Friendship is Power'
  },
  {
    id: 'telekinesis-pong',
    name: 'Telekinesis Pong',
    description: 'Classic pong with a psychic twist! Control your paddle with... reactions!',
    icon: '🏓',
    color: '#ff0844',
    difficulty: 'Medium',
    players: '2 Players',
    theme: 'Powers Unleashed'
  }
]

const GameSelectScreen = () => {
  const { startGame, friendName, playerName, scores, disconnect } = useGame()

  return (
    <div className="game-select-screen">
      <div className="select-header">
        <div className="players-display">
          <div className="player-badge me">
            <span className="badge-avatar">{playerName?.[0]}</span>
            <span className="badge-name">{playerName}</span>
            <span className="badge-score">{scores.me} pts</span>
          </div>
          <div className="connection-indicator">
            <span className="pulse-dot"></span>
            <span className="connection-text">Connected</span>
          </div>
          <div className="player-badge friend">
            <span className="badge-avatar">{friendName?.[0] || '?'}</span>
            <span className="badge-name">{friendName || 'Friend'}</span>
            <span className="badge-score">{scores.friend} pts</span>
          </div>
        </div>
        
        <button className="disconnect-btn" onClick={disconnect}>
          Leave Portal
        </button>
      </div>

      <div className="select-content">
        <h2 className="select-title">Choose Your Adventure</h2>
        <p className="select-subtitle">Pick a game from the Upside Down collection</p>

        <div className="games-grid">
          {games.map((game, index) => (
            <div 
              key={game.id}
              className="game-card"
              style={{ 
                '--card-color': game.color,
                '--card-delay': `${index * 0.1}s`
              }}
              onClick={() => startGame(game.id)}
            >
              <div className="card-glow"></div>
              <div className="card-content">
                <div className="card-icon">{game.icon}</div>
                <h3 className="card-title">{game.name}</h3>
                <p className="card-description">{game.description}</p>
                <div className="card-meta">
                  <span className="meta-tag difficulty">{game.difficulty}</span>
                  <span className="meta-tag players">{game.players}</span>
                </div>
                <div className="card-theme">{game.theme}</div>
              </div>
              <div className="card-hover-effect"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="demogorgon-silhouette"></div>
    </div>
  )
}

export default GameSelectScreen
