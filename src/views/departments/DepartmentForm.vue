<template>
  <form @submit.prevent="handleSubmit" class="space-y-5">
    <AppInput
      v-model="form.Name"
      id="dept_name"
      label="اسم الإدارة / القسم"
      placeholder="مثلاً: إدارة الموارد البشرية، قسم التقنية..."
      required
    />

    <div class="flex items-center gap-3 mt-2 p-1">
      <input
        v-model="form.IsActive"
        type="checkbox"
        id="isActiveDept"
        class="h-5 w-5 rounded border-surface-border text-primary focus:ring-primary cursor-pointer"
      />
      <label for="isActiveDept" class="text-sm text-text-secondary cursor-pointer select-none">
        إدارة مفعلة (تظهر في قوائم النظام)
      </label>
    </div>

    <div class="flex justify-end gap-3 mt-8 pt-5 border-t border-surface-border">
      <AppButton type="button" variant="secondary" @click="$emit('cancel')" :disabled="loading">
        إلغاء
      </AppButton>

      <AppButton type="submit" variant="primary" :loading="loading" :disabled="loading">
        {{ isEditing ? 'تحديث البيانات' : 'حفظ الإدارة' }}
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

// ✅ الحالة الابتدائية للنموذج (باستخدام PascalCase للمطابقة مع الباك-أند)
const form = ref({
  Name: '',
  IsActive: true,
  // ملاحظة: DeptCode سيتم توليده في السيرفر أو إضافته آلياً عند الإرسال
})

const isEditing = computed(() => !!props.initialData)

/**
 * مراقبة البيانات القادمة من الأب (في حالة التعديل)
 * لتعبئة النموذج تلقائياً عند فتح المودال
 */
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.value = {
        // نأخذ القيمة سواء كانت Name أو name لضمان أقصى مرونة
        Name: newData.Name || newData.name || '',
        IsActive: newData.IsActive !== undefined ? !!newData.IsActive : !!newData.is_active,
        // إذا كان التعديل يتطلب كود الإدارة، نحتفظ به هنا ليُرسل مرة أخرى
        DeptCode: newData.DeptCode || null,
      }
    } else {
      // إعادة تعيين النموذج في حالة الإضافة الجديدة
      form.value = { Name: '', IsActive: true }
    }
  },
  { immediate: true },
)

const handleSubmit = () => {
  // إرسال البيانات للأب (DepartmentModal) ليقوم بعملية الـ API
  emit('submit', { ...form.value })
}
</script>
