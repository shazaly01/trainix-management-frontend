<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 class="text-2xl font-bold text-text-primary">إدارة المترشحين للإطفاء والإنقاذ</h1>

      <div class="flex items-center gap-3">
        <button
          @click="handlePrint"
          :disabled="isPrinting || candidateStore.loading"
          class="bg-slate-700 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            v-if="isPrinting"
            class="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <svg
            v-else
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
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          <span>{{ isPrinting ? 'جاري تجهيز التقرير...' : 'طباعة التقرير' }}</span>
        </button>

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
    </div>

    <CandidatesFilters :loading="candidateStore.loading" @filter="handleFilter" />

    <CandidatesTable
      :items="candidateStore.candidates"
      :isLoading="candidateStore.loading"
      @edit="openEditModal"
      @delete="handleDelete"
      @manage-documents="openDocumentsModal"
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

    <CandidatesReportView
      v-if="reportData.length > 0"
      :data="reportData"
      :filters="currentFilters"
      :search="currentSearch"
    />

    <CandidateModal
      v-if="isModalOpen"
      :is-open="isModalOpen"
      :candidate-to-edit="selectedCandidate"
      @close="closeModal"
      @saved="handleSaved"
    />

    <DocumentsManagerModal
      v-model="isDocsModalOpen"
      :owner="currentDocOwner"
      target-type="App\Models\Candidate"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import CandidatesReportView from './CandidatesReportView.vue'
import { useCandidateStore } from '@/stores/candidateStore'
import CandidatesTable from './CandidatesTable.vue'
import CandidateModal from './CandidateModal.vue'
import CandidatesFilters from './CandidatesFilters.vue'
// استيراد المودال الخاص بالمستندات
import DocumentsManagerModal from '@/views/documents/DocumentsManagerModal.vue'
import { useRouter } from 'vue-router'

const candidateStore = useCandidateStore()

// حالة التصفح والفلاتر
const currentPage = ref(1)
const currentSearch = ref('')
const currentFilters = ref({})

const isPrinting = ref(false)
const reportData = ref([])

// حالة مودال المترشح
const isModalOpen = ref(false)
const selectedCandidate = ref(null)

// 🌟 حالة مودال المستندات
const isDocsModalOpen = ref(false)
const currentDocOwner = ref({ id: null, name: '' })
const router = useRouter()

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
  currentSearch.value = filtersObj.search || ''
  const { search, ...restFilters } = filtersObj
  currentFilters.value = restFilters
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

// إغلاق مودال المترشح
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

// 🌟 دالة معالجة جلب بيانات التقرير والطباعة
const handlePrint = async () => {
  try {
    isPrinting.value = true
    // 1. جلب البيانات الشاملة من الـ Store
    const data = await candidateStore.fetchAllForReport(currentSearch.value, currentFilters.value)

    if (data && data.length > 0) {
      // 2. حفظ البيانات والفلاتر في sessionStorage
      sessionStorage.setItem(
        'candidatesPrintData',
        JSON.stringify({
          reportData: data,
          filters: currentFilters.value,
          search: currentSearch.value,
        }),
      )

      // 3. فتح نافذة الطباعة المستقلة (سنعرف هذا المسار في الراوتر)
      const routeData = router.resolve({ name: 'CandidatesPrint' })
      window.open(routeData.href, '_blank')
    } else {
      alert('لا توجد بيانات للطباعة')
    }
  } catch (error) {
    console.error('خطأ في الطباعة:', error)
  } finally {
    isPrinting.value = false
  }
}

// 🌟 فتح مودال إدارة المستندات وتمرير بيانات المترشح كمالك
const openDocumentsModal = (candidate) => {
  currentDocOwner.value = {
    id: candidate.id,
    name: candidate.Name, // تحويل Name إلى name ليتوافق مع ما يتوقعه Modal المستندات
  }
  isDocsModalOpen.value = true
}
</script>
