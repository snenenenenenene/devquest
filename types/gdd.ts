export type DesignElementType = 
  | "gameplay"
  | "narrative"
  | "art"
  | "audio"
  | "ui"
  | "technical"
  | "mechanics"
  | "levels"
  | "characters"
  | "items"
  | "custom"

export interface Tag {
  id: string
  name: string
  color: string
}

export interface Comment {
  id: string
  content: string
  author: string
  createdAt: Date
  mentions: string[] // User IDs
  tags: string[] // Tag IDs
  parentId?: string // For threaded comments
}

export interface Attachment {
  id: string
  name: string
  url: string
  type: "image" | "document" | "link" | "figma"
  createdAt: Date
}

export interface DesignElement {
  id: string
  name: string
  type: string
  description: string
  tags: string[] // Tag IDs
  attachments: Attachment[]
  comments: Comment[]
  linkedElements: string[] // Element IDs
  linkedTasks: string[] // Task IDs
  version: number
  lastModified: Date
  createdAt: Date
  properties: Record<string, any>
  progress: {
    completed: number
    total: number
  }
}

export interface Category {
  id: string
  name: string
  description: string
  icon: string
  color: string
  elements: DesignElement[]
}

export interface GDDTemplate {
  id: string
  name: string
  description: string
  categories: Category[]
  version: string
}

export interface GDDVersion {
  id: string
  version: number
  changes: string[]
  author: string
  timestamp: Date
}

export interface GDD {
  id: string
  name: string
  description: string
  template: GDDTemplate
  categories: Category[]
  elements: DesignElement[]
  tags: Tag[]
  versions: GDDVersion[]
  collaborators: string[] // User IDs
  createdAt: Date
  lastModified: Date
  progress: {
    completed: number
    total: number
  }
}

export const defaultGDDTemplates: GDDTemplate[] = [
  {
    id: "general",
    name: "General Game Template",
    description: "A comprehensive template suitable for any game type",
    version: "1.0.0",
    categories: [
      {
        id: "overview",
        name: "Game Overview",
        description: "High-level game concept and vision",
        icon: "GamepadIcon",
        color: "blue",
        elements: []
      },
      {
        id: "mechanics",
        name: "Core Mechanics",
        description: "Detailed gameplay systems and mechanics",
        icon: "CogIcon",
        color: "green",
        elements: []
      },
      {
        id: "characters",
        name: "Characters",
        description: "Character designs, abilities, and progression",
        icon: "UserIcon",
        color: "purple",
        elements: []
      },
      {
        id: "levels",
        name: "Level Design",
        description: "World, levels, and environment design",
        icon: "MapIcon",
        color: "orange",
        elements: []
      },
      {
        id: "narrative",
        name: "Narrative",
        description: "Story, dialogue, and world-building",
        icon: "BookOpenIcon",
        color: "yellow",
        elements: []
      },
      {
        id: "art",
        name: "Art Direction",
        description: "Visual style, assets, and animation",
        icon: "PaintBrushIcon",
        color: "pink",
        elements: []
      },
      {
        id: "audio",
        name: "Audio Design",
        description: "Music, sound effects, and voice acting",
        icon: "SpeakerWaveIcon",
        color: "red",
        elements: []
      },
      {
        id: "ui",
        name: "UI/UX",
        description: "Interface design and user experience",
        icon: "WindowIcon",
        color: "indigo",
        elements: []
      },
      {
        id: "technical",
        name: "Technical Design",
        description: "Technical requirements and architecture",
        icon: "CodeBracketIcon",
        color: "gray",
        elements: []
      }
    ]
  },
  {
    id: "rpg",
    name: "RPG Game Template",
    description: "Specialized template for RPG game development",
    version: "1.0.0",
    categories: [
      {
        id: "overview",
        name: "Game Overview",
        description: "High-level game concept and vision",
        icon: "GamepadIcon",
        color: "blue",
        elements: []
      },
      {
        id: "characters",
        name: "Characters & Classes",
        description: "Character system, classes, and progression",
        icon: "UserIcon",
        color: "purple",
        elements: []
      },
      {
        id: "combat",
        name: "Combat System",
        description: "Battle mechanics and abilities",
        icon: "SwordIcon",
        color: "red",
        elements: []
      },
      {
        id: "progression",
        name: "Progression Systems",
        description: "Experience, skills, and character development",
        icon: "ChartBarIcon",
        color: "green",
        elements: []
      },
      {
        id: "quests",
        name: "Quest System",
        description: "Mission structure and quest design",
        icon: "MapPinIcon",
        color: "yellow",
        elements: []
      },
      {
        id: "world",
        name: "World Building",
        description: "Setting, lore, and environment design",
        icon: "GlobeIcon",
        color: "orange",
        elements: []
      },
      {
        id: "items",
        name: "Items & Equipment",
        description: "Inventory system and item design",
        icon: "BackpackIcon",
        color: "brown",
        elements: []
      },
      {
        id: "economy",
        name: "Economy & Trading",
        description: "Currency, trading, and economy balance",
        icon: "BanknotesIcon",
        color: "emerald",
        elements: []
      }
    ]
  }
]
