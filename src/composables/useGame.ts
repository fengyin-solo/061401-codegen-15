import { ref, computed, watch } from 'vue'
import type { GameState, LogEntry, RandomEvent, ActionType, ActionEffect, DesperateGambleResult, GambleResultDisplay } from '@/types/game'
import { randomEvents, desperateGambleSuccessEvents, desperateGambleFailEvents } from '@/data/events'

const STORAGE_KEY_HIGH_SCORE = 'survival_game_high_score'
const MAX_STAT = 100

const actionEffects: Record<ActionType, ActionEffect> = {
  gatherWood: {
    health: -5, hunger: 5, thirst: 3, wood: 10, stone: 0 },
  gatherStone: {
    health: -8, hunger: 6, thirst: 4, wood: 0, stone: 8 },
  hunt: {
    health: 15, hunger: -20, thirst: 5, wood: -5, stone: 0 },
  drink: {
    health: 0, hunger: 2, thirst: -25, wood: -3, stone: 0 },
}

const actionNames: Record<ActionType, string> = {
  gatherWood: '采集木头',
  gatherStone: '采集石头',
  hunt: '打猎',
  drink: '喝水',
  desperateGamble: '孤注一掷',
}

const DESPERATE_GAMBLE_THRESHOLD = 20
const DESPERATE_GAMBLE_BASE_SUCCESS_RATE = 0.4

