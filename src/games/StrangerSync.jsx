import React, { useState, useEffect, useCallback } from 'react'
import { useGame } from '../context/GameContext'

const QUESTIONS = [
  {
    question: "If you could have any Stranger Things power, which would you choose?",
    options: ["Telekinesis (Eleven)", "Mind control (Vecna)", "Super strength", "Time travel"],
    category: "powers"
  },
  {
    question: "Pick a movie night snack!",
    options: ["Popcorn 🍿", "Pizza 🍕", "Ice cream 🍦", "Chips 🥔"],
    category: "food"
  },
  {
    question: "Which Stranger Things character are you most like?",
    options: ["Eleven", "Dustin", "Steve", "Max"],
    category: "personality"
  },
  {
    question: "Best way to spend a weekend?",
    options: ["Gaming marathon", "Outdoor adventure", "Movie binge", "Hanging with friends"],
    category: "lifestyle"
  },
  {
    question: "Pick a superpower!",
    options: ["Flying ✈️", "Invisibility 👻", "Mind reading 🧠", "Time stop ⏱️"],
    category: "powers"
  },
  {
    question: "Favorite season?",
    options: ["Spring 🌸", "Summer ☀️", "Fall 🍂", "Winter ❄️"],
    category: "preferences"
  },
  {
    question: "If you found a portal to the Upside Down, would you...?",
    options: ["Jump in immediately!", "Peek inside first", "Call for backup", "Run away screaming"],
    category: "personality"
  },
  {
    question: "Pick a mythical creature to befriend!",
    options: ["Dragon 🐉", "Phoenix 🔥", "Unicorn 🦄", "Griffin 🦅"],
    category: "fantasy"
  },
  {
    question: "What's your go-to comfort activity?",
    options: ["Listening to music", "Playing games", "Watching shows", "Chatting with friends"],
    category: "lifestyle"
  },
  {
    question: "Dream travel destination?",
    options: ["Japan 🗾", "Iceland 🧊", "Italy 🇮🇹", "New Zealand 🥝"],
    category: "travel"
  },
  {
    question: "Pick a weapon to fight the Demogorgon!",
    options: ["Baseball bat with nails", "Flamethrower", "Sword", "Psyc powers"],
    category: "combat"
  },
  {
    question: "Ideal way to communicate with your BFF?",
    options: ["Voice calls", "Video chats", "Texting", "Gaming together"],
    category: "friendship"
  }
]

