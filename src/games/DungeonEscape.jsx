import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useGame } from '../context/GameContext'

const MAZE_SIZE = 9
const MONSTERS = ['🦇', '👻', '💀', '🕷️', '🐍']
const ITEMS = ['🗝️', '💎', '🔮', '📜', '⚔️']

// Generate a simple maze
const generateMaze = () => {
  const maze = []
  for (let y = 0; y < MAZE_SIZE; y++) {
    const row = []
    for (let x = 0; x < MAZE_SIZE; x++) {
      // Border walls
      if (x === 0 || y === 0 || x === MAZE_SIZE - 1 || y === MAZE_SIZE - 1) {
        row.push({ type: 'wall', content: null })
      }
      // Random walls (30% chance)
      else if (Math.random() < 0.25 && !(x === 1 && y === 1) && !(x === MAZE_SIZE - 2 && y === MAZE_SIZE - 2)) {
        row.push({ type: 'wall', content: null })
      }
      // Empty space
      else {
        row.push({ type: 'floor', content: null })
      }
    }
    maze.push(row)
  }
  
  // Ensure start and end are clear
  maze[1][1] = { type: 'floor', content: null }
  maze[MAZE_SIZE - 2][MAZE_SIZE - 2] = { type: 'floor', content: 'exit' }
  
  // Add some items
  const itemCount = 3
  let placed = 0
  while (placed < itemCount) {
    const x = Math.floor(Math.random() * (MAZE_SIZE - 2)) + 1
    const y = Math.floor(Math.random() * (MAZE_SIZE - 2)) + 1
    if (maze[y][x].type === 'floor' && !maze[y][x].content && !(x === 1 && y === 1)) {
      maze[y][x].content = ITEMS[Math.floor(Math.random() * ITEMS.length)]
      placed++
    }
  }
  
  // Add monsters
  const monsterCount = 2
  placed = 0
  while (placed < monsterCount) {
    const x = Math.floor(Math.random() * (MAZE_SIZE - 2)) + 1
    const y = Math.floor(Math.random() * (MAZE_SIZE - 2)) + 1
    if (maze[y][x].type === 'floor' && !maze[y][x].content && !(x <= 2 && y <= 2)) {
      maze[y][x].content = MONSTERS[Math.floor(Math.random() * MONSTERS.length)]
      maze[y][x].isMonster = true
      placed++
    }
  }
  
  return maze
}

