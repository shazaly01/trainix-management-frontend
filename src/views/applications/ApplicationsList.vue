<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 class="text-2xl font-bold text-text-primary">إدارة التقديمات (الفرز والمراجعة)</h1>

      <button
        @click="goToCreate"
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
        <span>تقديم جديد يدوياً</span>
      </button>
    </div>

    <ApplicationsFilter @filter="handleFilterChange" />

    <ApplicationsTable
      :items="applicationStore.applications"
      :isLoading="applicationStore.loading"
      @edit="goToReview"
      @delete="handleDelete"
    />

    <div
      v-if="applicationStore.pagination?.total > 0"
      class="flex justify-between items-center py-4 border-t border-surface-border mt-4"
    >
      <button
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
        class="px-4 py-2 bg-surface-section border border-surface-border rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-ground transition-colors"
      >
        السابق
      </button>
      <span class="text-text-secondary text-sm font-medium">
        صفحة {{ currentPage }} من {{ applicationStore.pagination.last_page || 1 }}
      </span>
      <button
        :disabled="currentPage === (applicationStore.pagination.last_page || 1)"
        @click="changePage(currentPage + 1)"
        class="px-4 py-2 bg-surface-section border border-surface-border rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-ground transition-colors"
      >
        التالي
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useApplicationStore } from '@/stores/applicationStore'

// استيراد المكونات الفرعية
import ApplicationsTable from './ApplicationsTable.vue'
import ApplicationsFilter from './ApplicationsFilter.vue'

const router = useRouter()
const applicationStore = useApplicationStore()

// حالة الصفحة والفلترة
const currentPage = ref(1)
const currentFilters = ref({})

// جلب البيانات من الباك إند
const fetchData = () => {
  applicationStore.fetchApplications({
    page: currentPage.value,
    ...currentFilters.value,
  })
}

// عند تحميل الصفحة لأول مرة
onMounted(() => {
  fetchData()
})

// استقبال الفلاتر الجديدة من مكون ApplicationsFilter
const handleFilterChange = (filters) => {
  currentFilters.value = filters
  currentPage.value = 1 // إعادة الصفحة إلى 1 عند تطبيق أي فلتر جديد
  fetchData()
}

// تغيير الصفحة (Pagination)
const changePage = (page) => {
  currentPage.value = page
  fetchData()
}

// ✅ الانتقال لشاشة المراجعة الشاملة عند الضغط على أيقونة العين في الجدول
const goToReview = (application) => {
  router.push({
    name: 'ApplicationReview',
    params: { id: application.id },
  })
}

// التوجيه لصفحة إنشاء تقديم يدوي (يمكنك تعديل اسم المسار حسب نظامك)
const goToCreate = () => {
  // router.push({ name: 'ApplicationCreate' })
  alert('ميزة التقديم اليدوي قيد التطوير.')
}

// حذف التقديم
const handleDelete = async (id) => {
  if (confirm('هل أنت متأكد من رغبتك في حذف هذا التقديم نهائياً؟')) {
    try {
      await applicationStore.deleteApplication(id)
      if (!applicationStore.error) {
        fetchData() // تحديث الجدول بعد الحذف
      }
    } catch (error) {
      console.error('حدث خطأ أثناء الحذف:', error)
    }
  }
}
</script>
