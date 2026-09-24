import { useState } from 'react'
import { AnimalPicker } from './components/AnimalPicker'
import { RecordingPanel } from './components/RecordingPanel'
import { AnimalAnimation } from './components/AnimalAnimation'
import { Toast } from './components/Toast'
import type { Animal } from './constants/animals'
import { hasAnimation } from './constants/animals'

type Screen = 'picker' | 'recording' | 'animation'

function App() {
  const [screen, setScreen] = useState<Screen>('picker')
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null)
  const [submittedAudio, setSubmittedAudio] = useState<Blob | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const handleAnimalSelect = (animal: Animal) => {
    if (!hasAnimation(animal)) {
      setToast(`The ${animal.name} is coming soon! Choose another animal.`)
      return
    }
    setSelectedAnimal(animal)
    setScreen('recording')
  }

  const handleSubmit = (blob: Blob) => {
    setSubmittedAudio(blob)
    setScreen('animation')
  }

  const handleBackToPicker = () => {
    setScreen('picker')
    setSelectedAnimal(null)
    setSubmittedAudio(null)
  }

  const handleTryAgain = () => {
    setSubmittedAudio(null)
    setScreen('recording')
  }

  return (
    <div className="min-h-screen bg-background font-fredoka">
      {screen === 'picker' && <AnimalPicker onSelect={handleAnimalSelect} />}

      {screen === 'recording' && selectedAnimal && (
        <RecordingPanel
          animal={selectedAnimal}
          onSubmit={handleSubmit}
          onBack={handleBackToPicker}
        />
      )}

      {screen === 'animation' && selectedAnimal && submittedAudio && hasAnimation(selectedAnimal) && (
        <AnimalAnimation
          animal={selectedAnimal}
          audioBlob={submittedAudio}
          onTryAgain={handleTryAgain}
          onBack={handleBackToPicker}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}

export default App
