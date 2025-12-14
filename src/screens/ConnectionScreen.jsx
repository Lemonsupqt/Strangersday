import React, { useState } from 'react'
import { useGame } from '../context/GameContext'

const ConnectionScreen = ({ onComplete }) => {
  const { setPlayerName } = useGame()
  const [name, setName] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) {
      setIsAnimating(true)
      setTimeout(() => {
        setPlayerName(name.trim())
        onComplete()
      }, 800)
    }
  }

  return (
    <div className={`connection-screen ${isAnimating ? 'portal-out' : ''}`}>
      <div className="portal-frame">
        <div className="portal-inner">
          <div className="portal-glow"></div>
          
          <div className="connection-content">
            {/* Combined icon - Eleven's number + Wednesday's aesthetic */}
            <div className="eleven-icon">
              <div className="icon-wrapper">
                <span className="icon-bat left">🦇</span>
                <svg viewBox="0 0 100 100" className="eleven-svg">
                  <text x="50" y="70" textAnchor="middle" className="eleven-text">011</text>
                </svg>
                <span className="icon-bat right">🦇</span>
              </div>
            </div>
            
            <h2 className="connection-title">Enter the Void</h2>
            <p className="connection-subtitle">
              <span className="subtitle-deco">☠️</span>
              What shall we call you, mortal?
              <span className="subtitle-deco">☠️</span>
            </p>
            
            <form onSubmit={handleSubmit} className="name-form">
              <div className="input-wrapper">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name..."
                  className="name-input"
                  maxLength={20}
                  autoFocus
                />
                <div className="input-glow"></div>
              </div>
              
              <button 
                type="submit" 
                className={`enter-btn ${name.trim() ? 'active' : ''}`}
                disabled={!name.trim()}
              >
                <span className="btn-text">Open the Portal</span>
                <span className="btn-icon">🌙</span>
              </button>
            </form>

            {/* Gothic lights inspired by both shows */}
            <div className="gothic-lights">
              <div className="light-row christmas-lights">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={`light light-${i % 4}`}></div>
                ))}
              </div>
              <p className="lights-hint">The lights will guide you...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConnectionScreen
