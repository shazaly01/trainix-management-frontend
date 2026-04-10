<template>
  <div class="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans pb-20" dir="rtl">
    <div v-if="loading" class="min-h-[80vh] flex flex-col items-center justify-center gap-5">
      <div class="relative w-20 h-20">
        <div class="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
        <div
          class="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"
        ></div>
      </div>
      <p class="text-blue-600 font-black tracking-wide animate-pulse">
        جاري تجهيز بوابة التدريب...
      </p>
    </div>

    <div
      v-else-if="currentJob"
      class="max-w-5xl mx-auto px-4 sm:px-6 pt-12 animate-in fade-in slide-in-from-bottom-4 duration-700"
    >
      <header
        class="bg-slate-300 rounded-[2.5rem] p-8 md:p-12 shadow-md border border-slate-400 mb-10 relative overflow-hidden"
      >
        <div
          class="absolute -top-40 -right-40 w-96 h-96 bg-blue-50/70 rounded-full blur-3xl pointer-events-none"
        ></div>
        <div
          class="absolute -bottom-20 -left-20 w-72 h-72 bg-emerald-50/50 rounded-full blur-3xl pointer-events-none"
        ></div>

        <div
          class="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10"
        >
          <div class="space-y-6 flex-1">
            <div class="flex items-center gap-3">
              <span
                class="bg-blue-600 text-white text-[10px] font-black uppercase px-4 py-2 rounded-xl tracking-widest shadow-md shadow-blue-200"
              >
                برنامج تدريبي
              </span>
              <span
                class="text-slate-400 font-mono text-sm font-bold flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1 border border-slate-200/50"
              >
                <svg
                  class="w-4 h-4 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                  />
                </svg>
                <span>{{ currentJob.RequestNo }}</span>
              </span>
            </div>

            <h1
              class="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-l from-slate-950 via-blue-950 to-slate-900 tracking-tight leading-tight pb-1"
            >
              {{ currentJob.RequiredMajor }}
            </h1>
          </div>

          <div
            class="hidden lg:flex shrink-0 w-36 h-36 bg-white border border-slate-100 rounded-[2.5rem] items-center justify-center text-6xl shadow-xl shadow-blue-900/5 transform rotate-3 hover:rotate-6 hover:scale-105 transition-all duration-500 pointer-events-none"
          >
            🎓
          </div>
        </div>

        <div
          class="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 pt-8 border-t border-slate-100"
        >
          <div
            class="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 transition-colors group cursor-default hover:shadow-md"
          >
            <div
              class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-2xl shrink-0"
            >
              🏢
            </div>
            <div>
              <p class="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1.5">
                الجهة المنظمة
              </p>
              <p class="text-sm font-bold text-slate-900 truncate">
                {{ currentJob.Department?.Name || 'الإدارة العامة' }}
              </p>
            </div>
          </div>

          <div
            class="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-emerald-200 transition-colors group cursor-default hover:shadow-md"
          >
            <div
              class="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 text-2xl shrink-0"
            >
              📍
            </div>
            <div>
              <p class="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1.5">
                موقع التدريب
              </p>
              <p class="text-sm font-bold text-slate-900 truncate">المقر الرئيسي</p>
            </div>
          </div>

          <div
            class="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-200 transition-colors group cursor-default hover:shadow-md"
          >
            <div
              class="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-2xl shrink-0"
            >
              📜
            </div>
            <div>
              <p class="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1.5">
                المؤهل المطلوب
              </p>
              <p class="text-sm font-bold text-slate-900 truncate">
                {{ currentJob.RequiredDegreeLevel || 'غير محدد' }}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main
        class="bg-white rounded-[3rem] p-6 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100/60 relative z-20"
      >
        <PublicCandidateForm :job-request-id="currentJob.id" />
      </main>
    </div>

    <div
      v-else
      class="min-h-[80vh] flex items-center justify-center px-4 animate-in fade-in zoom-in duration-500"
    >
      <div
        class="bg-white rounded-[2.5rem] p-10 max-w-md w-full text-center shadow-2xl shadow-slate-200/50 border border-slate-100"
      >
        <div
          class="w-24 h-24 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-4xl transform -rotate-6"
        >
          ⚠️
        </div>
        <h2 class="text-2xl font-black text-slate-900 mb-3">عذراً، الدورة غير متاحة</h2>
        <p class="text-slate-500 mb-8 leading-relaxed font-medium">
          الرابط الذي تحاول الوصول إليه غير صحيح، أو أن فترة التقديم لهذه الدورة قد انتهت.
        </p>
        <button
          @click="goBack"
          class="w-full h-16 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          العودة للصفحة السابقة
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useJobRequestStore } from '@/stores/jobRequestStore'
import PublicCandidateForm from './PublicCandidateForm.vue'

const route = useRoute()
const router = useRouter()
const jobRequestStore = useJobRequestStore()

const loading = ref(true)

const currentJob = computed(() => jobRequestStore.currentJobRequest)

onMounted(async () => {
  loading.value = true
  const slug = route.params.slug
  if (slug) {
    await jobRequestStore.fetchJobRequestBySlug(slug)
  }
  loading.value = false
})

const goBack = () => {
  router.back()
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Almarai:wght@400;700;800&display=swap');

.font-sans {
  font-family:
    'Almarai',
    system-ui,
    -apple-system,
    sans-serif;
}

::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #f8fafc;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
