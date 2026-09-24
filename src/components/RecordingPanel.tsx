import { useRef, useEffect, useState } from 'react'
import { useAudioRecorder } from '../hooks/useAudioRecorder'
import { unlockAudioContext } from '../lib/audioContext'
import { AnimalIcon } from './AnimalIcon'
import { AnimalSpecialLabel } from './AnimalSpecialLabel'
import { BackButton } from './BackButton'
import type { Animal } from '../constants/animals'
import { ACCENT_CLASSES } from '../constants/animals'

interface RecordingPanelProps {
  animal: Animal
  onSubmit: (blob: Blob) => void
  onBack: () => void
}

export function RecordingPanel({ animal, onSubmit, onBack }: RecordingPanelProps) {
  const { state, blob, error, start, stop, reset, setFromFile } = useAudioRecorder()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewAudioRef = useRef<HTMLAudioElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!blob) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(blob)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [blob])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setFromFile(file)
    e.target.value = ''
  }

  const handleRetake = () => {
    previewAudioRef.current?.pause()
    reset()
  }

  const handleSubmit = async () => {
    if (!blob) return
    await unlockAudioContext()
    onSubmit(blob)
  }

  const accentClass = ACCENT_CLASSES[animal.accent]

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-8">
      <BackButton onClick={onBack} />

      <div className="mt-8 text-center">
        <AnimalIcon animal={animal} className="mx-auto h-16 w-16 object-contain" />
        <h2 className="mt-4 text-3xl font-bold text-gray-800">
          How does a {animal.name.toLowerCase()} sound?
        </h2>
        {animal.specialLabel && (
          <AnimalSpecialLabel label={animal.specialLabel} className="mt-2" />
        )}
        <p className="mt-2 text-lg text-gray-600">
          Record your best imitation or upload an audio clip!
        </p>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl bg-red-100 px-4 py-3 text-center text-red-700">
          {error}
        </div>
      )}

      <div className="mt-10 flex flex-col items-center gap-4">
        {state === 'idle' && (
          <>
            <button
              onClick={() => {
                unlockAudioContext()
                start()
              }}
              className="flex h-24 w-24 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition hover:scale-105 hover:bg-red-600 active:scale-95"
              aria-label="Start recording"
            >
              <span className="text-4xl">🎤</span>
            </button>
            <p className="text-lg font-medium text-gray-600">Tap to record</p>

            <div className="mt-4 flex w-full flex-col items-center gap-2">
              <span className="text-sm text-gray-500">or</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
                id="audio-upload"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`flex items-center gap-2 rounded-full border-4 px-6 py-3 text-lg font-semibold text-gray-800 shadow-md transition hover:scale-105 active:scale-95 ${accentClass}`}
              >
                <span className="text-2xl">📁</span>
                Upload audio
              </button>
            </div>
          </>
        )}

        {state === 'recording' && (
          <>
            <button
              onClick={stop}
              className="flex h-24 w-24 animate-pulseRecord items-center justify-center rounded-full bg-red-500 text-white shadow-lg"
              aria-label="Stop recording"
            >
              <span className="text-4xl">⏹</span>
            </button>
            <p className="text-lg font-medium text-red-600">Recording... tap to stop</p>
          </>
        )}

        {state === 'recorded' && blob && previewUrl && (
          <div className="flex w-full flex-col items-center gap-6">
            <div className={`w-full rounded-3xl border-4 p-6 ${accentClass}`}>
              <p className="mb-3 text-center text-lg font-semibold text-gray-700">
                Your sound:
              </p>
              <audio
                ref={previewAudioRef}
                src={previewUrl}
                controls
                className="w-full"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={handleRetake}
                className="rounded-full border-4 border-gray-300 bg-white px-6 py-3 text-lg font-semibold text-gray-700 shadow-md transition hover:scale-105 active:scale-95"
              >
                Retake
              </button>
              <button
                onClick={handleSubmit}
                className="rounded-full border-4 border-emerald-400 bg-pastel-green px-8 py-3 text-lg font-semibold text-gray-800 shadow-md transition hover:scale-105 active:scale-95"
              >
                Submit!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
