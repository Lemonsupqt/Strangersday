import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useGame } from '../context/GameContext'

// Gothic phrases from both universes
const PHRASES = [
  { text: "I would rather fail at originality than succeed at imitation", category: "Wednesday Wisdom", difficulty: 1 },
  { text: "Friends dont lie", category: "Hawkins Rules", difficulty: 1 },
  { text: "I am not perky but I am willing to be perceived as a dark cloud", category: "Wednesday Wisdom", difficulty: 2 },
  { text: "Mornings are for coffee and contemplation", category: "Hawkins Vibes", difficulty: 1 },
  { text: "The only person who gets to torture my brother is me", category: "Wednesday Wisdom", difficulty: 2 },
  { text: "She is our friend and she is crazy", category: "Hawkins Rules", difficulty: 1 },
  { text: "I act as if I dont care if people dislike me but deep down I secretly enjoy it", category: "Wednesday Wisdom", difficulty: 3 },
  { text: "I am on a curiosity voyage and I need my paddles", category: "Hawkins Vibes", difficulty: 2 },
  { text: "Rumors of my death have been greatly understated", category: "Gothic Quotes", difficulty: 2 },
  { text: "Sometimes the bravest thing you can do is keep living", category: "Upside Down Truth", difficulty: 2 },
  { text: "This is music to my ears but sad music like a funeral dirge", category: "Wednesday Wisdom", difficulty: 3 },
  { text: "The Demogorgon is not done with us yet", category: "Upside Down Truth", difficulty: 2 },
  { text: "I find social media to be a soul sucking void of meaningless affirmation", category: "Wednesday Wisdom", difficulty: 3 },
  { text: "Mouth breather", category: "Hawkins Insults", difficulty: 1 },
  { text: "I do have emotions I just choose not to express them", category: "Gothic Quotes", difficulty: 2 },
]

