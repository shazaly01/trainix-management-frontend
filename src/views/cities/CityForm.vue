<template>
  <form @submit.prevent="handleSubmit" class="space-y-5">
    <AppInput v-model="form.Name" label="اسم المدينة" placeholder="أدخل اسم المدينة..." required />

    <div class="flex items-center gap-2 mt-2">
      <input
        v-model="form.IsActive"
        type="checkbox"
        id="isActive"
        class="h-4 w-4 rounded border-surface-border text-primary focus:ring-primary"
      />
      <label for="isActive" class="text-sm text-text-secondary cursor-pointer">
        مدينة مفعلة (تظهر في القوائم)
      </label>
    </div>

    <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-surface-border">
      <AppButton type="button" variant="secondary" @click="$emit('cancel')"> إلغاء </AppButton>

      <AppButton type="submit" variant="primary" :loading="loading" :disabled="loading">
        {{ isEditing ? 'تحديث البيانات' : 'حفظ المدينة' }}
      </AppButton>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'

const props = defineProps({
  initialData: {
    type: Object,
    default: () => null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit', 'cancel'])

// ✅ تم توحيد المسميات مع الباك-أند (PascalCase)
const form = ref({
  Name: '',
  IsActive: true,
})

const isEditing = computed(() => !!props.initialData)

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.value = {
        // نأخذ القيمة سواء كانت بكبيرة أو صغيرة لضمان المرونة
        Name: newData.Name || newData.name || '',
        IsActive: newData.IsActive !== undefined ? !!newData.IsActive : !!newData.is_active,
      }
    } else {
      form.value = { Name: '', IsActive: true }
    }
  },
  { immediate: true },
)

const handleSubmit = () => {
  emit('submit', form.value)
}
</script>
