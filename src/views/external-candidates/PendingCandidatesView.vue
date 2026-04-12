<!--src\views\external-candidates\PendingCandidatesView.vue-->
<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-text-primary flex items-center gap-3">
          <svg class="w-7 h-7 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          مراجعة واعتماد الطلبات الخارجية
        </h1>
        <p class="text-sm font-bold text-text-secondary mt-1">
          راجع بيانات المتقدمين بدقة قبل اعتمادهم لإضافتهم إلى السجلات النهائية.
        </p>
      </div>
    </div>

    <CandidatesFilters :loading="candidateStore.loading" @filter="handleFilter" />

    <PendingCandidatesTable
      :items="candidateStore.pendingCandidates"
      :isLoading="candidateStore.loading"
      @view="openViewModal"
      @approve="handleApprove"
      @reject="handleReject"
    />

    <div
      v-if="candidateStore.pendingPagination?.total > 0"
      class="flex justify-between items-center py-4"
    >
      <button
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
        class="px-4 py-2 bg-surface-section border border-surface-border rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-ground transition-colors"
      >
        السابق
      </button>
      <span class="text-text-secondary text-sm font-bold">
        صفحة {{ currentPage }} من {{ candidateStore.pendingPagination.last_page || 1 }}
      </span>
      <button
        :disabled="currentPage === (candidateStore.pendingPagination.last_page || 1)"
        @click="changePage(currentPage + 1)"
        class="px-4 py-2 bg-surface-section border border-surface-border rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-ground transition-colors"
      >
        التالي
      </button>
    </div>

    <CandidateViewModal
      v-if="isModalOpen"
      :is-open="isModalOpen"
      :candidate="selectedCandidate"
      @close="closeModal"
      @approve="handleApproveFromModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCandidateStore } from '@/stores/candidateStore'

// 🌟 لاحظ المسارات للاستيراد
import CandidatesFilters from '@/views/candidates/CandidatesFilters.vue' // من مجلد المترشحين الرئيسي
import PendingCandidatesTable from './PendingCandidatesTable.vue' // من نفس المجلد الجديد
import CandidateViewModal from './CandidateViewModal.vue' // من نفس المجلد الجديد

const candidateStore = useCandidateStore()

const currentPage = ref(1)
const currentSearch = ref('')
const currentFilters = ref({})

const isModalOpen = ref(false)
const selectedCandidate = ref(null)

const fetchData = () => {
  candidateStore.fetchPendingCandidates(
    currentPage.value,
    currentSearch.value,
    currentFilters.value,
  )
}

onMounted(() => {
  fetchData()
})

const handleFilter = (filtersObj) => {
  currentSearch.value = filtersObj.search || ''
  const { search, ...restFilters } = filtersObj
  currentFilters.value = restFilters
  currentPage.value = 1
  fetchData()
}

const changePage = (page) => {
  currentPage.value = page
  fetchData()
}

const openViewModal = (candidate) => {
  selectedCandidate.value = candidate
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedCandidate.value = null
}

const handleApprove = async (candidate) => {
  if (confirm(`هل أنت متأكد من اعتماد المترشح "${candidate.Name}"؟`)) {
    await candidateStore.approveCandidate(candidate.id)
    checkPaginationAfterAction()
  }
}

const handleApproveFromModal = async (id) => {
  await candidateStore.approveCandidate(id)
  closeModal()
  checkPaginationAfterAction()
}

const handleReject = async (id) => {
  if (confirm('هل أنت متأكد من رفض هذا الطلب وحذفه نهائياً؟')) {
    await candidateStore.deleteCandidate(id)
    fetchData() // نجلب البيانات مجدداً لتعكس الحذف
  }
}

const checkPaginationAfterAction = () => {
  if (candidateStore.pendingCandidates.length === 0 && currentPage.value > 1) {
    currentPage.value -= 1
    fetchData()
  }
}
</script>