const ShadowTyping = () => {
  const { sendMessage, addMessageHandler, endGame, playerName, friendName, updateScore } = useGame()
  
  const [phase, setPhase] = useState('start') // start, playing, result
  const [currentPhrase, setCurrentPhrase] = useState(null)
  const [myInput, setMyInput] = useState('')
  const [friendInput, setFriendInput] = useState('')
  const [myProgress, setMyProgress] = useState(0)
  const [friendProgress, setFriendProgress] = useState(0)
  const [round, setRound] = useState(1)
  const [maxRounds] = useState(5)
  const [score, setScore] = useState({ me: 0, friend: 0 })
  const [winner, setWinner] = useState(null)
  const [combo, setCombo] = useState(0)
  const [usedPhrases, setUsedPhrases] = useState([])
  const [timeLeft, setTimeLeft] = useState(60)
  const [effects, setEffects] = useState([])
  const inputRef = useRef(null)

  // Get random phrase
  const getRandomPhrase = useCallback(() => {
    const available = PHRASES.filter(p => !usedPhrases.includes(p.text))
    if (available.length === 0) {
      setUsedPhrases([])
      return PHRASES[Math.floor(Math.random() * PHRASES.length)]
    }
    return available[Math.floor(Math.random() * available.length)]
  }, [usedPhrases])

  // Message handler
  useEffect(() => {
    const unsubscribe = addMessageHandler((message) => {
      if (message.type === 'SHADOW_TYPING') {
        const { action, payload } = message.payload
        
        switch (action) {
          case 'TYPING_PROGRESS':
            setFriendInput(payload.input)
            setFriendProgress(payload.progress)
            break
          case 'ROUND_WIN':
            // Friend won this round
            break
          case 'GAME_SYNC':
            setCurrentPhrase(payload.phrase)
            setPhase('playing')
            setMyInput('')
            setFriendInput('')
            setMyProgress(0)
            setFriendProgress(0)
            setTimeLeft(60)
            break
          case 'NEXT_ROUND':
            startNewRound()
            break
        }
      }
    })
    return unsubscribe
  }, [addMessageHandler])

  // Timer
  useEffect(() => {
    if (phase !== 'playing') return
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up - draw
          setWinner('draw')
          setPhase('result')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [phase])

  // Calculate progress
  const calculateProgress = (input, target) => {
    if (!target) return 0
    const targetLower = target.toLowerCase().replace(/[^a-z\s]/g, '')
    const inputLower = input.toLowerCase().replace(/[^a-z\s]/g, '')
    
    let correctChars = 0
    for (let i = 0; i < inputLower.length; i++) {
      if (inputLower[i] === targetLower[i]) {
        correctChars++
      } else {
        break // Stop at first mistake
      }
    }
    return Math.min(100, Math.round((correctChars / targetLower.length) * 100))
  }

  // Handle typing
  const handleInput = (e) => {
    const input = e.target.value
    setMyInput(input)
    
    const progress = calculateProgress(input, currentPhrase?.text)
    setMyProgress(progress)
    
    // Add effect on milestone
    if (progress >= 25 && myProgress < 25) addEffect('⚡')
    if (progress >= 50 && myProgress < 50) addEffect('🌙')
    if (progress >= 75 && myProgress < 75) addEffect('🦇')
    
    sendMessage({
      type: 'SHADOW_TYPING',
      payload: { action: 'TYPING_PROGRESS', payload: { input, progress } }
    })
    
    // Check win condition
    if (progress >= 100) {
      const roundScore = Math.max(10, 50 - Math.floor((60 - timeLeft) / 2)) + (combo * 5)
      setScore(prev => ({ ...prev, me: prev.me + roundScore }))
      setCombo(prev => prev + 1)
      updateScore(roundScore)
      setWinner('me')
      setPhase('result')
      
      sendMessage({
        type: 'SHADOW_TYPING',
        payload: { action: 'ROUND_WIN', payload: { winner: 'friend' } }
      })
    }
  }

  // Check if friend won
  useEffect(() => {
    if (friendProgress >= 100 && phase === 'playing') {
      setWinner('friend')
      setScore(prev => ({ ...prev, friend: prev.friend + 30 }))
      setCombo(0)
      setPhase('result')
    }
  }, [friendProgress, phase])

  const addEffect = (emoji) => {
    const id = Date.now()
    setEffects(prev => [...prev, { id, emoji, x: Math.random() * 80 + 10, y: Math.random() * 30 + 10 }])
    setTimeout(() => {
      setEffects(prev => prev.filter(e => e.id !== id))
    }, 1000)
  }

  const startNewRound = () => {
    if (round >= maxRounds) {
      setPhase('gameover')
      return
    }
    
    const phrase = getRandomPhrase()
    setUsedPhrases(prev => [...prev, phrase.text])
    setCurrentPhrase(phrase)
    setRound(prev => prev + 1)
    setMyInput('')
    setFriendInput('')
    setMyProgress(0)
    setFriendProgress(0)
    setWinner(null)
    setTimeLeft(60)
    setPhase('playing')
    
    sendMessage({
      type: 'SHADOW_TYPING',
      payload: { action: 'GAME_SYNC', payload: { phrase } }
    })
    
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const handleNextRound = () => {
    sendMessage({
      type: 'SHADOW_TYPING',
      payload: { action: 'NEXT_ROUND', payload: {} }
    })
    startNewRound()
  }

  const startGame = () => {
    const phrase = getRandomPhrase()
    setUsedPhrases([phrase.text])
    setCurrentPhrase(phrase)
    setPhase('playing')
    
    sendMessage({
      type: 'SHADOW_TYPING',
      payload: { action: 'GAME_SYNC', payload: { phrase } }
    })
    
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  // Render typed text with highlighting
  const renderPhrase = () => {
    if (!currentPhrase) return null
    const target = currentPhrase.text.toLowerCase().replace(/[^a-z\s]/g, '')
    const input = myInput.toLowerCase().replace(/[^a-z\s]/g, '')
    
    return currentPhrase.text.split('').map((char, i) => {
      const targetChar = target[i] || ''
      const inputChar = input[i] || ''
      
      let className = 'char-pending'
      if (i < input.length) {
        if (inputChar === targetChar) {
          className = 'char-correct'
        } else {
          className = 'char-wrong'
        }
      } else if (i === input.length) {
        className = 'char-current'
      }
      
      return (
        <span key={i} className={`typing-char ${className}`}>
          {char}
        </span>
      )
    })
  }

  return (
    <div className="game-container shadow-typing">
      <div className="game-header">
        <button className="back-btn" onClick={endGame}>← Back</button>
        <div className="game-info">
          <span className="game-title">👻 Shadow Typing</span>
          {phase === 'playing' && (
            <span className="round-info">Round {round}/{maxRounds}</span>
          )}
        </div>
        <div className="score-display">
          <span className="my-points">{score.me}</span>
          <span className="score-sep">vs</span>
          <span className="friend-points">{score.friend}</span>
        </div>
      </div>

      <div className="game-content shadow-content">
        {/* Floating effects */}
        {effects.map(e => (
          <div
            key={e.id}
            className="typing-effect"
            style={{ left: `${e.x}%`, top: `${e.y}%` }}
          >
            {e.emoji}
          </div>
        ))}

        {phase === 'start' && (
          <div className="phase-start">
            <div className="shadow-icon">
              <span className="ghost-emoji">👻</span>
              <div className="shadow-pulse"></div>
            </div>
            <h2>Shadow Typing</h2>
            <p className="game-explanation">
              Channel your inner gothic spirit! Race your friend to type supernatural 
              quotes from the Upside Down and Nevermore Academy.
            </p>
            <div className="rules-box gothic-rules">
              <h4>📜 The Dark Arts of Typing:</h4>
              <ul>
                <li>🦇 Type the phrase faster than your friend</li>
                <li>⚡ Accuracy matters - mistakes break your streak</li>
                <li>🔥 Build combos for bonus points</li>
                <li>⏱️ 60 seconds per round</li>
              </ul>
            </div>
            <button className="start-btn gothic-btn" onClick={startGame}>
              <span>Summon the Shadows</span>
              <span className="btn-glow"></span>
            </button>
          </div>
        )}

        {phase === 'playing' && currentPhrase && (
          <div className="typing-phase">
            <div className="timer-bar">
              <div 
                className="timer-fill" 
                style={{ width: `${(timeLeft / 60) * 100}%` }}
              />
              <span className="timer-text">{timeLeft}s</span>
            </div>
            
            <div className="phrase-category">
              <span className="category-tag">{currentPhrase.category}</span>
              {combo > 1 && <span className="combo-badge">🔥 {combo}x Combo</span>}
            </div>
            
            <div className="phrase-display">
              <div className="phrase-text">{renderPhrase()}</div>
            </div>
            
            <div className="progress-bars">
              <div className="progress-item me">
                <span className="progress-name">{playerName}</span>
                <div className="progress-track">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${myProgress}%` }}
                  />
                </div>
                <span className="progress-percent">{myProgress}%</span>
              </div>
              <div className="progress-item friend">
                <span className="progress-name">{friendName || 'Friend'}</span>
                <div className="progress-track friend-track">
                  <div 
                    className="progress-fill friend-fill" 
                    style={{ width: `${friendProgress}%` }}
                  />
                </div>
                <span className="progress-percent">{friendProgress}%</span>
              </div>
            </div>
            
            <div className="input-area">
              <input
                ref={inputRef}
                type="text"
                value={myInput}
                onChange={handleInput}
                placeholder="Type here..."
                className="typing-input"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
            </div>
          </div>
        )}

        {phase === 'result' && (
          <div className="result-phase">
            <div className={`result-announcement ${winner}`}>
              {winner === 'me' ? (
                <>
                  <div className="result-icon">🏆</div>
                  <h2>Victory!</h2>
                  <p>Your shadowy fingers were fastest!</p>
                </>
              ) : winner === 'friend' ? (
                <>
                  <div className="result-icon">💀</div>
                  <h2>{friendName || 'Friend'} Won!</h2>
                  <p>The shadows favored them this time...</p>
                </>
              ) : (
                <>
                  <div className="result-icon">⏰</div>
                  <h2>Time's Up!</h2>
                  <p>The spirits grow impatient...</p>
                </>
              )}
            </div>
            
            <div className="round-stats">
              <div className="stat-card">
                <span className="stat-label">Your Progress</span>
                <span className="stat-value">{myProgress}%</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Friend's Progress</span>
                <span className="stat-value">{friendProgress}%</span>
              </div>
            </div>

            <button className="next-btn gothic-btn" onClick={handleNextRound}>
              {round >= maxRounds ? 'See Final Results' : 'Next Round →'}
            </button>
          </div>
        )}

        {phase === 'gameover' && (
          <div className="phase-gameover">
            <div className="final-result">
              {score.me > score.friend ? (
                <>
                  <div className="trophy-icon">🏆</div>
                  <h2>You Are The Shadow Master!</h2>
                </>
              ) : score.friend > score.me ? (
                <>
                  <div className="trophy-icon">🌙</div>
                  <h2>{friendName || 'Friend'} Claims Victory!</h2>
                </>
              ) : (
                <>
                  <div className="trophy-icon">⚖️</div>
                  <h2>A Perfect Balance of Darkness!</h2>
                </>
              )}
            </div>
            
            <div className="final-scores">
              <div className={`final-score ${score.me > score.friend ? 'winner' : ''}`}>
                <span className="final-name">{playerName}</span>
                <span className="final-value">{score.me}</span>
                {score.me > score.friend && <span className="winner-badge">👑</span>}
              </div>
              <div className="vs">VS</div>
              <div className={`final-score ${score.friend > score.me ? 'winner' : ''}`}>
                <span className="final-name">{friendName || 'Friend'}</span>
                <span className="final-value">{score.friend}</span>
                {score.friend > score.me && <span className="winner-badge">👑</span>}
              </div>
            </div>

            <div className="gameover-actions">
              <button className="play-again-btn gothic-btn" onClick={() => {
                setPhase('start')
                setRound(1)
                setScore({ me: 0, friend: 0 })
                setCombo(0)
                setUsedPhrases([])
              }}>
                Summon Again
              </button>
              <button className="back-btn" onClick={endGame}>
                Return to the Void
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ShadowTyping
