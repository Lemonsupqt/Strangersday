import React from 'react'
import { useGame } from '../context/GameContext'

const games = [
  {
    id: 'mind-meld',
    name: 'Mind Meld',
    description: 'Think alike! Both type a word for a category. Can you read each other\'s minds?',
    icon: '🧠',
    color: '#ff6b9d',
    difficulty: 'Medium',
    players: 'Co-op',
    theme: 'Eleven\'s Telepathy',
    category: 'brain'
  },
  {
    id: 'shadow-typing',
    name: 'Shadow Typing',
    description: 'Race to type gothic quotes! Channel your inner Wednesday with supernatural speed.',
    icon: '👻',
    color: '#9333ea',
    difficulty: 'Hard',
    players: 'VS',
    theme: 'Nevermore Speed',
    category: 'speed'
  },
  {
    id: 'seance-circle',
    name: 'Séance Circle',
    description: 'The spirits speak in letters! Work together in this supernatural hangman.',
    icon: '🔮',
    color: '#6366f1',
    difficulty: 'Easy',
    players: 'Co-op',
    theme: 'Ouija Wisdom',
    category: 'brain'
  },
  {
    id: 'thing-hand-slap',
    name: 'Thing\'s Hand Slap',
    description: 'Thing challenges your reflexes! Slap when you see the signal - don\'t be too early!',
    icon: '🖐️',
    color: '#f59e0b',
    difficulty: 'Easy',
    players: 'VS',
    theme: 'Wednesday\'s Helper',
    category: 'speed'
  },
  {
    id: 'upside-down-draw',
    name: 'Upside Down Draw',
    description: 'Draw and guess, but the canvas has a mind of its own! Effects twist your art.',
    icon: '🎨',
    color: '#7b2cbf',
    difficulty: 'Medium',
    players: 'VS',
    theme: 'The Upside Down',
    category: 'creative'
  },
  {
    id: 'void-memory',
    name: 'Void Memory',
    description: 'A twisted memory game. Find matching pairs before the void consumes them!',
    icon: '🌀',
    color: '#00d4ff',
    difficulty: 'Hard',
    players: 'VS',
    theme: 'The Mind Flayer',
    category: 'brain'
  },
  {
    id: 'stranger-sync',
    name: 'Stranger Sync',
    description: 'How well do you know each other? Answer questions and see if you\'re in sync!',
    icon: '💫',
    color: '#20e3b2',
    difficulty: 'Easy',
    players: 'Co-op',
    theme: 'Friendship is Power',
    category: 'brain'
  },
  {
    id: 'telekinesis-pong',
    name: 'Telekinesis Pong',
    description: 'Classic pong with psychic powers! Control your paddle with lightning reflexes.',
    icon: '🏓',
    color: '#ff0844',
    difficulty: 'Medium',
    players: 'VS',
    theme: 'Powers Unleashed',
    category: 'speed'
  },
  {
    id: 'dungeon-escape',
    name: 'Dungeon Escape',
    description: 'Trapped in a dungeon! Navigate the maze together, avoid monsters, find the exit.',
    icon: '🏰',
    color: '#84cc16',
    difficulty: 'Hard',
    players: 'Co-op',
    theme: 'D&D Campaign',
    category: 'adventure'
  }
]

const categoryIcons = {
  brain: '🧠',
  speed: '⚡',
  creative: '🎨',
  adventure: '⚔️'
}

const GameSelectScreen = () => {
  const { startGame, friendName, playerName, scores, disconnect } = useGame()

  return (
    <div className="game-select-screen">
      <div className="select-header">
        <div className="players-display">
          <div className="player-badge me">
            <div className="badge-avatar-wrapper">
              <span className="badge-avatar">{playerName?.[0]}</span>
              <span className="avatar-glow-small"></span>
            </div>
            <div className="badge-info">
              <span className="badge-name">{playerName}</span>
              <span className="badge-score">✨ {scores.me} pts</span>
            </div>
          </div>
          
          <div className="connection-indicator">
            <div className="connection-dots">
              <span className="dot dot-1"></span>
              <span className="dot dot-2"></span>
              <span className="dot dot-3"></span>
            </div>
            <span className="connection-text">Soul Link Active</span>
          </div>
          
          <div className="player-badge friend">
            <div className="badge-avatar-wrapper">
              <span className="badge-avatar">{friendName?.[0] || '?'}</span>
              <span className="avatar-glow-small friend-glow"></span>
            </div>
            <div className="badge-info">
              <span className="badge-name">{friendName || 'Waiting...'}</span>
              <span className="badge-score">✨ {scores.friend} pts</span>
            </div>
          </div>
        </div>
        
        <button className="disconnect-btn" onClick={disconnect}>
          <span className="btn-icon">🚪</span>
          <span>Leave Portal</span>
        </button>
      </div>

      <div className="select-content">
        <div className="select-title-area">
          <h2 className="select-title">
            <span className="title-icon">⚰️</span>
            Choose Your Fate
            <span className="title-icon">⚰️</span>
          </h2>
          <p className="select-subtitle">Games from the Upside Down and Nevermore Academy</p>
        </div>
        
        <div className="category-filters">
          <span className="filter-label">Categories:</span>
          <div className="filter-tags">
            <span className="filter-tag">🧠 Brain Games</span>
            <span className="filter-tag">⚡ Speed Games</span>
            <span className="filter-tag">🎨 Creative</span>
            <span className="filter-tag">⚔️ Adventure</span>
          </div>
        </div>

        <div className="games-grid">
          {games.map((game, index) => (
            <div 
              key={game.id}
              className="game-card"
              style={{ 
                '--card-color': game.color,
                '--card-delay': `${index * 0.08}s`
              }}
              onClick={() => startGame(game.id)}
            >
              <div className="card-glow"></div>
              <div className="card-border-glow"></div>
              <div className="card-content">
                <div className="card-header">
                  <span className="card-category">{categoryIcons[game.category]}</span>
                  <div className="card-icon">{game.icon}</div>
                  <span className="card-mode">{game.players}</span>
                </div>
                <h3 className="card-title">{game.name}</h3>
                <p className="card-description">{game.description}</p>
                <div className="card-footer">
                  <div className="card-meta">
                    <span className={`meta-tag difficulty-${game.difficulty.toLowerCase()}`}>
                      {game.difficulty === 'Easy' ? '🌟' : game.difficulty === 'Medium' ? '🌟🌟' : '🌟🌟🌟'}
                    </span>
                  </div>
                  <div className="card-theme">{game.theme}</div>
                </div>
              </div>
              <div className="card-hover-effect"></div>
              <div className="card-shine"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Wednesday's quote */}
      <div className="wednesday-quote">
        <span className="quote-icon">🖤</span>
        <p>"I act as if I don't care if people dislike me... deep down, I secretly enjoy it."</p>
        <span className="quote-author">- Wednesday Addams</span>
      </div>
    </div>
  )
}

export default GameSelectScreen
