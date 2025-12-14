import React, { useState, useEffect } from 'react'
import { useGame } from '../context/GameContext'

const LobbyScreen = () => {
  const { 
    peerId, 
    connectToPeer, 
    connectionStatus, 
    isConnected,
    playerName,
    error 
  } = useGame()
  
  const [friendCode, setFriendCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [showJoin, setShowJoin] = useState(false)

  const copyCode = () => {
    navigator.clipboard.writeText(peerId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleConnect = (e) => {
    e.preventDefault()
    if (friendCode.trim() && friendCode !== peerId) {
      connectToPeer(friendCode.trim().toUpperCase())
    }
  }

  const getStatusMessage = () => {
    switch (connectionStatus) {
      case 'connecting':
        return 'The spirits are searching...'
      case 'connected':
        return 'Soul Link Established! 🌙'
      case 'error':
        return error || 'The void rejected the connection...'
      default:
        return 'Awaiting your kindred spirit...'
    }
  }

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connecting': return '🔮'
      case 'connected': return '✨'
      case 'error': return '💀'
      default: return '👻'
    }
  }

  return (
    <div className="lobby-screen">
      <div className="lobby-container">
        {/* Player Card with Gothic Theme */}
        <div className="player-card">
          <div className="player-avatar">
            <div className="avatar-glow"></div>
            <span className="avatar-initial">{playerName?.[0]?.toUpperCase()}</span>
          </div>
          <h3 className="player-name">{playerName}</h3>
          <div className="player-title">Seeker of the Void</div>
          <div className={`status-badge ${connectionStatus}`}>
            <span className="status-icon">{getStatusIcon()}</span>
            <span className="status-dot"></span>
            <span className="status-text">{getStatusMessage()}</span>
          </div>
        </div>

        <div className="connection-panel">
          {/* Your Code Section */}
          <div className="room-code-section">
            <h4 className="section-title">
              <span className="title-icon">🦇</span>
              Your Soul Beacon
            </h4>
            <div className="code-display" onClick={copyCode}>
              <span className="code-text">{peerId || '...'}</span>
              <button className={`copy-btn ${copied ? 'copied' : ''}`}>
                {copied ? '✓ Summoned!' : '📜 Copy'}
              </button>
            </div>
            <p className="code-hint">Send this arcane code to your BFF from the other realm!</p>
          </div>

          <div className="divider">
            <span className="divider-icon">⚰️</span>
            <span className="divider-text">OR</span>
            <span className="divider-icon">⚰️</span>
          </div>

          {/* Join Section */}
          <div className="join-section">
            <h4 className="section-title">
              <span className="title-icon">🔮</span>
              Join Their Séance
            </h4>
            
            {!showJoin ? (
              <button 
                className="show-join-btn"
                onClick={() => setShowJoin(true)}
              >
                <span>🖤</span> Enter Friend's Code <span>🖤</span>
              </button>
            ) : (
              <form onSubmit={handleConnect} className="join-form">
                <input
                  type="text"
                  value={friendCode}
                  onChange={(e) => setFriendCode(e.target.value.toUpperCase())}
                  placeholder="SOUL-CODE..."
                  className="friend-code-input"
                  autoFocus
                />
                <button 
                  type="submit" 
                  className="connect-btn"
                  disabled={!friendCode.trim() || connectionStatus === 'connecting'}
                >
                  {connectionStatus === 'connecting' ? (
                    <span className="loading-spinner"></span>
                  ) : (
                    '🌙 Summon'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Mystical Portal Animation */}
        <div className="portal-animation">
          <div className="portal-ring ring-1"></div>
          <div className="portal-ring ring-2"></div>
          <div className="portal-ring ring-3"></div>
          {connectionStatus === 'connecting' && (
            <div className="portal-energy"></div>
          )}
          <span className="portal-center-icon">
            {connectionStatus === 'connecting' ? '🌀' : '🕯️'}
          </span>
        </div>

        {/* Gothic Tips */}
        <div className="lobby-tips">
          <h5>📜 The Ritual of Connection:</h5>
          <ol>
            <li>🦇 Share your Soul Beacon with your friend</li>
            <li>🔮 OR enter their code to join their realm</li>
            <li>⚡ Once linked, choose your game of darkness!</li>
          </ol>
          <div className="tips-quote">
            <em>"I'm not perky... I'm just mildly enthusiastic about chaos."</em>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LobbyScreen
