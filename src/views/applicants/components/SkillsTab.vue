<template>
  <div class="animate-fade-in bg-surface-ground p-6 rounded-lg border border-surface-border">
    <div v-if="!applicantId" class="text-center py-10">
      <div
        class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-warning/10 text-warning mb-4"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          ></path>
        </svg>
      </div>
      <h3 class="text-lg font-bold text-text-primary">يرجى حفظ البيانات الأساسية أولاً</h3>
      <p class="text-sm text-text-muted mt-2">
        لا يمكنك إضافة مهارات قبل حفظ الملف الأساسي للمتقدم.
      </p>
    </div>

    <div v-else>
      <div class="mb-6 border-b border-surface-border pb-4">
        <h3 class="text-lg font-bold text-text-primary">المهارات والقدرات</h3>
        <p class="text-sm text-text-muted mt-1">
          إضافة المهارات التقنية والشخصية مع تحديد مستوى الإتقان.
        </p>
      </div>

      <div
        v-if="skillStore.error"
        class="mb-4 p-3 bg-danger/10 border-l-4 border-danger rounded text-danger text-sm"
      >
        {{ skillStore.error }}
      </div>

      <form
        @submit.prevent="addSkill"
        class="bg-surface-section p-5 rounded-lg border border-surface-border mb-8"
      >
        <h4 class="text-md font-semibold text-primary mb-4">إضافة مهارة جديدة</h4>
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div class="md:col-span-6">
            <AppInput
              id="skill_name"
              v-model="form.SkillName"
              label="اسم المهارة"
              required
              placeholder="مثال: Microsoft Excel، برمجة Java، القيادة..."
            />
          </div>

          <div class="md:col-span-4">
            <AppDropdown
              id="proficiency"
              v-model="form.ProficiencyLevel"
              label="مستوى الإتقان"
              :options="proficiencyOptions"
              optionLabel="label"
              optionValue="value"
              required
            />
          </div>

          <div class="md:col-span-2">
            <AppButton
              type="submit"
              class="w-full bg-primary hover:bg-primary-dark text-white py-2.5 rounded transition-all shadow-md"
              :disabled="skillStore.loading || !form.SkillName.trim()"
            >
              {{ skillStore.loading ? '...' : 'إضافة' }}
            </AppButton>
          </div>
        </div>
      </form>

      <div>
        <h4 class="text-md font-semibold text-text-primary mb-3">المهارات المسجلة</h4>
        <AppTable
          :headers="tableHeaders"
          :items="skillStore.applicantSkills || []"
          :isLoading="skillStore.loading"
          :rowClickable="false"
        >
          <template #cell-ProficiencyLevel="{ item }">
            <span
              class="px-3 py-1 rounded-full text-xs font-bold inline-block"
              :class="getProficiencyBadgeClass(item.ProficiencyLevel)"
            >
              {{ translateProficiency(item.ProficiencyLevel) }}
            </span>
          </template>

          <template #cell-actions="{ item }">
            <button
              @click="deleteSkill(item.id)"
              class="text-text-muted hover:text-danger p-2 rounded-lg hover:bg-danger/5 transition-colors"
              title="حذف المهارة"
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
          </template>
        </AppTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, watch } from 'vue'
import { useApplicantSkillStore } from '@/stores/applicantSkillStore'
import AppInput from '@/components/ui/AppInput.vue'
import AppDropdown from '@/components/ui/AppDropdown.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppTable from '@/components/ui/AppTable.vue'

const props = defineProps({
  applicantId: { type: [Number, String], default: null },
})

const skillStore = useApplicantSkillStore()

// خيارات مستويات الإتقان (تطابق Enum في لارافل)
const proficiencyOptions = [
  { label: 'مبتدئ (Beginner)', value: 'Beginner' },
  { label: 'متوسط (Intermediate)', value: 'Intermediate' },
  { label: 'متقدم (Advanced)', value: 'Advanced' },
  { label: 'خبير (Expert)', value: 'Expert' },
]

const tableHeaders = [
  { key: 'SkillName', label: 'اسم المهارة' },
  { key: 'ProficiencyLevel', label: 'المستوى', class: 'text-center', cellClass: 'text-center' },
  { key: 'actions', label: 'إجراءات', class: 'w-16 text-center', cellClass: 'text-center' },
]

const form = reactive({
  SkillName: '',
  ProficiencyLevel: 'Intermediate', // القيمة الافتراضية
})

const loadSkills = () => {
  if (props.applicantId) {
    skillStore.fetchSkillsByApplicant(props.applicantId)
  }
}

onMounted(loadSkills)

watch(
  () => props.applicantId,
  (newId) => {
    if (newId) loadSkills()
  },
)

const addSkill = async () => {
  if (!props.applicantId || !form.SkillName.trim()) return

  try {
    const payload = {
      applicant_id: props.applicantId,
      SkillName: form.SkillName,
      ProficiencyLevel: form.ProficiencyLevel,
    }

    await skillStore.createSkill(payload)

    // تفريغ الحقول بعد النجاح
    form.SkillName = ''
    form.ProficiencyLevel = 'Intermediate'

    // إعادة تحميل الجدول (استخدام await لضمان التحديث)
    await loadSkills()
  } catch (error) {
    console.error('فشل إضافة المهارة:', error)
  }
}

const deleteSkill = async (id) => {
  if (confirm('هل أنت متأكد من حذف هذه المهارة؟')) {
    try {
      await skillStore.deleteSkill(id)
      loadSkills()
    } catch (error) {
      console.error('فشل حذف المهارة:', error)
    }
  }
}

// دوال مساعدة للتنسيق (Helper Functions)
const translateProficiency = (level) => {
  const levels = {
    Beginner: 'مبتدئ',
    Intermediate: 'متوسط',
    Advanced: 'متقدم',
    Expert: 'خبير',
  }
  return levels[level] || level
}

const getProficiencyBadgeClass = (level) => {
  const classes = {
    Beginner: 'bg-slate-100 text-slate-600',
    Intermediate: 'bg-blue-100 text-blue-600',
    Advanced: 'bg-indigo-100 text-indigo-600',
    Expert: 'bg-emerald-100 text-emerald-600',
  }
  return classes[level] || 'bg-gray-100 text-gray-600'
}
</script>
