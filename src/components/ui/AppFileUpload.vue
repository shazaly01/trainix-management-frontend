<template>
  <div class="w-full">
    <label v-if="label" class="block text-sm font-medium text-text-primary mb-1">{{ label }}</label>

    <div
      class="relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors duration-300"
      :class="[
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-surface-border hover:border-primary/50 bg-surface-section',
        error ? 'border-danger bg-danger/5' : '',
      ]"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <input
        type="file"
        ref="fileInput"
        class="hidden"
        :accept="accept"
        @change="handleFileSelect"
      />

      <div v-if="!selectedFile" class="text-center cursor-pointer">
        <svg
          class="mx-auto h-12 w-12 text-text-muted mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          ></path>
        </svg>
        <p class="text-sm text-text-primary font-medium">
          اضغط لاختيار ملف أو قم بسحبه وإفلاته هنا
        </p>
        <p class="text-xs text-text-muted mt-1">
          الصيغ المدعومة: {{ accept }} (الحد الأقصى: {{ maxSizeMB }}MB)
        </p>
      </div>

      <div v-else class="text-center w-full">
        <svg
          class="mx-auto h-10 w-10 text-success mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <p class="text-sm font-medium text-text-primary truncate px-4">{{ selectedFile.name }}</p>
        <p class="text-xs text-text-muted mt-1">{{ formatFileSize(selectedFile.size) }}</p>

        <button
          @click.stop="removeFile"
          class="mt-3 text-xs text-danger hover:text-red-400 font-medium transition-colors"
        >
          إزالة الملف
        </button>
      </div>
    </div>

    <p v-if="error" class="text-xs text-danger mt-1">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  label: { type: String, default: '' },
  accept: { type: String, default: '.pdf,.doc,.docx' },
  maxSizeMB: { type: Number, default: 5 },
})

const emit = defineEmits(['update:modelValue', 'error'])

const fileInput = ref(null)
const isDragging = ref(false)
const selectedFile = ref(null)
const error = ref('')

// فتح نافذة اختيار الملفات
const triggerFileInput = () => {
  fileInput.value.click()
}

// معالجة اختيار الملف عبر النقر
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  processFile(file)
}

// معالجة السحب والإفلات
const handleDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  processFile(file)
}

// التحقق من الملف وتخزينه
const processFile = (file) => {
  error.value = ''
  if (!file) return

  // التحقق من حجم الملف
  const fileSizeMB = file.size / (1024 * 1024)
  if (fileSizeMB > props.maxSizeMB) {
    error.value = `حجم الملف يجب ألا يتجاوز ${props.maxSizeMB} ميجابايت.`
    emit('error', error.value)
    return
  }

  selectedFile.value = file
  emit('update:modelValue', file) // إرسال الملف الفعلي (Object) للأب
}

// إزالة الملف المختار
const removeFile = () => {
  selectedFile.value = null
  fileInput.value.value = '' // تفريغ الـ input
  error.value = ''
  emit('update:modelValue', null)
}

// تحويل حجم الملف إلى صيغة مقروءة
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>
