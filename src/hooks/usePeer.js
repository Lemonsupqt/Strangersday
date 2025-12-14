import { useState, useEffect, useCallback, useRef } from 'react'
import Peer from 'peerjs'

const PEER_CONFIG = {
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' },
    ]
  }
}

export const usePeer = () => {
  const [peerId, setPeerId] = useState(null)
  const [connection, setConnection] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const [error, setError] = useState(null)
  const [lastMessage, setLastMessage] = useState(null)
  
  const peerRef = useRef(null)
  const connectionRef = useRef(null)
  const messageHandlersRef = useRef(new Set())

  // Generate a fun room code
  const generateRoomCode = () => {
    const words = ['ELEVEN', 'DEMOGORGON', 'HAWKINS', 'UPSIDE', 'VECNA', 'HOPPER', 'DUSTIN', 'LUCAS', 'MIKE', 'WILL', 'MAX', 'EDDIE']
    const word = words[Math.floor(Math.random() * words.length)]
    const num = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `${word}-${num}`
  }

  // Initialize peer
  useEffect(() => {
    const roomCode = generateRoomCode()
    const peer = new Peer(roomCode, PEER_CONFIG)
    peerRef.current = peer

    peer.on('open', (id) => {
      setPeerId(id)
      setConnectionStatus('waiting')
    })

    peer.on('connection', (conn) => {
      handleConnection(conn)
    })

    peer.on('error', (err) => {
      console.error('Peer error:', err)
      if (err.type === 'unavailable-id') {
        // Try with a new ID
        const newCode = generateRoomCode()
        peerRef.current = new Peer(newCode, PEER_CONFIG)
      } else {
        setError(err.message)
        setConnectionStatus('error')
      }
    })

    peer.on('disconnected', () => {
      setConnectionStatus('disconnected')
      setIsConnected(false)
    })

    return () => {
      if (connectionRef.current) {
        connectionRef.current.close()
      }
      peer.destroy()
    }
  }, [])

  const handleConnection = useCallback((conn) => {
    connectionRef.current = conn
    setConnection(conn)
    setConnectionStatus('connecting')

    conn.on('open', () => {
      setIsConnected(true)
      setConnectionStatus('connected')
      setError(null)
    })

    conn.on('data', (data) => {
      setLastMessage(data)
      messageHandlersRef.current.forEach(handler => handler(data))
    })

    conn.on('close', () => {
      setIsConnected(false)
      setConnectionStatus('disconnected')
      setConnection(null)
      connectionRef.current = null
    })

    conn.on('error', (err) => {
      console.error('Connection error:', err)
      setError(err.message)
    })
  }, [])

  const connectToPeer = useCallback((targetPeerId) => {
    if (!peerRef.current) {
      setError('Peer not initialized')
      return
    }

    setConnectionStatus('connecting')
    const conn = peerRef.current.connect(targetPeerId, { reliable: true })
    handleConnection(conn)
  }, [handleConnection])

  const sendMessage = useCallback((data) => {
    if (connectionRef.current && connectionRef.current.open) {
      connectionRef.current.send(data)
      return true
    }
    return false
  }, [])

  const addMessageHandler = useCallback((handler) => {
    messageHandlersRef.current.add(handler)
    return () => messageHandlersRef.current.delete(handler)
  }, [])

  const disconnect = useCallback(() => {
    if (connectionRef.current) {
      connectionRef.current.close()
    }
    setIsConnected(false)
    setConnectionStatus('waiting')
  }, [])

  return {
    peerId,
    isConnected,
    connectionStatus,
    error,
    lastMessage,
    connectToPeer,
    sendMessage,
    addMessageHandler,
    disconnect
  }
}

export default usePeer
