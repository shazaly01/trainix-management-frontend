<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 class="text-2xl font-bold text-text-primary">إدارة المترشحين للإطفاء والإنقاذ</h1>
      <button
        @click="openCreateModal"
        class="bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm"
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
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span>إضافة مترشح جديد</span>
      </button>
    </div>

    <CandidatesFilters :loading="candidateStore.loading" @filter="handleFilter" />

    <CandidatesTable
      :items="candidateStore.candidates"
      :isLoading="candidateStore.loading"
      @edit="openEditModal"
      @delete="handleDelete"
    />

    <div v-if="candidateStore.pagination?.total > 0" class="flex justify-between items-center py-4">
      <button
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
        class="px-4 py-2 bg-surface-section border border-surface-border rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-ground transition-colors"
      >
        السابق
      </button>
      <span class="text-text-secondary text-sm">
        صفحة {{ currentPage }} من {{ candidateStore.pagination.last_page || 1 }}
      </span>
      <button
        :disabled="currentPage === (candidateStore.pagination.last_page || 1)"
        @click="changePage(currentPage + 1)"
        class="px-4 py-2 bg-surface-section border border-surface-border rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-ground transition-colors"
      >
        التالي
      </button>
    </div>

    <CandidateModal
      v-if="isModalOpen"
      :is-open="isModalOpen"
      :candidate-to-edit="selectedCandidate"
      @close="closeModal"
      @saved="handleSaved"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCandidateStore } from '@/stores/candidateStore'
import CandidatesTable from './CandidatesTable.vue'
import CandidateModal from './CandidateModal.vue'
import CandidatesFilters from './CandidatesFilters.vue'

const candidateStore = useCandidateStore()

// حالة التصفح والفلاتر
const currentPage = ref(1)
const currentSearch = ref('')
const currentFilters = ref({})

// حالة المودال
const isModalOpen = ref(false)
const selectedCandidate = ref(null)

// دالة جلب البيانات من الـ Store مع تمرير الفلاتر
const fetchData = () => {
  candidateStore.fetchCandidates(currentPage.value, currentSearch.value, currentFilters.value)
}

// الجلب الأولي عند فتح الصفحة
onMounted(() => {
  fetchData()
})

// استقبال الفلاتر من مكون CandidatesFilters
const handleFilter = (filtersObj) => {
  // فصل نص البحث عن باقي الفلاتر ليتوافق مع تصميم الـ Store
  currentSearch.value = filtersObj.search || ''

  const { search, ...restFilters } = filtersObj
  currentFilters.value = restFilters

  // إعادة التصفح للصفحة الأولى عند كل عملية بحث جديدة
  currentPage.value = 1
  fetchData()
}

// تغيير الصفحة
const changePage = (page) => {
  currentPage.value = page
  fetchData()
}

// فتح مودال الإضافة
const openCreateModal = () => {
  selectedCandidate.value = null
  isModalOpen.value = true
}

// فتح مودال التعديل مع تمرير بيانات المترشح
const openEditModal = (candidate) => {
  selectedCandidate.value = { ...candidate }
  isModalOpen.value = true
}

// إغلاق المودال
const closeModal = () => {
  isModalOpen.value = false
  selectedCandidate.value = null
}

// عند إتمام الحفظ بنجاح
const handleSaved = () => {
  closeModal()
  fetchData()
}

// معالجة الحذف
const handleDelete = async (id) => {
  if (confirm('هل أنت متأكد من رغبتك في حذف بيانات هذا المترشح بشكل دائم (إلى الأرشيف)؟')) {
    try {
      await candidateStore.deleteCandidate(id)
      if (!candidateStore.error) {
        fetchData()
      }
    } catch (error) {
      console.error('حدث خطأ أثناء الحذف:', error)
    }
  }
}
</script>