export function useGame() {
  const state = ref<GameState>({
    health: 80,
    hunger: 30,
    thirst: 30,
    wood: 10,
    stone: 5,
    turn: 0,
    isGameOver: false,
    logs: [],
  })

  const highScore = ref<number>(0)
  let logIdCounter = 0

  const gambleResult = ref<GambleResultDisplay>({
    show: false,
    success: false,
    eventText: '',
    successRate: 0,
    statsBefore: { health: 0, hunger: 0, thirst: 0, wood: 0, stone: 0 },
    statsAfter: { health: 0, hunger: 0, thirst: 0, wood: 0, stone: 0 },
  })

  const canAct = computed(() => !state.value.isGameOver && !gambleResult.value.show)

  const isDesperate = computed(() => {
    if (state.value.isGameOver) return false
    const healthLow = state.value.health <= DESPERATE_GAMBLE_THRESHOLD
    const resourcesLow = state.value.wood + state.value.stone <= DESPERATE_GAMBLE_THRESHOLD
    const statsCritical = state.value.hunger >= MAX_STAT - DESPERATE_GAMBLE_THRESHOLD || state.value.thirst >= MAX_STAT - DESPERATE_GAMBLE_THRESHOLD
    return healthLow || resourcesLow || statsCritical
  })

  const desperateGambleSuccessRate = computed(() => {
    let rate = DESPERATE_GAMBLE_BASE_SUCCESS_RATE
    if (state.value.health <= 10) rate += 0.15
    if (state.value.hunger >= 90 || state.value.thirst >= 90) rate += 0.1
    return Math.min(0.75, rate)
  })

  function loadHighScore() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HIGH_SCORE)
      if (saved) {
        highScore.value = parseInt(saved, 10) || 0
      }
    } catch (e) {
      highScore.value = 0
    }
  }

  function saveHighScore() {
    if (state.value.turn > highScore.value) {
      highScore.value = state.value.turn
      try {
        localStorage.setItem(STORAGE_KEY_HIGH_SCORE, String(highScore.value))
      } catch (e) {
        // ignore
      }
    }
  }

  function addLog(text: string, type: LogEntry['type'] = 'action') {
    state.value.logs.unshift({
      id: ++logIdCounter,
      text,
      type,
      turn: state.value.turn,
    })
    if (state.value.logs.length > 50) {
      state.value.logs.pop()
    }
  }

  function clampStat(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value))
  }

  function applyEffects(effects: ActionEffect) {
    if (effects.health !== undefined) {
      state.value.health = clampStat(state.value.health + effects.health, 0, MAX_STAT)
    }
    if (effects.hunger !== undefined) {
      state.value.hunger = clampStat(state.value.hunger + effects.hunger, 0, MAX_STAT)
    }
    if (effects.thirst !== undefined) {
      state.value.thirst = clampStat(state.value.thirst + effects.thirst, 0, MAX_STAT)
    }
    if (effects.wood !== undefined) {
      state.value.wood = Math.max(0, state.value.wood + effects.wood)
    }
    if (effects.stone !== undefined) {
      state.value.stone = Math.max(0, state.value.stone + effects.stone)
    }
  }

  function getRandomEvent(): RandomEvent {
    const index = Math.floor(Math.random() * randomEvents.length)
    return randomEvents[index]
  }

  function checkGameOver() {
    if (state.value.health <= 0 || state.value.hunger >= MAX_STAT || state.value.thirst >= MAX_STAT) {
      state.value.isGameOver = true
      saveHighScore()
      addLog('你没能在荒野中生存下来...', 'system')
    }
  }

  function canPerformAction(action: ActionType): boolean {
    if (state.value.isGameOver) return false
    const effects = actionEffects[action]
    if (effects.wood !== undefined && state.value.wood + effects.wood < 0) {
      return false
    }
    if (effects.stone !== undefined && state.value.stone + effects.stone < 0) {
      return false
    }
    return true
  }

  function performAction(action: ActionType) {
    if (!canPerformAction(action)) return

    const effects = actionEffects[action]
    applyEffects(effects)
    state.value.turn++

    addLog(`第 ${state.value.turn} 回合：${actionNames[action]}`, 'action')

    const event = getRandomEvent()
    applyEffects(event.effects)

    const eventLogType = event.type === 'good' ? 'good' : event.type === 'bad' ? 'bad' : 'event'
    addLog(event.text, eventLogType)

    checkGameOver()
  }

  function gatherWood() {
    performAction('gatherWood')
  }

  function gatherStone() {
    performAction('gatherStone')
  }

  function hunt() {
    performAction('hunt')
  }

  function drink() {
    performAction('drink')
  }

  function performDesperateGamble(): DesperateGambleResult {
    if (!isDesperate.value || state.value.isGameOver || gambleResult.value.show) {
      throw new Error('不满足孤注一掷条件')
    }

    const statsBefore = {
      health: state.value.health,
      hunger: state.value.hunger,
      thirst: state.value.thirst,
      wood: state.value.wood,
      stone: state.value.stone,
    }

    const currentSuccessRate = desperateGambleSuccessRate.value
    const success = Math.random() < currentSuccessRate
    const eventPool = success ? desperateGambleSuccessEvents : desperateGambleFailEvents
    const index = Math.floor(Math.random() * eventPool.length)
    const event = eventPool[index]

    state.value.turn++

    addLog(`第 ${state.value.turn} 回合：${success ? '孤注一掷成功！' : '孤注一掷失败！'}`, success ? 'good' : 'bad')
    addLog(event.text, success ? 'good' : 'bad')

    applyEffects(event.effects)

    checkGameOver()

    gambleResult.value = {
      show: true,
      success,
      eventText: event.text,
      successRate: currentSuccessRate,
      statsBefore,
      statsAfter: {
        health: state.value.health,
        hunger: state.value.hunger,
        thirst: state.value.thirst,
        wood: state.value.wood,
        stone: state.value.stone,
      },
    }

    return {
      success,
      event,
      effects: event.effects,
    }
  }

  function desperateGamble() {
    performDesperateGamble()
  }

  function closeGambleResult() {
    gambleResult.value.show = false
  }

  function restart() {
    state.value = {
      health: 80,
      hunger: 30,
      thirst: 30,
      wood: 10,
      stone: 5,
      turn: 0,
      isGameOver: false,
      logs: [],
    }
    gambleResult.value = {
      show: false,
      success: false,
      eventText: '',
      successRate: 0,
      statsBefore: { health: 0, hunger: 0, thirst: 0, wood: 0, stone: 0 },
      statsAfter: { health: 0, hunger: 0, thirst: 0, wood: 0, stone: 0 },
    }
    logIdCounter = 0
    addLog('你醒来发现自己身处荒野中，需要想办法生存下去...', 'system')
  }

  loadHighScore()
  addLog('你醒来发现自己身处荒野中，需要想办法生存下去...', 'system')

  return {
    state,
    highScore,
    canAct,
    canPerformAction,
    isDesperate,
    desperateGambleSuccessRate,
    gambleResult,
    gatherWood,
    gatherStone,
    hunt,
    drink,
    desperateGamble,
    closeGambleResult,
    restart,
  }
}
