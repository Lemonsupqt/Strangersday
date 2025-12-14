import React, { useState, useEffect, useCallback } from 'react'
import { useGame } from '../context/GameContext'

const WORDS = [
  // Stranger Things themed
  { word: 'DEMOGORGON', hint: 'The monster from the Upside Down', category: 'Creatures' },
  { word: 'ELEVEN', hint: 'She has powers and loves Eggos', category: 'Characters' },
  { word: 'HAWKINS', hint: 'A small town in Indiana', category: 'Places' },
  { word: 'VECNA', hint: 'The most powerful villain', category: 'Creatures' },
  { word: 'MINDFLAYER', hint: 'The shadow monster', category: 'Creatures' },
  { word: 'HOPPER', hint: 'The chief of police', category: 'Characters' },
  { word: 'DUSTIN', hint: 'Loves his turtle and science', category: 'Characters' },
  { word: 'UPSIDEDOWN', hint: 'The dark dimension', category: 'Places' },
  { word: 'ARCADE', hint: 'Where they played games', category: 'Places' },
  { word: 'TELEKINESIS', hint: "Eleven's main power", category: 'Powers' },
  
  // Wednesday themed
  { word: 'NEVERMORE', hint: 'The academy for outcasts', category: 'Places' },
  { word: 'WEDNESDAY', hint: 'Our favorite goth protagonist', category: 'Characters' },
  { word: 'THING', hint: 'A helpful hand', category: 'Characters' },
  { word: 'PUGSLEY', hint: 'The brother who loves torture', category: 'Characters' },
  { word: 'MORTICIA', hint: 'The elegant mother', category: 'Characters' },
  { word: 'GOMEZ', hint: 'The passionate father', category: 'Characters' },
  { word: 'ENID', hint: 'The colorful werewolf roommate', category: 'Characters' },
  { word: 'HYDE', hint: 'The monster within', category: 'Creatures' },
  { word: 'PSYCHIC', hint: 'Ability to see visions', category: 'Powers' },
  { word: 'CELLO', hint: "Wednesday's instrument", category: 'Objects' },
  { word: 'POISON', hint: 'A popular Addams family hobby', category: 'Objects' },
  { word: 'GRAVEYARD', hint: 'A perfect place for a picnic', category: 'Places' },
]

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const SeanceCircle = () => {
  const { sendMessage, addMessageHandler, endGame, playerName, friendName, updateScore } = useGame()
  
  const [phase, setPhase] = useState('start')
  const [currentWord, setCurrentWord] = useState(null)
  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongGuesses, setWrongGuesses] = useState(0)
  const [maxWrongGuesses] = useState(6)
  const [round, setRound] = useState(1)
  const [maxRounds] = useState(5)
  const [score, setScore] = useState({ me: 0, friend: 0 })
  const [isMyTurn, setIsMyTurn] = useState(true)
  const [usedWords, setUsedWords] = useState([])
  const [planchetteLetter, setPlanchetteLetter] = useState(null)
  const [spiritMessage, setSpiritMessage] = useState('')
  const [isHost, setIsHost] = useState(false)

  // Spirit messages
  const spiritMessages = [
    "The spirits are restless...",
    "I sense a presence...",
    "The veil grows thin...",
    "Something stirs in the darkness...",
    "The dead whisper secrets...",
  ]

  // Get random word
  const getRandomWord = useCallback(() => {
    const available = WORDS.filter(w => !usedWords.includes(w.word))
    if (available.length === 0) {
      setUsedWords([])
      return WORDS[Math.floor(Math.random() * WORDS.length)]
    }
    return available[Math.floor(Math.random() * available.length)]
  }, [usedWords])

  // Message handler
  useEffect(() => {
    const unsubscribe = addMessageHandler((message) => {
      if (message.type === 'SEANCE') {
        const { action, payload } = message.payload
        
        switch (action) {
          case 'LETTER_GUESS':
            handleLetterGuess(payload.letter, false)
            setIsMyTurn(true)
            break
          case 'GAME_SYNC':
            setCurrentWord(payload.word)
            setGuessedLetters([])
            setWrongGuesses(0)
            setIsMyTurn(!payload.hostStarts)
            setIsHost(false)
            setPhase('playing')
            break
          case 'NEXT_ROUND':
            startNewRound(false)
            break
          case 'WIN_CLAIM':
            // Friend claims they won (they finished guessing)
            break
        }
      }
    })
    return unsubscribe
  }, [addMessageHandler, currentWord])

  // Check if word is complete
  const isWordComplete = useCallback(() => {
    if (!currentWord) return false
    return currentWord.word.split('').every(letter => guessedLetters.includes(letter))
  }, [currentWord, guessedLetters])

  // Handle letter guess
  const handleLetterGuess = useCallback((letter, isLocal = true) => {
    if (guessedLetters.includes(letter)) return
    
    // Animate planchette
    setPlanchetteLetter(letter)
    setTimeout(() => setPlanchetteLetter(null), 800)
    
    setGuessedLetters(prev => [...prev, letter])
    
    if (currentWord && !currentWord.word.includes(letter)) {
      setWrongGuesses(prev => prev + 1)
      setSpiritMessage(spiritMessages[Math.floor(Math.random() * spiritMessages.length)])
      setTimeout(() => setSpiritMessage(''), 2000)
    }
    
    if (isLocal) {
      sendMessage({
        type: 'SEANCE',
        payload: { action: 'LETTER_GUESS', payload: { letter } }
      })
      setIsMyTurn(false)
    }
  }, [guessedLetters, currentWord, sendMessage])

  // Check win/lose conditions
  useEffect(() => {
    if (phase !== 'playing' || !currentWord) return
    
    if (wrongGuesses >= maxWrongGuesses) {
      setPhase('result')
    } else if (isWordComplete()) {
      const roundScore = (maxWrongGuesses - wrongGuesses) * 10 + 20
      setScore(prev => ({ ...prev, me: prev.me + roundScore / 2, friend: prev.friend + roundScore / 2 }))
      updateScore(roundScore / 2)
      setPhase('result')
    }
  }, [wrongGuesses, guessedLetters, phase, currentWord, isWordComplete, maxWrongGuesses, updateScore])

  // Render word display
  const renderWord = () => {
    if (!currentWord) return null
    return currentWord.word.split('').map((letter, i) => (
      <span 
        key={i} 
        className={`word-letter ${guessedLetters.includes(letter) ? 'revealed' : ''}`}
      >
        {guessedLetters.includes(letter) ? letter : ''}
      </span>
    ))
  }

  // Get ghost stage
  const getGhostStage = () => {
    const stages = ['👻', '💀', '☠️', '🦴', '⚰️', '🪦', '💀']
    return stages[Math.min(wrongGuesses, stages.length - 1)]
  }

  const startNewRound = (isInitiator = true) => {
    if (round >= maxRounds) {
      setPhase('gameover')
      return
    }
    
    const word = getRandomWord()
    setUsedWords(prev => [...prev, word.word])
    setCurrentWord(word)
    setGuessedLetters([])
    setWrongGuesses(0)
    setRound(prev => prev + 1)
    setIsHost(isInitiator)
    setIsMyTurn(isInitiator)
    setPhase('playing')
    
    if (isInitiator) {
      sendMessage({
        type: 'SEANCE',
        payload: { action: 'GAME_SYNC', payload: { word, hostStarts: true } }
      })
    }
  }

  const handleNextRound = () => {
    sendMessage({
      type: 'SEANCE',
      payload: { action: 'NEXT_ROUND', payload: {} }
    })
    startNewRound(true)
  }

  const startGame = () => {
    const word = getRandomWord()
    setUsedWords([word.word])
    setCurrentWord(word)
    setIsHost(true)
    setIsMyTurn(true)
    setPhase('playing')
    
    sendMessage({
      type: 'SEANCE',
      payload: { action: 'GAME_SYNC', payload: { word, hostStarts: true } }
    })
  }

  return (
    <div className="game-container seance-circle">
      <div className="game-header">
        <button className="back-btn" onClick={endGame}>← Back</button>
        <div className="game-info">
          <span className="game-title">🔮 Séance Circle</span>
          <span className="round-info">Round {round}/{maxRounds}</span>
        </div>
        <div className="score-display">
          <span>{score.me + score.friend} pts</span>
        </div>
      </div>

      <div className="game-content seance-content">
        {phase === 'start' && (
          <div className="phase-start">
            <div className="ouija-icon">
              <span className="crystal-ball">🔮</span>
              <div className="mystical-glow"></div>
            </div>
            <h2>Séance Circle</h2>
            <p className="game-explanation">
              The spirits wish to communicate! Work together with your friend 
              to reveal the hidden words from beyond the veil.
            </p>
            <div className="rules-box gothic-rules">
              <h4>🕯️ How to Commune:</h4>
              <ul>
                <li>🔮 Take turns guessing letters</li>
                <li>👻 6 wrong guesses and the spirit departs</li>
                <li>💀 Cooperative mode - work together!</li>
                <li>✨ Bonus points for fewer mistakes</li>
              </ul>
            </div>
            <button className="start-btn gothic-btn" onClick={startGame}>
              <span>Begin the Séance</span>
            </button>
          </div>
        )}

        {phase === 'playing' && currentWord && (
          <div className="seance-phase">
            {/* Spirit message */}
            {spiritMessage && (
              <div className="spirit-message">{spiritMessage}</div>
            )}
            
            {/* Ghost/Hangman display */}
            <div className="ghost-display">
              <div className="candles">
                {[...Array(maxWrongGuesses)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`candle ${i < wrongGuesses ? 'extinguished' : 'lit'}`}
                  >
                    {i < wrongGuesses ? '🕯️' : '🕯️'}
                  </div>
                ))}
              </div>
              <div className="ghost-stage">
                {getGhostStage()}
              </div>
              <div className="guesses-left">
                {maxWrongGuesses - wrongGuesses} candles remain
              </div>
            </div>
            
            {/* Word hint */}
            <div className="word-hint">
              <span className="hint-category">{currentWord.category}</span>
              <span className="hint-text">"{currentWord.hint}"</span>
            </div>
            
            {/* Word display */}
            <div className="word-display">
              {renderWord()}
            </div>
            
            {/* Turn indicator */}
            <div className={`turn-indicator ${isMyTurn ? 'your-turn' : 'friend-turn'}`}>
              {isMyTurn ? '🌙 Your turn to guess' : `⭐ ${friendName || 'Friend'}'s turn`}
            </div>
            
            {/* Ouija board */}
            <div className="ouija-board">
              <div className="planchette-area">
                {planchetteLetter && (
                  <div className="planchette-moving">
                    <span className="planchette-letter">{planchetteLetter}</span>
                  </div>
                )}
              </div>
              <div className="letter-grid">
                {ALPHABET.map(letter => (
                  <button
                    key={letter}
                    className={`letter-btn ${guessedLetters.includes(letter) ? 'used' : ''} ${
                      guessedLetters.includes(letter) && currentWord.word.includes(letter) 
                        ? 'correct' 
                        : guessedLetters.includes(letter) 
                          ? 'wrong' 
                          : ''
                    }`}
                    onClick={() => handleLetterGuess(letter)}
                    disabled={guessedLetters.includes(letter) || !isMyTurn}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Guessed letters */}
            <div className="guessed-display">
              <span className="guessed-label">Revealed: </span>
              <span className="guessed-letters">
                {guessedLetters.filter(l => currentWord.word.includes(l)).join(' ')}
              </span>
              <span className="wrong-label">Mistakes: </span>
              <span className="wrong-letters">
                {guessedLetters.filter(l => !currentWord.word.includes(l)).join(' ')}
              </span>
            </div>
          </div>
        )}

        {phase === 'result' && (
          <div className="result-phase">
            <div className={`seance-result ${isWordComplete() ? 'success' : 'failure'}`}>
              {isWordComplete() ? (
                <>
                  <div className="result-icon">✨</div>
                  <h2>The Spirits Spoke!</h2>
                  <p>You successfully communicated with the beyond!</p>
                </>
              ) : (
                <>
                  <div className="result-icon">💀</div>
                  <h2>The Spirit Departed</h2>
                  <p>The candles have all been extinguished...</p>
                </>
              )}
            </div>
            
            <div className="word-reveal">
              <span className="reveal-label">The word was:</span>
              <span className="reveal-word">{currentWord?.word}</span>
            </div>

            <button className="next-btn gothic-btn" onClick={handleNextRound}>
              {round >= maxRounds ? 'Final Results' : 'Next Spirit →'}
            </button>
          </div>
        )}

        {phase === 'gameover' && (
          <div className="phase-gameover">
            <div className="seance-final">
              <div className="crystal-icon">🔮</div>
              <h2>The Séance Has Ended</h2>
              <p>The spirits thank you for your communion</p>
            </div>
            
            <div className="final-score">
              <span className="score-label">Combined Spirit Energy</span>
              <span className="score-value">{score.me + score.friend}</span>
            </div>

            <div className="gameover-actions">
              <button className="play-again-btn gothic-btn" onClick={() => {
                setPhase('start')
                setRound(1)
                setScore({ me: 0, friend: 0 })
                setUsedWords([])
              }}>
                Another Séance
              </button>
              <button className="back-btn" onClick={endGame}>
                Leave the Circle
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SeanceCircle
