<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div
      v-if="isEditing && trainingLink"
      class="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-6"
    >
      <label class="text-xs text-blue-700 font-bold block mb-2"
        >رابط التسجيل المباشر لهذه الدورة:</label
      >
      <div class="flex items-center gap-2">
        <input
          type="text"
          readonly
          :value="trainingLink"
          class="flex-1 bg-white border border-blue-100 text-sm font-mono text-slate-600 py-2 px-3 rounded-lg outline-none"
        />
        <AppButton
          type="button"
          size="sm"
          variant="primary"
          @click="copyApplyLink"
          class="bg-blue-600 hover:bg-blue-700 text-white"
        >
          نسخ الرابط
        </AppButton>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AppInput
        v-model="form.RequiredMajor"
        id="required_major"
        label="اسم الدورة التدريبية"
        placeholder="مثال: دورة صيانة الحاسب الآلي، إدارة المشاريع..."
        required
      />

      <DepartmentsDropdown
        id="department_id"
        v-model="form.department_id"
        label="الجهة المنظمة / الإدارة التابع لها"
        required
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AppInput
        v-model="form.RequiredDegreeLevel"
        id="degree_level"
        label="المؤهل العلمي المطلوب (إن وجد)"
        placeholder="مثال: بكالوريوس، دبلوم، أو غير محدد..."
        required
      />

      <AppInput
        v-model="form.RequiredYearsOfExperience"
        id="exp_years"
        type="number"
        label="سنوات الخبرة المطلوبة (أو 0 للمبتدئين)"
        placeholder="0"
        required
      />
    </div>

    <AppTextarea
      v-model="form.JobDescription"
      id="job_description"
      label="وصف الدورة والمحاور التدريبية"
      placeholder="اكتب هنا تفاصيل الدورة، المحاور الأساسية، والأهداف المرجوة من التدريب..."
      rows="6"
    />

    <div
      class="flex items-center gap-2 bg-surface-ground p-3 rounded-lg border border-surface-border"
    >
      <input
        v-model="form.Status"
        type="checkbox"
        id="is_open_status"
        true-value="Open"
        false-value="Closed"
        class="h-5 w-5 rounded border-surface-border text-primary focus:ring-primary cursor-pointer"
      />
      <label
        for="is_open_status"
        class="text-sm text-text-primary font-bold cursor-pointer select-none flex items-center gap-2"
      >
        حالة التسجيل:
        <span
          :class="
            form.Status === 'Open'
              ? 'text-green-600 bg-green-50 px-2 py-0.5 rounded'
              : 'text-red-600 bg-red-50 px-2 py-0.5 rounded'
          "
        >
          {{ form.Status === 'Open' ? 'مفتوح (يسمح بالتسجيل)' : 'مغلق (الرابط سيتوقف)' }}
        </span>
      </label>
    </div>

    <div class="flex justify-end gap-3 mt-8 pt-5 border-t border-surface-border">
      <AppButton type="button" variant="secondary" @click="$emit('cancel')" :disabled="loading">
        إلغاء
      </AppButton>

      <AppButton
        type="submit"
        variant="primary"
        :loading="loading"
        :disabled="loading"
        class="px-8 shadow-lg shadow-primary/30"
      >
        {{ isEditing ? 'تحديث بيانات الدورة' : 'نشر الدورة التدريبية' }}
      </AppButton>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppTextarea from '@/components/ui/AppTextarea.vue'
import AppButton from '@/components/ui/AppButton.vue'
import DepartmentsDropdown from '@/components/forms/DepartmentsDropdown.vue'

const props = defineProps({
  initialData: { type: Object, default: null },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['submit', 'cancel'])

// 1. تعريف الحالة (State)
const form = ref({
  department_id: '',
  RequiredDegreeLevel: '',
  RequiredMajor: '',
  RequiredYearsOfExperience: 0,
  JobDescription: '',
  Status: 'Open',
})

const isEditing = computed(() => !!props.initialData)

// ✅ خاصية ذكية لتعديل الرابط القادم من الباك إند ليناسب "التدريب"
const trainingLink = computed(() => {
  if (!props.initialData || !props.initialData.ApplyLink) return ''
  return props.initialData.ApplyLink.replace('/apply/', '/training/')
})

// 2. تعريف الدوال المساعدة
const resetForm = () => {
  form.value = {
    department_id: '',
    RequiredDegreeLevel: '',
    RequiredMajor: '',
    RequiredYearsOfExperience: 0,
    JobDescription: '',
    Status: 'Open',
  }
}

// دالة نسخ الرابط بعد تعديله
const copyApplyLink = () => {
  if (!trainingLink.value) return
  navigator.clipboard.writeText(trainingLink.value).then(() => {
    alert('تم نسخ رابط الدورة التدريبية بنجاح!')
  })
}

const handleSubmit = () => {
  emit('submit', { ...form.value })
}

// 3. مراقبة التغييرات (Watcher)
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.value = {
        department_id: newData.department_id,
        RequiredDegreeLevel: newData.RequiredDegreeLevel,
        RequiredMajor: newData.RequiredMajor,
        RequiredYearsOfExperience: Number(newData.RequiredYearsOfExperience || 0),
        JobDescription: newData.JobDescription || '',
        Status: newData.Status || 'Open',
      }
    } else {
      resetForm()
    }
  },
  { immediate: true },
)
</script>
