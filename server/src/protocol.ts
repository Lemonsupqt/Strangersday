export type Role = 'WITNESS' | 'DIVER'

export type ClientToServer =
  | { type: 'hello'; clientId: string; pairId?: string; name?: string }
  | { type: 'create_room'; name: string }
  | { type: 'join_room'; roomCode: string; name: string }
  | { type: 'set_ready'; ready: boolean }
  | { type: 'mark'; sceneId: string; mark: { id: string; x: number; y: number; label?: string } }
  | { type: 'look'; sceneId: string; targetId: string }
  | { type: 'tap'; sceneId: string }
  | { type: 'play_card'; sceneId: string; cardId: string }
  | { type: 'free_text'; sceneId: string; text: string }
  | { type: 'commit_choice'; sceneId: string; choiceId: string; value: string }
  | { type: 'autopsy_response'; promptId: string; text: string }

export type ServerToClient =
  | { type: 'error'; message: string }
  | { type: 'hello_ack'; serverTime: number }
  | { type: 'room_created'; roomCode: string; playerId: string; pairId: string }
  | { type: 'room_joined'; roomCode: string; playerId: string; pairId: string; players: Array<{ id: string; name: string; role?: Role; ready: boolean }> }
  | { type: 'player_update'; players: Array<{ id: string; name: string; role?: Role; ready: boolean }> }
  | { type: 'session_started'; roomCode: string; pairId: string; role: Role }
  | { type: 'state'; state: PublicRoomState }
  | { type: 'autopsy'; artifact: AutopsyArtifact }

export type Card = { id: string; text: string }

export type SceneDefinition = {
  id: string
  title: string
  durationMs: number
  witnessText: string
  diverText: string
  choices: Array<{ id: string; prompt: string; options: Array<{ id: string; label: string }> }>
}

export type SceneState = {
  id: string
  index: number
  title: string
  endsAt: number
  witnessText: string
  diverText: string
  threat: number
  // Shared per-scene budget (forces restraint + coordination).
  comms: { tapsLeft: number; cardsLeft: number; freeTextLeft: number }
  cards: Card[]
  marks: Array<{ by: Role; id: string; x: number; y: number; label?: string }>
  looks: Partial<Record<Role, string>>
  commits: Partial<Record<Role, { choiceId: string; value: string; at: number }>>
  choices: SceneDefinition['choices']
}

export type PublicRoomState = {
  roomCode: string
  stage: 'LOBBY' | 'IN_SCENE' | 'AUTOPSY' | 'ENDED'
  players: Array<{ id: string; name: string; role?: Role; ready: boolean }>
  scene?: SceneState
  logTail: Array<{ at: number; text: string }>
}

export type PairProfile = {
  pairId: string
  createdAt: number
  sessions: number
  styleTag: 'LACONIC' | 'DIRECTIVE' | 'TENDER-CRUEL' | 'UNSET'
  stats: {
    taps: number
    cards: number
    freeText: number
    avgDecisionTimeMs: number
  }
}

export type AutopsyArtifact = {
  pairId: string
  roomCode: string
  endedAt: number
  scenes: Array<{ id: string; title: string; outcomeLine: string }>
  prompts: Array<{ id: string; prompt: string; byRole: Role; text?: string }>
  signature: string
}
