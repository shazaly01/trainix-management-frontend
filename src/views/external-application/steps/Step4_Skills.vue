<template>
  <div class="animate-fade-in">
    <div class="mb-6">
      <h2 class="text-xl font-bold text-text-primary">المهارات</h2>
      <p class="text-sm text-text-muted mt-1">
        أضف المهارات التقنية أو الشخصية التي تتقنها مع تحديد مستوى الكفاءة.
      </p>
    </div>

    <div
      v-if="skillStore.error"
      class="mb-4 p-3 bg-danger/10 border-l-4 border-danger rounded text-danger text-sm"
    >
      {{ skillStore.error }}
    </div>

    <div class="bg-surface-ground border border-surface-border rounded-lg p-5 mb-8">
      <form @submit.prevent="addSkill">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-1">
            <AppInput
              v-model="form.SkillName"
              label="اسم المهارة"
              required
              placeholder="مثال: إدارة المشاريع واللغات والمهارات"
            />
          </div>

          <div class="md:col-span-1">
            <AppDropdown
              v-model="form.ProficiencyLevel"
              label="مستوى الإجادة"
              :options="proficiencyOptions"
              optionLabel="label"
              optionValue="value"
              required
              placeholder="اختر المستوى"
            />
          </div>

          <div class="md:col-span-1 flex items-end">
            <AppButton
              type="submit"
              class="w-full bg-surface-section hover:bg-surface-border text-primary border border-primary transition-colors py-2 rounded flex justify-center items-center"
              :disabled="skillStore.loading"
            >
              <svg
                v-if="!skillStore.loading"
                class="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
              <span>{{ skillStore.loading ? 'جاري الإضافة...' : 'إضافة المهارة' }}</span>
            </AppButton>
          </div>
        </div>
      </form>
    </div>

    <div class="mb-8">
      <h3 class="text-lg font-semibold text-text-primary mb-3">المهارات المضافة</h3>
      <AppTable
        :headers="tableHeaders"
        :items="skillStore.applicantSkills"
        :isLoading="skillStore.loading"
        :rowClickable="false"
      >
        <template #cell-actions="{ item }">
          <button
            @click="deleteSkill(item.id)"
            class="text-danger hover:text-red-400 transition-colors p-1"
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
        </template>
      </AppTable>
    </div>

    <div class="flex justify-between mt-8 pt-4 border-t border-surface-border">
      <AppButton
        type="button"
        @click="emit('go-back')"
        class="bg-surface-section hover:bg-surface-border text-text-primary px-6 py-2 rounded transition-colors"
      >
        السابق
      </AppButton>

      <AppButton
        type="button"
        @click="emit('step-completed')"
        class="bg-primary hover:bg-primary-dark text-white px-8 py-2 rounded transition-colors"
      >
        المتابعة
      </AppButton>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue'
import { useApplicantSkillStore } from '@/stores/applicantSkillStore'
import AppDropdown from '@/components/ui/AppDropdown.vue'

import AppInput from '@/components/ui/AppInput.vue'
// قم بتأكيد استيراد AppTextarea أو استخدم <textarea> العادي إذا لم يكن جاهزاً تماماً
import AppButton from '@/components/ui/AppButton.vue'
import AppTable from '@/components/ui/AppTable.vue'

const props = defineProps({
  applicantId: { type: [Number, String], required: true },
})

const emit = defineEmits(['step-completed', 'go-back'])
const skillStore = useApplicantSkillStore()

const proficiencyOptions = ref([
  { label: 'مبتدئ', value: 'Beginner' },
  { label: 'متوسط', value: 'Intermediate' },
  { label: 'متقدم', value: 'Advanced' },
  { label: 'خبير', value: 'Expert' },
])

const tableHeaders = [
  { key: 'SkillName', label: 'اسم المهارة' },
  { key: 'ProficiencyLevel', label: 'مستوى الإجادة' },
  { key: 'actions', label: 'إجراءات', class: 'w-16 text-center', cellClass: 'text-center' },
]

const form = reactive({
  SkillName: '',
  ProficiencyLevel: '',
})

onMounted(() => {
  if (props.applicantId) {
    skillStore.fetchSkillsByApplicant(props.applicantId)
  }
})

const addSkill = async () => {
  try {
    const payload = { ...form, applicant_id: props.applicantId }
    await skillStore.createSkill(payload)
    resetForm()
    skillStore.fetchSkillsByApplicant(props.applicantId)
  } catch (error) {
    console.error('فشل إضافة المهارة', error)
  }
}

const deleteSkill = async (id) => {
  if (confirm('هل أنت متأكد من حذف هذه المهارة؟')) {
    try {
      await skillStore.deleteSkill(id)
      skillStore.fetchSkillsByApplicant(props.applicantId)
    } catch (error) {
      console.error('فشل الحذف', error)
    }
  }
}

const resetForm = () => {
  form.SkillName = ''
  form.ProficiencyLevel = ''
}
</script>
