import http from 'node:http'
import { WebSocketServer, type WebSocket } from 'ws'
import { nanoid } from 'nanoid'
import {
  type AutopsyArtifact,
  type ClientToServer,
  type PairProfile,
  type PublicRoomState,
  type Role,
  type SceneDefinition,
  type SceneState,
  type ServerToClient,
} from './protocol.js'
import { buildScenes, deriveStyleTag, makeRoomCode, pickCards, pickRoles } from './game.js'

type PlayerConn = {
  id: string
  name: string
  clientId: string
  pairId?: string
  role?: Role
  ready: boolean
  ws: WebSocket
}

type Room = {
  code: string
  pairId: string
  createdAt: number
  stage: 'LOBBY' | 'IN_SCENE' | 'AUTOPSY' | 'ENDED'
  players: PlayerConn[]
  scenes: SceneDefinition[]
  sceneIndex: number
  scene?: SceneState
  log: Array<{ at: number; text: string }>
  autopsy?: {
    artifact: AutopsyArtifact
    responses: Partial<Record<Role, { promptId: string; text: string }>>
  }
  tick?: NodeJS.Timeout
}

const rooms = new Map<string, Room>()
const pairProfiles = new Map<string, PairProfile>()

function now() {
  return Date.now()
}

function safeSend(ws: WebSocket, msg: ServerToClient) {
  if (ws.readyState !== ws.OPEN) return
  ws.send(JSON.stringify(msg))
}

function broadcast(room: Room, msg: ServerToClient) {
  for (const p of room.players) safeSend(p.ws, msg)
}

function publicState(room: Room): PublicRoomState {
  return {
    roomCode: room.code,
    stage: room.stage,
    players: room.players.map((p) => ({
      id: p.id,
      name: p.name,
      ...(p.role ? { role: p.role } : {}),
      ready: p.ready,
    })),
    ...(room.scene ? { scene: room.scene } : {}),
    logTail: room.log.slice(-8),
  }
}

function log(room: Room, text: string) {
  room.log.push({ at: now(), text })
  broadcast(room, { type: 'state', state: publicState(room) })
}

function startTick(room: Room) {
  stopTick(room)
  room.tick = setInterval(() => {
    if (room.stage !== 'IN_SCENE' || !room.scene) return

    const remaining = room.scene.endsAt - now()
    if (remaining <= 0) {
      resolveScene(room, 'timeout')
      return
    }

    // small silence decay
    room.scene.threat = Math.max(0, room.scene.threat - 0.02)

    // send state every second-ish
    if (Math.floor(remaining / 1000) !== Math.floor((remaining + 250) / 1000)) {
      broadcast(room, { type: 'state', state: publicState(room) })
    }
  }, 250)
}

function stopTick(room: Room) {
  if (room.tick) clearInterval(room.tick)
  delete room.tick
}

function ensureRoomHasTwo(room: Room): boolean {
  return room.players.length === 2
}

function beginSession(room: Room) {
  if (!ensureRoomHasTwo(room)) return
  if (!room.players.every((p) => p.ready)) return

  const [r1, r2] = pickRoles()
  room.players[0]!.role = r1
  room.players[1]!.role = r2

  const profile = pairProfiles.get(room.pairId)
  room.scenes = buildScenes(profile)
  room.sceneIndex = 0
  room.stage = 'IN_SCENE'

  for (const p of room.players) {
    safeSend(p.ws, { type: 'session_started', roomCode: room.code, pairId: room.pairId, role: p.role! })
  }

  startScene(room)
  startTick(room)
}

function startScene(room: Room) {
  const def = room.scenes[room.sceneIndex]
  if (!def) {
    beginAutopsy(room)
    return
  }

  const profile = pairProfiles.get(room.pairId)
  room.scene = {
    id: def.id,
    index: room.sceneIndex,
    title: def.title,
    endsAt: now() + def.durationMs,
    witnessText: def.witnessText,
    diverText: def.diverText,
    threat: 0,
    comms: {
      WITNESS: { tapsLeft: 3, cardsLeft: 2, freeTextLeft: 1 },
      DIVER: { tapsLeft: 3, cardsLeft: 2, freeTextLeft: 1 },
    },
    cards: pickCards(profile),
    marks: [],
    looks: {},
    commits: {},
    choices: def.choices,
  }

  log(room, `Scene ${room.sceneIndex + 1}: ${def.title}.`) 
  broadcast(room, { type: 'state', state: publicState(room) })
}

function resolveScene(room: Room, reason: 'both_committed' | 'timeout') {
  if (!room.scene) return

  const scene = room.scene
  const witnessCommit = scene.commits.WITNESS
  const diverCommit = scene.commits.DIVER

  const outcomeBits: string[] = []
  if (reason === 'timeout') outcomeBits.push('Time ran out.')
  if (witnessCommit && diverCommit) outcomeBits.push('You committed together.')
  if (witnessCommit && !diverCommit) outcomeBits.push('The Witness acted alone.')
  if (!witnessCommit && diverCommit) outcomeBits.push('The Diver acted alone.')

  // crude "unsettling" effect: higher threat yields harsher outcome line
  const threat = scene.threat
  if (threat >= 3) outcomeBits.push('The In-Between listened back.')
  else if (threat >= 1.5) outcomeBits.push('The air kept the shape of your words.')
  else outcomeBits.push('Silence held, for once.')

  log(room, outcomeBits.join(' '))

  room.sceneIndex += 1
  delete room.scene

  setTimeout(() => {
    if (room.stage !== 'IN_SCENE') return
    startScene(room)
  }, 650)
}

function beginAutopsy(room: Room) {
  room.stage = 'AUTOPSY'
  stopTick(room)

  const prompts: AutopsyArtifact['prompts'] = [
    { id: 'assumption', prompt: 'What did you assume about them?', byRole: 'WITNESS' },
    { id: 'protect', prompt: 'What did you protect them from?', byRole: 'DIVER' },
  ]

  const artifact: AutopsyArtifact = {
    pairId: room.pairId,
    roomCode: room.code,
    endedAt: now(),
    scenes: room.scenes.map((s) => ({ id: s.id, title: s.title, outcomeLine: 'Recorded.' })),
    prompts,
    signature: `THE VEIL BETWEEN / ${new Date().toISOString().slice(0, 10)}`,
  }

  room.autopsy = { artifact, responses: {} }
  broadcast(room, { type: 'autopsy', artifact })
  broadcast(room, { type: 'state', state: publicState(room) })

  // update pair profile (very light)
  const existing = pairProfiles.get(room.pairId)
  const next: PairProfile = {
    pairId: room.pairId,
    createdAt: existing?.createdAt ?? now(),
    sessions: (existing?.sessions ?? 0) + 1,
    styleTag: deriveStyleTag(existing),
    stats: {
      taps: existing?.stats.taps ?? 0,
      cards: existing?.stats.cards ?? 0,
      freeText: existing?.stats.freeText ?? 0,
      avgDecisionTimeMs: existing?.stats.avgDecisionTimeMs ?? 0,
    },
  }
  pairProfiles.set(room.pairId, next)
}

function handleAutopsy(room: Room, player: PlayerConn, promptId: string, text: string) {
  if (room.stage !== 'AUTOPSY' || !room.autopsy) return
  const role = player.role
  if (!role) return

  // constrain: one line, keep it terse
  const clean = text.trim().slice(0, 140)
  room.autopsy.responses[role] = { promptId, text: clean }

  const prompt = room.autopsy.artifact.prompts.find((p) => p.id === promptId && p.byRole === role)
  if (prompt) prompt.text = clean

  broadcast(room, { type: 'autopsy', artifact: room.autopsy.artifact })

  if (room.autopsy.responses.WITNESS && room.autopsy.responses.DIVER) {
    room.stage = 'ENDED'
    broadcast(room, { type: 'state', state: publicState(room) })
  }
}

function onComms(room: Room, role: Role, kind: 'tap' | 'card' | 'freeText') {
  if (!room.scene) return

  const c = room.scene.comms[role]
  if (!c) return
  if (kind === 'tap') c.tapsLeft = Math.max(0, c.tapsLeft - 1)
  if (kind === 'card') c.cardsLeft = Math.max(0, c.cardsLeft - 1)
  if (kind === 'freeText') c.freeTextLeft = Math.max(0, c.freeTextLeft - 1)

  // speaking increases threat
  const inc = kind === 'freeText' ? 1.1 : kind === 'card' ? 0.6 : 0.35
  room.scene.threat += inc
}

function roomByPlayer(player: PlayerConn): Room | undefined {
  for (const room of rooms.values()) if (room.players.some((p) => p.id === player.id)) return room
  return undefined
}

const server = http.createServer((_req, res) => {
  res.writeHead(200, { 'content-type': 'text/plain' })
  res.end('THE VEIL BETWEEN / realtime server\n')
})

const wss = new WebSocketServer({ server })

