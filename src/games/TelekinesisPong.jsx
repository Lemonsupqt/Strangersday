import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useGame } from '../context/GameContext'

const GAME_WIDTH = 600
const GAME_HEIGHT = 400
const PADDLE_HEIGHT = 80
const PADDLE_WIDTH = 12
const BALL_SIZE = 12
const PADDLE_SPEED = 8
const INITIAL_BALL_SPEED = 5

const TelekinesisPong = () => {
  const { sendMessage, addMessageHandler, endGame, playerName, friendName, updateScore } = useGame()
  
  const canvasRef = useRef(null)
  const gameLoopRef = useRef(null)
  const keysRef = useRef({ up: false, down: false })
  
  const [phase, setPhase] = useState('start')
  const [score, setScore] = useState({ me: 0, friend: 0 })
  const [winScore] = useState(5)
  const [powerUp, setPowerUp] = useState(null)
  const [message, setMessage] = useState('')

  // Game state refs for animation loop
  const gameStateRef = useRef({
    myPaddle: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    friendPaddle: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    ball: { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2, vx: INITIAL_BALL_SPEED, vy: INITIAL_BALL_SPEED * (Math.random() - 0.5) },
    isHost: true
  })

  // Message handler
  useEffect(() => {
    const unsubscribe = addMessageHandler((message) => {
      if (message.type === 'PONG_GAME') {
        const { action, payload } = message.payload
        
        switch (action) {
          case 'PADDLE_MOVE':
            gameStateRef.current.friendPaddle = payload.y
            break
          case 'BALL_SYNC':
            if (!gameStateRef.current.isHost) {
              gameStateRef.current.ball = payload.ball
            }
            break
          case 'SCORE':
            setScore(prev => ({ ...prev, friend: prev.friend + 1 }))
            resetBall()
            break
          case 'GAME_START':
            gameStateRef.current.isHost = false
            setPhase('playing')
            break
          case 'POWER_UP':
            handlePowerUp(payload.type)
            break
        }
      }
    })
    return unsubscribe
  }, [addMessageHandler])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w') keysRef.current.up = true
      if (e.key === 'ArrowDown' || e.key === 's') keysRef.current.down = true
    }
    
    const handleKeyUp = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w') keysRef.current.up = false
      if (e.key === 'ArrowDown' || e.key === 's') keysRef.current.down = false
    }
    
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Touch controls
  const handleTouchMove = useCallback((e) => {
    e.preventDefault()
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const touch = e.touches[0]
    const y = touch.clientY - rect.top - PADDLE_HEIGHT / 2
    const clampedY = Math.max(0, Math.min(GAME_HEIGHT - PADDLE_HEIGHT, y))
    
    gameStateRef.current.myPaddle = clampedY
    sendMessage({
      type: 'PONG_GAME',
      payload: { action: 'PADDLE_MOVE', payload: { y: clampedY } }
    })
  }, [sendMessage])

  const resetBall = () => {
    const direction = Math.random() > 0.5 ? 1 : -1
    gameStateRef.current.ball = {
      x: GAME_WIDTH / 2,
      y: GAME_HEIGHT / 2,
      vx: INITIAL_BALL_SPEED * direction,
      vy: INITIAL_BALL_SPEED * (Math.random() - 0.5)
    }
  }

  const handlePowerUp = (type) => {
    setPowerUp(type)
    setMessage(`⚡ ${type.toUpperCase()} ACTIVATED! ⚡`)
    
    setTimeout(() => {
      setPowerUp(null)
      setMessage('')
    }, 5000)
  }

  // Game loop
  useEffect(() => {
    if (phase !== 'playing') return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    const gameLoop = () => {
      const state = gameStateRef.current
      
      // Move paddle based on keyboard
      if (keysRef.current.up) {
        state.myPaddle = Math.max(0, state.myPaddle - PADDLE_SPEED)
        sendMessage({
          type: 'PONG_GAME',
          payload: { action: 'PADDLE_MOVE', payload: { y: state.myPaddle } }
        })
      }
      if (keysRef.current.down) {
        state.myPaddle = Math.min(GAME_HEIGHT - PADDLE_HEIGHT, state.myPaddle + PADDLE_SPEED)
        sendMessage({
          type: 'PONG_GAME',
          payload: { action: 'PADDLE_MOVE', payload: { y: state.myPaddle } }
        })
      }
      
      // Only host updates ball physics
      if (state.isHost) {
        // Move ball
        state.ball.x += state.ball.vx
        state.ball.y += state.ball.vy
        
        // Top/bottom collision
        if (state.ball.y <= 0 || state.ball.y >= GAME_HEIGHT - BALL_SIZE) {
          state.ball.vy *= -1
        }
        
        // Left paddle collision (my paddle)
        if (state.ball.x <= PADDLE_WIDTH + 20 && 
            state.ball.y >= state.myPaddle && 
            state.ball.y <= state.myPaddle + PADDLE_HEIGHT) {
          state.ball.vx = Math.abs(state.ball.vx) * 1.05
          state.ball.vy += (state.ball.y - (state.myPaddle + PADDLE_HEIGHT / 2)) * 0.1
        }
        
        // Right paddle collision (friend's paddle)
        if (state.ball.x >= GAME_WIDTH - PADDLE_WIDTH - 20 - BALL_SIZE && 
            state.ball.y >= state.friendPaddle && 
            state.ball.y <= state.friendPaddle + PADDLE_HEIGHT) {
          state.ball.vx = -Math.abs(state.ball.vx) * 1.05
          state.ball.vy += (state.ball.y - (state.friendPaddle + PADDLE_HEIGHT / 2)) * 0.1
        }
        
        // Score
        if (state.ball.x <= 0) {
          // Friend scores
          setScore(prev => {
            const newScore = { ...prev, friend: prev.friend + 1 }
            if (newScore.friend >= winScore) {
              setPhase('gameover')
            }
            return newScore
          })
          sendMessage({
            type: 'PONG_GAME',
            payload: { action: 'SCORE', payload: {} }
          })
          resetBall()
        }
        
        if (state.ball.x >= GAME_WIDTH) {
          // I score
          setScore(prev => {
            const newScore = { ...prev, me: prev.me + 1 }
            updateScore(1)
            if (newScore.me >= winScore) {
              setPhase('gameover')
            }
            return newScore
          })
          resetBall()
        }
        
        // Sync ball position
        sendMessage({
          type: 'PONG_GAME',
          payload: { action: 'BALL_SYNC', payload: { ball: state.ball } }
        })
      }
      
      // Draw
      // Background
      ctx.fillStyle = '#0a0a0f'
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
      
      // Center line
      ctx.strokeStyle = '#7b2cbf'
      ctx.setLineDash([10, 10])
      ctx.beginPath()
      ctx.moveTo(GAME_WIDTH / 2, 0)
      ctx.lineTo(GAME_WIDTH / 2, GAME_HEIGHT)
      ctx.stroke()
      ctx.setLineDash([])
      
      // My paddle (left)
      const gradient1 = ctx.createLinearGradient(10, state.myPaddle, 10 + PADDLE_WIDTH, state.myPaddle + PADDLE_HEIGHT)
      gradient1.addColorStop(0, '#ff0844')
      gradient1.addColorStop(1, '#ff6b9d')
      ctx.fillStyle = gradient1
      ctx.shadowColor = '#ff0844'
      ctx.shadowBlur = 15
      ctx.fillRect(10, state.myPaddle, PADDLE_WIDTH, PADDLE_HEIGHT)
      
      // Friend's paddle (right)
      const gradient2 = ctx.createLinearGradient(GAME_WIDTH - 10 - PADDLE_WIDTH, state.friendPaddle, GAME_WIDTH - 10, state.friendPaddle + PADDLE_HEIGHT)
      gradient2.addColorStop(0, '#00d4ff')
      gradient2.addColorStop(1, '#20e3b2')
      ctx.fillStyle = gradient2
      ctx.shadowColor = '#00d4ff'
      ctx.shadowBlur = 15
      ctx.fillRect(GAME_WIDTH - 10 - PADDLE_WIDTH, state.friendPaddle, PADDLE_WIDTH, PADDLE_HEIGHT)
      
      // Ball
      ctx.shadowColor = '#d4af37'
      ctx.shadowBlur = 20
      ctx.fillStyle = '#d4af37'
      ctx.beginPath()
      ctx.arc(state.ball.x, state.ball.y, BALL_SIZE / 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0
      
      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }
    
    gameLoop()
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [phase, sendMessage, updateScore, winScore])

  const startGame = () => {
    gameStateRef.current.isHost = true
    resetBall()
    setPhase('playing')
    setScore({ me: 0, friend: 0 })
    
    sendMessage({
      type: 'PONG_GAME',
      payload: { action: 'GAME_START', payload: {} }
    })
  }

  return (
    <div className="game-container telekinesis-pong">
      <div className="game-header">
        <button className="back-btn" onClick={endGame}>← Back</button>
        <div className="game-info">
          <span className="game-title">🏓 Telekinesis Pong</span>
        </div>
        <div className="pong-score">
          <span className="my-score">{score.me}</span>
          <span className="score-divider">-</span>
          <span className="friend-score">{score.friend}</span>
        </div>
      </div>

      <div className="game-content">
        {phase === 'start' && (
          <div className="phase-start">
            <div className="pong-icon">
              <span className="pong-emoji">🏓</span>
            </div>
            <h2>Telekinesis Pong</h2>
            <p className="game-explanation">
              The classic game with a psychic twist! Use your mind (and keyboard)
              to control your paddle and defeat your friend!
            </p>
            <div className="rules-box">
              <h4>Controls:</h4>
              <ul>
                <li>⬆️ Arrow Up / W - Move paddle up</li>
                <li>⬇️ Arrow Down / S - Move paddle down</li>
                <li>📱 Touch - Drag to move (mobile)</li>
                <li>🏆 First to {winScore} wins!</li>
              </ul>
            </div>
            <button className="start-btn" onClick={startGame}>
              Start Game
            </button>
          </div>
        )}

        {phase === 'playing' && (
          <div className="play-phase">
            <div className="player-names">
              <span className="name-left">{playerName}</span>
              <span className="name-right">{friendName || 'Friend'}</span>
            </div>
            
            {message && (
              <div className="power-message">{message}</div>
            )}
            
            <div className="canvas-wrapper">
              <canvas
                ref={canvasRef}
                width={GAME_WIDTH}
                height={GAME_HEIGHT}
                className="pong-canvas"
                onTouchMove={handleTouchMove}
                onTouchStart={handleTouchMove}
              />
            </div>
            
            <div className="mobile-controls">
              <button 
                className="control-btn up"
                onTouchStart={() => keysRef.current.up = true}
                onTouchEnd={() => keysRef.current.up = false}
                onMouseDown={() => keysRef.current.up = true}
                onMouseUp={() => keysRef.current.up = false}
              >
                ⬆️
              </button>
              <button 
                className="control-btn down"
                onTouchStart={() => keysRef.current.down = true}
                onTouchEnd={() => keysRef.current.down = false}
                onMouseDown={() => keysRef.current.down = true}
                onMouseUp={() => keysRef.current.down = false}
              >
                ⬇️
              </button>
            </div>
          </div>
        )}

        {phase === 'gameover' && (
          <div className="phase-gameover">
            <div className={`winner-display ${score.me > score.friend ? 'you-win' : 'friend-wins'}`}>
              {score.me > score.friend ? (
                <>
                  <div className="winner-icon">🏆</div>
                  <h2>You Win!</h2>
                  <p>Your telekinetic powers are unmatched!</p>
                </>
              ) : (
                <>
                  <div className="winner-icon">💫</div>
                  <h2>{friendName || 'Friend'} Wins!</h2>
                  <p>They've mastered the art of mind-pong!</p>
                </>
              )}
            </div>

            <div className="final-score-display">
              <span className="final-my-score">{score.me}</span>
              <span className="final-divider">-</span>
              <span className="final-friend-score">{score.friend}</span>
            </div>

            <div className="gameover-actions">
              <button className="play-again-btn" onClick={startGame}>
                Rematch!
              </button>
              <button className="back-btn" onClick={endGame}>
                Choose Another Game
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TelekinesisPong
