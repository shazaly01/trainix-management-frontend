<template>
  <div class="w-full py-4 px-2">
    <div class="relative flex items-center justify-between w-full">
      <div
        class="absolute left-0 top-5 transform -translate-y-1/2 w-full h-0.5 bg-surface-border z-0"
      ></div>

      <div
        class="absolute left-0 top-5 transform -translate-y-1/2 h-0.5 bg-primary transition-all duration-500 ease-in-out z-0"
        :style="{ width: progressWidth, right: 0, left: 'auto' }"
      ></div>

      <div
        v-for="(step, index) in steps"
        :key="index"
        class="relative z-10 flex flex-col items-center group"
        :style="{ width: `${100 / steps.length}%` }"
      >
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 shadow-sm"
          :class="[
            currentStep > index + 1
              ? 'bg-primary border-primary text-white scale-90'
              : currentStep === index + 1
                ? 'bg-surface-ground border-primary text-primary ring-4 ring-primary/10'
                : 'bg-surface-section border-surface-border text-text-muted',
          ]"
        >
          <svg
            v-if="currentStep > index + 1"
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          <span v-else>{{ index + 1 }}</span>
        </div>

        <div class="absolute top-12 hidden md:block w-max text-center">
          <span
            class="text-xs font-bold transition-colors duration-300"
            :class="currentStep >= index + 1 ? 'text-text-primary' : 'text-text-muted'"
          >
            {{ step }}
          </span>
        </div>

        <div
          v-if="currentStep === index + 1"
          class="md:hidden absolute top-12 text-[10px] font-bold text-primary whitespace-nowrap"
        >
          {{ step }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  steps: {
    type: Array,
    required: true,
  },
  currentStep: {
    type: Number,
    required: true,
  },
})

const progressWidth = computed(() => {
  if (props.currentStep <= 1) return '0%'
  const totalSteps = props.steps.length - 1
  const completedSteps = props.currentStep - 1
  return `${(completedSteps / totalSteps) * 100}%`
})
</script>

<style scoped>
/* إضافة تأثير انتقالي ناعم للدائرة عند التغيير */
.group:hover .rounded-full {
  transform: translateY(-2px);
}
</style>
