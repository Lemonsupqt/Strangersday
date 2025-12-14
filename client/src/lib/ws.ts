import { useEffect, useMemo, useRef, useState } from 'react'
import type { ClientToServer, ServerToClient } from '../types'

type WSStatus = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'ERROR'

export function useGameSocket(url: string) {
  const [status, setStatus] = useState<WSStatus>('DISCONNECTED')
  const [lastError, setLastError] = useState<string | null>(null)
  const [lastMessage, setLastMessage] = useState<ServerToClient | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  const send = useMemo(() => {
    return (msg: ClientToServer) => {
      const ws = wsRef.current
      if (!ws || ws.readyState !== WebSocket.OPEN) return
      ws.send(JSON.stringify(msg))
    }
  }, [])

  useEffect(() => {
    setStatus('CONNECTING')
    setLastError(null)

    const ws = new WebSocket(url)
    wsRef.current = ws

    ws.addEventListener('open', () => setStatus('CONNECTED'))
    ws.addEventListener('error', () => {
      setStatus('ERROR')
      setLastError('Socket error.')
    })
    ws.addEventListener('close', () => {
      setStatus('DISCONNECTED')
    })
    ws.addEventListener('message', (ev) => {
      try {
        const msg = JSON.parse(String(ev.data)) as ServerToClient
        setLastMessage(msg)
      } catch {
        // ignore
      }
    })

    return () => {
      try {
        ws.close()
      } catch {
        // ignore
      }
      wsRef.current = null
    }
  }, [url])

  return { status, lastError, lastMessage, send }
}