const StrangerSync = () => {
  const { sendMessage, addMessageHandler, endGame, playerName, friendName, updateScore } = useGame()
  
  const [phase, setPhase] = useState('start')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [questions, setQuestions] = useState([])
  const [myAnswer, setMyAnswer] = useState(null)
  const [friendAnswer, setFriendAnswer] = useState(null)
  const [results, setResults] = useState([])
  const [syncScore, setSyncScore] = useState(0)

  // Initialize questions
  useEffect(() => {
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 8)
    setQuestions(shuffled)
  }, [])

  // Message handler
  useEffect(() => {
    const unsubscribe = addMessageHandler((message) => {
      if (message.type === 'STRANGER_SYNC') {
        const { action, payload } = message.payload
        
        switch (action) {
          case 'ANSWER':
            setFriendAnswer(payload.answer)
            break
          case 'GAME_START':
            setQuestions(payload.questions)
            setPhase('playing')
            break
          case 'NEXT_QUESTION':
            handleNextQuestion()
            break
        }
      }
    })
    return unsubscribe
  }, [addMessageHandler])

  // Check if both answered
  useEffect(() => {
    if (myAnswer !== null && friendAnswer !== null) {
      const matched = myAnswer === friendAnswer
      setResults(prev => [...prev, { 
        question: questions[currentQuestion],
        myAnswer, 
        friendAnswer, 
        matched 
      }])
      
      if (matched) {
        setSyncScore(prev => prev + 1)
        updateScore(10)
      }
      
      setTimeout(() => {
        setPhase('reveal')
      }, 500)
    }
  }, [myAnswer, friendAnswer])

  const startGame = () => {
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 8)
    setQuestions(shuffled)
    setPhase('playing')
    setCurrentQuestion(0)
    setResults([])
    setSyncScore(0)
    
    sendMessage({
      type: 'STRANGER_SYNC',
      payload: { action: 'GAME_START', payload: { questions: shuffled } }
    })
  }

  const handleAnswer = (answerIndex) => {
    if (myAnswer !== null) return
    setMyAnswer(answerIndex)
    
    sendMessage({
      type: 'STRANGER_SYNC',
      payload: { action: 'ANSWER', payload: { answer: answerIndex } }
    })
  }

  const handleNextQuestion = () => {
    if (currentQuestion >= questions.length - 1) {
      setPhase('gameover')
      return
    }
    
    setCurrentQuestion(prev => prev + 1)
    setMyAnswer(null)
    setFriendAnswer(null)
    setPhase('playing')
  }

  const nextQuestion = () => {
    sendMessage({
      type: 'STRANGER_SYNC',
      payload: { action: 'NEXT_QUESTION', payload: {} }
    })
    handleNextQuestion()
  }

  const getSyncLevel = () => {
    const percentage = (syncScore / questions.length) * 100
    if (percentage >= 80) return { level: 'Mind Melded! 🧠', color: '#20e3b2', description: 'You two are basically telepathic!' }
    if (percentage >= 60) return { level: 'Soul Synced! 💫', color: '#00d4ff', description: 'Your minds are seriously aligned!' }
    if (percentage >= 40) return { level: 'Good Vibes! ✨', color: '#7b2cbf', description: 'Solid friendship frequency!' }
    if (percentage >= 20) return { level: 'Getting There! 🌟', color: '#ff6b9d', description: 'Room to grow, but still connected!' }
    return { level: 'Opposites Attract! 🎭', color: '#ff0844', description: 'Different minds, unique bond!' }
  }

  const question = questions[currentQuestion]

  return (
    <div className="game-container stranger-sync">
      <div className="game-header">
        <button className="back-btn" onClick={endGame}>← Back</button>
        <div className="game-info">
          <span className="game-title">💫 Stranger Sync</span>
          <span className="question-count">{currentQuestion + 1}/{questions.length}</span>
        </div>
        <div className="sync-display">
          <span className="sync-label">Sync:</span>
          <span className="sync-value">{syncScore}</span>
        </div>
      </div>

      <div className="game-content">
        {phase === 'start' && (
          <div className="phase-start">
            <div className="sync-icon">
              <div className="sync-pulse">💫</div>
            </div>
            <h2>Stranger Sync</h2>
            <p className="game-explanation">
              How in sync are you and your BFF? Answer questions and
              see if your answers match! The more matches, the higher your sync level!
            </p>
            <div className="rules-box">
              <h4>How to Play:</h4>
              <ul>
                <li>📝 Both answer the same question</li>
                <li>✨ Same answer = Sync point!</li>
                <li>🔮 Discover your sync level at the end</li>
                <li>💫 8 questions total</li>
              </ul>
            </div>
            <button className="start-btn" onClick={startGame}>
              Test Your Sync
            </button>
          </div>
        )}

        {phase === 'playing' && question && (
          <div className="play-phase">
            <div className="question-card">
              <span className="question-category">{question.category}</span>
              <h3 className="question-text">{question.question}</h3>
            </div>

            <div className="options-grid">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  className={`option-btn ${myAnswer === index ? 'selected' : ''} ${myAnswer !== null ? 'disabled' : ''}`}
                  onClick={() => handleAnswer(index)}
                  disabled={myAnswer !== null}
                >
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  <span className="option-text">{option}</span>
                </button>
              ))}
            </div>

            <div className="answer-status">
              <div className={`status-item ${myAnswer !== null ? 'answered' : ''}`}>
                <span className="status-name">{playerName}</span>
                <span className="status-icon">{myAnswer !== null ? '✅' : '⏳'}</span>
              </div>
              <div className={`status-item ${friendAnswer !== null ? 'answered' : ''}`}>
                <span className="status-name">{friendName || 'Friend'}</span>
                <span className="status-icon">{friendAnswer !== null ? '✅' : '⏳'}</span>
              </div>
            </div>
          </div>
        )}

        {phase === 'reveal' && question && (
          <div className="reveal-phase">
            <div className={`reveal-result ${myAnswer === friendAnswer ? 'match' : 'no-match'}`}>
              {myAnswer === friendAnswer ? (
                <>
                  <div className="result-icon">🎉</div>
                  <h3>SYNC!</h3>
                  <p>You both chose the same answer!</p>
                </>
              ) : (
                <>
                  <div className="result-icon">🎭</div>
                  <h3>Different Vibes!</h3>
                  <p>Opposites can attract too!</p>
                </>
              )}
            </div>

            <div className="answers-comparison">
              <div className="answer-card me">
                <span className="answer-label">{playerName}</span>
                <span className="answer-value">{question.options[myAnswer]}</span>
              </div>
              <div className="answer-card friend">
                <span className="answer-label">{friendName || 'Friend'}</span>
                <span className="answer-value">{question.options[friendAnswer]}</span>
              </div>
            </div>

            <button className="next-btn" onClick={nextQuestion}>
              {currentQuestion >= questions.length - 1 ? 'See Results' : 'Next Question →'}
            </button>
          </div>
        )}

        {phase === 'gameover' && (
          <div className="phase-gameover">
            <div className="sync-result" style={{ '--sync-color': getSyncLevel().color }}>
              <h2>{getSyncLevel().level}</h2>
              <div className="sync-meter">
                <div 
                  className="sync-fill" 
                  style={{ width: `${(syncScore / questions.length) * 100}%` }}
                ></div>
              </div>
              <p className="sync-score">{syncScore}/{questions.length} synced!</p>
              <p className="sync-description">{getSyncLevel().description}</p>
            </div>

            <div className="results-breakdown">
              <h4>Question Breakdown:</h4>
              <div className="results-list">
                {results.map((r, i) => (
                  <div key={i} className={`result-item ${r.matched ? 'matched' : ''}`}>
                    <span className="result-q">Q{i + 1}</span>
                    <span className="result-answers">
                      {r.question.options[r.myAnswer]} / {r.question.options[r.friendAnswer]}
                    </span>
                    <span className="result-icon">{r.matched ? '✨' : '🎭'}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="gameover-actions">
              <button className="play-again-btn" onClick={() => {
                setPhase('start')
                setCurrentQuestion(0)
                setResults([])
                setSyncScore(0)
                setMyAnswer(null)
                setFriendAnswer(null)
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

export default StrangerSync
