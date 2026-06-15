<script setup lang="ts">
interface ActionButton {
  label: string
  icon: string
  description: string
  action: () => void
  disabled: boolean
  bgClass: string
  hoverClass: string
}

interface Props {
  canGatherWood: boolean
  canGatherStone: boolean
  canHunt: boolean
  canDrink: boolean
  isDesperate: boolean
  desperateSuccessRate: number
  disabled: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  gatherWood: []
  gatherStone: []
  hunt: []
  drink: []
  desperateGamble: []
}>()

const buttons: ActionButton[] = [
  {
    label: '采集木头',
    icon: '🪵',
    description: '获得木材，消耗体力',
    action: () => emit('gatherWood'),
    disabled: false,
    bgClass: 'bg-amber-900/40',
    hoverClass: 'hover:bg-amber-800/60',
  },
  {
    label: '采集石头',
    icon: '🪨',
    description: '获得石头，消耗体力',
    action: () => emit('gatherStone'),
    disabled: false,
    bgClass: 'bg-gray-700/40',
    hoverClass: 'hover:bg-gray-600/60',
  },
  {
    label: '打猎',
    icon: '🏹',
    description: '回复生命，增加饥饿，消耗木材',
    action: () => emit('hunt'),
    disabled: false,
    bgClass: 'bg-red-900/40',
    hoverClass: 'hover:bg-red-800/60',
  },
  {
    label: '喝水',
    icon: '💧',
    description: '减少口渴，消耗木材烧水',
    action: () => emit('drink'),
    disabled: false,
    bgClass: 'bg-blue-900/40',
    hoverClass: 'hover:bg-blue-800/60',
  },
]
</script>

<template>
  <div class="bg-game-card rounded-2xl p-6 border border-game-border shadow-xl">
    <h2 class="text-xl font-bold text-white mb-5 flex items-center gap-2">
      <span>⚡</span>
      <span>行动</span>
    </h2>
    <div class="grid grid-cols-2 gap-3">
      <button
        v-for="(btn, index) in buttons"
        :key="btn.label"
        @click="btn.action"
        :disabled="disabled || (index === 0 ? !canGatherWood : index === 1 ? !canGatherStone : index === 2 ? !canHunt : !canDrink)"
        :class="[
          btn.bgClass,
          'relative p-4 rounded-xl border border-game-border transition-all duration-200',
          'flex flex-col items-center justify-center gap-2 text-center',
          disabled || (index === 0 ? !canGatherWood : index === 1 ? !canGatherStone : index === 2 ? !canHunt : !canDrink)
            ? 'opacity-40 cursor-not-allowed'
            : [btn.hoverClass, 'hover:scale-[1.02] hover:shadow-lg cursor-pointer active:scale-[0.98]'],
        ]"
      >
        <span class="text-3xl">{{ btn.icon }}</span>
        <span class="text-white font-semibold text-sm">{{ btn.label }}</span>
        <span class="text-gray-400 text-xs">{{ btn.description }}</span>
      </button>
    </div>

    <Transition name="desperate">
      <div
        v-if="isDesperate && !disabled"
        class="mt-5 p-4 rounded-xl border-2 border-red-500/60 bg-red-950/40 backdrop-blur-sm animate-pulse-slow"
      >
        <div class="flex items-center gap-2 mb-3">
          <span class="text-2xl">🔥</span>
          <span class="text-red-400 font-bold">危险！孤注一掷已解锁</span>
        </div>
        <p class="text-gray-300 text-xs mb-3">
          你的处境非常危险，可以尝试孤注一掷寻找转机。成功率：
          <span class="text-yellow-400 font-bold">{{ Math.round(desperateSuccessRate * 100) }}%</span>
        </p>
        <button
          @click="emit('desperateGamble')"
          class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-900/50 border border-red-400/30"
        >
          <span class="flex items-center justify-center gap-2">
            <span>🎲</span>
            <span>孤注一掷</span>
            <span>🎲</span>
          </span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.desperate-enter-active,
.desperate-leave-active {
  transition: all 0.4s ease-out;
}

.desperate-enter-from,
.desperate-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

@keyframes pulse-slow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.2);
  }
  50% {
    box-shadow: 0 0 30px rgba(239, 68, 68, 0.4);
  }
}

.animate-pulse-slow {
  animation: pulse-slow 2s ease-in-out infinite;
}
</style>
