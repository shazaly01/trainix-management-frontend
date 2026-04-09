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
        لا يمكنك رفع مرفقات قبل حفظ الملف الأساسي للمتقدم لإنشاء الرقم المرجعي.
      </p>
    </div>

    <div v-else>
      <div class="mb-6 border-b border-surface-border pb-4">
        <h3 class="text-lg font-bold text-text-primary">المستندات والمرفقات</h3>
        <p class="text-sm text-text-muted mt-1">
          رفع وإدارة السيرة الذاتية، صور الهوية، والشهادات الثبوتية.
        </p>
      </div>

      <div
        v-if="documentStore.error"
        class="mb-4 p-3 bg-danger/10 border-l-4 border-danger rounded text-danger text-sm"
      >
        {{ documentStore.error }}
      </div>

      <form
        @submit.prevent="uploadDocument"
        class="bg-surface-section p-5 rounded-lg border border-surface-border mb-8"
      >
        <h4 class="text-md font-semibold text-primary mb-4">رفع مستند جديد</h4>
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
              label="وصف المستند (اختياري)"
              placeholder="مثال: شهادة التخرج الأصلية"
            />
          </div>

          <div>
            <AppFileUpload
              v-model="form.file"
              label="اختر الملف (PDF, JPG, PNG)"
              accept=".pdf,.jpg,.jpeg,.png"
              :maxSizeMB="5"
              required
            />
            <p class="text-[10px] text-text-muted mt-2">الحجم الأقصى للملف: 5 ميجابايت.</p>
          </div>

          <div class="md:col-span-2 flex justify-end mt-2 border-t border-surface-border pt-4">
            <AppButton
              type="submit"
              class="bg-primary hover:bg-primary-dark text-white px-10 py-2.5 rounded-lg transition-all shadow-lg"
              :disabled="documentStore.loading || !form.file"
            >
              <span v-if="documentStore.loading" class="flex items-center"> جاري الرفع... </span>
              <span v-else>رفع وحفظ المستند</span>
            </AppButton>
          </div>
        </div>
      </form>

      <div>
        <h4 class="text-md font-semibold text-text-primary mb-3">المستندات المؤرشفة</h4>
        <AppTable
          :headers="tableHeaders"
          :items="documentStore.documents || []"
          :isLoading="documentStore.loading"
          :rowClickable="false"
        >
          <template #cell-file_path="{ item }">
            <a
              v-if="item.url"
              :href="item.url"
              target="_blank"
              class="text-primary hover:text-primary-dark font-bold text-xs flex items-center justify-center gap-1 underline"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              معاينة الملف
            </a>
          </template>

          <template #cell-actions="{ item }">
            <button
              @click="deleteDocument(item.id)"
              class="text-text-muted hover:text-danger p-2 rounded-lg hover:bg-danger/5 transition-colors"
              title="حذف المستند"
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
import { useDocumentStore } from '@/stores/documentStore'
import AppInput from '@/components/ui/AppInput.vue'
import AppDropdown from '@/components/ui/AppDropdown.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppTable from '@/components/ui/AppTable.vue'
import AppFileUpload from '@/components/ui/AppFileUpload.vue'

const props = defineProps({
  applicantId: { type: [Number, String], default: null },
})

const documentStore = useDocumentStore()

const documentTypes = [
  { label: 'السيرة الذاتية (CV)', value: 'Resume' },
  { label: 'البطاقة الشخصية / الإقامة', value: 'ID_Card' },
  { label: 'الشهادة الجامعية', value: 'Degree_Certificate' },
  { label: 'شهادة خبرة', value: 'Experience_Certificate' },
  { label: 'أخرى', value: 'Other' },
]

const tableHeaders = [
  { key: 'DocumentType', label: 'النوع' },
  { key: 'name', label: 'الوصف' },
  { key: 'file_path', label: 'المستند', class: 'w-32 text-center', cellClass: 'text-center' },
  { key: 'actions', label: 'إجراءات', class: 'w-16 text-center', cellClass: 'text-center' },
]

const form = reactive({
  DocumentType: 'Resume',
  name: '',
  file: null,
})

const loadDocuments = () => {
  if (props.applicantId) {
    documentStore.fetchDocumentsByApplicant(props.applicantId)
  }
}

onMounted(loadDocuments)

watch(
  () => props.applicantId,
  (newId) => {
    if (newId) loadDocuments()
  },
)

const uploadDocument = async () => {
  if (!props.applicantId || !form.file) return

  // 🚨 إنشاء FormData لإرسال الملف والبيانات معاً
  const formData = new FormData()
  formData.append('file', form.file)
  formData.append('name', form.name || form.file.name)
  formData.append('DocumentType', form.DocumentType)

  // ✅ مطابقة بيانات العلاقة متعددة الأشكال المطلوبة في Laravel Request
  formData.append('documentable_id', props.applicantId)
  formData.append('documentable_type', 'App\\Models\\Applicant')

  try {
    await documentStore.createDocument(formData)

    // إعادة تعيين النموذج
    form.DocumentType = 'Resume'
    form.name = ''
    form.file = null

    // تحديث الجدول
    await loadDocuments()
  } catch (error) {
    console.error('فشل رفع المستند:', error)
  }
}

const deleteDocument = async (id) => {
  if (confirm('هل أنت متأكد من حذف هذا المرفق نهائياً؟')) {
    try {
      await documentStore.deleteDocument(id)
      loadDocuments()
    } catch (error) {
      console.error('فشل حذف المستند:', error)
    }
  }
}
</script>
