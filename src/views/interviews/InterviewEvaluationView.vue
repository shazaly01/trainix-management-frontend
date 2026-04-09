<template>
  <div class="max-w-7xl mx-auto pb-20 animate-fade-in px-4">
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 py-6 border-b border-surface-border sticky top-0 bg-surface-ground z-10 backdrop-blur-sm"
    >
      <div class="flex items-center gap-4">
        <button
          @click="router.back()"
          class="p-2.5 hover:bg-surface-section rounded-xl border border-surface-border transition-all"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
        <div>
          <h1 class="text-2xl font-black text-text-primary">إجراء التقييم الفني للمقابلة</h1>
          <p class="text-sm text-text-muted mt-1 italic">
            جلسة رقم #{{ interviewId }} - المقيّم: {{ masterData.EmpCode }}
          </p>
        </div>
      </div>

      <div class="flex gap-3">
        <AppButton variant="secondary" @click="router.back()">إلغاء</AppButton>
        <AppButton variant="primary" :loading="saving" @click="saveEvaluation">
          حفظ نتائج التقييم النهائي
        </AppButton>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <aside class="lg:col-span-1 space-y-6">
        <div class="bg-surface-section p-6 rounded-2xl border border-surface-border shadow-sm">
          <h3 class="font-bold text-primary mb-4 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            بيانات الوظيفة المستهدفة
          </h3>
          <div class="space-y-4 border-r-2 border-primary/20 pr-4">
            <div>
              <p class="text-[10px] text-text-muted uppercase tracking-widest font-bold">
                المسمى الوظيفي المطلوب
              </p>
              <p class="font-bold text-text-primary text-base">
                {{ masterData.jobRequest?.RequiredMajor || 'وظيفة عامة' }}
              </p>
            </div>
            <div>
              <p class="text-[10px] text-text-muted uppercase tracking-widest font-bold">
                القسم / الإدارة
              </p>
              <p class="font-medium text-text-secondary">
                {{ masterData.jobRequest?.department?.Name || '—' }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-primary/5 p-6 rounded-2xl border border-primary/10 space-y-3">
          <p class="text-xs text-primary font-bold flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            تعليمات التقييم للمقيّم
          </p>
          <ul
            class="text-[11px] text-text-secondary space-y-1.5 list-decimal list-inside pr-1 font-medium"
          >
            <li>يتم التقييم من 100 درجة (شاملة المهارات الشخصية والفنية).</li>
            <li>الدرجة أقل من 60 تعني عدم اجتياز المرشح تلقائياً.</li>
            <li>يجب كتابة انطباع المقيّم بدقة لدعم القرار الإداري اللاحق.</li>
          </ul>
        </div>
      </aside>

      <main class="lg:col-span-2 space-y-6">
        <div
          v-for="candidate in candidatesData"
          :key="candidate.id"
          class="bg-surface-section rounded-2xl border border-surface-border overflow-hidden shadow-sm animate-slide-in"
        >
          <div
            class="p-5 bg-surface-ground/30 border-b border-surface-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-14 h-14 rounded-2xl bg-surface-ground border border-surface-border flex items-center justify-center font-black text-2xl text-primary shadow-inner"
              >
                {{ candidate.applicant_name?.charAt(0) }}
              </div>
              <div>
                <h3 class="text-xl font-black text-text-primary">{{ candidate.applicant_name }}</h3>
                <p
                  class="text-xs text-text-muted font-medium bg-black/5 px-2 py-0.5 rounded inline-block mt-1 font-mono"
                >
                  #{{ candidate.application_id }}
                </p>
              </div>
            </div>

            <div class="flex flex-col sm:flex-end gap-2 text-left w-full sm:w-auto">
              <a
                v-if="candidate.cv_url"
                :href="candidate.cv_url"
                target="_blank"
                class="px-5 py-2.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-primary/20"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                عرض السيرة الذاتية (CV)
              </a>
              <span
                v-else
                class="text-xs text-text-muted italic bg-surface-ground px-4 py-2 rounded-lg border border-surface-border text-center"
              >
                لا يوجد ملف CV مرفق
              </span>

              <div
                class="text-xs text-text-muted font-mono bg-surface-ground px-3 py-1 rounded-full border border-surface-border text-center"
              >
                الموعد: {{ candidate.InterviewTime }}
              </div>
            </div>
          </div>

          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-section">
            <div class="space-y-3">
              <label class="block text-sm font-bold text-text-secondary flex items-center gap-2">
                <svg
                  class="w-4 h-4 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 00-2 2h-2a2 2 0 00-2-2z"
                  />
                </svg>
                الدرجة الفنية النهائية (من 100)
              </label>
              <input
                type="number"
                v-model="candidate.EvaluationScore"
                max="100"
                min="0"
                step="0.5"
                class="w-full bg-surface-ground border border-surface-border rounded-xl px-5 py-4 font-black text-3xl text-center focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all shadow-inner"
                placeholder="0.00"
              />
            </div>

            <div class="space-y-3">
              <label class="block text-sm font-bold text-text-secondary"
                >القرار النهائي للمقابلة</label
              >
              <select
                v-model="candidate.Result"
                class="w-full h-[68px] bg-surface-ground border border-surface-border rounded-xl px-5 py-4 font-bold focus:ring-2 focus:ring-primary focus:border-primary outline-none appearance-none cursor-pointer text-base"
                :class="{
                  'text-success': candidate.Result === 'Accepted',
                  'text-danger': candidate.Result === 'Rejected',
                  'text-warning': candidate.Result === 'Pending',
                }"
              >
                <option value="Pending">🕒 قيد الانتظار (لم يقرر بعد)</option>
                <option value="Accepted">✅ اجتاز المقابلة بنجاح (Accepted)</option>
                <option value="Rejected">❌ لم يوفق في المقابلة (Rejected)</option>
              </select>
            </div>

            <div class="md:col-span-2 space-y-3">
              <label class="block text-sm font-bold text-text-secondary"
                >انطباع المقيّم وملاحظات الأداء (هام للقرار الإداري)</label
              >
              <textarea
                v-model="candidate.Notes"
                rows="4"
                class="w-full bg-surface-ground border border-surface-border rounded-xl px-5 py-4 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none shadow-inner"
                placeholder="اكتب هنا نقاط القوة، الضعف، التوصيات، وأسباب القرار..."
              ></textarea>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInterviewStore } from '@/stores/interviewStore'
