<template>
  <div
    class="bg-[#0f172a] rounded-[1.5rem] shadow-2xl border border-slate-800/50 overflow-hidden font-sans"
  >
    <AppTable
      :headers="filteredHeaders"
      :items="items"
      :isLoading="isLoading"
      @row-click="$emit('row-click', $event)"
      class="candidates-final-table"
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
              >#{{ item.SequenceNo || '---' }}</span
            >
          </div>
        </div>
      </template>

      <template #cell-Personal="{ item }">
        <div class="flex flex-col gap-1.5">
          <span class="text-slate-100 font-bold text-sm leading-none">{{
            item.Qualification || '---'
          }}</span>
          <div class="flex items-center gap-2">
            <span class="text-sky-300 font-black text-xs"
              >{{ calculateAge(item.BirthDate) }} سنة</span
            >
            <span class="text-slate-500 text-xs font-medium">{{ item.BirthDate }}</span>
          </div>
        </div>
      </template>

      <template #cell-Docs="{ item }">
        <div class="flex flex-col items-start gap-3 py-1">
          <div class="flex items-center gap-3">
            <div
              class="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-black text-slate-500 shrink-0 uppercase"
            >
              ID
            </div>
            <span class="font-mono text-sm font-bold text-slate-200 tracking-wider">{{
              item.NationalNo || '---'
            }}</span>
          </div>
          <div v-if="item.PassportNo" class="flex flex-col gap-2">
            <div class="flex items-center gap-3">
              <div
                class="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-[10px] font-black text-indigo-400 shrink-0"
              >
                P
              </div>
              <span
                class="font-mono text-sm font-black text-indigo-300 uppercase tracking-widest"
                >{{ item.PassportNo }}</span
              >
            </div>
            <div class="flex items-center gap-2 mr-10" v-if="item.PassportExpiry">
              <div class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
              <span class="text-[11px] font-bold text-rose-300"
                >ينتهي: {{ item.PassportExpiry }}</span
              >
            </div>
          </div>
        </div>
      </template>

      <template #cell-ContactLocation="{ item }">
        <div class="flex flex-col items-start gap-3 py-1">
          <div class="flex items-center gap-3">
            <div
              class="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0"
            >
              <svg
                class="w-4 h-4 text-sky-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  stroke-width="2.5"
                />
              </svg>
            </div>
            <span class="text-white font-bold text-sm font-mono tracking-wide" dir="ltr">{{
              item.Phone
            }}</span>
          </div>
          <div class="flex items-center gap-3">
            <div
              class="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0"
            >
              <svg
                class="w-4 h-4 text-emerald-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  stroke-width="2.5"
                />
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2.5" />
              </svg>
            </div>
            <span class="text-slate-400 text-xs font-bold truncate max-w-[140px]">{{
              item.Residence || '---'
            }}</span>
          </div>
        </div>
      </template>

      <template #cell-StatusTypeSize="{ item }">
        <div class="flex flex-col gap-2">
          <span
            class="px-2.5 py-0.5 text-[10px] font-black rounded-lg border w-fit uppercase"
            :class="
              item.IsFit
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            "
          >
            {{ item.IsFit ? 'لائق طبياً' : 'غير لائق' }}
          </span>
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
          <div
            v-if="item.Size"
            class="text-[9px] font-black text-slate-400 bg-slate-800 px-2 py-0.5 border border-slate-700 rounded-lg w-fit"
          >
            SIZE: {{ item.Size }}
          </div>
        </div>
      </template>

      <template #cell-Notes="{ item }">
        <p class="text-slate-400 text-[11px] leading-snug max-w-[160px] line-clamp-2 italic">
          {{ item.Notes || '---' }}
        </p>
      </template>

      <template #cell-actions="{ item }">
        <div class="flex items-center gap-2">
          <button
            v-if="auth.can('candidate.update')"
            @click.stop="$emit('edit', item)"
            class="w-9 h-9 bg-slate-800 text-sky-400 rounded-xl hover:bg-sky-500 hover:text-white transition-all flex items-center justify-center border border-slate-700/50 shadow-lg"
            title="تعديل المترشح"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                stroke-width="2"
              />
            </svg>
          </button>

          <button
            v-if="auth.can('candidate.delete')"
            @click.stop="$emit('delete', item.id)"
            class="w-9 h-9 bg-slate-800 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center border border-slate-700/50 shadow-lg"
            title="حذف المترشح"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                stroke-width="2"
              />
            </svg>
          </button>
        </div>
      </template>
    </AppTable>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import AppTable from '@/components/ui/AppTable.vue'
import { useAuthStore } from '@/stores/authStore' // 👈 استيراد ستور الصلاحيات

const props = defineProps({
  items: { type: Array, required: true },
  isLoading: { type: Boolean, default: false },
})

defineEmits(['edit', 'delete', 'row-click'])

const auth = useAuthStore() // 👈 تهيئة الستور

const calculateAge = (birthDate) => {
  if (!birthDate) return '--'
  const birth = new Date(birthDate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

// 🌟 تصفية الهيدرز: إخفاء عمود الإجراءات إذا لم تكن هناك صلاحيات
const filteredHeaders = computed(() => {
  const baseHeaders = [
    { key: 'Identity', label: 'المترشح' },
    { key: 'Personal', label: 'المؤهل والعمر' },
    { key: 'Docs', label: 'الوثائق الثبوتية' },
    { key: 'ContactLocation', label: 'الاتصال والسكن' },
    { key: 'StatusTypeSize', label: 'الحالة والنوع' },
    { key: 'Notes', label: 'ملاحظات' },
  ]

  // إذا كان المستخدم يملك صلاحية التعديل أو الحذف (أو هو Super Admin)
  if (auth.can('candidate.update') || auth.can('candidate.delete')) {
    baseHeaders.push({ key: 'actions', label: '', class: 'w-24' })
  }

  return baseHeaders
})
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

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: #0f172a;
}
::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 10px;
}
</style>
