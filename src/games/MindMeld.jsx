import React, { useState, useEffect, useCallback } from 'react'
import { useGame } from '../context/GameContext'

const CATEGORIES = [
  { name: 'Animals', emoji: '🦁', words: ['dog', 'cat', 'lion', 'elephant', 'bird', 'fish', 'snake', 'bear', 'wolf', 'tiger'] },
  { name: 'Food', emoji: '🍕', words: ['pizza', 'burger', 'sushi', 'pasta', 'salad', 'soup', 'bread', 'cheese', 'fruit', 'cake'] },
  { name: 'Colors', emoji: '🌈', words: ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'black', 'white', 'gold'] },
  { name: 'Movies', emoji: '🎬', words: ['action', 'comedy', 'horror', 'romance', 'drama', 'hero', 'villain', 'magic', 'space', 'time'] },
  { name: 'Feelings', emoji: '💭', words: ['happy', 'sad', 'angry', 'excited', 'scared', 'love', 'peace', 'hope', 'joy', 'calm'] },
  { name: 'Nature', emoji: '🌲', words: ['tree', 'ocean', 'mountain', 'river', 'forest', 'desert', 'sky', 'sun', 'moon', 'star'] },
  { name: 'Music', emoji: '🎵', words: ['rock', 'pop', 'jazz', 'beat', 'guitar', 'piano', 'drum', 'bass', 'melody', 'rhythm'] },
  { name: 'Sports', emoji: '⚽', words: ['soccer', 'basketball', 'tennis', 'swimming', 'running', 'golf', 'hockey', 'baseball', 'boxing', 'yoga'] }
]

