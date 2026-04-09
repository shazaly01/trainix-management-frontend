<template>
  <div class="min-h-screen bg-surface-ground pb-20">
    <div
      v-if="jobRequestStore.loading"
      class="flex flex-col items-center justify-center py-32 gap-6"
    >
      <div class="relative w-16 h-16">
        <div class="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
        <div
          class="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"
        ></div>
      </div>
      <p class="text-text-muted font-medium animate-pulse">جاري تحميل تفاصيل الوظيفة...</p>
    </div>

    <div v-else-if="jobRequestStore.error" class="max-w-2xl mx-auto mt-20 px-4">
      <div
        class="bg-surface-section rounded-3xl border border-danger/20 p-12 text-center shadow-xl"
      >
        <div
          class="w-24 h-24 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 class="text-2xl font-black text-text-primary mb-3">عذراً، الوظيفة غير متاحة</h1>
        <p class="text-text-muted mb-8 leading-relaxed">{{ jobRequestStore.error }}</p>
        <AppButton href="/careers" variant="primary" class="!px-10">العودة لكافة الوظائف</AppButton>
      </div>
    </div>

    <div v-else-if="currentJob" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      <div
        class="relative overflow-hidden bg-surface-section rounded-3xl border border-surface-border shadow-sm mb-8"
      >
        <div
          class="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"
        ></div>

        <div
          class="relative p-6 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8"
        >
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <span
                class="px-4 py-1.5 bg-primary/10 text-primary text-sm font-bold rounded-full border border-primary/20"
              >
                رقم الطلب: {{ currentJob.RequestNo }}
              </span>
              <span class="px-4 py-1.5 bg-success/10 text-success text-sm font-bold rounded-full">
                توظيف مفتوح
              </span>
            </div>
            <h1 class="text-3xl md:text-4xl font-black text-text-primary tracking-tight">
              {{ currentJob.RequiredMajor }}
            </h1>
            <div class="flex flex-wrap items-center gap-6 text-text-secondary font-medium">
              <div class="flex items-center gap-2">
                <div class="p-1.5 bg-surface-ground rounded-lg">🏢</div>
                <span>{{ currentJob.Department?.Name || 'الإدارة العامة' }}</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="p-1.5 bg-surface-ground rounded-lg">📍</div>
                <span>المقر الرئيسي</span>
              </div>
            </div>
          </div>

          <AppButton
            @click="scrollToForm"
            variant="primary"
            size="lg"
            class="!h-16 !px-12 !text-lg shadow-lg shadow-primary/25 group"
          >
            قدّم الآن
            <svg
              class="w-5 h-5 mr-2 transition-transform group-hover:translate-y-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </AppButton>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <aside class="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
          <div class="bg-surface-section rounded-3xl border border-surface-border p-6 shadow-sm">
            <h2 class="text-xl font-black text-text-primary mb-6 flex items-center gap-2">
              <span class="w-1.5 h-6 bg-primary rounded-full"></span>
              متطلبات الوظيفة
            </h2>

            <div class="space-y-5">
              <div
                class="flex items-start gap-4 p-4 bg-surface-ground rounded-2xl border border-surface-border/50"
              >
                <div class="text-2xl">🎓</div>
                <div>
                  <p class="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">
                    المؤهل المطلوب
                  </p>
                  <p class="font-bold text-text-primary">{{ currentJob.RequiredDegreeLevel }}</p>
                </div>
              </div>

              <div
                class="flex items-start gap-4 p-4 bg-surface-ground rounded-2xl border border-surface-border/50"
              >
                <div class="text-2xl">💼</div>
                <div>
                  <p class="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">
                    سنوات الخبرة
                  </p>
                  <p class="font-bold text-text-primary">
                    {{ currentJob.RequiredYearsOfExperience }} سنوات على الأقل
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-surface-section rounded-3xl border border-surface-border p-6 shadow-sm">
            <h2 class="text-xl font-black text-text-primary mb-4 flex items-center gap-2">
              <span class="w-1.5 h-6 bg-primary rounded-full"></span>
              وصف المهام
            </h2>
            <div
              class="prose prose-sm prose-primary max-w-none text-text-secondary leading-relaxed whitespace-pre-line"
            >
              {{ currentJob.JobDescription || 'لا يوجد وصف تفصيلي متاح لهذه الوظيفة حالياً.' }}
            </div>
          </div>
        </aside>

        <main id="application-form" class="lg:col-span-8">
          <div
            class="bg-surface-section rounded-3xl border border-surface-border p-6 md:p-10 shadow-sm relative overflow-hidden"
          >
            <div class="mb-10 relative z-10">
              <h2 class="text-2xl font-black text-text-primary mb-2">نموذج التقديم الإلكتروني</h2>
              <p class="text-text-muted">يرجى اتباع الخطوات بدقة لضمان معالجة طلبك.</p>
              <div class="mt-6 h-1 w-20 bg-primary/20 rounded-full overflow-hidden">
                <div class="h-full bg-primary w-1/3"></div>
              </div>
            </div>

            <PublicApplicationForm
              :fixed-job-request-id="currentJob.id"
              :fixed-job-title="currentJob.RequiredMajor"
            />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useJobRequestStore } from '@/stores/jobRequestStore'
import AppButton from '@/components/ui/AppButton.vue'
import PublicApplicationForm from '@/views/external-application/ApplicationWizard.vue'

const route = useRoute()
const jobRequestStore = useJobRequestStore()
const currentJob = computed(() => jobRequestStore.currentJobRequest)

onMounted(async () => {
  const slug = route.params.slug
  if (slug) {
    await jobRequestStore.fetchJobRequestBySlug(slug)
  }
})

const scrollToForm = () => {
  const element = document.getElementById('application-form')
  if (element) {
    const offset = 20
    const bodyRect = document.body.getBoundingClientRect().top
    const elementRect = element.getBoundingClientRect().top
    const elementPosition = elementRect - bodyRect
    const offsetPosition = elementPosition - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    })
  }
}
</script>

<style scoped>
/* إضافة تأثيرات بصرية لتحسين التجربة */
.prose {
  color: var(--text-secondary);
}
/* تأكد من أن الـ sticky يعمل بشكل جيد مع الهيدر العلوي للموقع إن وجد */
@media (min-width: 1024px) {
  aside {
    top: 2rem;
    max-height: calc(100vh - 4rem);
    overflow-y: auto;
    scrollbar-width: none; /* إخفاء سكرول بار الجانبي */
  }
  aside::-webkit-scrollbar {
    display: none;
  }
}
</style>
