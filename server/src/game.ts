import type { Card, PairProfile, Role, SceneDefinition } from './protocol.js'

export function makeRoomCode(): string {
  // avoid ambiguous chars (0/O, 1/I)
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  let out = ''
  for (let i = 0; i < 6; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)]
  return out
}

export function pickRoles(): [Role, Role] {
  return Math.random() < 0.5 ? ['WITNESS', 'DIVER'] : ['DIVER', 'WITNESS']
}

const CARD_LIBRARY: Record<string, Card> = {
  noticed: { id: 'noticed', text: 'I noticed something you will not enjoy.' },
  trustBriefly: { id: 'trustBriefly', text: 'Trust me. Briefly.' },
  continue: { id: 'continue', text: 'I am here. Continue.' },
  stalling: { id: 'stalling', text: "You are stalling. It's almost flattering." },
  dontRomanticize: { id: 'dontRomanticize', text: "Don't romanticize this." },
  cutTether: { id: 'cutTether', text: 'Cut the tether. We can stitch it later.' },
  anchorNow: { id: 'anchorNow', text: 'Anchor it. Before it learns your name.' },
  sayLess: { id: 'sayLess', text: 'Say less. The walls listen.' },
  iWithheld: { id: 'iWithheld', text: 'I withheld something. It was pragmatic.' },
  yourTurn: { id: 'yourTurn', text: 'Your turn to be brave.' },
}

export function pickCards(profile: PairProfile | undefined): Card[] {
  const base = ['continue', 'trustBriefly', 'sayLess', 'noticed', 'dontRomanticize', 'stalling']
  const directive = ['anchorNow', 'yourTurn', 'cutTether']
  const cruel = ['iWithheld']

  let ids = base.slice()
  if (profile?.styleTag === 'DIRECTIVE') ids = [...ids, ...directive]
  if (profile?.styleTag === 'TENDER-CRUEL') ids = [...ids, ...cruel, ...directive]

  // shuffle and take 6
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[ids[i], ids[j]] = [ids[j]!, ids[i]!]
  }

  return ids.slice(0, 6).map((id) => CARD_LIBRARY[id]!).filter(Boolean)
}

export function buildScenes(profile: PairProfile | undefined): SceneDefinition[] {
  const baseDuration = profile?.styleTag === 'LACONIC' ? 4 * 60_000 : 3 * 60_000

  return [
    {
      id: 'scene_01_mismatch',
      title: 'The Object That Doesn\'t Belong',
      durationMs: baseDuration,
      witnessText:
        'The room is polite. Too polite. One object is lying by omission. Your task is not to comfort them. It is to be accurate.',
      diverText:
        'The air tastes like pennies and wet paper. Three objects hum with the same false sincerity. Anchor one. Choose wrong and you will feel it in your teeth.',
      choices: [
        {
          id: 'anchor',
          prompt: 'Which object do you anchor?',
          options: [
            { id: 'musicbox', label: 'Music box' },
            { id: 'polaroid', label: 'Polaroid' },
            { id: 'key', label: 'Iron key' },
          ],
        },
      ],
    },
    {
      id: 'scene_02_listening',
      title: 'The Listening Wall',
      durationMs: 3 * 60_000,
      witnessText:
        'Your words are weight. Each sentence drops through the floor and wakes something patient. If you must speak, be surgical.',
      diverText:
        'There is a wall that copies your breathing half a beat late. It wants you to explain yourself. Do not give it the satisfaction.',
      choices: [
        {
          id: 'approach',
          prompt: 'Do you approach the wall?',
          options: [
            { id: 'approach', label: 'Approach' },
            { id: 'hold', label: 'Hold distance' },
          ],
        },
      ],
    },
    {
      id: 'scene_03_withhold',
      title: 'Austere Mercy',
      durationMs: 3 * 60_000,
      witnessText:
        'You can hide one detail from them. It will feel like kindness. It will also feel like control. Both are true.',
      diverText:
        'Something is missing in your view. The absence has edges. Decide whether to demand clarity or to trust the shape of the silence.',
      choices: [
        {
          id: 'tether',
          prompt: 'How do you handle the tether?',
          options: [
            { id: 'pull_close', label: 'Pull close (risk)' },
            { id: 'cut_clean', label: 'Cut clean (safe)' },
          ],
        },
      ],
    },
  ]
}

export function deriveStyleTag(prev: PairProfile | undefined): PairProfile['styleTag'] {
  if (!prev || prev.sessions < 1) return 'UNSET'

  const { taps, cards, freeText } = prev.stats
  if (freeText <= prev.sessions * 0.5 && cards <= prev.sessions * 2) return 'LACONIC'
  if (cards >= prev.sessions * 3) return 'DIRECTIVE'
  if (freeText >= prev.sessions * 1.25) return 'TENDER-CRUEL'
  return prev.styleTag ?? 'UNSET'
}
