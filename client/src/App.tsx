import { useEffect, useMemo, useState } from 'react'
import './App.css'
import type { AutopsyArtifact, PublicRoomState, Role, ServerToClient } from './types'
import { useGameSocket } from './lib/ws'
import { getOrCreateClientId, getStoredPairId, storePairId } from './lib/id'

function getInitialWsUrl() {
  return (
    localStorage.getItem('veil.wsUrl') ??
    (import.meta as unknown as { env?: Record<string, string | undefined> }).env?.VITE_WS_URL ??
    'ws://localhost:8080'
  )
}

function useNow(intervalMs: number) {
  const [t, setT] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setT(Date.now()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return t
}

export default function App() {
  const now = useNow(250)

  const [wsUrl, setWsUrl] = useState(getInitialWsUrl)
  const { status, lastError, lastMessage, send } = useGameSocket(wsUrl)

  const [name, setName] = useState(() => localStorage.getItem('veil.name') ?? '')
  const [roomCode, setRoomCode] = useState<string>('')
  const [playerId, setPlayerId] = useState<string>('')
  const [pairId, setPairId] = useState<string | undefined>(() => getStoredPairId())
  const [role, setRole] = useState<Role | null>(null)
  const [state, setState] = useState<PublicRoomState | null>(null)
  const [artifact, setArtifact] = useState<AutopsyArtifact | null>(null)
  const [uiError, setUiError] = useState<string | null>(null)

  const [joinCode, setJoinCode] = useState(() => {
    const u = new URL(window.location.href)
    return (u.searchParams.get('room') ?? '').toUpperCase()
  })

  const clientId = useMemo(() => getOrCreateClientId(), [])

  useEffect(() => {
    localStorage.setItem('veil.wsUrl', wsUrl)
  }, [wsUrl])

  useEffect(() => {
    localStorage.setItem('veil.name', name)
  }, [name])

  useEffect(() => {
    if (status !== 'CONNECTED') return
    send({ type: 'hello', clientId, pairId, name: name || undefined })
  }, [status, send, clientId, pairId, name])

  useEffect(() => {
    if (!lastMessage) return
    const msg: ServerToClient = lastMessage
    if (msg.type === 'error') setUiError(msg.message)

    if (msg.type === 'room_created') {
      setRoomCode(msg.roomCode)
      setPlayerId(msg.playerId)
      setPairId(msg.pairId)
      storePairId(msg.pairId)
      setArtifact(null)
    }

    if (msg.type === 'room_joined') {
      setRoomCode(msg.roomCode)
      setPlayerId(msg.playerId)
      setPairId(msg.pairId)
      storePairId(msg.pairId)
      setArtifact(null)
    }

    if (msg.type === 'session_started') {
      setRole(msg.role)
    }

    if (msg.type === 'state') {
      setState(msg.state)
    }

    if (msg.type === 'autopsy') {
      setArtifact(msg.artifact)
    }
  }, [lastMessage])

  const connected = status === 'CONNECTED'

  const stage = state?.stage ?? 'LOBBY'
  const scene = state?.scene
  const myRole = role
  const myComms = myRole && scene ? scene.comms[myRole] : null

  const secondsLeft = scene ? Math.max(0, Math.ceil((scene.endsAt - now) / 1000)) : 0

  const inviteLink = useMemo(() => {
    if (!roomCode) return ''
    const u = new URL(window.location.href)
    u.searchParams.set('room', roomCode)
    return u.toString()
  }, [roomCode])

  function createRoom() {
    setUiError(null)
    if (!connected) return
    if (!name.trim()) {
      setUiError('Write a name. Not a performance. A label.')
      return
    }
    send({ type: 'create_room', name: name.trim() })
  }

  function joinRoom() {
    setUiError(null)
    if (!connected) return
    if (!name.trim()) {
      setUiError('Write a name. Not a performance. A label.')
      return
    }
    if (!joinCode.trim()) {
      setUiError('Room code required.')
      return
    }
    send({ type: 'join_room', roomCode: joinCode.trim().toUpperCase(), name: name.trim() })
  }

  function setReady(ready: boolean) {
    if (!connected) return
    send({ type: 'set_ready', ready })
  }

  function onTap() {
    if (!connected || !scene) return
    send({ type: 'tap', sceneId: scene.id })
  }

  function onPlayCard(cardId: string) {
    if (!connected || !scene) return
    send({ type: 'play_card', sceneId: scene.id, cardId })
  }

  function onFreeText(text: string) {
    if (!connected || !scene) return
    send({ type: 'free_text', sceneId: scene.id, text })
  }

  function onCommit(choiceId: string, value: string) {
    if (!connected || !scene) return
    send({ type: 'commit_choice', sceneId: scene.id, choiceId, value })
  }

  function onLook(targetId: string) {
    if (!connected || !scene) return
    send({ type: 'look', sceneId: scene.id, targetId })
  }

  function onMark(x: number, y: number) {
    if (!connected || !scene) return
    const id = `m_${Math.random().toString(16).slice(2, 9)}`
    send({ type: 'mark', sceneId: scene.id, mark: { id, x, y } })
  }

  return (
    <div className="app">
      <div className="frame">
        <div className="header">
          <div>
            <div className="title">THE VEIL BETWEEN</div>
            <div className="subtitle">
              2-player co-op • constrained speech • invite-only • {connected ? 'connected' : status.toLowerCase()}
            </div>
          </div>
          <div className="small mono">
            {roomCode ? `ROOM ${roomCode}` : ''}
            {playerId ? `  •  YOU ${playerId.slice(0, 6)}` : ''}
          </div>
        </div>

        <div className="grid">
          <div className="panel">
            <div className="h">Connection</div>
            <div className="row">
              <div style={{ flex: 1, minWidth: 200 }}>
                <label>Server URL (WebSocket)</label>
                <input value={wsUrl} onChange={(e) => setWsUrl(e.target.value)} placeholder="wss://your-server.example" />
                <div className="small">GitHub Pages hosts the client only. This points to your realtime server.</div>
              </div>
            </div>

            <div className="hr" />

            <div className="h">Identity</div>
            <label>Your name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Elsie" maxLength={32} />

            {uiError ? (
              <div className="small" style={{ color: 'var(--danger)', marginTop: 8 }}>
                {uiError}
              </div>
            ) : null}
            {lastError ? (
              <div className="small" style={{ color: 'var(--danger)', marginTop: 8 }}>
                {lastError}
              </div>
            ) : null}

            <div className="hr" />

            {stage === 'LOBBY' ? (
              <>
                <div className="h">Room</div>

                <div className="row">
                  <button onClick={createRoom} disabled={!connected}>
                    Create private room
                  </button>
                </div>

                <div style={{ marginTop: 12 }}>
                  <label>Join room code</label>
                  <div className="row">
                    <input
                      className="mono"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      placeholder="ABC123"
                      maxLength={8}
                      style={{ flex: 1 }}
                    />
                    <button onClick={joinRoom} disabled={!connected}>
                      Join
                    </button>
                  </div>
                </div>

                {roomCode ? (
                  <>
                    <div className="hr" />
                    <div className="h">Invite</div>
                    <div className="kv">
                      <div>
                        <div className="mono">{inviteLink}</div>
                        <div className="small">Send this link to your best friend. No strangers.</div>
                      </div>
                      <button
                        onClick={() => {
                          void navigator.clipboard.writeText(inviteLink)
                        }}
                      >
                        Copy
                      </button>
                    </div>

                    <div className="hr" />
                    <div className="h">Players</div>
                    <div className="log">
                      {(state?.players ?? []).map((p) => (
                        <div key={p.id} className="logLine">
                          <span className="mono">{p.name}</span> — <span className="small">{p.ready ? 'ready' : 'not ready'}</span>
                        </div>
                      ))}
                    </div>

                    <div className="hr" />
                    <div className="row">
                      <button onClick={() => setReady(true)} disabled={!connected}>
                        Ready
                      </button>
                      <button className="btnDanger" onClick={() => setReady(false)} disabled={!connected}>
                        Not ready
                      </button>
                    </div>
                    <div className="small" style={{ marginTop: 8 }}>
                      When both of you are ready, roles are assigned and the case begins.
                    </div>
                  </>
                ) : null}
              </>
            ) : null}

            {stage === 'IN_SCENE' && scene && myRole ? (
              <>
                <div className="h">You</div>
                <div className="kv">
                  <div>
                    <div className="mono">{myRole === 'WITNESS' ? 'THE WITNESS' : 'THE DIVER'}</div>
                    <div className="small">
                      {myRole === 'WITNESS'
                        ? 'Clarity. Restraint. You are allowed to be cruel if it is accurate.'
                        : 'Bravery. Endurance. Do not explain yourself to the wall.'}
                    </div>
                  </div>
                  <div className="mono">{String(secondsLeft).padStart(2, '0')}s</div>
                </div>

                <div className="hr" />

                <div className="h">Comms (constrained)</div>
                <div className="row">
                  <button onClick={onTap} disabled={!connected || !myComms || myComms.tapsLeft <= 0}>
                    Tap ({myComms?.tapsLeft ?? 0})
                  </button>
                </div>

                <div style={{ marginTop: 10 }}>
                  <div className="small">Cards ({myComms?.cardsLeft ?? 0} left)</div>
                  <div className="log" style={{ marginTop: 8 }}>
                    {scene.cards.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => onPlayCard(c.id)}
                        disabled={!connected || !myComms || myComms.cardsLeft <= 0}
                        style={{ textAlign: 'left' }}
                      >
                        {c.text}
                      </button>
                    ))}
                  </div>
                </div>

                <FreeText
                  disabled={!connected || !myComms || myComms.freeTextLeft <= 0}
                  remaining={myComms?.freeTextLeft ?? 0}
                  onSend={onFreeText}
                />
              </>
            ) : null}

            {stage === 'AUTOPSY' && artifact && myRole ? (
              <Autopsy artifact={artifact} myRole={myRole} onSubmit={(promptId, text) => send({ type: 'autopsy_response', promptId, text })} />
            ) : null}

            {stage === 'ENDED' ? (
              <>
                <div className="h">Ended</div>
                <div className="small">The room is gone. It will pretend it never existed.</div>
                {artifact ? (
                  <>
                    <div className="hr" />
                    <div className="small">Artifact (copy/paste)</div>
                    <pre className="mono" style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(artifact, null, 2)}</pre>
                  </>
                ) : null}
              </>
            ) : null}
          </div>

          <div className="panel">
            {stage === 'LOBBY' ? (
              <>
                <div className="h">Instructions</div>
                <div className="log">
                  <div className="logLine">Create a room. Invite exactly one person.</div>
                  <div className="logLine">Ready up. Stop talking. Let the constraints do the work.</div>
                  <div className="logLine">This is not a test of reflexes. It is a test of restraint.</div>
                </div>

                <div className="hr" />
                <div className="h">Tone</div>
                <div className="small">
                  Silence is allowed. Dryness is allowed. Tenderness will happen accidentally if you stop trying to manufacture it.
                </div>
              </>
            ) : null}

            {stage === 'IN_SCENE' && scene && myRole ? (
              <>
                <div className="h">Scene {scene.index + 1}</div>
                <div className="kv">
                  <div>
                    <div className="mono">{scene.title}</div>
                    <div className="small">Threat: {scene.threat.toFixed(2)}</div>
                  </div>
                  <div className="small mono">ends in {secondsLeft}s</div>
                </div>

                <div className="hr" />

                <div className="small" style={{ whiteSpace: 'pre-wrap' }}>
                  {myRole === 'WITNESS' ? scene.witnessText : scene.diverText}
                </div>

                <div className="hr" />

                <SceneBoard
                  looks={scene.looks}
                  myRole={myRole}
                  onLook={onLook}
                  onMark={onMark}
                  marks={scene.marks}
                  objects={scene.choices[0]?.options ?? []}
                />

                <div className="hr" />

                {scene.choices.map((choice) => (
                  <Choice
                    key={choice.id}
                    choiceId={choice.id}
                    prompt={choice.prompt}
                    options={choice.options}
                    myRole={myRole}
                    commits={scene.commits}
                    onCommit={onCommit}
                  />
                ))}

                <div className="hr" />

                <div className="h">Afterimage</div>
                <div className="log">
                  {state?.logTail?.length ? (
                    state.logTail.map((l) => (
                      <div key={l.at} className="logLine">
                        {l.text}
                      </div>
                    ))
                  ) : (
                    <div className="logLine">Nothing has been said. That is rarely a mistake.</div>
                  )}
                </div>
              </>
            ) : null}

            {stage === 'AUTOPSY' && artifact ? (
              <>
                <div className="h">The Autopsy</div>
                <div className="small">
                  The case is over. What remains is what you *meant*.
                </div>
                <div className="hr" />
                <div className="small mono">{artifact.signature}</div>
                <div className="hr" />
                <div className="small">Artifact preview</div>
                <pre className="mono" style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(artifact, null, 2)}</pre>
              </>
            ) : null}

            {stage === 'ENDED' ? (
              <>
                <div className="h">The Veil Closes</div>
                <div className="small">You can refresh to start again. It will not feel the same.</div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

function FreeText(props: { disabled: boolean; remaining: number; onSend: (text: string) => void }) {
  const [text, setText] = useState('')
  const trimmed = text.trim()

  return (
    <div style={{ marginTop: 12 }}>
      <div className="small">One sentence ({props.remaining} left). Costs attention.</div>
      <div className="row" style={{ marginTop: 8 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 60))}
          placeholder="60 chars. Make them count."
          disabled={props.disabled}
        />
        <button
          onClick={() => {
            if (!trimmed) return
            props.onSend(trimmed)
            setText('')
          }}
          disabled={props.disabled || !trimmed}
        >
          Send
        </button>
      </div>
    </div>
  )
}

function SceneBoard(props: {
  myRole: Role
  looks: Partial<Record<Role, string>>
  marks: Array<{ by: Role; id: string; x: number; y: number; label?: string }>
  objects: Array<{ id: string; label: string }>
  onLook: (targetId: string) => void
  onMark: (x: number, y: number) => void
}) {
  const focusMine = props.looks[props.myRole]
  const focusTheirs = props.looks[props.myRole === 'WITNESS' ? 'DIVER' : 'WITNESS']

  return (
    <>
      <div
        className="sceneBoard"
        onClick={(e) => {
          const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
          const x = (e.clientX - rect.left) / rect.width
          const y = (e.clientY - rect.top) / rect.height
          props.onMark(x, y)
        }}
        role="button"
        aria-label="Scene board"
      >
        <div className="noise" />

        <Obj
          x={0.17}
          y={0.55}
          label={props.objects[0]?.label ?? 'Left'}
          focus={focusMine === (props.objects[0]?.id ?? 'left') || focusTheirs === (props.objects[0]?.id ?? 'left')}
          onClick={() => props.onLook(props.objects[0]?.id ?? 'left')}
          accent={focusTheirs === (props.objects[0]?.id ?? 'left')}
        />
        <Obj
          x={0.50}
          y={0.42}
          label={props.objects[1]?.label ?? 'Center'}
          focus={focusMine === (props.objects[1]?.id ?? 'center') || focusTheirs === (props.objects[1]?.id ?? 'center')}
          onClick={() => props.onLook(props.objects[1]?.id ?? 'center')}
          accent={focusTheirs === (props.objects[1]?.id ?? 'center')}
        />
        <Obj
          x={0.83}
          y={0.58}
          label={props.objects[2]?.label ?? 'Right'}
          focus={focusMine === (props.objects[2]?.id ?? 'right') || focusTheirs === (props.objects[2]?.id ?? 'right')}
          onClick={() => props.onLook(props.objects[2]?.id ?? 'right')}
          accent={focusTheirs === (props.objects[2]?.id ?? 'right')}
        />

        {props.marks.map((m) => (
          <div
            key={m.id}
            className={`mark ${m.by === 'WITNESS' ? 'markW' : 'markD'}`}
            style={{ left: `${m.x * 100}%`, top: `${m.y * 100}%` }}
            title={m.label ?? ''}
          />
        ))}
      </div>

      <div className="small" style={{ marginTop: 8 }}>
        Click an object to "look". Click anywhere to place a mark. You cannot explain it; you can only insist.
      </div>
    </>
  )
}

function Obj(props: { x: number; y: number; label: string; focus: boolean; accent: boolean; onClick: () => void }) {
  return (
    <div
      className={`obj ${props.focus ? 'objFocus' : ''}`}
      style={{ left: `${props.x * 100}%`, top: `${props.y * 100}%`, transform: 'translate(-50%, -50%)' }}
      onClick={(e) => {
        e.stopPropagation()
        props.onClick()
      }}
      role="button"
      aria-label={props.label}
    >
      <div>
        <div className="mono" style={{ color: props.accent ? 'var(--accent)' : 'rgba(245,245,255,0.78)' }}>
          {props.label}
        </div>
        <div className="small">(presence)</div>
      </div>
    </div>
  )
}

function Choice(props: {
  choiceId: string
  prompt: string
  options: Array<{ id: string; label: string }>
  myRole: Role
  commits: Partial<Record<Role, { choiceId: string; value: string; at: number }>>
  onCommit: (choiceId: string, value: string) => void
}) {
  const myCommit = props.commits[props.myRole]
  const theirCommit = props.commits[props.myRole === 'WITNESS' ? 'DIVER' : 'WITNESS']

  const [selected, setSelected] = useState<string>('')

  useEffect(() => {
    if (myCommit?.choiceId === props.choiceId) setSelected(myCommit.value)
  }, [myCommit, props.choiceId])

  const committedHere = myCommit?.choiceId === props.choiceId

  return (
    <div style={{ marginTop: 12 }}>
      <div className="h">Choice</div>
      <div className="small">{props.prompt}</div>

      <div style={{ marginTop: 10 }} className="log">
        {props.options.map((o) => (
          <label key={o.id} className="kv" style={{ gridTemplateColumns: 'auto 1fr auto', alignItems: 'center' }}>
            <input
              type="radio"
              name={`choice_${props.choiceId}`}
              checked={selected === o.id}
              onChange={() => setSelected(o.id)}
              style={{ width: 18, height: 18 }}
            />
            <span className="mono">{o.label}</span>
            <span className="small">{committedHere && myCommit?.value === o.id ? 'committed' : ''}</span>
          </label>
        ))}
      </div>

      <div className="row" style={{ marginTop: 10 }}>
        <button
          onClick={() => {
            if (!selected) return
            props.onCommit(props.choiceId, selected)
          }}
          disabled={!selected}
        >
          Commit
        </button>
        <div className="small">
          {theirCommit ? 'They have committed something.' : 'They are still deciding.'}
        </div>
      </div>
    </div>
  )
}

function Autopsy(props: { artifact: AutopsyArtifact; myRole: Role; onSubmit: (promptId: string, text: string) => void }) {
  const prompt = props.artifact.prompts.find((p) => p.byRole === props.myRole)
  const [text, setText] = useState(prompt?.text ?? '')

  useEffect(() => {
    const updated = props.artifact.prompts.find((p) => p.byRole === props.myRole)
    if (updated?.text) setText(updated.text)
  }, [props.artifact, props.myRole])

  if (!prompt) return null

  return (
    <>
      <div className="h">Autopsy prompt</div>
      <div className="small">{prompt.prompt}</div>
      <div style={{ marginTop: 10 }}>
        <textarea value={text} onChange={(e) => setText(e.target.value.slice(0, 140))} placeholder="One line. Do not decorate it." />
      </div>
      <div className="row" style={{ marginTop: 10 }}>
        <button
          onClick={() => {
            const t = text.trim()
            if (!t) return
            props.onSubmit(prompt.id, t)
          }}
        >
          Submit
        </button>
        <div className="small">Max 140 chars. The game remembers shape, not volume.</div>
      </div>
    </>
  )
}
