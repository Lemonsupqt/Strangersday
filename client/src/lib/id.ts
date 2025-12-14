export function getOrCreateClientId(): string {
  const key = 'veil.clientId'
  const existing = localStorage.getItem(key)
  if (existing) return existing

  const id = (crypto?.randomUUID?.() ?? randomFallback())
  localStorage.setItem(key, id)
  return id
}

export function getStoredPairId(): string | undefined {
  return localStorage.getItem('veil.pairId') ?? undefined
}

export function storePairId(pairId: string) {
  localStorage.setItem('veil.pairId', pairId)
}

function randomFallback(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
}
