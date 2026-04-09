<!--src\views\job-requests\JobRequestForm.vue-->
<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div
      v-if="isEditing && initialData?.ApplyLink"
      class="bg-primary/5 border border-primary/20 p-4 rounded-xl mb-6"
    >
      <label class="text-xs text-primary font-bold block mb-2"
        >رابط التقديم المباشر لهذه الوظيفة:</label
      >
      <div class="flex items-center gap-2">
        <input
          type="text"
          readonly
          :value="initialData.ApplyLink"
          class="flex-1 bg-surface-ground border-none text-sm font-mono text-text-secondary py-1 px-2 rounded outline-none"
        />
        <AppButton
          type="button"
          size="sm"
          variant="primary"
          @click="copyApplyLink(initialData.ApplyLink)"
        >
          نسخ الرابط
        </AppButton>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AppInput
        v-model="form.RequiredMajor"
        id="required_major"
        label="المسمى الوظيفي / التخصص"
        placeholder="مثال: مهندس برمجيات، محاسب تكاليف..."
        required
      />

      <DepartmentsDropdown
        id="department_id"
        v-model="form.department_id"
        label="الإدارة التابع لها"
        required
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AppInput
        v-model="form.RequiredDegreeLevel"
        id="degree_level"
        label="المؤهل العلمي المطلوب"
        placeholder="مثال: بكالوريوس، دبلوم عالي..."
        required
      />

      <AppInput
        v-model="form.RequiredYearsOfExperience"
        id="exp_years"
        type="number"
        label="سنوات الخبرة المطلوبة"
        placeholder="0"
        required
      />
    </div>

    <AppTextarea
      v-model="form.JobDescription"
      id="job_description"
      label="وصف الوظيفة والمسؤوليات"
      placeholder="اكتب هنا تفاصيل المهام الوظيفية والمسؤوليات المتوقعة..."
      rows="6"
    />

    <div class="flex items-center gap-2">
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
        class="text-sm text-text-primary font-medium cursor-pointer select-none"
      >
        حالة الطلب:
        <span :class="form.Status === 'Open' ? 'text-success' : 'text-danger'">{{
          form.Status === 'Open' ? 'مفتوح (يسمح بالتقديم)' : 'مغلق (رابط التقديم سيتوقف)'
        }}</span>
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
        class="px-8"
      >
        {{ isEditing ? 'تحديث البيانات' : 'نشر الوظيفة الآن' }}
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

// 1. تعريف الحالة (State) أولاً
const form = ref({
  department_id: '',
  RequiredDegreeLevel: '',
  RequiredMajor: '',
  RequiredYearsOfExperience: 0,
  JobDescription: '',
  Status: 'Open',
})

const isEditing = computed(() => !!props.initialData)

// 2. تعريف الدوال المساعدة (Helpers) ثانياً
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

const copyApplyLink = (link) => {
  if (!link) return
  navigator.clipboard.writeText(link).then(() => {
    alert('تم نسخ الرابط بنجاح!')
  })
}

const handleSubmit = () => {
  emit('submit', { ...form.value })
}

// 3. تعريف الـ Watcher ثالثاً (الآن سيجد resetForm جاهزة)
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
      resetForm() // ✅ الآن ستعمل بدون أخطاء
    }
  },
  { immediate: true },
)
</script>