const DungeonEscape = () => {
  const { sendMessage, addMessageHandler, endGame, playerName, friendName, updateScore } = useGame()
  
  const [phase, setPhase] = useState('start')
  const [maze, setMaze] = useState(null)
  const [myPosition, setMyPosition] = useState({ x: 1, y: 1 })
  const [friendPosition, setFriendPosition] = useState({ x: 1, y: 2 })
  const [health, setHealth] = useState({ me: 3, friend: 3 })
  const [inventory, setInventory] = useState([])
  const [friendInventory, setFriendInventory] = useState([])
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [message, setMessage] = useState('')
  const [escaped, setEscaped] = useState({ me: false, friend: false })
  const [gameWon, setGameWon] = useState(false)
  const [gameLost, setGameLost] = useState(false)
  const [fogOfWar, setFogOfWar] = useState(true)

  // Message handler
  useEffect(() => {
    const unsubscribe = addMessageHandler((message) => {
      if (message.type === 'DUNGEON') {
        const { action, payload } = message.payload
        
        switch (action) {
          case 'MOVE':
            setFriendPosition(payload.position)
            break
          case 'ITEM_COLLECTED':
            setFriendInventory(prev => [...prev, payload.item])
            break
          case 'DAMAGE':
            setHealth(prev => ({ ...prev, friend: prev.friend - 1 }))
            break
          case 'ESCAPED':
            setEscaped(prev => ({ ...prev, friend: true }))
            break
          case 'GAME_SYNC':
            setMaze(payload.maze)
            setMyPosition({ x: 1, y: 1 })
            setFriendPosition({ x: 1, y: 2 })
            setHealth({ me: 3, friend: 3 })
            setInventory([])
            setFriendInventory([])
            setEscaped({ me: false, friend: false })
            setPhase('playing')
            break
        }
      }
    })
    return unsubscribe
  }, [addMessageHandler])

  // Check win/lose conditions
  useEffect(() => {
    if (phase !== 'playing') return
    
    // Both escaped
    if (escaped.me && escaped.friend) {
      const finalScore = score + (health.me + health.friend) * 50 + inventory.length * 25
      setScore(finalScore)
      updateScore(finalScore)
      setGameWon(true)
      setPhase('result')
    }
    
    // Someone died
    if (health.me <= 0 || health.friend <= 0) {
      setGameLost(true)
      setPhase('result')
    }
  }, [escaped, health, phase, score, inventory, updateScore])

  // Handle keyboard controls
  useEffect(() => {
    if (phase !== 'playing' || escaped.me) return
    
    const handleKeyDown = (e) => {
      let newX = myPosition.x
      let newY = myPosition.y
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          newY = myPosition.y - 1
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          newY = myPosition.y + 1
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          newX = myPosition.x - 1
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          newX = myPosition.x + 1
          break
        default:
          return
      }
      
      movePlayer(newX, newY)
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [phase, myPosition, maze, escaped.me])

  const movePlayer = (newX, newY) => {
    if (!maze) return
    if (newX < 0 || newX >= MAZE_SIZE || newY < 0 || newY >= MAZE_SIZE) return
    
    const cell = maze[newY][newX]
    if (cell.type === 'wall') {
      showMessage('🧱 Blocked by wall!')
      return
    }
    
    // Check for collision with friend
    if (newX === friendPosition.x && newY === friendPosition.y) {
      showMessage('🤝 Your friend is there!')
      return
    }
    
    setMyPosition({ x: newX, y: newY })
    
    sendMessage({
      type: 'DUNGEON',
      payload: { action: 'MOVE', payload: { position: { x: newX, y: newY } } }
    })
    
    // Check cell content
    if (cell.content) {
      if (cell.isMonster) {
        setHealth(prev => ({ ...prev, me: prev.me - 1 }))
        showMessage(`💥 ${cell.content} attacked you! -1 HP`)
        sendMessage({
          type: 'DUNGEON',
          payload: { action: 'DAMAGE', payload: {} }
        })
        // Remove monster
        const newMaze = [...maze]
        newMaze[newY][newX] = { type: 'floor', content: null }
        setMaze(newMaze)
      } else if (cell.content === 'exit') {
        setEscaped(prev => ({ ...prev, me: true }))
        showMessage('🚪 You found the exit!')
        sendMessage({
          type: 'DUNGEON',
          payload: { action: 'ESCAPED', payload: {} }
        })
      } else if (ITEMS.includes(cell.content)) {
        setInventory(prev => [...prev, cell.content])
        setScore(prev => prev + 10)
        showMessage(`✨ Found ${cell.content}!`)
        sendMessage({
          type: 'DUNGEON',
          payload: { action: 'ITEM_COLLECTED', payload: { item: cell.content } }
        })
        // Remove item
        const newMaze = [...maze]
        newMaze[newY][newX] = { type: 'floor', content: null }
        setMaze(newMaze)
      }
    }
  }

  const handleDirectionClick = (direction) => {
    let newX = myPosition.x
    let newY = myPosition.y
    
    switch (direction) {
      case 'up': newY--; break
      case 'down': newY++; break
      case 'left': newX--; break
      case 'right': newX++; break
    }
    
    movePlayer(newX, newY)
  }

  const showMessage = (msg) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 2000)
  }

  const startGame = () => {
    const newMaze = generateMaze()
    setMaze(newMaze)
    setMyPosition({ x: 1, y: 1 })
    setFriendPosition({ x: 1, y: 2 })
    setHealth({ me: 3, friend: 3 })
    setInventory([])
    setFriendInventory([])
    setEscaped({ me: false, friend: false })
    setGameWon(false)
    setGameLost(false)
    setScore(0)
    setPhase('playing')
    
    sendMessage({
      type: 'DUNGEON',
      payload: { action: 'GAME_SYNC', payload: { maze: newMaze } }
    })
  }

  // Calculate visible cells (fog of war)
  const isVisible = (x, y) => {
    if (!fogOfWar) return true
    const myDist = Math.abs(x - myPosition.x) + Math.abs(y - myPosition.y)
    const friendDist = Math.abs(x - friendPosition.x) + Math.abs(y - friendPosition.y)
    return myDist <= 2 || friendDist <= 2
  }

  const renderMaze = () => {
    if (!maze) return null
    
    return (
      <div className="dungeon-grid">
        {maze.map((row, y) => (
          <div key={y} className="dungeon-row">
            {row.map((cell, x) => {
              const isMyPos = x === myPosition.x && y === myPosition.y
              const isFriendPos = x === friendPosition.x && y === friendPosition.y
              const visible = isVisible(x, y)
              
              return (
                <div 
                  key={x}
                  className={`dungeon-cell ${cell.type} ${visible ? 'visible' : 'fog'} ${
                    isMyPos ? 'my-position' : ''
                  } ${isFriendPos ? 'friend-position' : ''}`}
                >
                  {visible && (
                    <>
                      {isMyPos && <span className="player-icon me">🧙</span>}
                      {isFriendPos && !escaped.friend && <span className="player-icon friend">🧝</span>}
                      {!isMyPos && !isFriendPos && cell.content && (
                        <span className="cell-content">{cell.content === 'exit' ? '🚪' : cell.content}</span>
                      )}
                      {cell.type === 'wall' && <span className="wall-icon">🧱</span>}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="game-container dungeon-escape">
      <div className="game-header">
        <button className="back-btn" onClick={endGame}>← Back</button>
        <div className="game-info">
          <span className="game-title">🏰 Dungeon Escape</span>
          <span className="score-info">Score: {score}</span>
        </div>
        <div className="health-display">
          <span className="my-health">🧙 {'❤️'.repeat(Math.max(0, health.me))}</span>
          <span className="friend-health">🧝 {'❤️'.repeat(Math.max(0, health.friend))}</span>
        </div>
      </div>

      <div className="game-content dungeon-content">
        {phase === 'start' && (
          <div className="phase-start">
            <div className="dungeon-icon">
              <span className="castle-emoji">🏰</span>
              <div className="dungeon-glow"></div>
            </div>
            <h2>Dungeon Escape</h2>
            <p className="game-explanation">
              You and your friend are trapped in a dungeon! Work together to find 
              the exit while collecting treasures and avoiding monsters!
            </p>
            <div className="rules-box gothic-rules">
              <h4>⚔️ Survive Together:</h4>
              <ul>
                <li>🎮 Move with WASD or Arrow keys</li>
                <li>🚪 Both players must reach the exit</li>
                <li>👻 Monsters deal 1 damage</li>
                <li>💎 Collect items for bonus points</li>
                <li>👁️ You can only see nearby areas</li>
              </ul>
            </div>
            <button className="start-btn gothic-btn" onClick={startGame}>
              <span>Enter the Dungeon</span>
            </button>
          </div>
        )}

        {phase === 'playing' && (
          <div className="playing-phase">
            {message && (
              <div className="game-message">{message}</div>
            )}
            
            <div className="escape-status">
              <span className={`status-badge ${escaped.me ? 'escaped' : ''}`}>
                🧙 {escaped.me ? 'Escaped!' : 'In Dungeon'}
              </span>
              <span className={`status-badge ${escaped.friend ? 'escaped' : ''}`}>
                🧝 {escaped.friend ? 'Escaped!' : 'In Dungeon'}
              </span>
            </div>
            
            {renderMaze()}
            
            <div className="mobile-controls dungeon-controls">
              <button className="dir-btn up" onClick={() => handleDirectionClick('up')}>⬆️</button>
              <div className="horizontal-btns">
                <button className="dir-btn left" onClick={() => handleDirectionClick('left')}>⬅️</button>
                <button className="dir-btn right" onClick={() => handleDirectionClick('right')}>➡️</button>
              </div>
              <button className="dir-btn down" onClick={() => handleDirectionClick('down')}>⬇️</button>
            </div>
            
            <div className="inventory-display">
              <span className="inv-label">Loot: </span>
              <span className="inv-items">{inventory.join(' ') || 'Empty'}</span>
            </div>
          </div>
        )}

        {phase === 'result' && (
          <div className="result-phase">
            {gameWon ? (
              <div className="dungeon-result victory">
                <div className="result-icon">🏆</div>
                <h2>You Escaped!</h2>
                <p>Both adventurers made it out alive!</p>
              </div>
            ) : (
              <div className="dungeon-result defeat">
                <div className="result-icon">💀</div>
                <h2>Game Over</h2>
                <p>The dungeon claims another victim...</p>
              </div>
            )}
            
            <div className="final-score dungeon-score">
              <span className="score-label">Final Score</span>
              <span className="score-value">{score}</span>
            </div>
            
            <div className="loot-summary">
              <h4>Treasures Found:</h4>
              <div className="loot-items">
                {[...inventory, ...friendInventory].map((item, i) => (
                  <span key={i} className="loot-item">{item}</span>
                ))}
                {inventory.length === 0 && friendInventory.length === 0 && (
                  <span className="no-loot">No treasures collected</span>
                )}
              </div>
            </div>

            <div className="gameover-actions">
              <button className="play-again-btn gothic-btn" onClick={startGame}>
                Try Again
              </button>
              <button className="back-btn" onClick={endGame}>
                Leave Dungeon
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DungeonEscape
