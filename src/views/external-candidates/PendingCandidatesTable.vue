<template>
  <div
    class="bg-[#0f172a] rounded-[1.5rem] shadow-2xl border border-slate-800/50 overflow-hidden font-sans"
  >
    <AppTable
      :headers="headers"
      :items="items"
      :isLoading="isLoading"
      class="pending-candidates-table"
    >
      <template #cell-Identity="{ item }">
        <div class="flex items-center gap-4 py-1.5">
          <div
            class="w-11 h-11 rounded-xl overflow-hidden bg-slate-800 border-2 border-slate-700 shadow-sm flex-shrink-0"
          >
            <img v-if="item.image_url" :src="item.image_url" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center text-slate-600">
              <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                />
              </svg>
            </div>
          </div>
          <div class="flex flex-col gap-0.5">
            <span class="text-white font-bold text-[15px] leading-tight">{{ item.Name }}</span>
            <span class="text-sky-400 font-mono text-xs font-black opacity-80"
              >رقم وطني: {{ item.NationalNo || '---' }}</span
            >
          </div>
        </div>
      </template>

      <template #cell-Details="{ item }">
        <div class="flex flex-col gap-1.5">
          <span class="text-slate-100 font-bold text-sm leading-none">{{
            item.Qualification || 'بدون مؤهل'
          }}</span>
          <span class="text-slate-500 text-xs font-medium">{{ item.Residence || '---' }}</span>
        </div>
      </template>

      <template #cell-Contact="{ item }">
        <div class="flex flex-col items-start gap-1.5 py-1">
          <span class="text-white font-bold text-sm font-mono tracking-wide" dir="ltr">{{
            item.Phone
          }}</span>
          <span
            class="px-2.5 py-0.5 text-[10px] font-black rounded-lg border w-fit uppercase"
            :class="
              item.TrainingType === 'external'
                ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
            "
          >
            {{ item.TrainingType === 'external' ? 'تدريب خارجي' : 'تدريب داخلي' }}
          </span>
        </div>
      </template>

      <template #cell-Status="{ item }">
        <span
          class="px-3 py-1.5 text-[10px] font-black rounded-xl border bg-amber-500/10 text-amber-400 border-amber-500/20 uppercase flex items-center gap-2 w-fit"
        >
          <span class="relative flex h-2 w-2">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"
            ></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          قيد المراجعة
        </span>
      </template>

      <template #cell-actions="{ item }">
        <div class="flex items-center gap-2">
          <button
            @click.stop="$emit('view', item)"
            class="w-9 h-9 bg-slate-800 text-slate-400 rounded-xl hover:bg-slate-700 hover:text-white transition-all flex items-center justify-center border border-slate-700/50 shadow-lg"
            title="عرض كل التفاصيل"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>

          <button
            @click.stop="$emit('approve', item)"
            class="px-4 h-9 bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-600/30 rounded-xl text-[11px] font-black transition-all flex items-center gap-1.5 shadow-lg"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M5 13l4 4L19 7"
              />
            </svg>
            اعتماد
          </button>

          <button
            @click.stop="$emit('reject', item.id)"
            class="w-9 h-9 bg-slate-800 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center border border-slate-700/50 shadow-lg"
            title="رفض وحذف"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </template>
    </AppTable>
  </div>
</template>

<script setup>
import AppTable from '@/components/ui/AppTable.vue'

const props = defineProps({
  items: { type: Array, required: true },
  isLoading: { type: Boolean, default: false },
})

defineEmits(['view', 'approve', 'reject'])

const headers = [
  { key: 'Identity', label: 'المتقدم' },
  { key: 'Details', label: 'المؤهل والسكن' },
  { key: 'Contact', label: 'التواصل والنوع' },
  { key: 'Status', label: 'الحالة' },
  { key: 'actions', label: 'الإجراءات', class: 'w-64 text-left' },
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Almarai:wght@400;700;800&display=swap');

:deep(table) {
  font-family: 'Almarai', sans-serif;
  @apply bg-[#0f172a] border-separate border-spacing-0;
}
:deep(th) {
  @apply bg-[#1e293b] text-slate-400 font-black text-[11px] uppercase tracking-wider py-4 border-b border-slate-800 text-right px-6;
}
:deep(td) {
  @apply py-3 px-6 border-b border-slate-800/50 align-middle transition-colors text-slate-300;
}
:deep(tr:hover td) {
  @apply bg-slate-800/40;
}
</style>
