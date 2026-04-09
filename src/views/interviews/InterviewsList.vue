<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-text-primary tracking-tight">أجندة مقابلات التوظيف</h1>
        <p class="text-text-muted mt-1 text-sm font-medium">
          إدارة وجدولة جلسات المقابلات وتقييم المرشحين بناءً على الكفاءة المهنية
        </p>
      </div>

      <AppButton variant="primary" @click="goToCreatePage" class="shadow-lg shadow-primary/20">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 ml-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clip-rule="evenodd"
          />
        </svg>
        جدولة جلسة جديدة
      </AppButton>
    </div>

    <div
      class="bg-surface-section p-5 rounded-2xl border border-surface-border flex flex-col md:flex-row gap-4 items-center shadow-sm"
    >
      <div class="relative flex-1 w-full md:max-w-md">
        <span
          class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-muted"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ابحث برقم الجلسة، كود المقيّم أو الوظيفة..."
          class="w-full pr-10 pl-4 py-2.5 rounded-xl border border-surface-border bg-surface-ground focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-medium"
          @input="debounceSearch"
        />
      </div>

      <div class="hidden md:flex items-center gap-6 mr-auto px-6 border-r border-surface-border">
        <div class="text-center">
          <p class="text-[10px] text-text-muted uppercase font-bold tracking-widest">
            إجمالي الجلسات
          </p>
          <p class="text-xl font-black text-primary">{{ interviewStore.pagination.total || 0 }}</p>
        </div>
      </div>
    </div>

    <div
      class="bg-surface-section rounded-2xl border border-surface-border overflow-hidden shadow-sm"
    >
      <InterviewsTable
        :interviews="interviewStore.interviews"
        :loading="interviewStore.loading"
        @edit="goToEditPage"
        @delete="confirmDelete"
      />
    </div>

    <div v-if="interviewStore.pagination.last_page > 1" class="flex justify-center mt-8 pb-10">
      <nav
        class="inline-flex -space-x-px rtl:space-x-reverse rounded-xl shadow-sm bg-surface-section border border-surface-border overflow-hidden"
      >
        <button
          @click="fetchData(interviewStore.pagination.current_page - 1)"
          :disabled="interviewStore.pagination.current_page === 1"
          class="px-4 py-2 text-sm font-bold text-text-secondary hover:bg-surface-ground disabled:opacity-40 border-l border-surface-border transition-colors"
        >
          السابق
        </button>

        <button
          v-for="page in interviewStore.pagination.last_page"
          :key="page"
          @click="fetchData(page)"
          :class="[
            'px-5 py-2 text-sm font-bold border-l border-surface-border transition-all',
            interviewStore.pagination.current_page === page
              ? 'bg-primary text-white shadow-inner'
              : 'text-text-secondary hover:bg-surface-ground',
          ]"
        >
          {{ page }}
        </button>

        <button
          @click="fetchData(interviewStore.pagination.current_page + 1)"
          :disabled="interviewStore.pagination.current_page === interviewStore.pagination.last_page"
          class="px-4 py-2 text-sm font-bold text-text-secondary hover:bg-surface-ground disabled:opacity-40 transition-colors"
        >
          التالي
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useInterviewStore } from '@/stores/interviewStore'
import AppButton from '@/components/ui/AppButton.vue'
import InterviewsTable from './InterviewsTable.vue'

const router = useRouter()
const interviewStore = useInterviewStore()

// --- الحالة (State) ---
const searchQuery = ref('')
let debounceTimer = null

// --- العمليات (Actions) ---

onMounted(() => {
  fetchData()
})

const fetchData = async (page = 1) => {
  await interviewStore.fetchInterviews(page, searchQuery.value)
}

/**
 * دالة البحث بتأخير (Debounce) لتحسين الأداء وتقليل طلبات API
 */
const debounceSearch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    fetchData(1)
  }, 500)
}

/**
 * الانتقال لصفحة إنشاء جلسة جديدة (الجدولة الأعمى)
 */
const goToCreatePage = () => {
  router.push({ name: 'InterviewCreate' })
}

/**
 * الانتقال لصفحة تعديل الجدولة
 * (يتم استدعاؤها عند النقر على صف في الجدول)
 */
const goToEditPage = (interview) => {
  router.push({
    name: 'InterviewEdit',
    params: { id: interview.id },
  })
}

/**
 * حذف جلسة المقابلات بعد التأكيد
 */
const confirmDelete = async (id) => {
  if (
    confirm(
      'تنبيه: هل أنت متأكد من إلغاء جلسة المقابلات هذه؟ سيتم حذف جميع بيانات الجدولة والتقييمات المرتبطة بها نهائياً.',
    )
  ) {
    try {
      await interviewStore.deleteInterview(id)
      // إعادة جلب البيانات للصفحة الحالية بعد الحذف
      await fetchData(interviewStore.pagination.current_page)
    } catch (err) {
      console.error('Delete operation failed:', err)
      alert('عذراً، حدث خطأ أثناء محاولة الحذف. يرجى التحقق من الاتصال والمحاولة ثانية.')
    }
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
