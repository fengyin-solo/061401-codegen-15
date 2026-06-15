import type { RandomEvent } from '@/types/game'

export const desperateGambleSuccessEvents: RandomEvent[] = [
  {
    id: 'gamble_find_survivor',
    text: '你遇到了一位友善的幸存者，他分享了大量物资和医疗用品！',
    type: 'good',
    effects: { health: 40, hunger: -30, thirst: -30, wood: 20, stone: 15 },
  },
  {
    id: 'gamble_find_bunker',
    text: '你发现了一个废弃的地下避难所，里面储备充足！',
    type: 'good',
    effects: { health: 25, hunger: -40, thirst: -35, wood: 30, stone: 20 },
  },
  {
    id: 'gamble_healing_spring',
    text: '你找到了传说中的治愈之泉，泉水让你重获新生！',
    type: 'good',
    effects: { health: 60, hunger: -15, thirst: -50, wood: 5, stone: 5 },
  },
  {
    id: 'gamble_rescue_helicopter',
    text: '一架救援直升机发现了你，投下了大量补给物资！',
    type: 'good',
    effects: { health: 30, hunger: -35, thirst: -35, wood: 25, stone: 25 },
  },
  {
    id: 'gamble_treasure_cache',
    text: '你发现了一个探险者留下的宝藏，里面应有尽有！',
    type: 'good',
    effects: { health: 20, hunger: -25, thirst: -25, wood: 40, stone: 35 },
  },
]

export const desperateGambleFailEvents: RandomEvent[] = [
  {
    id: 'gamble_beast_attack',
    text: '你深入荒野时遭遇了凶猛的野兽群，身受重伤！',
    type: 'bad',
    effects: { health: -35, hunger: 20, thirst: 20, wood: -10, stone: -5 },
  },
  {
    id: 'gamble_landslide',
    text: '你遭遇了山体滑坡，被困了很久，物资也损失惨重！',
    type: 'bad',
    effects: { health: -25, hunger: 30, thirst: 30, wood: -20, stone: -15 },
  },
  {
    id: 'gamble_poisonous_fog',
    text: '你误入了毒雾区域，身体受到了严重损伤！',
    type: 'bad',
    effects: { health: -45, hunger: 15, thirst: 25, wood: -5, stone: -5 },
  },
  {
    id: 'gamble_bandits',
    text: '你遇到了一群凶残的土匪，被抢走了所有物资！',
    type: 'bad',
    effects: { health: -20, hunger: 25, thirst: 25, wood: -30, stone: -25 },
  },
  {
    id: 'gamble_storm',
    text: '一场突如其来的暴风雨摧毁了你的营地和物资！',
    type: 'bad',
    effects: { health: -15, hunger: 35, thirst: 20, wood: -35, stone: -20 },
  },
]

export const randomEvents: RandomEvent[] = [
  {
    id: 'beast_attack',
    text: '一只野兽突然袭击了你！',
    type: 'bad',
    effects: { health: -15 },
  },
  {
    id: 'find_berries',
    text: '你发现了一丛野生浆果！',
    type: 'good',
    effects: { hunger: -12 },
  },
  {
    id: 'find_spring',
    text: '你找到了一处清澈的泉水！',
    type: 'good',
    effects: { thirst: -18 },
  },
  {
    id: 'cold_weather',
    text: '天气突然变冷，你消耗了更多体力和木材取暖。',
    type: 'bad',
    effects: { health: -5, wood: -4 },
  },
  {
    id: 'abandoned_camp',
    text: '你发现了一个废弃的营地，找到了一些物资！',
    type: 'good',
    effects: { wood: 8, stone: 5 },
  },
  {
    id: 'trap',
    text: '你不小心踩到了一个陷阱！',
    type: 'bad',
    effects: { health: -10 },
  },
  {
    id: 'food_cache',
    text: '你找到了一个隐藏的食物储藏点！',
    type: 'good',
    effects: { hunger: -20 },
  },
  {
    id: 'rain',
    text: '下起了雨，你收集了一些雨水。',
    type: 'good',
    effects: { thirst: -12 },
  },
  {
    id: 'find_stone_vein',
    text: '你发现了一处石矿脉！',
    type: 'good',
    effects: { stone: 10 },
  },
  {
    id: 'fall',
    text: '你在行走时不小心摔倒了。',
    type: 'bad',
    effects: { health: -6 },
  },
  {
    id: 'sunny',
    text: '今天阳光明媚，你感觉精神焕发。',
    type: 'good',
    effects: { health: 5 },
  },
  {
    id: 'find_dead_tree',
    text: '你发现了一棵枯死的大树。',
    type: 'good',
    effects: { wood: 12 },
  },
  {
    id: 'food_poisoning',
    text: '你吃了不干净的东西，感觉有些不适。',
    type: 'bad',
    effects: { health: -8, hunger: 8 },
  },
  {
    id: 'peaceful_night',
    text: '平静的一天，什么也没有发生。',
    type: 'neutral',
    effects: {},
  },
  {
    id: 'find_cave',
    text: '你发现了一个山洞，里面有一些石头和木材。',
    type: 'good',
    effects: { stone: 6, wood: 4 },
  },
]
