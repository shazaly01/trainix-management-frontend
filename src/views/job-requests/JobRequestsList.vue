<!--src\views\job-requests\JobRequestsList.vue-->
<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 class="text-2xl font-bold text-text-primary">إدارة طلبات التوظيف</h1>
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
        <span>إنشاء طلب توظيف</span>
      </button>
    </div>

    <div
      class="bg-surface-section p-4 rounded-xl shadow-sm border border-surface-border flex items-center gap-4"
    >
      <div class="relative w-full max-w-md">
        <input
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="ابحث برقم الطلب أو التخصص..."
          class="w-full pl-4 pr-10 py-2 border border-surface-border rounded-lg bg-surface-ground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 absolute right-3 top-2.5 text-text-muted"
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
      </div>
    </div>

    <JobRequestsTable
      :items="jobRequestStore.jobRequests"
      :isLoading="jobRequestStore.loading"
      @edit="openEditModal"
      @delete="handleDelete"
    />

    <div
      v-if="jobRequestStore.pagination?.total > 0"
      class="flex justify-between items-center py-4"
    >
      <button
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
        class="px-4 py-2 bg-surface-section border border-surface-border rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-ground transition-colors"
      >
        السابق
      </button>
      <span class="text-text-secondary text-sm">
        صفحة {{ currentPage }} من {{ jobRequestStore.pagination.last_page || 1 }}
      </span>
      <button
        :disabled="currentPage === (jobRequestStore.pagination.last_page || 1)"
        @click="changePage(currentPage + 1)"
        class="px-4 py-2 bg-surface-section border border-surface-border rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-ground transition-colors"
      >
        التالي
      </button>
    </div>

    <JobRequestModal
      v-if="isModalOpen"
      :is-open="isModalOpen"
      :job-request="selectedJobRequest"
      @close="closeModal"
      @saved="handleSaved"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useJobRequestStore } from '@/stores/jobRequestStore'
import JobRequestsTable from './JobRequestsTable.vue'
import JobRequestModal from './JobRequestModal.vue'

const jobRequestStore = useJobRequestStore()

const searchQuery = ref('')
const currentPage = ref(1)

const isModalOpen = ref(false)
const selectedJobRequest = ref(null)

const fetchData = () => {
  jobRequestStore.fetchJobRequests(currentPage.value, searchQuery.value)
}

onMounted(() => {
  fetchData()
})

let searchTimeout
const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchData()
  }, 400)
}

const changePage = (page) => {
  currentPage.value = page
  fetchData()
}

const openCreateModal = () => {
  selectedJobRequest.value = null
  isModalOpen.value = true
}

const openEditModal = (jobRequest) => {
  selectedJobRequest.value = { ...jobRequest }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedJobRequest.value = null
}

const handleSaved = () => {
  closeModal()
  fetchData()
}

const handleDelete = async (id) => {
  if (confirm('هل أنت متأكد من رغبتك في حذف طلب التوظيف هذا؟')) {
    try {
      await jobRequestStore.deleteJobRequest(id)
      if (!jobRequestStore.error) {
        fetchData()
      }
    } catch (error) {
      console.error('حدث خطأ أثناء الحذف:', error)
    }
  }
}
</script>
