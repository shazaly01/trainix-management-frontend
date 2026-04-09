<template>
  <div class="animate-fade-in space-y-6">
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-ground p-6 rounded-xl border border-surface-border shadow-sm"
    >
      <div>
        <h1 class="text-2xl font-bold text-text-primary flex items-center gap-2">
          <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            ></path>
          </svg>
          إدارة المتقدمين للتوظيف
        </h1>
        <p class="text-sm text-text-muted mt-1 mr-10">
          عرض ومتابعة كافة طلبات التوظيف الواردة للمؤسسة.
        </p>
      </div>

      <button
        @click="goToCreate"
        class="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl flex items-center font-bold transition-all shadow-lg shadow-primary/20 active:scale-95"
      >
        <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          ></path>
        </svg>
        إضافة متقدم يدوياً
      </button>
    </div>

    <div
      class="bg-surface-ground p-4 rounded-xl border border-surface-border flex flex-col md:flex-row gap-4 items-center"
    >
      <div class="relative flex-1 w-full">
        <span class="absolute inset-y-0 right-3 flex items-center text-text-muted">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ابحث بالاسم، الرقم الوطني، أو رقم المتقدم..."
          class="w-full pr-10 pl-4 py-2.5 bg-surface-section border border-surface-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-sm"
          @keyup.enter="handleSearch"
        />
      </div>

      <div class="flex gap-2 w-full md:w-auto">
        <button
          @click="handleSearch"
          class="flex-1 md:flex-none bg-surface-section hover:bg-surface-border text-text-primary border border-surface-border px-8 py-2.5 rounded-lg font-medium transition-colors"
        >
          بحث
        </button>
        <button
          @click="resetSearch"
          class="p-2.5 text-text-muted hover:text-danger hover:bg-danger/5 rounded-lg transition-colors"
          title="إعادة ضبط"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            ></path>
          </svg>
        </button>
      </div>
    </div>

    <div
      class="bg-surface-ground rounded-xl border border-surface-border shadow-sm overflow-hidden"
    >
      <AppTable
        :headers="tableHeaders"
        :items="applicantStore.applicants"
        :isLoading="applicantStore.loading"
        :rowClickable="false"
      >
        <template #cell-ApplicantNo="{ item }">
          <span class="font-mono font-bold text-primary text-sm"> #{{ item.ApplicantNo }} </span>
        </template>

        <template #cell-fullName="{ item }">
          <div class="flex items-center gap-3">
            <div
              class="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm"
            >
              {{ item.FirstName.charAt(0) }}
            </div>
            <div class="flex flex-col">
              <span class="text-text-primary font-bold text-sm"
                >{{ item.FirstName }} {{ item.LastName }}</span
              >
              <span class="text-xs text-text-muted">{{ item.Email || 'لا يوجد بريد' }}</span>
            </div>
          </div>
        </template>

        <template #cell-ApplicationSource="{ item }">
          <div class="flex items-center">
            <span
              v-if="item.ApplicationSource === 'Online'"
              class="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-bold"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              بوابة خارجية
            </span>
            <span
              v-else
              class="flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-bold"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              إدخال داخلي
            </span>
          </div>
        </template>

        <template #cell-actions="{ item }">
          <div class="flex items-center justify-center gap-1">
            <button
              @click="goToProfile(item.id)"
              class="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all group"
              title="فتح الملف الكامل"
            >
              <svg
                class="w-5 h-5 group-hover:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                ></path>
              </svg>
            </button>

            <button
              @click="confirmDelete(item)"
              class="p-2 text-text-muted hover:text-danger hover:bg-danger/5 rounded-lg transition-all"
              title="حذف"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                ></path>
              </svg>
            </button>
          </div>
        </template>
      </AppTable>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useApplicantStore } from '@/stores/ApplicantStore'
import AppTable from '@/components/ui/AppTable.vue'

const router = useRouter()
const applicantStore = useApplicantStore()

// الحالة
const searchQuery = ref('')

// تعريف أعمدة الجدول لتناسب مودل الـ Applicant الخاص بك
const tableHeaders = [
  { key: 'ApplicantNo', label: 'الرقم المرجعي', class: 'w-32' },
  { key: 'fullName', label: 'بيانات المتقدم' },
  { key: 'NationalID', label: 'الرقم الوطني / الإقامة', class: 'w-48' },
  { key: 'ApplicationSource', label: 'المصدر', class: 'w-40' },
  { key: 'actions', label: 'إجراءات', class: 'w-24 text-center', cellClass: 'text-center' },
]

// جلب البيانات عند التحميل
onMounted(() => {
  loadApplicants()
})

const loadApplicants = () => {
  // نرسل الـ searchQuery للستور الذي بدوره يرسله للباك-إند
  applicantStore.fetchApplicants({ search: searchQuery.value })
}

const handleSearch = () => {
  loadApplicants()
}

const resetSearch = () => {
  searchQuery.value = ''
  loadApplicants()
}

// التنقل لشاشة الإضافة (ستفتح ApplicantProfile بدون ID)
const goToCreate = () => {
  router.push({ name: 'ApplicantProfile' })
}

// التنقل لملف المتقدم (تعديل)
const goToProfile = (id) => {
  router.push({ name: 'ApplicantProfile', params: { id } })
}

// حذف المتقدم
const confirmDelete = async (applicant) => {
  if (
    confirm(`هل أنت متأكد من حذف المتقدم "${applicant.FirstName} ${applicant.LastName}" نهائياً؟`)
  ) {
    try {
      await applicantStore.deleteApplicant(applicant.id)
      loadApplicants() // تحديث الجدول بعد الحذف
    } catch (error) {
      console.error('فشل حذف المتقدم:', error)
    }
  }
}
</script>

<style scoped>
/* إضافة تأثير ناعم لظهور الصفحة */
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
