import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import usePeer from '../hooks/usePeer'

const GameContext = createContext(null)

export const GameProvider = ({ children }) => {
  const peer = usePeer()
  const [currentGame, setCurrentGame] = useState(null)
  const [playerName, setPlayerName] = useState('')
  const [friendName, setFriendName] = useState('')
  const [gameState, setGameState] = useState({})
  const [scores, setScores] = useState({ me: 0, friend: 0 })

  // Sync game state with friend
  const syncGameState = useCallback((newState) => {
    setGameState(newState)
    peer.sendMessage({
      type: 'GAME_STATE_SYNC',
      payload: newState
    })
  }, [peer])

  // Send game action
  const sendGameAction = useCallback((action) => {
    peer.sendMessage({
      type: 'GAME_ACTION',
      payload: action
    })
  }, [peer])

  // Handle incoming messages
  useEffect(() => {
    const unsubscribe = peer.addMessageHandler((message) => {
      switch (message.type) {
        case 'PLAYER_INFO':
          setFriendName(message.payload.name)
          break
        case 'GAME_START':
          setCurrentGame(message.payload.game)
          setGameState(message.payload.initialState || {})
          break
        case 'GAME_STATE_SYNC':
          setGameState(message.payload)
          break
        case 'GAME_END':
          // Handle game end
          break
        case 'SCORE_UPDATE':
          setScores(prev => ({
            ...prev,
            friend: message.payload.score
          }))
          break
        default:
          // Game-specific messages handled by individual games
          break
      }
    })

    return unsubscribe
  }, [peer])

  // Send player info when connected
  useEffect(() => {
    if (peer.isConnected && playerName) {
      peer.sendMessage({
        type: 'PLAYER_INFO',
        payload: { name: playerName }
      })
    }
  }, [peer.isConnected, playerName, peer])

  const startGame = useCallback((gameName, initialState = {}) => {
    setCurrentGame(gameName)
    setGameState(initialState)
    peer.sendMessage({
      type: 'GAME_START',
      payload: { game: gameName, initialState }
    })
  }, [peer])

  const endGame = useCallback(() => {
    setCurrentGame(null)
    setGameState({})
    peer.sendMessage({
      type: 'GAME_END',
      payload: {}
    })
  }, [peer])

  const updateScore = useCallback((points) => {
    setScores(prev => {
      const newScore = prev.me + points
      peer.sendMessage({
        type: 'SCORE_UPDATE',
        payload: { score: newScore }
      })
      return { ...prev, me: newScore }
    })
  }, [peer])

  const value = {
    ...peer,
    currentGame,
    setCurrentGame,
    playerName,
    setPlayerName,
    friendName,
    gameState,
    setGameState,
    syncGameState,
    sendGameAction,
    scores,
    updateScore,
    startGame,
    endGame
  }

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}

export default GameContext
