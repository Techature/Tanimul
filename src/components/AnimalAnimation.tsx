import { useEffect, useState } from 'react'
import { useWaveformPlayer } from '../hooks/useWaveformPlayer'
import type { Animal, AnimalFrames } from '../constants/animals'
import { AnimalSpecialLabel } from './AnimalSpecialLabel'
import { BackButton } from './BackButton'

interface AnimalAnimationProps {
  animal: Animal
  audioBlob: Blob
  onTryAgain: () => void
  onBack: () => void
}

export function AnimalAnimation({ animal, audioBlob, onTryAgain, onBack }: AnimalAnimationProps) {
  const frames = animal.frames as AnimalFrames
  const { isPlaying, isLoud, error, play } = useWaveformPlayer()
  const [hasStarted, setHasStarted] = useState(false)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    let active = true
    setHasStarted(true)
    setFinished(false)
    play(audioBlob, () => {
      if (active) setFinished(true)
    })
    return () => {
      active = false
    }
  }, [audioBlob, play])

  const handleReplay = () => {
    setFinished(false)
    play(audioBlob, () => setFinished(true))
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-8">
      <div className="mb-6 w-full">
        <BackButton onClick={onBack} label="Home" />
      </div>

      <h2 className="mb-2 text-3xl font-bold text-gray-800">{frames.watchTitle}</h2>
      {animal.specialLabel && (
        <AnimalSpecialLabel label={animal.specialLabel} className="mb-2" />
      )}
      <p className="mb-8 text-lg text-gray-600">
        {error
          ? error
          : finished
            ? 'Great job!'
            : isPlaying
              ? frames.playingMessage
              : 'Getting ready...'}
      </p>

      <div
        className={`relative mx-auto h-80 w-72 ${hasStarted && isPlaying ? 'animate-bouncegentle' : ''}`}
        aria-label={`Animated ${animal.name.toLowerCase()}`}
      >
        <img
          src={frames.normal}
          alt={frames.normalAlt}
          className={`absolute inset-0 h-full w-full object-contain object-bottom ${isLoud ? 'hidden' : 'block'}`}
          draggable={false}
        />
        <img
          src={frames.loud}
          alt={frames.loudAlt}
          className={`absolute inset-0 h-full w-full object-contain object-bottom ${isLoud ? 'block' : 'hidden'}`}
          style={{
            transform: frames.loudScale ? `scale(${frames.loudScale})` : undefined,
            transformOrigin: 'bottom center',
          }}
          draggable={false}
        />
      </div>

      {(finished || error) && (
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button
            onClick={handleReplay}
            className="rounded-full border-4 border-violet-300 bg-pastel-purple px-8 py-4 text-xl font-semibold text-gray-800 shadow-md transition hover:scale-105 hover:shadow-lg active:scale-95"
          >
            Play again
          </button>
          <button
            onClick={onTryAgain}
            className="rounded-full border-4 border-gray-300 bg-white px-8 py-4 text-xl font-semibold text-gray-800 shadow-md transition hover:scale-105 hover:shadow-lg active:scale-95"
          >
            Try again!
          </button>
        </div>
      )}
    </div>
  )
}