import AppButton from '@/components/ui/AppButton.vue'

const route = useRoute()
const router = useRouter()
const interviewStore = useInterviewStore()

const interviewId = route.params.id
const loading = ref(false)
const saving = ref(false)
const masterData = ref({})
const candidatesData = ref([])

onMounted(async () => {
  loading.value = true
  try {
    // 1. جلب بيانات الجلسة (تأكد من تعديل الباك إند لتحميل Documents كما موضح في الأعلى)
    await interviewStore.fetchInterview(interviewId)

    if (interviewStore.currentInterview) {
      masterData.value = interviewStore.currentInterview

      // 2. معالجة وتجهيز بيانات المرشحين
      candidatesData.value = masterData.value.Details.map((d) => {
        // ✅ 🟢 منطق جلب رابط الـ CV من المصفوفة قادمة من الباك إند 🟢
        // نفترض هنا أن لديك نوع مستند اسمه 'CV'
        const applicant = d.application?.applicant
        const cvDocument = applicant?.documents?.find(
          (doc) => doc.DocumentType === 'CV' || doc.name === 'CV',
        )

        return {
          id: d.id,
          application_id: d.application_id,
          applicant_name: applicant ? `${applicant.FirstName} ${applicant.LastName}` : 'مرشح مجهول',
          cv_url: cvDocument?.FileUrl || null, // نفترض وجود FileUrl في الباك إند
          InterviewTime: d.InterviewTime,
          EvaluationScore: d.EvaluationScore || null,
          Result: d.Result || 'Pending',
          Notes: d.Notes || '',
        }
      })
    }
  } catch (error) {
    console.error('فشل تحميل الجلسة:', error)
  } finally {
    loading.value = false
  }
})

const saveEvaluation = async () => {
  saving.value = true
  interviewStore.error = null
  try {
    const payload = {
      ...masterData.value,
      candidates: candidatesData.value,
      Status: 'Completed', // تحديث حالة الجلسة عند حفظ التقييمات
    }
    await interviewStore.updateInterview(interviewId, payload)

    // الانتقال للقائمة عند النجاح
    router.push({ name: 'InterviewsList' })
  } catch (error) {
    console.error('فشل حفظ التقييم:', error)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
.animate-slide-in {
  animation: slideIn 0.3s ease-out forwards;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
