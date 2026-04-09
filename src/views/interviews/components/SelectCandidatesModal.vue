<template>
  <AppDialog
    :model-value="isOpen"
    title="اختيار الكفاءات (نظام التوظيف الأعمى)"
    @update:model-value="closeModal"
    size="5xl"
  >
    <div class="space-y-4">
      <div class="flex flex-col md:flex-row gap-4 items-center mb-4">
        <div class="relative flex-1">
          <span
            class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-muted"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            placeholder="ابحث بالتخصص أو المهارة أو رقم الطلب..."
            class="w-full pr-10 pl-4 py-2.5 rounded-xl border border-surface-border bg-surface-ground focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
          />
        </div>
        <div
          class="text-xs text-text-muted bg-surface-section px-3 py-2 rounded-lg border border-surface-border"
        >
          عدد المتاحين: <span class="font-bold text-primary">{{ filteredApplicants.length }}</span>
        </div>
      </div>

      <div
        class="max-h-[500px] overflow-y-auto border border-surface-border rounded-xl shadow-sm bg-surface-section"
      >
        <table class="w-full text-right text-sm border-collapse">
          <thead
            class="bg-surface-ground sticky top-0 z-20 border-b border-surface-border shadow-sm"
          >
            <tr>
              <th class="px-4 py-4 w-12 text-center">
                <input
                  type="checkbox"
                  @change="toggleAll"
                  :checked="isAllSelected"
                  class="rounded border-surface-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                />
              </th>
              <th class="px-6 py-4 font-bold text-text-primary text-xs uppercase tracking-wider">
                الملف المهني والخبرات
              </th>
              <th
                class="px-6 py-4 font-bold text-text-primary text-xs uppercase tracking-wider text-center"
              >
                المؤهل الدراسي
              </th>
              <th
                class="px-6 py-4 font-bold text-text-primary text-xs uppercase tracking-wider text-center w-28"
              >
                رقم الطلب
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-surface-border">
            <tr v-if="loading">
              <td colspan="4" class="py-20 text-center">
                <div class="flex flex-col items-center gap-3">
                  <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                  <span class="text-text-muted font-medium">جاري تحليل بيانات الكفاءات...</span>
                </div>
              </td>
            </tr>

            <tr v-else-if="filteredApplicants.length === 0">
              <td colspan="4" class="py-20 text-center">
                <div class="opacity-40 flex flex-col items-center">
                  <svg class="h-16 w-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <p class="text-lg font-bold">لا يوجد مرشحون متاحون</p>
                  <p class="text-xs">تأكد من وجود متقدمين حالتهم "Interview" لهذا الطلب</p>
                </div>
              </td>
            </tr>

            <tr
              v-else
              v-for="app in filteredApplicants"
              :key="app.id"
              @click="toggleSelection(app.id)"
              class="hover:bg-primary/5 transition-all cursor-pointer group"
            >
              <td class="px-4 py-4 text-center">
                <input
                  type="checkbox"
                  :value="app.id"
                  v-model="selectedIds"
                  @click.stop
                  class="rounded border-surface-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                />
              </td>

              <td class="px-6 py-4">
                <div class="space-y-2">
                  <div class="font-bold text-text-primary text-base flex items-center gap-2">
                    {{ app.Applicant?.CurrentJobTitle || 'متقدم كفء' }}
                    <span
                      class="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20"
                    >
                      خبرة في {{ app.Applicant?.Experiences?.length || 0 }} جهات عمل
                    </span>
                  </div>

                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="skill in app.Applicant?.Skills"
                      :key="skill.id"
                      class="text-[10px] bg-surface-ground text-text-secondary px-2 py-1 rounded border border-surface-border"
                    >
                      {{ skill.Name }}
                    </span>
                    <span
                      v-if="!app.Applicant?.Skills?.length"
                      class="text-[10px] text-text-muted italic"
                      >لم تُحدد مهارات خاصة</span
                    >
                  </div>
                </div>
              </td>

              <td class="px-6 py-4 text-center">
                <div
                  class="inline-block px-3 py-1 bg-surface-ground rounded-lg border border-surface-border"
                >
                  <div class="text-sm font-bold text-text-primary">
                    {{ app.Applicant?.Qualifications?.[0]?.DegreeLevel || 'بكالوريوس' }}
                  </div>
                  <div class="text-[11px] text-text-muted mt-0.5">
                    تخصص: {{ app.Applicant?.Qualifications?.[0]?.Major || 'تخصص عام' }}
                  </div>
                </div>
              </td>

              <td class="px-6 py-4 text-center">
                <span
                  class="px-3 py-1.5 bg-black/5 rounded font-mono text-xs font-bold border border-transparent group-hover:border-primary/20 transition-all"
                >
                  #{{ app.id }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-surface-border">
        <AppButton variant="secondary" @click="closeModal">إلغاء</AppButton>
        <AppButton
          variant="primary"
          :disabled="!jobRequestId || selectedIds.length === 0"
          @click="confirmSelection"
          class="px-8 shadow-lg shadow-primary/20"
        >
          اعتماد إضافة ({{ selectedIds.length }}) مرشحين
        </AppButton>
      </div>
    </div>
  </AppDialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import AppDialog from '@/components/ui/AppDialog.vue'
