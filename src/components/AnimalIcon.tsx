import type { Animal } from '../constants/animals'

interface AnimalIconProps {
  animal: Animal
  className?: string
}

export function AnimalIcon({ animal, className = 'h-14 w-14 object-contain' }: AnimalIconProps) {
  if (animal.emojiImage) {
    return (
      <img
        src={animal.emojiImage}
        alt={animal.name}
        className={className}
        draggable={false}
      />
    )
  }

  return (
    <span className="text-5xl" role="img" aria-label={animal.name}>
      {animal.emoji}
    </span>
  )
}
