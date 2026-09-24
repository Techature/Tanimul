let sharedContext: AudioContext | null = null

export async function getAudioContext(): Promise<AudioContext> {
  if (!sharedContext || sharedContext.state === 'closed') {
    sharedContext = new AudioContext()
  }
  if (sharedContext.state === 'suspended') {
    await sharedContext.resume()
  }
  return sharedContext
}

/** Call from a user-gesture handler (e.g. Submit click) to unlock browser audio. */
export function unlockAudioContext(): Promise<AudioContext> {
  return getAudioContext()
}
