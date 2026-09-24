import { useCallback, useRef, useState } from 'react'

export type RecorderState = 'idle' | 'recording' | 'recorded' | 'error'

function getSupportedMimeType(): string {
  const types = ['audio/webm', 'audio/webm;codecs=opus', 'audio/mp4', 'audio/ogg']
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) return type
  }
  return ''
}

export function useAudioRecorder() {
  const [state, setState] = useState<RecorderState>('idle')
  const [blob, setBlob] = useState<Blob | null>(null)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  const cleanupStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
  }, [])

  const start = useCallback(async () => {
    setError(null)
    setBlob(null)
    chunksRef.current = []

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mimeType = getSupportedMimeType()
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream)

      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = () => {
        const recorded = new Blob(chunksRef.current, {
          type: recorder.mimeType || 'audio/webm',
        })
        setBlob(recorded)
        setState('recorded')
        cleanupStream()
      }

      recorder.start()
      setState('recording')
    } catch {
      setError("Oops! We couldn't access your microphone. Please allow mic access and try again.")
      setState('error')
      cleanupStream()
    }
  }, [cleanupStream])

  const stop = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
  }, [])

  const reset = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    cleanupStream()
    setBlob(null)
    setError(null)
    setState('idle')
    chunksRef.current = []
  }, [cleanupStream])

  const setFromFile = useCallback((file: File) => {
    const isAudio =
      file.type.startsWith('audio/') ||
      /\.(mp3|wav|webm|ogg|m4a|aac)$/i.test(file.name)

    if (!isAudio) {
      setError('Please upload an audio file (like .mp3, .wav, or .webm).')
      setState('error')
      return
    }
    setError(null)
    setBlob(file)
    setState('recorded')
  }, [])

  return { state, blob, error, start, stop, reset, setFromFile }
}
