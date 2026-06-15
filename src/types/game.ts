export interface GameState {
  health: number
  hunger: number
  thirst: number
  wood: number
  stone: number
  turn: number
  isGameOver: boolean
  logs: LogEntry[]
}

export interface LogEntry {
  id: number
  text: string
  type: 'action' | 'event' | 'system' | 'good' | 'bad'
  turn: number
}

export interface RandomEvent {
  id: string
  text: string
  type: 'good' | 'bad' | 'neutral'
  effects: {
    health?: number
    hunger?: number
    thirst?: number
    wood?: number
    stone?: number
  }
}

export type ActionType = 'gatherWood' | 'gatherStone' | 'hunt' | 'drink' | 'desperateGamble'

export interface DesperateGambleResult {
  success: boolean
  event: RandomEvent
  effects: ActionEffect
}

export interface StatChange {
  label: string
  icon: string
  before: number
  after: number
  change: number
  color: string
}

export interface GambleResultDisplay {
  show: boolean
  success: boolean
  eventText: string
  successRate: number
  statsBefore: {
    health: number
    hunger: number
    thirst: number
    wood: number
    stone: number
  }
  statsAfter: {
    health: number
    hunger: number
    thirst: number
    wood: number
    stone: number
  }
}

export interface ActionEffect {
  health?: number
  hunger?: number
  thirst?: number
  wood?: number
  stone?: number
}