const MindMeld = () => {
  const { sendMessage, addMessageHandler, endGame, playerName, friendName, updateScore } = useGame()
  
  const [phase, setPhase] = useState('start') // start, category, thinking, reveal, result
  const [round, setRound] = useState(1)
  const [maxRounds] = useState(5)
  const [category, setCategory] = useState(null)
  const [myWord, setMyWord] = useState('')
  const [friendWord, setFriendWord] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [friendSubmitted, setFriendSubmitted] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const [score, setScore] = useState({ me: 0, friend: 0 })
  const [history, setHistory] = useState([])
  const [isHost, setIsHost] = useState(false)

  // Message handler
  useEffect(() => {
    const unsubscribe = addMessageHandler((message) => {
      if (message.type === 'MIND_MELD') {
        const { action, payload } = message.payload
        
        switch (action) {
          case 'CATEGORY_SELECTED':
            setCategory(payload.category)
            setPhase('thinking')
            break
          case 'WORD_SUBMITTED':
            setFriendWord(payload.word)
            setFriendSubmitted(true)
            break
          case 'READY_REVEAL':
            // Friend is ready, start reveal if we're also ready
            break
          case 'NEXT_ROUND':
            startNewRound()
            break
        }
      }
    })
    return unsubscribe
  }, [addMessageHandler])

  // Check if both submitted
  useEffect(() => {
    if (submitted && friendSubmitted) {
      setPhase('reveal')
      setCountdown(3)
    }
  }, [submitted, friendSubmitted])

  // Countdown for reveal
  useEffect(() => {
    if (phase === 'reveal' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (phase === 'reveal' && countdown === 0) {
      calculateResult()
    }
  }, [phase, countdown])

  const calculateResult = () => {
    const match = myWord.toLowerCase().trim() === friendWord.toLowerCase().trim()
    const partial = !match && (
      myWord.toLowerCase().includes(friendWord.toLowerCase()) ||
      friendWord.toLowerCase().includes(myWord.toLowerCase())
    )
    
    setHistory(prev => [...prev, {
      round,
      myWord,
      friendWord,
      match,
      partial
    }])

    if (match) {
      setScore(prev => ({ me: prev.me + 10, friend: prev.friend + 10 }))
      updateScore(10)
    } else if (partial) {
      setScore(prev => ({ me: prev.me + 3, friend: prev.friend + 3 }))
      updateScore(3)
    }

    setPhase('result')
  }

  const startNewRound = () => {
    if (round >= maxRounds) {
      setPhase('gameover')
      return
    }
    setRound(prev => prev + 1)
    setMyWord('')
    setFriendWord('')
    setSubmitted(false)
    setFriendSubmitted(false)
    setCategory(null)
    setPhase('category')
    setIsHost(!isHost)
  }

  const selectCategory = (cat) => {
    setCategory(cat)
    setPhase('thinking')
    sendMessage({
      type: 'MIND_MELD',
      payload: { action: 'CATEGORY_SELECTED', payload: { category: cat } }
    })
  }

  const submitWord = (e) => {
    e.preventDefault()
    if (myWord.trim()) {
      setSubmitted(true)
      sendMessage({
        type: 'MIND_MELD',
        payload: { action: 'WORD_SUBMITTED', payload: { word: myWord.trim() } }
      })
    }
  }

  const handleNextRound = () => {
    sendMessage({
      type: 'MIND_MELD',
      payload: { action: 'NEXT_ROUND', payload: {} }
    })
    startNewRound()
  }

  return (
    <div className="game-container mind-meld">
      <div className="game-header">
        <button className="back-btn" onClick={endGame}>← Back</button>
        <div className="game-info">
          <span className="game-title">🧠 Mind Meld</span>
          <span className="round-info">Round {round}/{maxRounds}</span>
        </div>
        <div className="score-display">
          <span>{score.me + score.friend} pts</span>
        </div>
      </div>

      <div className="game-content">
        {phase === 'start' && (
          <div className="phase-start">
            <div className="brain-animation">
              <div className="brain-pulse"></div>
              <span className="brain-icon">🧠</span>
            </div>
            <h2>Mind Meld</h2>
            <p className="game-explanation">
              Think alike! You and your friend will each type a word based on a category.
              The goal? Type the SAME word! Great minds think alike... do yours?
            </p>
            <div className="rules-box">
              <h4>How to Play:</h4>
              <ul>
                <li>🎯 A category will be shown (e.g., "Animals")</li>
                <li>🤔 Both of you secretly type ONE word</li>
                <li>✨ If you match: <strong>+10 points!</strong></li>
                <li>🌟 Partial match: <strong>+3 points</strong></li>
              </ul>
            </div>
            <button className="start-btn" onClick={() => { setPhase('category'); setIsHost(true); }}>
              Begin Mind Meld
            </button>
          </div>
        )}

        {phase === 'category' && (
          <div className="phase-category">
            <h2>{isHost ? 'Choose a Category' : 'Waiting for friend to pick...'}</h2>
            <div className="categories-grid">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  className={`category-btn ${!isHost ? 'disabled' : ''}`}
                  onClick={() => isHost && selectCategory(cat)}
                  disabled={!isHost}
                >
                  <span className="cat-emoji">{cat.emoji}</span>
                  <span className="cat-name">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === 'thinking' && (
          <div className="phase-thinking">
            <div className="category-display">
              <span className="thinking-emoji">{category?.emoji}</span>
              <h2>{category?.name}</h2>
            </div>
            
            <p className="thinking-prompt">
              Think of a <strong>{category?.name.toLowerCase()}</strong> word your friend would also think of!
            </p>

            {!submitted ? (
              <form onSubmit={submitWord} className="word-form">
                <input
                  type="text"
                  value={myWord}
                  onChange={(e) => setMyWord(e.target.value)}
                  placeholder="Type your word..."
                  className="word-input"
                  autoFocus
                  maxLength={30}
                />
                <button type="submit" className="submit-btn" disabled={!myWord.trim()}>
                  Lock In 🔒
                </button>
              </form>
            ) : (
              <div className="waiting-display">
                <div className="lock-icon">🔒</div>
                <p>Your word is locked!</p>
                <p className="waiting-friend">
                  {friendSubmitted ? 'Friend also ready!' : 'Waiting for friend...'}
                </p>
              </div>
            )}

            <div className="player-status">
              <div className={`status-item ${submitted ? 'ready' : ''}`}>
                <span className="status-name">{playerName}</span>
                <span className="status-icon">{submitted ? '✅' : '⏳'}</span>
              </div>
              <div className={`status-item ${friendSubmitted ? 'ready' : ''}`}>
                <span className="status-name">{friendName || 'Friend'}</span>
                <span className="status-icon">{friendSubmitted ? '✅' : '⏳'}</span>
              </div>
            </div>
          </div>
        )}

        {phase === 'reveal' && (
          <div className="phase-reveal">
            <h2>Revealing in...</h2>
            <div className="countdown-display">
              <span className="countdown-number">{countdown}</span>
            </div>
            <div className="suspense-text">
              🌀 The minds are connecting... 🌀
            </div>
          </div>
        )}

        {phase === 'result' && (
          <div className="phase-result">
            {myWord.toLowerCase().trim() === friendWord.toLowerCase().trim() ? (
              <div className="result-match">
                <div className="match-animation">
                  <span className="match-icon">🎉</span>
                </div>
                <h2>MIND MELD!</h2>
                <p className="match-message">You both thought the same thing!</p>
              </div>
            ) : (
              <div className="result-no-match">
                <h2>So Close!</h2>
                <p className="no-match-message">Different minds, but still connected!</p>
              </div>
            )}
            
            <div className="words-reveal">
              <div className="word-card me">
                <span className="word-label">{playerName}</span>
                <span className="word-value">{myWord}</span>
              </div>
              <div className="word-vs">VS</div>
              <div className="word-card friend">
                <span className="word-label">{friendName || 'Friend'}</span>
                <span className="word-value">{friendWord}</span>
              </div>
            </div>

            <button className="next-btn" onClick={handleNextRound}>
              {round >= maxRounds ? 'See Results' : 'Next Round →'}
            </button>
          </div>
        )}

        {phase === 'gameover' && (
          <div className="phase-gameover">
            <h2>🎊 Game Complete! 🎊</h2>
            <div className="final-score">
              <span className="score-label">Team Score</span>
              <span className="score-value">{score.me + score.friend}</span>
            </div>
            
            <div className="history-list">
              <h4>Round History:</h4>
              {history.map((h, i) => (
                <div key={i} className={`history-item ${h.match ? 'match' : ''}`}>
                  <span className="history-round">R{h.round}</span>
                  <span className="history-words">{h.myWord} / {h.friendWord}</span>
                  <span className="history-result">{h.match ? '🎯' : h.partial ? '🌟' : '❌'}</span>
                </div>
              ))}
            </div>

            <div className="gameover-actions">
              <button className="play-again-btn" onClick={() => {
                setPhase('start')
                setRound(1)
                setScore({ me: 0, friend: 0 })
                setHistory([])
              }}>
                Play Again
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

export default MindMeld
