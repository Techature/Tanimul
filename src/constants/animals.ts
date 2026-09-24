export type AccentColor = 'yellow' | 'green' | 'purple'

export interface AnimalFrames {
  normal: string
  loud: string
  normalAlt: string
  loudAlt: string
  watchTitle: string
  playingMessage: string
  /** Scale the loud frame up/down if it looks smaller than normal (e.g. 1.2 = 20% bigger). */
  loudScale?: number
}

export interface Animal {
  id: string
  name: string
  emoji: string
  emojiImage?: string
  accent: AccentColor
  specialLabel?: string
  frames?: AnimalFrames
}

export const ANIMALS: Animal[] = [
  { 
    id: 'elephant', 
    name: 'Elephant', 
    emoji: '🐘', 
    emojiImage: '/assets/Elephant_emoji.png',
    accent: 'yellow',
    specialLabel: "Dad's Special: Colored ✨",
    frames: {
      normal: '/assets/Elephant_normal.png',
      loud: '/assets/Elephant_trumpet.png',
      normalAlt: 'Elephant sitting calmly',
      loudAlt: 'Elephant trumpeting',
      watchTitle: 'Watch your elephant go!',
      playingMessage: 'Listen to your trumpet...',
      loudScale: 1.01,
    },
  },
  { id: 'lion', name: 'Lion', emoji: '🦁', emojiImage: '/assets/Lion_emoji.png', accent: 'green' },
  {
    id: 'dog',
    name: 'Dog',
    emoji: '🐶',
    emojiImage: '/assets/Dog_emoji.png',
    accent: 'purple',
    frames: {
      normal: '/assets/Dog_normal.png',
      loud: '/assets/Dog_bark.png',
      normalAlt: 'Dog sitting calmly',
      loudAlt: 'Dog barking',
      watchTitle: 'Watch your dog go!',
      playingMessage: 'Listen to your bark...',
    },
  },
  {
    id: 'bee',
    name: 'Bee',
    emoji: '🐝',
    emojiImage: '/assets/Bee_emoji.png',
    accent: 'yellow',
    frames: {
      normal: '/assets/Bee_normal.png',
      loud: '/assets/Bee_buzz.png',
      normalAlt: 'Bee flying',
      loudAlt: 'Bee buzzing',
      watchTitle: 'Watch your bee go!',
      playingMessage: 'Listen to your buzz...',
    },
  },
  {
    id: 'cat',
    name: 'Cat',
    emoji: '🐱',
    emojiImage: '/assets/Cat_emoji.png',
    accent: 'green',
    frames: {
      normal: '/assets/Cat_normal.png',
      loud: '/assets/Cat_meow.png',
      normalAlt: 'Cat sitting calmly',
      loudAlt: 'Cat meowing',
      watchTitle: 'Watch your cat go!',
      playingMessage: 'Listen to your meow...',
    },
  },
  {
    id: 'frog',
    name: 'Frog',
    emoji: '🐸',
    emojiImage: '/assets/Frog_emoji.png',
    accent: 'purple',
  },
]

export const ACCENT_CLASSES: Record<AccentColor, string> = {
  yellow: 'bg-pastel-yellow hover:brightness-95 border-amber-300',
  green: 'bg-pastel-green hover:brightness-95 border-emerald-300',
  purple: 'bg-pastel-purple hover:brightness-95 border-violet-300',
}

export function hasAnimation(animal: Animal): boolean {
  return animal.frames !== undefined
}