wss.on('connection', (ws) => {
  const player: PlayerConn = {
    id: nanoid(10),
    name: 'Anonymous',
    clientId: nanoid(10),
    ready: false,
    ws,
  }

  safeSend(ws, { type: 'hello_ack', serverTime: now() })

  ws.on('message', (data) => {
    let msg: ClientToServer
    try {
      msg = JSON.parse(String(data)) as ClientToServer
    } catch {
      safeSend(ws, { type: 'error', message: 'Malformed message.' })
      return
    }

    const room = roomByPlayer(player)

    switch (msg.type) {
      case 'hello': {
        player.clientId = msg.clientId
        if (msg.pairId) player.pairId = msg.pairId
        if (msg.name) player.name = msg.name.slice(0, 32)
        return
      }

      case 'create_room': {
        if (room) return
        player.name = msg.name.slice(0, 32)

        const code = makeRoomCode()
        const pairId = nanoid(12)
        player.pairId = pairId

        const newRoom: Room = {
          code,
          pairId,
          createdAt: now(),
          stage: 'LOBBY',
          players: [player],
          scenes: [],
          sceneIndex: 0,
          log: [{ at: now(), text: 'A room was created. The air became interested.' }],
        }
        rooms.set(code, newRoom)

        safeSend(ws, { type: 'room_created', roomCode: code, playerId: player.id, pairId })
        safeSend(ws, {
          type: 'room_joined',
          roomCode: code,
          playerId: player.id,
          pairId,
          players: newRoom.players.map((p) => ({ id: p.id, name: p.name, ready: p.ready })),
        })
        broadcast(newRoom, { type: 'state', state: publicState(newRoom) })
        return
      }

      case 'join_room': {
        if (room) return
        const target = rooms.get(msg.roomCode.toUpperCase())
        if (!target) {
          safeSend(ws, { type: 'error', message: 'Room not found.' })
          return
        }
        if (target.players.length >= 2) {
          safeSend(ws, { type: 'error', message: 'Room is full.' })
          return
        }

        player.name = msg.name.slice(0, 32)
        player.pairId = target.pairId
        target.players.push(player)

        broadcast(target, {
          type: 'room_joined',
          roomCode: target.code,
          playerId: player.id,
          pairId: target.pairId,
          players: target.players.map((p) => ({ id: p.id, name: p.name, ready: p.ready })),
        })
        broadcast(target, {
          type: 'player_update',
          players: target.players.map((p) => ({
            id: p.id,
            name: p.name,
            ...(p.role ? { role: p.role } : {}),
            ready: p.ready,
          })),
        })
        log(target, 'The tether tightened. Two presences. One mistake away from tenderness.')
        return
      }

      case 'set_ready': {
        if (!room) return
        player.ready = msg.ready
        broadcast(room, {
          type: 'player_update',
          players: room.players.map((p) => ({
            id: p.id,
            name: p.name,
            ...(p.role ? { role: p.role } : {}),
            ready: p.ready,
          })),
        })
        if (room.stage === 'LOBBY') beginSession(room)
        return
      }

      case 'mark': {
        if (!room?.scene || room.stage !== 'IN_SCENE') return
        if (!player.role) return
        const m = msg.mark
        room.scene.marks.push({
          by: player.role,
          id: m.id,
          x: clamp01(m.x),
          y: clamp01(m.y),
          ...(m.label ? { label: m.label.slice(0, 32) } : {}),
        })
        broadcast(room, { type: 'state', state: publicState(room) })
        return
      }

      case 'look': {
        if (!room?.scene || room.stage !== 'IN_SCENE') return
        if (!player.role) return
        room.scene.looks[player.role] = msg.targetId
        broadcast(room, { type: 'state', state: publicState(room) })
        return
      }

      case 'tap': {
        if (!room?.scene || room.stage !== 'IN_SCENE') return
        if (!player.role) return
        if (room.scene.comms[player.role].tapsLeft <= 0) return
        onComms(room, player.role, 'tap')
        log(room, `${player.role ?? 'Someone'} tapped.`)
        return
      }

      case 'play_card': {
        if (!room?.scene || room.stage !== 'IN_SCENE') return
        if (!player.role) return
        if (room.scene.comms[player.role].cardsLeft <= 0) return
        const card = room.scene.cards.find((c) => c.id === msg.cardId)
        if (!card) return
        onComms(room, player.role, 'card')
        log(room, card.text)
        return
      }

      case 'free_text': {
        if (!room?.scene || room.stage !== 'IN_SCENE') return
        if (!player.role) return
        if (room.scene.comms[player.role].freeTextLeft <= 0) return
        const text = msg.text.trim().slice(0, 60)
        if (!text) return
        onComms(room, player.role, 'freeText')
        log(room, text)
        return
      }

      case 'commit_choice': {
        if (!room?.scene || room.stage !== 'IN_SCENE') return
        if (!player.role) return

        const scene = room.scene
        if (scene.id !== msg.sceneId) return

        const defChoice = scene.choices.find((c) => c.id === msg.choiceId)
        if (!defChoice) return
        if (!defChoice.options.some((o) => o.id === msg.value)) return

        scene.commits[player.role] = { choiceId: msg.choiceId, value: msg.value, at: now() }
        broadcast(room, { type: 'state', state: publicState(room) })

        if (scene.commits.WITNESS && scene.commits.DIVER) resolveScene(room, 'both_committed')
        return
      }

      case 'autopsy_response': {
        if (!room) return
        handleAutopsy(room, player, msg.promptId, msg.text)
        return
      }
    }
  })

  ws.on('close', () => {
    const room = roomByPlayer(player)
    if (!room) return

    room.players = room.players.filter((p) => p.id !== player.id)
    if (room.players.length === 0) {
      stopTick(room)
      rooms.delete(room.code)
      return
    }

    room.stage = 'ENDED'
    log(room, 'The tether snapped. The room pretended not to notice.')
    broadcast(room, { type: 'state', state: publicState(room) })
  })
})

function clamp01(n: number) {
  if (!Number.isFinite(n)) return 0
  return Math.min(1, Math.max(0, n))
}

const PORT = Number(process.env.PORT ?? 8080)
server.listen(PORT, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`[veil] listening on :${PORT}`)
})
