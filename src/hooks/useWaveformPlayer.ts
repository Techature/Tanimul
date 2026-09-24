import { useCallback, useEffect, useRef, useState } from 'react'
import { getAudioContext } from '../lib/audioContext'

const WINDOW_MS = 40
const THRESHOLD_RATIO = 0.3

function analyzeLoudFrames(buffer: AudioBuffer): boolean[] {
  const data = buffer.getChannelData(0)
  const windowSamples = Math.max(1, Math.floor(buffer.sampleRate * (WINDOW_MS / 1000)))
  const rmsValues: number[] = []

  for (let i = 0; i < data.length; i += windowSamples) {
    const end = Math.min(i + windowSamples, data.length)
    let sum = 0
    for (let j = i; j < end; j++) {
      sum += data[j] * data[j]
    }
    rmsValues.push(Math.sqrt(sum / (end - i)))
  }

  const peak = Math.max(...rmsValues, 0.0001)
  const threshold = peak * THRESHOLD_RATIO

  return rmsValues.map((rms) => rms > threshold)
}

export function useWaveformPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoud, setIsLoud] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sourceRef = useRef<AudioBufferSourceNode | null>(null)
  const loudFramesRef = useRef<boolean[]>([])
  const startTimeRef = useRef(0)
  const rafRef = useRef<number>(0)

  const stopSource = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    if (sourceRef.current) {
      try {
        sourceRef.current.stop()
      } catch {
        // already stopped
      }
      sourceRef.current.disconnect()
      sourceRef.current = null
    }
    loudFramesRef.current = []
    setIsPlaying(false)
    setIsLoud(false)
  }, [])

  const tick = useCallback((ctx: AudioContext) => {
    const elapsed = ctx.currentTime - startTimeRef.current
    const frameIndex = Math.floor((elapsed * 1000) / WINDOW_MS)
    const frames = loudFramesRef.current

    if (frameIndex >= 0 && frameIndex < frames.length) {
      setIsLoud(frames[frameIndex])
    }

    rafRef.current = requestAnimationFrame(() => tick(ctx))
  }, [])

  const play = useCallback(
    async (blob: Blob, onEnded?: () => void) => {
      stopSource()
      setError(null)

      try {
        const ctx = await getAudioContext()

        const arrayBuffer = await blob.arrayBuffer()
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0))
        loudFramesRef.current = analyzeLoudFrames(audioBuffer)

        const source = ctx.createBufferSource()
        source.buffer = audioBuffer
        source.connect(ctx.destination)

        sourceRef.current = source

        source.onended = () => {
          cancelAnimationFrame(rafRef.current)
          sourceRef.current = null
          setIsPlaying(false)
          setIsLoud(false)
          onEnded?.()
        }

        startTimeRef.current = ctx.currentTime
        source.start(0)
        setIsPlaying(true)
        setIsLoud(loudFramesRef.current[0] ?? false)
        rafRef.current = requestAnimationFrame(() => tick(ctx))
      } catch (err) {
        console.error('Playback failed:', err)
        setError('Could not play your audio. Please try again.')
        setIsPlaying(false)
      }
    },
    [stopSource, tick],
  )

  useEffect(() => {
    return () => stopSource()
  }, [stopSource])

  return { isPlaying, isLoud, error, play, stop: stopSource }
}
