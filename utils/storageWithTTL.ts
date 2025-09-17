export function storageWithTTL(storage: Storage, ttlMs: number) {
  return {
    setItem(key: string, value: string) {
      const payload = {
        value,
        expiry: Date.now() + ttlMs
      }
      storage.setItem(key, JSON.stringify(payload))
    },
    getItem(key: string) {
      const raw = storage.getItem(key)
      if (!raw) return null

      try {
        const payload = JSON.parse(raw)
        if (Date.now() > payload.expiry) {
          storage.removeItem(key)
          return null
        }
        return payload.value
      } catch {
        return null
      }
    },
    removeItem(key: string) {
      storage.removeItem(key)
    }
  }
}
