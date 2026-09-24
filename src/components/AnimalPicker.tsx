import { ANIMALS, ACCENT_CLASSES } from '../constants/animals'
import type { Animal } from '../constants/animals'
import { AnimalIcon } from './AnimalIcon'
import { AnimalSpecialLabel } from './AnimalSpecialLabel'

interface AnimalPickerProps {
  onSelect: (animal: Animal) => void
}

export function AnimalPicker({ onSelect }: AnimalPickerProps) {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-bold text-gray-800">Tanimul</h1>
        <p className="mt-3 text-xl text-gray-600">
          Pick an animal and make its sound!
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {ANIMALS.map((animal) => (
          <button
            key={animal.id}
            onClick={() => onSelect(animal)}
            className={`flex flex-col items-center gap-2 rounded-3xl border-4 px-4 py-6 shadow-md transition hover:scale-105 hover:shadow-lg active:scale-95 ${ACCENT_CLASSES[animal.accent]}`}
          >
            <AnimalIcon animal={animal} />
            <span className="text-xl font-semibold text-gray-800">{animal.name}</span>
            {animal.specialLabel && (
              <AnimalSpecialLabel label={animal.specialLabel} className="text-center" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
