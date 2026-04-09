<template>
  <div
    class="bg-surface-section rounded-2xl border border-surface-border overflow-hidden shadow-sm animate-fade-in"
  >
    <div
      class="p-5 bg-surface-ground/40 border-b border-surface-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div>
        <h3 class="text-lg font-black text-text-primary flex items-center gap-2">
          <svg class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          تفاصيل المرشحين المختارين للفرز
        </h3>
        <p class="text-xs text-text-muted mt-1 font-medium">
          مراجعة كفاءات المرشحين وتنسيق مواعيدهم الزمنية (نظام التوظيف الأعمى)
        </p>
      </div>

      <AppButton
        type="button"
        variant="primary"
        size="sm"
        @click="$emit('open-selector')"
        class="shadow-sm px-6"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 ml-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clip-rule="evenodd"
          />
        </svg>
        إضافة مرشحين (فرز أعمى)
      </AppButton>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-right text-sm border-collapse">
        <thead
          class="bg-surface-ground text-text-muted text-[11px] uppercase tracking-widest border-b border-surface-border"
        >
          <tr>
            <th class="px-6 py-4 font-bold text-primary">المعّرف المجهول</th>
            <th class="px-6 py-4 font-bold">المؤهل العلمي</th>
            <th class="px-6 py-4 font-bold">المهارات المهنية والخبرات</th>
            <th class="px-6 py-4 font-bold w-48 text-center">وقت المقابلة المجدول</th>
            <th class="px-6 py-4 font-bold text-center w-20">إجراء</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-surface-border">
          <tr v-if="localCandidates.length === 0">
            <td colspan="5" class="px-6 py-20 text-center">
              <div class="flex flex-col items-center justify-center opacity-30">
                <svg class="h-20 w-20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <p class="text-xl font-black">لم يتم اختيار أي مرشح بعد</p>
                <p class="text-sm">ابدأ بإضافة الكفاءات التي ترغب في مقابلتها</p>
              </div>
            </td>
          </tr>

          <tr
            v-for="(candidate, index) in localCandidates"
            :key="candidate.application_id"
            class="hover:bg-primary/5 transition-all group"
          >
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-xl bg-surface-ground border border-surface-border flex items-center justify-center text-text-muted shadow-sm group-hover:border-primary/30 transition-all"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <div class="font-black text-text-primary">مرشح مجهول الهوية</div>
                  <div
                    class="text-[10px] font-mono bg-black/5 px-1.5 py-0.5 rounded text-text-muted mt-0.5"
                  >
                    الطلب الرقمي: #{{ candidate.application_id }}
                  </div>
                </div>
              </div>
            </td>

            <td class="px-6 py-4">
              <div class="text-sm font-bold text-text-primary">
                {{ candidate.DegreeLevel || 'غير محدد' }}
              </div>
              <div class="text-xs text-text-muted font-medium italic">
                {{ candidate.Major || 'تخصص عام' }}
              </div>
            </td>

            <td class="px-6 py-4">
              <div class="flex flex-wrap gap-1 mb-2">
                <span
                  v-for="skill in candidate.Skills || []"
                  :key="skill.id"
                  class="text-[10px] bg-primary/5 text-primary px-2 py-0.5 rounded border border-primary/10"
                >
                  {{ skill.Name }}
                </span>
                <span v-if="!candidate.Skills?.length" class="text-[10px] text-text-muted italic"
                  >لم تتوفر مهارات</span
                >
              </div>
              <div class="text-[11px] text-text-muted flex items-center gap-1 font-medium">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                خبرة عمل سابقة في {{ candidate.ExperienceCount || 0 }} جهات
              </div>
            </td>

            <td class="px-6 py-4">
              <div class="relative max-w-[160px] mx-auto">
                <input
                  type="time"
                  v-model="candidate.InterviewTime"
                  @change="syncWithParent"
                  class="w-full text-center rounded-xl border border-surface-border bg-surface-ground px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono font-bold text-lg"
                  required
                />
              </div>
            </td>

            <td class="px-6 py-4 text-center">
              <button
                type="button"
                @click="removeCandidate(index)"
                class="p-2.5 text-danger hover:bg-danger/10 rounded-xl transition-all opacity-0 group-hover:opacity-100 border border-transparent hover:border-danger/20"
                title="إزالة من الجلسة"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'

const props = defineProps({
  candidates: {
    type: Array,
    required: true,
    default: () => [],
  },
})

const emit = defineEmits(['update:candidates', 'open-selector'])

// نسخة محلية للتحكم بالبيانات
const localCandidates = ref([])

// مراقبة التغييرات القادمة من الأب لضمان التزامن
watch(
  () => props.candidates,
  (newVal) => {
    // نحدث النسخة المحلية فقط إذا كان هناك تغيير في عدد العناصر
    // لمنع فقدان التركيز (Focus) أثناء كتابة الوقت
    if (newVal.length !== localCandidates.value.length || localCandidates.value.length === 0) {
      localCandidates.value = JSON.parse(JSON.stringify(newVal))
    }
  },
  { immediate: true, deep: true },
)

// مزامنة البيانات مع الشاشة الرئيسية
const syncWithParent = () => {
  emit('update:candidates', localCandidates.value)
}

// إزالة مرشح من القائمة
const removeCandidate = (index) => {
  localCandidates.value.splice(index, 1)
  syncWithParent()
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* تحسين شكل مدخل الوقت في المتصفحات */
input[type='time']::-webkit-calendar-picker-indicator {
  cursor: pointer;
  filter: invert(0.5);
}
</style>
