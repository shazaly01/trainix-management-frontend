<template>
  <div class="animate-fade-in">
    <div class="mb-6">
      <h2 class="text-xl font-bold text-text-primary">المرفقات والمستندات</h2>
      <p class="text-sm text-text-muted mt-1">
        يرجى رفع سيرتك الذاتية (CV) وأي مستندات أخرى داعمة.
      </p>
    </div>

    <div
      v-if="documentStore.error"
      class="mb-4 p-3 bg-danger/10 border-l-4 border-danger rounded text-danger text-sm"
    >
      {{ documentStore.error }}
    </div>

    <div class="bg-surface-ground border border-surface-border rounded-lg p-5 mb-8">
      <form @submit.prevent="uploadDocument">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <AppDropdown
              id="document_type"
              v-model="form.DocumentType"
              label="نوع المستند"
              :options="documentTypes"
              optionLabel="label"
              optionValue="value"
              required
              placeholder="اختر نوع المستند"
            />

            <AppInput
              id="document_name"
              v-model="form.name"
              label="اسم المستند (اختياري)"
              placeholder="مثال: شهادة PMP، سيرة ذاتية 2024"
            />
          </div>

          <div>
            <AppFileUpload
              v-model="form.file"
              label="ملف المستند"
              accept=".pdf,.doc,.docx"
              :maxSizeMB="5"
            />
          </div>

          <div class="md:col-span-2 flex justify-end mt-2">
            <AppButton
              type="submit"
              class="bg-surface-section hover:bg-surface-border text-primary border border-primary transition-colors py-2 px-6 rounded flex items-center"
              :disabled="documentStore.loading || !form.file"
            >
              <svg
                v-if="!documentStore.loading"
                class="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                ></path>
              </svg>
              <span>{{ documentStore.loading ? 'جاري الرفع...' : 'رفع المستند' }}</span>
            </AppButton>
          </div>
        </div>
      </form>
    </div>

    <div class="mb-8">
      <h3 class="text-lg font-semibold text-text-primary mb-3">المستندات المرفوعة</h3>
      <AppTable
        :headers="tableHeaders"
        :items="documentStore.documents"
        :isLoading="documentStore.loading"
        :rowClickable="false"
      >
        <template #cell-file="{ item }">
          <a
            :href="item.url"
            target="_blank"
            class="text-primary hover:underline text-xs flex items-center"
          >
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              ></path>
            </svg>
            عرض الملف
          </a>
        </template>
        <template #cell-actions="{ item }">
          <button
            @click="deleteDocument(item.id)"
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
        @click="proceedToNext"
        class="bg-primary hover:bg-primary-dark text-white px-8 py-2 rounded transition-colors"
      >
        المراجعة والتقديم
      </AppButton>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue'
// قم بإنشاء واستيراد ستور المستندات بنفس نمط المهارات
import { useDocumentStore } from '@/stores/documentStore'
import AppInput from '@/components/ui/AppInput.vue'
import AppDropdown from '@/components/ui/AppDropdown.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppTable from '@/components/ui/AppTable.vue'
import AppFileUpload from '@/components/ui/AppFileUpload.vue' // المكون الجديد

const props = defineProps({
  applicantId: { type: [Number, String], required: true },
})

const emit = defineEmits(['step-completed', 'go-back'])
const documentStore = useDocumentStore()

const documentTypes = ref([
  { label: 'السيرة الذاتية (CV/Resume)', value: 'Resume' },
  { label: 'رسالة تغطية (Cover Letter)', value: 'Cover_Letter' },
  { label: 'شهادة علمية', value: 'Certificate' },
  { label: 'هوية وطنية / إقامة', value: 'ID_Copy' },
  { label: 'أخرى', value: 'Other' },
])

const tableHeaders = [
  { key: 'DocumentType', label: 'النوع' },
  { key: 'name', label: 'الاسم' },
  { key: 'file', label: 'الملف', class: 'w-24 text-center', cellClass: 'text-center' },
  { key: 'actions', label: 'إجراءات', class: 'w-16 text-center', cellClass: 'text-center' },
]

// لاحظ أن form يحتوي على 'file' وهو عبارة عن كائن (File Object) وليس نصاً
const form = reactive({
  DocumentType: '',
  name: '',
  file: null,
})

onMounted(() => {
  if (props.applicantId) {
    documentStore.fetchDocumentsByApplicant(props.applicantId)
  }
})

// الدالة الأهم: بناء الـ FormData
const uploadDocument = async () => {
  console.log('الملف المختار هو:', form.file)
  if (!form.file) {
    alert('لم يتم التقاط الملف من المكون!') // 👈 أضف هذا التنبيه المؤقت
    return
  }

  // 1. تحويل البيانات إلى FormData لأننا نرسل ملفاً حقيقياً
  const formData = new FormData()
  formData.append('DocumentType', form.DocumentType)
  formData.append('documentable_id', props.applicantId)
  formData.append('documentable_type', 'App\\Models\\Applicant') // العودة لعلاقة الـ Polymorphic في لارافيل
  formData.append('file', form.file)

  if (form.name) {
    formData.append('name', form.name)
  } else {
    // إذا لم يكتب اسماً، نستخدم اسم الملف الأصلي
    formData.append('name', form.file.name)
  }

  try {
    // 2. إرسال الـ FormData عبر الستور (يجب أن يدعم Axios الـ multipart/form-data هنا تلقائياً)
    await documentStore.createDocument(formData)
    resetForm()
    documentStore.fetchDocumentsByApplicant(props.applicantId)
  } catch (error) {
    console.error('فشل رفع المستند', error)
  }
}

const deleteDocument = async (id) => {
  if (confirm('هل أنت متأكد من حذف هذا المستند؟')) {
    try {
      await documentStore.deleteDocument(id)
      documentStore.fetchDocumentsByApplicant(props.applicantId)
    } catch (error) {
      console.error('فشل الحذف', error)
    }
  }
}

const resetForm = () => {
  form.DocumentType = ''
  form.name = ''
  form.file = null
}

const proceedToNext = () => {
  // ✅ التعديل هنا: استخدام .documents بدلاً من applicantDocuments وإضافة حماية || []
  const docs = documentStore.documents || []

  const hasResume = docs.some((doc) => doc.DocumentType === 'Resume')
  if (!hasResume) {
    if (!confirm('لم تقم برفع سيرة ذاتية (Resume). هل ترغب في المتابعة بدونها؟')) return
  }
  emit('step-completed')
}
</script>
