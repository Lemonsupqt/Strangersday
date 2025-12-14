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
        return 'Opening portal to the Upside Down...'
      case 'connected':
        return 'Portal established! 🌀'
      case 'error':
        return error || 'Something went wrong in the void...'
      default:
        return 'Waiting for a friend from the other side...'
    }
  }

  return (
    <div className="lobby-screen">
      <div className="lobby-container">
        <div className="player-card">
          <div className="player-avatar">
            <div className="avatar-glow"></div>
            <span className="avatar-initial">{playerName?.[0]?.toUpperCase()}</span>
          </div>
          <h3 className="player-name">{playerName}</h3>
          <div className={`status-badge ${connectionStatus}`}>
            <span className="status-dot"></span>
            <span className="status-text">{getStatusMessage()}</span>
          </div>
        </div>

        <div className="connection-panel">
          <div className="room-code-section">
            <h4 className="section-title">
              <span className="title-icon">📡</span>
              Your Portal Code
            </h4>
            <div className="code-display" onClick={copyCode}>
              <span className="code-text">{peerId || '...'}</span>
              <button className={`copy-btn ${copied ? 'copied' : ''}`}>
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>
            <p className="code-hint">Share this code with your BFF!</p>
          </div>

          <div className="divider">
            <span className="divider-text">OR</span>
          </div>

          <div className="join-section">
            <h4 className="section-title">
              <span className="title-icon">🔮</span>
              Join Friend's Portal
            </h4>
            
            {!showJoin ? (
              <button 
                className="show-join-btn"
                onClick={() => setShowJoin(true)}
              >
                Enter Friend's Code
              </button>
            ) : (
              <form onSubmit={handleConnect} className="join-form">
                <input
                  type="text"
                  value={friendCode}
                  onChange={(e) => setFriendCode(e.target.value.toUpperCase())}
                  placeholder="FRIEND-CODE"
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
                    'Connect'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Connection animation */}
        <div className="portal-animation">
          <div className="portal-ring ring-1"></div>
          <div className="portal-ring ring-2"></div>
          <div className="portal-ring ring-3"></div>
          {connectionStatus === 'connecting' && (
            <div className="portal-energy"></div>
          )}
        </div>

        {/* Tips */}
        <div className="lobby-tips">
          <h5>💡 How to connect:</h5>
          <ol>
            <li>Share your Portal Code with your friend</li>
            <li>OR enter their code to join their portal</li>
            <li>Once connected, choose a game to play!</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default LobbyScreen
