import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useGame } from '../context/GameContext'

const ThingHandSlap = () => {
  const { sendMessage, addMessageHandler, endGame, playerName, friendName, updateScore } = useGame()
  
  const [phase, setPhase] = useState('start') // start, waiting, ready, slap!, result, gameover
  const [round, setRound] = useState(1)
  const [maxRounds] = useState(10)
  const [score, setScore] = useState({ me: 0, friend: 0 })
  const [myReactionTime, setMyReactionTime] = useState(null)
  const [friendReactionTime, setFriendReactionTime] = useState(null)
  const [signalTime, setSignalTime] = useState(null)
  const [tooEarly, setTooEarly] = useState(false)
  const [friendTooEarly, setFriendTooEarly] = useState(false)
  const [waitingForSignal, setWaitingForSignal] = useState(false)
  const [roundWinner, setRoundWinner] = useState(null)
  const [handPosition, setHandPosition] = useState('idle')
  const [friendHandPosition, setFriendHandPosition] = useState('idle')
  const [streak, setStreak] = useState(0)
  const [bestTime, setBestTime] = useState(null)
  
  const timeoutRef = useRef(null)
  const startTimeRef = useRef(null)

  // Message handler
  useEffect(() => {
    const unsubscribe = addMessageHandler((message) => {
      if (message.type === 'THING_SLAP') {
        const { action, payload } = message.payload
        
        switch (action) {
          case 'READY':
            startRound(false)
            break
          case 'SLAP':
            setFriendReactionTime(payload.time)
            setFriendHandPosition('slapping')
            if (payload.tooEarly) {
              setFriendTooEarly(true)
            }
            break
          case 'SIGNAL_SYNC':
            // Start our timer when friend signals
            startTimeRef.current = Date.now()
            setSignalTime(Date.now())
            setPhase('slap!')
            setHandPosition('ready')
            setFriendHandPosition('ready')
            break
          case 'NEXT_ROUND':
            nextRound()
            break
        }
      }
    })
    return unsubscribe
  }, [addMessageHandler])

  // Determine round winner
  useEffect(() => {
    if (phase !== 'slap!' && phase !== 'result') return
    if (myReactionTime === null && friendReactionTime === null) return
    
    // Both have reacted or one was too early
    if ((myReactionTime !== null || tooEarly) && (friendReactionTime !== null || friendTooEarly)) {
      determineWinner()
    }
  }, [myReactionTime, friendReactionTime, tooEarly, friendTooEarly, phase])

  const determineWinner = () => {
    let winner = null
    
    if (tooEarly && friendTooEarly) {
      winner = 'draw'
    } else if (tooEarly) {
      winner = 'friend'
      setScore(prev => ({ ...prev, friend: prev.friend + 1 }))
      setStreak(0)
    } else if (friendTooEarly) {
      winner = 'me'
      setScore(prev => ({ ...prev, me: prev.me + 1 }))
      setStreak(prev => prev + 1)
      updateScore(1)
    } else if (myReactionTime < friendReactionTime) {
      winner = 'me'
      setScore(prev => ({ ...prev, me: prev.me + 1 }))
      setStreak(prev => prev + 1)
      updateScore(1)
      if (!bestTime || myReactionTime < bestTime) {
        setBestTime(myReactionTime)
      }
    } else if (friendReactionTime < myReactionTime) {
      winner = 'friend'
      setScore(prev => ({ ...prev, friend: prev.friend + 1 }))
      setStreak(0)
    } else {
      winner = 'draw'
    }
    
    setRoundWinner(winner)
    setPhase('result')
  }

  const startRound = (isInitiator = true) => {
    setMyReactionTime(null)
    setFriendReactionTime(null)
    setTooEarly(false)
    setFriendTooEarly(false)
    setRoundWinner(null)
    setHandPosition('waiting')
    setFriendHandPosition('waiting')
    setWaitingForSignal(true)
    setPhase('waiting')
    
    if (isInitiator) {
      sendMessage({
        type: 'THING_SLAP',
        payload: { action: 'READY', payload: {} }
      })
      
      // Random delay between 1-4 seconds
      const delay = 1000 + Math.random() * 3000
      timeoutRef.current = setTimeout(() => {
        setPhase('slap!')
        setSignalTime(Date.now())
        startTimeRef.current = Date.now()
        setWaitingForSignal(false)
        setHandPosition('ready')
        setFriendHandPosition('ready')
        
        sendMessage({
          type: 'THING_SLAP',
          payload: { action: 'SIGNAL_SYNC', payload: {} }
        })
      }, delay)
    }
  }

  const handleSlap = useCallback(() => {
    if (phase === 'waiting') {
      // Too early!
      setTooEarly(true)
      setHandPosition('slapping')
      clearTimeout(timeoutRef.current)
      
      sendMessage({
        type: 'THING_SLAP',
        payload: { action: 'SLAP', payload: { time: 9999, tooEarly: true } }
      })
      return
    }
    
    if (phase !== 'slap!' || myReactionTime !== null) return
    
    const reactionTime = Date.now() - startTimeRef.current
    setMyReactionTime(reactionTime)
    setHandPosition('slapping')
    
    sendMessage({
      type: 'THING_SLAP',
      payload: { action: 'SLAP', payload: { time: reactionTime, tooEarly: false } }
    })
  }, [phase, myReactionTime, sendMessage])

  const nextRound = () => {
    if (round >= maxRounds) {
      setPhase('gameover')
      return
    }
    setRound(prev => prev + 1)
    startRound(true)
  }

  const handleNextRound = () => {
    sendMessage({
      type: 'THING_SLAP',
      payload: { action: 'NEXT_ROUND', payload: {} }
    })
    nextRound()
  }

  const getHandEmoji = (position, isFriend = false) => {
    switch (position) {
      case 'idle': return '✋'
      case 'waiting': return '🤚'
      case 'ready': return '🖐️'
      case 'slapping': return '👋'
      default: return '✋'
    }
  }

  const getReactionRating = (time) => {
    if (time < 150) return { rating: 'SUPERNATURAL!', emoji: '⚡', color: '#d4af37' }
    if (time < 200) return { rating: 'Lightning Fast!', emoji: '🌟', color: '#20e3b2' }
    if (time < 250) return { rating: 'Quick!', emoji: '✨', color: '#00d4ff' }
    if (time < 350) return { rating: 'Good', emoji: '👍', color: '#7b2cbf' }
    if (time < 500) return { rating: 'Average', emoji: '😐', color: '#6b7280' }
    return { rating: 'Slow...', emoji: '🐌', color: '#ff0844' }
  }

  return (
    <div className="game-container thing-slap">
      <div className="game-header">
        <button className="back-btn" onClick={endGame}>← Back</button>
        <div className="game-info">
          <span className="game-title">🖐️ Thing's Hand Slap</span>
          <span className="round-info">Round {round}/{maxRounds}</span>
        </div>
        <div className="slap-score">
          <span className="my-score">{score.me}</span>
          <span className="score-divider">-</span>
          <span className="friend-score">{score.friend}</span>
        </div>
      </div>

      <div className="game-content slap-content">
        {phase === 'start' && (
          <div className="phase-start">
            <div className="thing-icon">
              <span className="hand-emoji">🖐️</span>
              <div className="thing-crawl"></div>
            </div>
            <h2>Thing's Hand Slap</h2>
            <p className="game-explanation">
              Thing challenges you to a duel of reflexes! When you see the signal, 
              slap as fast as you can. But don't slap too early, or Thing wins!
            </p>
            <div className="rules-box gothic-rules">
              <h4>🖐️ The Rules of Thing:</h4>
              <ul>
                <li>⏳ Wait for the screen to turn GREEN</li>
                <li>👋 SLAP as fast as possible!</li>
                <li>⚠️ Slap too early = automatic loss</li>
                <li>⚡ Fastest reaction wins the round</li>
              </ul>
            </div>
            <button className="start-btn gothic-btn" onClick={() => startRound(true)}>
              <span>Challenge Thing!</span>
            </button>
          </div>
        )}

        {(phase === 'waiting' || phase === 'slap!') && (
          <div 
            className={`slap-arena ${phase === 'slap!' ? 'go' : 'wait'}`}
            onClick={handleSlap}
          >
            <div className="arena-content">
              {streak > 2 && (
                <div className="streak-display">🔥 {streak} Win Streak!</div>
              )}
              
              <div className="hands-display">
                <div className={`hand-container me ${handPosition}`}>
                  <span className="hand-name">{playerName}</span>
                  <span className="hand-emoji">{getHandEmoji(handPosition)}</span>
                </div>
                
                <div className="vs-circle">
                  {phase === 'waiting' ? '⏳' : '👊'}
                </div>
                
                <div className={`hand-container friend ${friendHandPosition}`}>
                  <span className="hand-name">{friendName || 'Friend'}</span>
                  <span className="hand-emoji">{getHandEmoji(friendHandPosition, true)}</span>
                </div>
              </div>
              
              <div className="signal-display">
                {phase === 'waiting' ? (
                  <>
                    <div className="wait-text">WAIT...</div>
                    <div className="wait-subtext">Don't tap yet!</div>
                  </>
                ) : (
                  <>
                    <div className="go-text">SLAP!</div>
                    <div className="go-subtext">TAP NOW!</div>
                  </>
                )}
              </div>
              
              <div className="tap-area">
                <span className="tap-hint">
                  {phase === 'waiting' ? 'Keep your finger ready...' : 'TAP ANYWHERE!'}
                </span>
              </div>
            </div>
          </div>
        )}

        {phase === 'result' && (
          <div className="result-phase slap-result">
            <div className={`round-result ${roundWinner}`}>
              {roundWinner === 'me' ? (
                <>
                  <div className="result-icon">🏆</div>
                  <h2>You Got It!</h2>
                </>
              ) : roundWinner === 'friend' ? (
                <>
                  <div className="result-icon">😅</div>
                  <h2>{friendName || 'Friend'} Was Faster!</h2>
                </>
              ) : (
                <>
                  <div className="result-icon">🤝</div>
                  <h2>It's a Tie!</h2>
                </>
              )}
            </div>
            
            <div className="reaction-times">
              <div className={`time-card ${roundWinner === 'me' ? 'winner' : ''} ${tooEarly ? 'too-early' : ''}`}>
                <span className="time-name">{playerName}</span>
                {tooEarly ? (
                  <span className="time-value early">TOO EARLY!</span>
                ) : (
                  <>
                    <span className="time-value">{myReactionTime}ms</span>
                    <span 
                      className="time-rating"
                      style={{ color: getReactionRating(myReactionTime).color }}
                    >
                      {getReactionRating(myReactionTime).emoji} {getReactionRating(myReactionTime).rating}
                    </span>
                  </>
                )}
              </div>
              
              <div className={`time-card ${roundWinner === 'friend' ? 'winner' : ''} ${friendTooEarly ? 'too-early' : ''}`}>
                <span className="time-name">{friendName || 'Friend'}</span>
                {friendTooEarly ? (
                  <span className="time-value early">TOO EARLY!</span>
                ) : (
                  <>
                    <span className="time-value">{friendReactionTime}ms</span>
                    <span 
                      className="time-rating"
                      style={{ color: getReactionRating(friendReactionTime).color }}
                    >
                      {getReactionRating(friendReactionTime).emoji} {getReactionRating(friendReactionTime).rating}
                    </span>
                  </>
                )}
              </div>
            </div>

            {bestTime && (
              <div className="best-time">
                ⚡ Your best: {bestTime}ms
              </div>
            )}

            <button className="next-btn gothic-btn" onClick={handleNextRound}>
              {round >= maxRounds ? 'Final Results' : 'Next Round →'}
            </button>
          </div>
        )}

        {phase === 'gameover' && (
          <div className="phase-gameover">
            <div className={`final-result ${score.me > score.friend ? 'victory' : score.friend > score.me ? 'defeat' : 'tie'}`}>
              {score.me > score.friend ? (
                <>
                  <div className="trophy-icon">🏆</div>
                  <h2>You Beat Thing!</h2>
                  <p>Your reflexes are supernatural!</p>
                </>
              ) : score.friend > score.me ? (
                <>
                  <div className="trophy-icon">🖐️</div>
                  <h2>{friendName || 'Friend'} Wins!</h2>
                  <p>Thing is impressed with their speed!</p>
                </>
              ) : (
                <>
                  <div className="trophy-icon">🤝</div>
                  <h2>Perfect Tie!</h2>
                  <p>You're evenly matched!</p>
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

            {bestTime && (
              <div className="stats-card">
                <span className="stat-label">Your Best Reaction</span>
                <span className="stat-value">{bestTime}ms</span>
              </div>
            )}

            <div className="gameover-actions">
              <button className="play-again-btn gothic-btn" onClick={() => {
                setPhase('start')
                setRound(1)
                setScore({ me: 0, friend: 0 })
                setStreak(0)
                setBestTime(null)
              }}>
                Rematch Thing!
              </button>
              <button className="back-btn" onClick={endGame}>
                Return to Nevermore
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ThingHandSlap
