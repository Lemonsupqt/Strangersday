import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useGame } from '../context/GameContext'

const WORDS = [
  'demogorgon', 'waffle', 'bicycle', 'christmas lights', 'walkie talkie',
  'sunglasses', 'basketball', 'pizza', 'skateboard', 'headphones',
  'butterfly', 'rainbow', 'castle', 'dragon', 'spaceship',
  'hamburger', 'palm tree', 'snowman', 'guitar', 'telescope',
  'hot dog', 'ice cream', 'rocket', 'umbrella', 'lighthouse',
  'dinosaur', 'mermaid', 'robot', 'superhero', 'volcano'
]

const EFFECTS = [
  { name: 'normal', label: 'Normal', transform: '' },
  { name: 'flip', label: 'Upside Down', transform: 'scaleY(-1)' },
  { name: 'mirror', label: 'Mirror', transform: 'scaleX(-1)' },
  { name: 'rotate', label: 'Rotated', transform: 'rotate(180deg)' },
  { name: 'drunk', label: 'Drunk', transform: 'skewX(15deg)' },
]

const UpsideDownDraw = () => {
  const { sendMessage, addMessageHandler, endGame, playerName, friendName, updateScore } = useGame()
  
  const canvasRef = useRef(null)
  const [phase, setPhase] = useState('start') // start, drawing, guessing, result
  const [isDrawer, setIsDrawer] = useState(true)
  const [word, setWord] = useState('')
  const [guess, setGuess] = useState('')
  const [guesses, setGuesses] = useState([])
  const [effect, setEffect] = useState(EFFECTS[0])
  const [timeLeft, setTimeLeft] = useState(60)
  const [score, setScore] = useState({ me: 0, friend: 0 })
  const [round, setRound] = useState(1)
  const [isDrawing, setIsDrawing] = useState(false)
  const [brushColor, setBrushColor] = useState('#ff0844')
  const [brushSize, setBrushSize] = useState(5)
  const lastPosRef = useRef({ x: 0, y: 0 })

  const colors = ['#ff0844', '#7b2cbf', '#00d4ff', '#20e3b2', '#d4af37', '#ffffff', '#000000']

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#1a1a2e'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
  }, [phase])

  // Message handler
  useEffect(() => {
    const unsubscribe = addMessageHandler((message) => {
      if (message.type === 'DRAW_GAME') {
        const { action, payload } = message.payload
        
        switch (action) {
          case 'DRAW':
            drawRemote(payload)
            break
          case 'CLEAR':
            clearCanvas()
            break
          case 'GUESS':
            handleRemoteGuess(payload.guess)
            break
          case 'CORRECT':
            setPhase('result')
            break
          case 'START_ROUND':
            setIsDrawer(false)
            setEffect(EFFECTS.find(e => e.name === payload.effect) || EFFECTS[0])
            setPhase('guessing')
            setTimeLeft(60)
            break
          case 'NEXT_ROUND':
            startNewRound(true)
            break
        }
      }
    })
    return unsubscribe
  }, [addMessageHandler])

  // Timer
  useEffect(() => {
    if ((phase === 'drawing' || phase === 'guessing') && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && phase !== 'result') {
      setPhase('result')
    }
  }, [phase, timeLeft])

  // Random effect change for drawer
  useEffect(() => {
    if (phase === 'drawing' && isDrawer) {
      const interval = setInterval(() => {
        const newEffect = EFFECTS[Math.floor(Math.random() * EFFECTS.length)]
        setEffect(newEffect)
      }, 10000) // Change every 10 seconds
      return () => clearInterval(interval)
    }
  }, [phase, isDrawer])

  const drawRemote = (data) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    
    ctx.beginPath()
    ctx.strokeStyle = data.color
    ctx.lineWidth = data.size
    ctx.lineCap = 'round'
    ctx.moveTo(data.fromX, data.fromY)
    ctx.lineTo(data.toX, data.toY)
    ctx.stroke()
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    }
  }

  const startDrawing = (e) => {
    if (!isDrawer) return
    setIsDrawing(true)
    const coords = getCanvasCoords(e)
    lastPosRef.current = coords
  }

  const draw = (e) => {
    if (!isDrawing || !isDrawer) return
    e.preventDefault()
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const coords = getCanvasCoords(e)
    
    ctx.beginPath()
    ctx.strokeStyle = brushColor
    ctx.lineWidth = brushSize
    ctx.lineCap = 'round'
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y)
    ctx.lineTo(coords.x, coords.y)
    ctx.stroke()

    // Send to friend
    sendMessage({
      type: 'DRAW_GAME',
      payload: {
        action: 'DRAW',
        payload: {
          fromX: lastPosRef.current.x,
          fromY: lastPosRef.current.y,
          toX: coords.x,
          toY: coords.y,
          color: brushColor,
          size: brushSize
        }
      }
    })

    lastPosRef.current = coords
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const handleClear = () => {
    clearCanvas()
    sendMessage({
      type: 'DRAW_GAME',
      payload: { action: 'CLEAR', payload: {} }
    })
  }

  const handleRemoteGuess = (remoteGuess) => {
    const correct = remoteGuess.toLowerCase().trim() === word.toLowerCase().trim()
    setGuesses(prev => [...prev, { text: remoteGuess, correct, from: 'friend' }])
    
    if (correct) {
      setScore(prev => ({ me: prev.me + 5, friend: prev.friend + 10 }))
      updateScore(5)
      setPhase('result')
    }
  }

  const submitGuess = (e) => {
    e.preventDefault()
    if (!guess.trim()) return

    sendMessage({
      type: 'DRAW_GAME',
      payload: { action: 'GUESS', payload: { guess: guess.trim() } }
    })
    
    setGuesses(prev => [...prev, { text: guess, correct: false, from: 'me' }])
    setGuess('')
  }

  const startGame = () => {
    const selectedWord = WORDS[Math.floor(Math.random() * WORDS.length)]
    const selectedEffect = EFFECTS[Math.floor(Math.random() * EFFECTS.length)]
    
    setWord(selectedWord)
    setEffect(selectedEffect)
    setIsDrawer(true)
    setPhase('drawing')
    setTimeLeft(60)
    setGuesses([])
    
    sendMessage({
      type: 'DRAW_GAME',
      payload: {
        action: 'START_ROUND',
        payload: { effect: selectedEffect.name }
      }
    })
  }

  const startNewRound = (asGuesser = false) => {
    if (asGuesser) {
      setIsDrawer(false)
      setPhase('guessing')
      setTimeLeft(60)
      setGuesses([])
      clearCanvas()
    } else {
      setRound(prev => prev + 1)
      const selectedWord = WORDS[Math.floor(Math.random() * WORDS.length)]
      const selectedEffect = EFFECTS[Math.floor(Math.random() * EFFECTS.length)]
      
      setWord(selectedWord)
      setEffect(selectedEffect)
      setIsDrawer(true)
      setPhase('drawing')
      setTimeLeft(60)
      setGuesses([])
      clearCanvas()
      
      sendMessage({
        type: 'DRAW_GAME',
        payload: {
          action: 'START_ROUND',
          payload: { effect: selectedEffect.name }
        }
      })
    }
  }

  const handleNextRound = () => {
    sendMessage({
      type: 'DRAW_GAME',
      payload: { action: 'NEXT_ROUND', payload: {} }
    })
    startNewRound()
  }

  return (
    <div className="game-container upside-down-draw">
      <div className="game-header">
        <button className="back-btn" onClick={endGame}>← Back</button>
        <div className="game-info">
          <span className="game-title">🎨 Upside Down Draw</span>
          <span className="round-info">Round {round}</span>
        </div>
        <div className="timer-display">
          <span className={`timer ${timeLeft <= 10 ? 'urgent' : ''}`}>{timeLeft}s</span>
        </div>
      </div>

      <div className="game-content">
        {phase === 'start' && (
          <div className="phase-start">
            <div className="draw-preview">
              <span className="preview-icon">🎨</span>
            </div>
            <h2>Upside Down Draw</h2>
            <p className="game-explanation">
              Draw and guess! But watch out - the canvas has supernatural effects!
              The drawing might flip, mirror, or twist as you draw!
            </p>
            <div className="rules-box">
              <h4>How to Play:</h4>
              <ul>
                <li>🖌️ Drawer: Draw the word for your friend to guess</li>
                <li>👁️ Guesser: Type guesses to figure out the word</li>
                <li>🌀 The canvas effect changes randomly!</li>
                <li>⏱️ 60 seconds per round</li>
              </ul>
            </div>
            <button className="start-btn" onClick={startGame}>
              Start Drawing
            </button>
          </div>
        )}

        {(phase === 'drawing' || phase === 'guessing') && (
          <div className="draw-phase">
            <div className="draw-area">
              {isDrawer && (
                <div className="word-to-draw">
                  <span className="word-label">Draw this:</span>
                  <span className="word-value">{word}</span>
                </div>
              )}
              
              <div className="effect-indicator">
                <span className="effect-label">Effect:</span>
                <span className="effect-name">{effect.label}</span>
              </div>

              <div 
                className="canvas-container"
                style={{ transform: effect.transform }}
              >
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={400}
                  className="draw-canvas"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
              </div>

              {isDrawer && (
                <div className="draw-controls">
                  <div className="color-picker">
                    {colors.map(color => (
                      <button
                        key={color}
                        className={`color-btn ${brushColor === color ? 'active' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setBrushColor(color)}
                      />
                    ))}
                  </div>
                  <div className="size-picker">
                    <button 
                      className={`size-btn ${brushSize === 3 ? 'active' : ''}`}
                      onClick={() => setBrushSize(3)}
                    >S</button>
                    <button 
                      className={`size-btn ${brushSize === 5 ? 'active' : ''}`}
                      onClick={() => setBrushSize(5)}
                    >M</button>
                    <button 
                      className={`size-btn ${brushSize === 10 ? 'active' : ''}`}
                      onClick={() => setBrushSize(10)}
                    >L</button>
                  </div>
                  <button className="clear-btn" onClick={handleClear}>
                    🗑️ Clear
                  </button>
                </div>
              )}
            </div>

            {!isDrawer && (
              <div className="guess-area">
                <div className="guesses-list">
                  {guesses.map((g, i) => (
                    <div key={i} className={`guess-item ${g.from}`}>
                      {g.text}
                    </div>
                  ))}
                </div>
                <form onSubmit={submitGuess} className="guess-form">
                  <input
                    type="text"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    placeholder="Type your guess..."
                    className="guess-input"
                    autoFocus
                  />
                  <button type="submit" className="guess-btn">Guess!</button>
                </form>
              </div>
            )}

            {isDrawer && (
              <div className="guesses-display">
                <h4>Friend's Guesses:</h4>
                <div className="guesses-list">
                  {guesses.filter(g => g.from === 'friend').map((g, i) => (
                    <div key={i} className="guess-item friend">
                      {g.text} {g.correct && '✅'}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {phase === 'result' && (
          <div className="phase-result">
            <h2>{timeLeft > 0 ? '🎉 Correct!' : '⏱️ Time\'s Up!'}</h2>
            <div className="result-word">
              <span className="result-label">The word was:</span>
              <span className="result-value">{word}</span>
            </div>
            
            <div className="scores">
              <div className="score-card">
                <span className="score-name">{playerName}</span>
                <span className="score-value">{score.me}</span>
              </div>
              <div className="score-card">
                <span className="score-name">{friendName || 'Friend'}</span>
                <span className="score-value">{score.friend}</span>
              </div>
            </div>

            <div className="result-actions">
              <button className="next-btn" onClick={handleNextRound}>
                Next Round (Your turn to {isDrawer ? 'guess' : 'draw'})
              </button>
              <button className="back-btn" onClick={endGame}>
                Back to Games
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UpsideDownDraw
