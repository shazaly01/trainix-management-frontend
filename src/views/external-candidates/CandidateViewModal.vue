<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-slate-900/80 backdrop-blur-sm p-4"
  >
    <div
      class="relative w-full max-w-4xl bg-surface-ground border border-surface-border rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
    >
      <div
        class="flex justify-between items-center px-8 py-5 border-b border-surface-border/50 bg-surface-section"
      >
        <h3 class="text-xl font-black text-text-primary flex items-center gap-3">
          <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
            />
          </svg>
          تفاصيل طلب المترشح
        </h3>
        <button
          @click="$emit('close')"
          class="text-text-muted hover:text-rose-500 bg-surface-ground hover:bg-rose-500/10 p-2 rounded-xl transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div class="p-8 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
        <div
          class="flex flex-col md:flex-row items-center gap-6 p-6 bg-surface-section border border-surface-border/50 rounded-2xl"
        >
          <div
            class="w-28 h-28 rounded-full border-4 border-surface-ground shadow-lg overflow-hidden flex-shrink-0 bg-slate-800 flex items-center justify-center"
          >
            <img
              v-if="candidate?.image_url"
              :src="candidate.image_url"
              class="w-full h-full object-cover"
              alt="صورة المترشح"
            />
            <svg v-else class="w-12 h-12 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
              />
            </svg>
          </div>
          <div class="text-center md:text-right space-y-2">
            <h2 class="text-2xl font-black text-text-primary">{{ candidate?.Name }}</h2>
            <div class="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span
                class="px-3 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-lg text-sm font-bold font-mono"
              >
                رقم وطني: {{ candidate?.NationalNo || 'غير متوفر' }}
              </span>
              <span
                class="px-3 py-1 rounded-lg text-sm font-bold border"
                :class="
                  candidate?.TrainingType === 'external'
                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    : 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                "
              >
                {{ candidate?.TrainingType === 'external' ? 'تدريب خارجي' : 'تدريب داخلي' }}
              </span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div class="space-y-4">
            <h4 class="text-sm font-black text-text-secondary border-b border-surface-border pb-2">
              المعلومات الشخصية والتواصل
            </h4>

            <div class="grid grid-cols-2 gap-4">
              <div class="bg-surface-section p-3 rounded-xl border border-surface-border/30">
                <p class="text-[10px] font-bold text-text-muted mb-1">تاريخ الميلاد</p>
                <p class="text-sm font-black text-text-primary">
                  {{ candidate?.BirthDate || '---' }}
                  <span v-if="age" class="text-xs text-blue-500">({{ age }} سنة)</span>
                </p>
              </div>
              <div class="bg-surface-section p-3 rounded-xl border border-surface-border/30">
                <p class="text-[10px] font-bold text-text-muted mb-1">المدينة / السكن</p>
                <p class="text-sm font-black text-text-primary">
                  {{ candidate?.Residence || '---' }}
                </p>
              </div>
              <div
                class="bg-surface-section p-3 rounded-xl border border-surface-border/30 col-span-2"
              >
                <p class="text-[10px] font-bold text-text-muted mb-1">رقم الهاتف</p>
                <p class="text-sm font-black text-text-primary font-mono tracking-widest" dir="ltr">
                  {{ candidate?.Phone || '---' }}
                </p>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <h4 class="text-sm font-black text-text-secondary border-b border-surface-border pb-2">
              المؤهل، اللياقة، والمقاسات
            </h4>

            <div class="grid grid-cols-2 gap-4">
              <div
                class="bg-surface-section p-3 rounded-xl border border-surface-border/30 col-span-2"
              >
                <p class="text-[10px] font-bold text-text-muted mb-1">المؤهل العلمي</p>
                <p class="text-sm font-black text-text-primary">
                  {{ candidate?.Qualification || '---' }}
                </p>
              </div>

              <div
                class="bg-surface-section p-3 rounded-xl border border-surface-border/30 flex justify-between items-center"
              >
                <div>
                  <p class="text-[10px] font-bold text-text-muted mb-1">مقاس الزي</p>
                  <p class="text-sm font-black text-text-primary">{{ candidate?.Size || '---' }}</p>
                </div>
                <div
                  class="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-xs font-black text-slate-400 border border-slate-700"
                >
                  {{ candidate?.Size || '-' }}
                </div>
              </div>

              <div
                class="bg-surface-section p-3 rounded-xl border border-surface-border/30 flex justify-between items-center"
              >
                <div>
                  <p class="text-[10px] font-bold text-text-muted mb-1">رقم الحذاء</p>
                  <p class="text-sm font-black text-text-primary">
                    {{ candidate?.ShoeSize || '---' }}
                  </p>
                </div>
                <div
                  class="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-xs font-black text-slate-400 border border-slate-700"
                >
                  {{ candidate?.ShoeSize || '-' }}
                </div>
              </div>

              <div
                class="bg-surface-section p-3 rounded-xl border border-surface-border/30 col-span-2 flex items-center gap-3"
              >
                <p class="text-[10px] font-bold text-text-muted">حالة اللياقة الطبية:</p>
                <span
                  class="px-2.5 py-0.5 text-xs font-black rounded-lg border w-fit uppercase"
                  :class="
                    candidate?.IsFit
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                  "
                >
                  {{ candidate?.IsFit ? 'لائق طبياً' : 'غير لائق' }}
                </span>
              </div>
            </div>
          </div>

          <div class="space-y-4 md:col-span-2">
            <h4 class="text-sm font-black text-text-secondary border-b border-surface-border pb-2">
              بيانات إضافية (جواز السفر / الحساب البنكي)
            </h4>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div class="bg-surface-section p-3 rounded-xl border border-surface-border/30">
                <p class="text-[10px] font-bold text-text-muted mb-1">رقم الجواز</p>
                <p class="text-sm font-black text-text-primary font-mono uppercase">
                  {{ candidate?.PassportNo || '---' }}
                </p>
              </div>
              <div class="bg-surface-section p-3 rounded-xl border border-surface-border/30">
                <p class="text-[10px] font-bold text-text-muted mb-1">تاريخ انتهاء الجواز</p>
                <p class="text-sm font-black text-text-primary">
                  {{ candidate?.PassportExpiry || '---' }}
                </p>
              </div>
              <div class="bg-surface-section p-3 rounded-xl border border-surface-border/30">
                <p class="text-[10px] font-bold text-text-muted mb-1">اسم المصرف</p>
                <p class="text-sm font-black text-text-primary">
                  {{ candidate?.BankName || '---' }}
                </p>
              </div>
              <div class="bg-surface-section p-3 rounded-xl border border-surface-border/30">
                <p class="text-[10px] font-bold text-text-muted mb-1">رقم الحساب</p>
                <p class="text-sm font-black text-text-primary font-mono">
                  {{ candidate?.BankAccountNo || '---' }}
                </p>
              </div>
            </div>
          </div>

          <div class="space-y-4 md:col-span-2" v-if="candidate?.Notes">
            <h4 class="text-sm font-black text-text-secondary border-b border-surface-border pb-2">
              ملاحظات إضافية من المترشح
            </h4>
            <div
              class="bg-amber-500/5 p-4 rounded-xl border border-amber-500/20 text-sm text-amber-500/90 leading-relaxed font-medium italic"
            >
              {{ candidate.Notes }}
            </div>
          </div>
        </div>
      </div>

      <div class="p-6 bg-surface-section border-t border-surface-border/50 flex justify-end gap-3">
        <button
          @click="$emit('close')"
          class="px-6 py-3 bg-surface-ground text-text-primary border border-surface-border hover:bg-surface-border/50 rounded-xl font-bold transition-all"
        >
          إغلاق
        </button>

        <button
          @click="$emit('approve', candidate?.id)"
          class="px-8 py-3 bg-emerald-600 text-white rounded-xl font-black shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="3"
              d="M5 13l4 4L19 7"
            />
          </svg>
          اعتماد المترشح
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  candidate: { type: Object, default: null },
})

defineEmits(['close', 'approve'])

// حساب العمر للعرض في النافذة
const age = computed(() => {
  if (!props.candidate?.BirthDate) return null
  const birth = new Date(props.candidate.BirthDate)
  const today = new Date()
  let calculatedAge = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) calculatedAge--
  return calculatedAge
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #475569;
  border-radius: 20px;
}
</style>
