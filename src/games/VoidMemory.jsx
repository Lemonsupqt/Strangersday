import React, { useState, useEffect, useCallback } from 'react'
import { useGame } from '../context/GameContext'

const CARD_SYMBOLS = [
  '🎃', '👻', '🦇', '🕷️', '🌙', '⭐', '🔮', '🎭',
  '🕯️', '💀', '🧙', '🦉', '🐍', '🌀', '⚡', '🔥'
]

const VoidMemory = () => {
  const { sendMessage, addMessageHandler, endGame, playerName, friendName, updateScore } = useGame()
  
  const [phase, setPhase] = useState('start')
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [isMyTurn, setIsMyTurn] = useState(true)
  const [score, setScore] = useState({ me: 0, friend: 0 })
  const [voidEffect, setVoidEffect] = useState(null)
  const [message, setMessage] = useState('')
  const [canFlip, setCanFlip] = useState(true)

  // Initialize cards
  const initializeCards = useCallback(() => {
    const selectedSymbols = CARD_SYMBOLS.slice(0, 8)
    const cardPairs = [...selectedSymbols, ...selectedSymbols]
    const shuffled = cardPairs.sort(() => Math.random() - 0.5)
    return shuffled.map((symbol, index) => ({
      id: index,
      symbol,
      isFlipped: false,
      isMatched: false
    }))
  }, [])

  // Message handler
  useEffect(() => {
    const unsubscribe = addMessageHandler((message) => {
      if (message.type === 'VOID_MEMORY') {
        const { action, payload } = message.payload
        
        switch (action) {
          case 'GAME_START':
            setCards(payload.cards)
            setIsMyTurn(false)
            setPhase('playing')
            break
          case 'FLIP':
            handleRemoteFlip(payload.cardId)
            break
          case 'MATCH_FOUND':
            setMatched(prev => [...prev, payload.symbol])
            setScore(prev => ({ ...prev, friend: prev.friend + 10 }))
            break
          case 'NO_MATCH':
            setTimeout(() => {
              setFlipped([])
              setIsMyTurn(true)
              setCanFlip(true)
            }, 1000)
            break
          case 'VOID_EFFECT':
            applyVoidEffect(payload.effect)
            break
        }
      }
    })
    return unsubscribe
  }, [addMessageHandler, cards])

  // Check for game over
  useEffect(() => {
    if (matched.length === 8 && phase === 'playing') {
      setPhase('gameover')
    }
  }, [matched, phase])

  // Random void effects
  useEffect(() => {
    if (phase !== 'playing') return
    
    const interval = setInterval(() => {
      const effects = ['shuffle', 'peek', 'hide']
      const randomEffect = effects[Math.floor(Math.random() * effects.length)]
      
      if (Math.random() > 0.7) {
        applyVoidEffect(randomEffect)
        sendMessage({
          type: 'VOID_MEMORY',
          payload: { action: 'VOID_EFFECT', payload: { effect: randomEffect } }
        })
      }
    }, 15000)
    
    return () => clearInterval(interval)
  }, [phase, sendMessage])

  const applyVoidEffect = (effectName) => {
    setVoidEffect(effectName)
    
    switch (effectName) {
      case 'shuffle':
        setMessage('🌀 The void shuffles the cards!')
        setCards(prev => {
          const unmatchedCards = prev.filter(c => !matched.includes(c.symbol))
          const matchedCards = prev.filter(c => matched.includes(c.symbol))
          const shuffledUnmatched = unmatchedCards.sort(() => Math.random() - 0.5)
          return [...shuffledUnmatched, ...matchedCards].map((card, idx) => ({
            ...card,
            id: idx
          }))
        })
        break
      case 'peek':
        setMessage('👁️ The void reveals a glimpse!')
        setCards(prev => prev.map(c => ({ ...c, isFlipped: true })))
        setTimeout(() => {
          setCards(prev => prev.map(c => ({ 
            ...c, 
            isFlipped: matched.includes(c.symbol) 
          })))
        }, 1500)
        break
      case 'hide':
        setMessage('🌑 Darkness spreads...')
        break
    }
    
    setTimeout(() => {
      setVoidEffect(null)
      setMessage('')
    }, 3000)
  }

  const handleRemoteFlip = (cardId) => {
    setFlipped(prev => {
      const newFlipped = [...prev, cardId]
      
      if (newFlipped.length === 2) {
        const [first, second] = newFlipped
        const firstCard = cards[first]
        const secondCard = cards[second]
        
        if (firstCard.symbol === secondCard.symbol) {
          setMatched(prev => [...prev, firstCard.symbol])
          setTimeout(() => {
            setFlipped([])
            setIsMyTurn(true)
            setCanFlip(true)
          }, 500)
        }
      }
      
      return newFlipped
    })
  }

  const handleCardClick = (cardId) => {
    if (!canFlip || !isMyTurn || flipped.length >= 2) return
    
    const card = cards[cardId]
    if (matched.includes(card.symbol) || flipped.includes(cardId)) return

    const newFlipped = [...flipped, cardId]
    setFlipped(newFlipped)
    
    sendMessage({
      type: 'VOID_MEMORY',
      payload: { action: 'FLIP', payload: { cardId } }
    })

    if (newFlipped.length === 2) {
      setCanFlip(false)
      const [first, second] = newFlipped
      const firstCard = cards[first]
      const secondCard = cards[second]
      
      if (firstCard.symbol === secondCard.symbol) {
        // Match found
        setMatched(prev => [...prev, firstCard.symbol])
        setScore(prev => ({ ...prev, me: prev.me + 10 }))
        updateScore(10)
        sendMessage({
          type: 'VOID_MEMORY',
          payload: { action: 'MATCH_FOUND', payload: { symbol: firstCard.symbol } }
        })
        setTimeout(() => {
          setFlipped([])
          setCanFlip(true)
        }, 500)
      } else {
        // No match
        sendMessage({
          type: 'VOID_MEMORY',
          payload: { action: 'NO_MATCH', payload: {} }
        })
        setTimeout(() => {
          setFlipped([])
          setIsMyTurn(false)
          setCanFlip(true)
        }, 1000)
      }
    }
  }

  const startGame = () => {
    const newCards = initializeCards()
    setCards(newCards)
    setFlipped([])
    setMatched([])
    setIsMyTurn(true)
    setPhase('playing')
    
    sendMessage({
      type: 'VOID_MEMORY',
      payload: { action: 'GAME_START', payload: { cards: newCards } }
    })
  }

  const isCardFlipped = (card) => {
    return flipped.includes(card.id) || matched.includes(card.symbol)
  }

  return (
    <div className="game-container void-memory">
      <div className="game-header">
        <button className="back-btn" onClick={endGame}>← Back</button>
        <div className="game-info">
          <span className="game-title">🌀 Void Memory</span>
          <span className="pairs-left">Pairs: {matched.length}/8</span>
        </div>
        <div className="turn-indicator">
          <span className={`turn ${isMyTurn ? 'my-turn' : 'friend-turn'}`}>
            {isMyTurn ? 'Your Turn' : 'Friend\'s Turn'}
          </span>
        </div>
      </div>

      <div className="game-content">
        {phase === 'start' && (
          <div className="phase-start">
            <div className="void-icon">
              <div className="void-spiral">🌀</div>
            </div>
            <h2>Void Memory</h2>
            <p className="game-explanation">
              A memory game from the Upside Down! Find matching pairs,
              but beware - the void shifts and changes the cards!
            </p>
            <div className="rules-box">
              <h4>How to Play:</h4>
              <ul>
                <li>🃏 Flip two cards to find matching pairs</li>
                <li>✨ Match = Keep your turn & earn 10 points</li>
                <li>❌ No match = Friend's turn</li>
                <li>🌀 The void may shuffle, peek, or hide cards!</li>
              </ul>
            </div>
            <button className="start-btn" onClick={startGame}>
              Enter the Void
            </button>
          </div>
        )}

        {phase === 'playing' && (
          <div className="play-phase">
            <div className="scores-bar">
              <div className={`score-item ${isMyTurn ? 'active' : ''}`}>
                <span className="score-name">{playerName}</span>
                <span className="score-value">{score.me}</span>
              </div>
              <div className={`score-item ${!isMyTurn ? 'active' : ''}`}>
                <span className="score-name">{friendName || 'Friend'}</span>
                <span className="score-value">{score.friend}</span>
              </div>
            </div>

            {message && (
              <div className="void-message">
                {message}
              </div>
            )}

            <div className={`cards-grid ${voidEffect || ''}`}>
              {cards.map((card) => (
                <div
                  key={card.id}
                  className={`memory-card ${isCardFlipped(card) ? 'flipped' : ''} ${matched.includes(card.symbol) ? 'matched' : ''}`}
                  onClick={() => handleCardClick(card.id)}
                >
                  <div className="card-inner">
                    <div className="card-front">
                      <span className="card-back-design">?</span>
                    </div>
                    <div className="card-back">
                      <span className="card-symbol">{card.symbol}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="matched-display">
              <span className="matched-label">Matched:</span>
              <div className="matched-symbols">
                {matched.map((symbol, i) => (
                  <span key={i} className="matched-symbol">{symbol}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {phase === 'gameover' && (
          <div className="phase-gameover">
            <h2>🎊 All Pairs Found! 🎊</h2>
            
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
              <button className="play-again-btn" onClick={() => {
                setPhase('start')
                setScore({ me: 0, friend: 0 })
                setMatched([])
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

export default VoidMemory