import AppButton from '@/components/ui/AppButton.vue'
import apiClient from '@/services/apiClient'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  jobRequestId: { type: [Number, String], default: null },
  alreadySelectedIds: { type: Array, default: () => [] },
})

const emit = defineEmits(['close', 'select'])

const loading = ref(false)
const applications = ref([])
const selectedIds = ref([])
const searchQuery = ref('')

// مراقبة فتح النافذة لجلب البيانات
watch(
  () => props.isOpen,
  async (newVal) => {
    if (newVal && props.jobRequestId) {
      selectedIds.value = []
      searchQuery.value = ''
      await fetchAvailableApplicants()
    }
  },
)

const fetchAvailableApplicants = async () => {
  loading.value = true
  try {
    // جلب البيانات من الباك إند (تأكد من تعديل الـ Resource كما اتفقنا)
    const response = await apiClient.get(`/applications/by-request/${props.jobRequestId}`)
    const allApps = response.data.data || []

    // فلترة المتقدمين الذين حالتهم مؤهلة للمقابلة فقط
    applications.value = allApps.filter((app) => app.ApplicationStatus === 'Interview')
  } catch (error) {
    console.error('فشل جلب قائمة المتقدمين:', error)
  } finally {
    loading.value = false
  }
}

// فلترة البحث الذكية مع استبعاد المضافين مسبقاً للجدول
const filteredApplicants = computed(() => {
  return applications.value.filter((app) => {
    // استبعاد المضافين مسبقاً لجدول المقابلة الحالي
    if (props.alreadySelectedIds.includes(app.id)) return false

    // منطق البحث (في التخصص، المهارات، أو رقم الطلب)
    if (searchQuery.value) {
      const major = app.Applicant?.Qualifications?.[0]?.Major?.toLowerCase() || ''
      const skills = app.Applicant?.Skills?.map((s) => s.Name.toLowerCase()).join(' ') || ''
      const query = searchQuery.value.toLowerCase()

      return major.includes(query) || skills.includes(query) || app.id.toString().includes(query)
    }
    return true
  })
})

const isAllSelected = computed(() => {
  return (
    filteredApplicants.value.length > 0 &&
    selectedIds.value.length === filteredApplicants.value.length
  )
})

const toggleAll = (event) => {
  if (event.target.checked) {
    selectedIds.value = filteredApplicants.value.map((app) => app.id)
  } else {
    selectedIds.value = []
  }
}

const toggleSelection = (id) => {
  const index = selectedIds.value.indexOf(id)
  if (index === -1) {
    selectedIds.value.push(id)
  } else {
    selectedIds.value.splice(index, 1)
  }
}

const confirmSelection = () => {
  // تجهيز البيانات لإرسالها لجدول المقابلات الرئيسي
  const selection = applications.value
    .filter((app) => selectedIds.value.includes(app.id))
    .map((app) => ({
      application_id: app.id,
      // الاسم يظهر هنا لأنه مطلوب في جدول الجدولة الداخلي للإدمن
      applicant_name: app.Applicant?.FirstName
        ? `${app.Applicant.FirstName} ${app.Applicant.LastName}`
        : 'مرشح مجهول',
      InterviewTime: '09:00', // وقت افتراضي يبدأ منه المنسق
      Result: 'Pending',
    }))

  emit('select', selection)
  closeModal()
}

const closeModal = () => {
  emit('close')
}
</script>

<style scoped>
/* إضافة أنيميشن بسيط لجعل الجدول يظهر بسلاسة */
tr {
  animation: slideIn 0.2s ease-out forwards;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
