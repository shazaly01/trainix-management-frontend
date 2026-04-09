<template>
  <div class="max-w-7xl mx-auto space-y-6 pb-10 animate-fade-in">
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="application" class="space-y-6">
      <div
        class="bg-surface-section rounded-2xl p-6 border border-surface-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm"
      >
        <div>
          <div class="flex items-center gap-3 mb-2">
            <h1 class="text-2xl font-bold text-text-primary">
              {{ application.Applicant?.FirstName }} {{ application.Applicant?.LastName }}
            </h1>
            <span
              class="px-3 py-1 text-xs rounded-full font-medium border"
              :class="getStatusBadge(application.ApplicationStatus)"
            >
              {{ translateStatus(application.ApplicationStatus) }}
            </span>
          </div>
          <p class="text-text-secondary flex items-center gap-2">
            <svg class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            متقدم لوظيفة:
            <span class="font-bold text-text-primary">{{
              application.JobRequest?.RequiredMajor
            }}</span>
          </p>
        </div>

        <button
          @click="router.back()"
          class="px-4 py-2 bg-surface-ground border border-surface-border rounded-lg text-sm hover:bg-surface-border transition-colors"
        >
          &larr; العودة للقائمة
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-surface-ground rounded-xl p-6 border border-surface-border shadow-sm">
            <h2
              class="text-lg font-bold text-text-primary mb-4 border-b border-surface-border pb-2"
            >
              البيانات الشخصية
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <p class="text-text-muted mb-1">رقم المتقدم</p>
                <p class="font-medium text-text-primary font-mono">
                  {{ application.Applicant?.ApplicantNo }}
                </p>
              </div>
              <div>
                <p class="text-text-muted mb-1">الرقم الوطني</p>
                <p class="font-medium text-text-primary">
                  {{ application.Applicant?.NationalID || 'غير متوفر' }}
                </p>
              </div>
              <div>
                <p class="text-text-muted mb-1">البريد الإلكتروني</p>
                <p class="font-medium text-text-primary">
                  {{ application.Applicant?.Email || 'غير متوفر' }}
                </p>
              </div>
              <div>
                <p class="text-text-muted mb-1">رقم الهاتف</p>
                <p class="font-medium text-text-primary" dir="ltr">
                  {{ application.Applicant?.PhoneNumber || 'غير متوفر' }}
                </p>
              </div>
              <div>
                <p class="text-text-muted mb-1">المدينة / الإقامة</p>
                <p class="font-medium text-text-primary">
                  {{ application.Applicant?.City?.Name || 'غير محدد' }}
                </p>
              </div>
            </div>
          </div>

          <div class="bg-surface-ground rounded-xl p-6 border border-surface-border shadow-sm">
            <h2
              class="text-lg font-bold text-text-primary mb-4 border-b border-surface-border pb-2"
            >
              المؤهلات العلمية
            </h2>

            <div v-if="application.Applicant?.Qualifications?.length > 0" class="space-y-4">
              <div
                v-for="qual in application.Applicant.Qualifications"
                :key="qual.id"
                class="p-4 bg-surface-section rounded-lg border border-surface-border"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="font-bold text-text-primary">
                      {{ qual.DegreeLevel }} - {{ qual.Major }}
                    </h3>
                    <p class="text-sm text-text-secondary mt-1">{{ qual.UniversityOrInstitute }}</p>
                  </div>
                  <div class="text-left">
                    <span
                      class="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded font-bold mb-1"
                    >
                      تخرج: {{ qual.GraduationYear }}
                    </span>
                    <p class="text-xs text-text-muted">المعدل: {{ qual.GPA_or_Grade || 'N/A' }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-else
              class="p-4 bg-surface-section rounded border border-surface-border text-center text-text-muted"
            >
              لم يقم المتقدم بإضافة أي مؤهلات علمية.
            </div>
          </div>

          <div class="bg-surface-ground rounded-xl p-6 border border-surface-border shadow-sm">
            <h2
              class="text-lg font-bold text-text-primary mb-4 border-b border-surface-border pb-2"
            >
              الخبرات المهنية
            </h2>

            <div v-if="application.Applicant?.Experiences?.length > 0" class="space-y-4">
              <div
                v-for="exp in application.Applicant.Experiences"
                :key="exp.id"
                class="p-4 bg-surface-section rounded-lg border border-surface-border"
              >
                <div
                  class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2"
                >
                  <h3 class="font-bold text-text-primary text-lg">{{ exp.JobTitle }}</h3>
                  <span
                    class="text-sm font-medium text-text-secondary bg-surface-ground px-2 py-1 rounded mt-2 sm:mt-0"
                  >
                    {{ exp.StartDate }} إلى {{ exp.EndDate }}
                  </span>
                </div>
                <p class="text-primary font-medium text-sm mb-3">{{ exp.CompanyName }}</p>
                <p class="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                  {{ exp.JobDescription }}
                </p>
              </div>
            </div>
            <div
              v-else
              class="p-4 bg-surface-section rounded border border-surface-border text-center text-text-muted"
            >
              لم يقم المتقدم بإضافة أي خبرات سابقة.
            </div>
          </div>

          <div class="bg-surface-ground rounded-xl p-6 border border-surface-border shadow-sm">
            <h2
              class="text-lg font-bold text-text-primary mb-4 border-b border-surface-border pb-2"
            >
              المهارات
            </h2>

            <div v-if="application.Applicant?.Skills?.length > 0" class="flex flex-wrap gap-2">
              <span
                v-for="skill in application.Applicant.Skills"
                :key="skill.id"
                class="px-3 py-1.5 bg-surface-section border border-surface-border rounded-full text-sm text-text-primary flex items-center gap-2"
              >
                {{ skill.SkillName }}
                <span class="text-xs text-primary font-bold">({{ skill.ProficiencyLevel }})</span>
              </span>
            </div>
            <div
              v-else
              class="p-4 bg-surface-section rounded border border-surface-border text-center text-text-muted"
            >
              لم يقم المتقدم بإضافة مهارات.
            </div>
          </div>
        </div>

        <div class="lg:col-span-1 space-y-6">
          <div
            class="bg-primary/5 rounded-xl p-6 border border-primary/20 shadow-sm sticky top-6 z-10"
          >
            <h2 class="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              القرار الإداري
            </h2>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-text-secondary mb-1"
                  >تغيير حالة الطلب إلى:</label
                >
                <select
                  v-model="selectedStatus"
                  class="w-full px-4 py-2 border border-surface-border rounded-lg bg-surface-ground focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="Pending">جديد (Pending)</option>
                  <option value="Under Review">قيد المراجعة (Under Review)</option>
                  <option value="Interview">مؤهل للمقابلة (Interview)</option>
                  <option value="Accepted">مقبول نهائياً (Accepted)</option>
                  <option value="Rejected">مرفوض (Rejected)</option>
                </select>
              </div>

              <button
                @click="saveStatus"
                :disabled="isSaving"
                class="w-full py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex justify-center items-center gap-2 font-medium shadow-md"
              >
                <span
                  v-if="isSaving"
                  class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                ></span>
                <span>{{ isSaving ? 'جاري الحفظ...' : 'حفظ وتحديث الحالة' }}</span>
              </button>
            </div>
          </div>

          <div class="bg-surface-ground rounded-xl p-6 border border-surface-border shadow-sm">
            <h2
              class="text-sm font-bold text-text-muted uppercase tracking-wider mb-4 border-b border-surface-border pb-2"
            >
              المرفقات (CV)
            </h2>

            <div v-if="application.Applicant?.Documents?.length > 0" class="space-y-3">
              <a
                v-for="doc in application.Applicant.Documents"
                :key="doc.id"
                :href="doc.FileUrl"
                target="_blank"
                class="flex items-center gap-3 p-3 rounded-lg border border-surface-border hover:bg-surface-section transition-colors group"
              >
                <div
                  class="bg-primary/10 text-primary p-2 rounded group-hover:bg-primary group-hover:text-white transition-colors"
                >
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div class="flex-1 overflow-hidden">
                  <p class="text-sm font-medium text-text-primary truncate">{{ doc.name }}</p>
                  <p class="text-xs text-text-muted">
                    {{ doc.DocumentType }} • {{ doc.FileFormat }}
                  </p>
                </div>
              </a>
            </div>
            <div v-else class="text-sm text-text-muted text-center py-2">لا توجد مرفقات.</div>
          </div>

          <div class="bg-surface-ground rounded-xl p-6 border border-surface-border shadow-sm">
            <h2
              class="text-sm font-bold text-text-muted uppercase tracking-wider mb-4 border-b border-surface-border pb-2"
            >
              معلومات إدارية
            </h2>
            <ul class="space-y-3 text-sm">
              <li class="flex justify-between pb-2 border-b border-surface-border/50">
                <span class="text-text-secondary">رقم الحركة:</span>
                <span class="font-mono font-bold text-primary">{{
                  application.TransactionNo
                }}</span>
              </li>
              <li class="flex justify-between pb-2 border-b border-surface-border/50">
                <span class="text-text-secondary">رقم الشاغر:</span>
                <span class="font-mono text-text-primary">{{
                  application.JobRequest?.RequestNo
                }}</span>
              </li>
              <li class="flex justify-between pb-2 border-b border-surface-border/50">
                <span class="text-text-secondary">مصدر التقديم:</span>
                <span class="text-text-primary">{{
                  application.Applicant?.ApplicationSource || 'مباشر'
                }}</span>
              </li>
              <li class="flex justify-between">
                <span class="text-text-secondary">تاريخ التقديم:</span>
                <span class="text-text-primary" dir="ltr">{{ application.SubmittedAt }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApplicationStore } from '@/stores/applicationStore'

const route = useRoute()
const router = useRouter()
const applicationStore = useApplicationStore()

const application = computed(() => applicationStore.currentApplication)
const loading = computed(() => applicationStore.loading)
const isSaving = ref(false)
const selectedStatus = ref('')

onMounted(async () => {
  const id = route.params.id
  if (id) {
    await applicationStore.fetchApplication(id)
    if (application.value) {
      selectedStatus.value = application.value.ApplicationStatus || 'Pending'
    }
  }
})

// ترجمة الحالات
const translateStatus = (status) => {
  const statusMap = {
    Pending: 'جديد',
    'Under Review': 'قيد المراجعة',
    Interview: 'مؤهل للمقابلة',
    Accepted: 'مقبول',
    Rejected: 'مرفوض',
  }
  return statusMap[status] || status || 'جديد'
}

// تلوين الحالات
const getStatusBadge = (status) => {
  switch (status) {
    case 'Accepted':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'Rejected':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'Interview':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'Under Review':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

// حفظ الحالة
const saveStatus = async () => {
  if (!application.value) return
  isSaving.value = true
  try {
    await applicationStore.updateApplication(application.value.id, {
      ApplicationStatus: selectedStatus.value,
    })
    alert('تم تحديث حالة التقديم بنجاح!')
  } catch (error) {
    console.error('Error saving status:', error)
    alert('حدث خطأ أثناء التحديث.')
  } finally {
    isSaving.value = false
  }
}
</script>
