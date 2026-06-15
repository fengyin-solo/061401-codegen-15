<script setup lang="ts">
import { computed } from 'vue'
import type { StatChange } from '@/types/game'

interface Props {
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

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const statConfigs = [
  { key: 'health', label: '生命值', icon: '❤️', isReverse: false },
  { key: 'hunger', label: '饥饿值', icon: '🍖', isReverse: true },
  { key: 'thirst', label: '口渴值', icon: '💧', isReverse: true },
  { key: 'wood', label: '木材', icon: '🪵', isReverse: false },
  { key: 'stone', label: '石头', icon: '🪨', isReverse: false },
]

const statChanges = computed<(StatChange & { badgeClass: string })[]>(() => {
  return statConfigs.map((config) => {
    const key = config.key as keyof typeof props.statsBefore
    const before = props.statsBefore[key]
    const after = props.statsAfter[key]
    const change = after - before

    let color = 'text-gray-400'
    let badgeClass = 'bg-gray-500/20 text-gray-400'
    
    if (change !== 0) {
      const isGoodChange = config.isReverse ? change < 0 : change > 0
      if (isGoodChange) {
        color = 'text-green-400'
        badgeClass = 'bg-green-500/20 text-green-400'
      } else {
        color = 'text-red-400'
        badgeClass = 'bg-red-500/20 text-red-400'
      }
    }

    return {
      label: config.label,
      icon: config.icon,
      before: Math.round(before * 10) / 10,
      after: Math.round(after * 10) / 10,
      change: Math.round(change * 10) / 10,
      color,
      badgeClass,
    }
  })
})

const titleEmoji = computed(() => props.success ? '🎉' : '💥')
const titleText = computed(() => props.success ? '孤注一掷成功！' : '孤注一掷失败！')
const titleColor = computed(() => props.success ? 'text-emerald-400' : 'text-red-400')
const modalBorder = computed(() => props.success ? 'border-emerald-500/40' : 'border-red-500/40')
const modalGlow = computed(() =>
  props.success ? 'shadow-emerald-500/20' : 'shadow-red-500/20'
)
const headerBg = computed(() =>
  props.success ? 'bg-gradient-to-r from-emerald-900/60 to-teal-900/60' : 'bg-gradient-to-r from-red-900/60 to-orange-900/60'
)
const successRateColor = computed(() =>
  props.success ? 'text-emerald-400' : 'text-red-400'
)
const rateBg = computed(() =>
  props.success ? 'bg-emerald-900/30 border-emerald-500/30' : 'bg-red-900/30 border-red-500/30'
)

function formatChange(change: number): string {
  if (change === 0) return '—'
  return change > 0 ? `+${change}` : `${change}`
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div class="absolute inset-0 bg-black/80 backdrop-blur-md"></div>

        <div
          :class="[
            'relative bg-game-card rounded-3xl max-w-lg w-full border shadow-2xl animate-bounce-in overflow-hidden',
            modalBorder,
            modalGlow,
          ]"
        >
          <div :class="['px-8 py-6 text-center', headerBg]">
            <div class="text-7xl mb-3 animate-wobble">{{ titleEmoji }}</div>
            <h2 :class="['text-3xl font-extrabold mb-2', titleColor]">
              {{ titleText }}
            </h2>
            <div
              :class="[
                'inline-block px-4 py-1.5 rounded-full border text-sm font-semibold mb-1',
                rateBg,
                successRateColor,
              ]"
            >
              成功率：{{ Math.round(successRate * 100) }}%
            </div>
          </div>

          <div class="px-8 py-6 space-y-5">
            <div
              :class="[
                'rounded-2xl p-5 border',
                success ? 'bg-emerald-950/20 border-emerald-500/20' : 'bg-red-950/20 border-red-500/20',
              ]"
            >
              <div class="flex items-start gap-3">
                <span class="text-2xl flex-shrink-0">{{ success ? '✨' : '⚠️' }}</span>
                <p :class="['text-base leading-relaxed font-medium', success ? 'text-emerald-200' : 'text-red-200']">
                  {{ eventText }}
                </p>
              </div>
            </div>

            <div class="rounded-2xl border border-gray-700/50 overflow-hidden">
              <div class="bg-gray-800/50 px-5 py-3 flex items-center gap-2 border-b border-gray-700/50">
                <span>📊</span>
                <span class="font-bold text-white">结算明细</span>
              </div>
              <div class="divide-y divide-gray-700/30">
                <div
                  v-for="stat in statChanges"
                  :key="stat.label"
                  class="px-5 py-3 flex items-center justify-between gap-4 hover:bg-gray-800/30 transition-colors"
                >
                  <div class="flex items-center gap-2 flex-shrink-0 w-24">
                    <span class="text-lg">{{ stat.icon }}</span>
                    <span class="text-gray-300 text-sm font-medium">{{ stat.label }}</span>
                  </div>

                  <div class="flex items-center gap-2 flex-1 justify-end">
                    <span class="text-gray-500 text-sm tabular-nums font-mono">{{ stat.before }}</span>
                    <span class="text-gray-600">→</span>
                    <span :class="['font-bold tabular-nums font-mono', stat.color]">{{ stat.after }}</span>
                    <span
                      :class="[
                        'text-xs font-bold px-2 py-0.5 rounded-full tabular-nums min-w-[3.5rem] text-center',
                        stat.badgeClass,
                      ]"
                    >
                      {{ formatChange(stat.change) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              @click="emit('close')"
              :class="[
                'w-full py-4 px-6 text-white font-bold text-lg rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg',
                success
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 hover:shadow-emerald-500/25'
                  : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 hover:shadow-red-500/25',
              ]"
            >
              <span class="flex items-center justify-center gap-2">
                <span>{{ success ? '🌟' : '💪' }}</span>
                <span>{{ success ? '继续生存' : '坚持下去' }}</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.85) translateY(20px);
}

@keyframes bounce-in {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-bounce-in {
  animation: bounce-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes wobble {
  0%, 100% {
    transform: rotate(0deg) scale(1);
  }
  20% {
    transform: rotate(-20deg) scale(1.1);
  }
  40% {
    transform: rotate(15deg) scale(1.15);
  }
  60% {
    transform: rotate(-10deg) scale(1.1);
  }
  80% {
    transform: rotate(5deg) scale(1.05);
  }
}

.animate-wobble {
  animation: wobble 0.8s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}
</style>
