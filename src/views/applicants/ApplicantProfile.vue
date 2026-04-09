<template>
  <div class="animate-fade-in">
    <div class="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div class="flex items-center gap-4">
        <button
          @click="router.push({ name: 'ApplicantsList' })"
          class="p-2 hover:bg-surface-section rounded-full transition-colors text-text-muted hover:text-primary"
          title="العودة للقائمة"
        >
          <svg class="w-6 h-6 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
        </button>
        <div>
          <h1 class="text-2xl font-bold text-text-primary">
            {{ isEditMode ? `ملف المتقدم: ${applicantName}` : 'إضافة متقدم جديد' }}
          </h1>
          <p class="text-sm text-text-muted mt-1">
            إدارة كافة بيانات ومرفقات طلب التوظيف من مكان واحد.
          </p>
        </div>
      </div>

      <div v-if="isEditMode" class="flex items-center gap-2">
        <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
          رقم المتقدم: {{ applicantData?.ApplicantNo || '---' }}
        </span>
      </div>
    </div>

    <div class="flex border-b border-surface-border mb-6 overflow-x-auto no-scrollbar">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="px-6 py-3 text-sm font-medium transition-all border-b-2 whitespace-nowrap"
        :class="
          activeTab === tab.id
            ? 'border-primary text-primary bg-primary/5'
            : 'border-transparent text-text-muted hover:text-text-primary hover:bg-surface-section'
        "
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="transition-all duration-300">
      <component
        :is="currentTabComponent"
        :applicantId="applicantId"
        :applicantData="applicantData"
        @saved="handleApplicantSaved"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, markRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApplicantStore } from '@/stores/ApplicantStore'

// استيراد المكونات الصغيرة التي بنيناها
import BasicInfoTab from './components/BasicInfoTab.vue'
import QualificationsTab from './components/QualificationsTab.vue'
import ExperiencesTab from './components/ExperiencesTab.vue'
import SkillsTab from './components/SkillsTab.vue'
import DocumentsTab from './components/DocumentsTab.vue'

const route = useRoute()
const router = useRouter()
const applicantStore = useApplicantStore()

// الحالة (State)
const activeTab = ref('basic')
const applicantId = ref(route.params.id || null)
const applicantData = ref(null)

const isEditMode = computed(() => !!applicantId.value)
const applicantName = computed(() =>
  applicantData.value
    ? `${applicantData.value.FirstName} ${applicantData.value.LastName}`
    : 'جاري التحميل...',
)

// تعريف التبويبات
const tabs = [
  { id: 'basic', label: 'البيانات الأساسية', component: markRaw(BasicInfoTab) },
  { id: 'qualifications', label: 'المؤهلات العلمية', component: markRaw(QualificationsTab) },
  { id: 'experiences', label: 'الخبرات المهنية', component: markRaw(ExperiencesTab) },
  { id: 'skills', label: 'المهارات', component: markRaw(SkillsTab) },
  { id: 'documents', label: 'المستندات والمرفقات', component: markRaw(DocumentsTab) },
]

// المكون الحالي بناءً على التبويب النشط
const currentTabComponent = computed(() => {
  return tabs.find((t) => t.id === activeTab.value)?.component
})

// جلب بيانات المتقدم إذا كنا في وضع التعديل
const fetchInitialData = async () => {
  if (applicantId.value) {
    try {
      const data = await applicantStore.fetchApplicant(applicantId.value)
      applicantData.value = data
    } catch (error) {
      console.error('خطأ في جلب بيانات المتقدم:', error)
    }
  }
}

onMounted(fetchInitialData)

// دالة تُستدعى بعد حفظ البيانات الأساسية لأول مرة
const handleApplicantSaved = (data) => {
  if (!applicantId.value && data.id) {
    // إذا كان المتقدم جديداً، نقوم بتحديث الـ ID ونبقى في نفس الصفحة كوضع تعديل
    applicantId.value = data.id
    // تحديث الرابط في المتصفح ليكون /applicants/edit/ID بدون إعادة تحميل الصفحة
    router.replace({ name: 'ApplicantProfile', params: { id: data.id } })
    fetchInitialData() // جلب البيانات الكاملة (مثل الرقم المولد ApplicantNo)
  }
}
</script>

<style scoped>
/* إخفاء شريط التمرير للتبويبات مع الحفاظ على وظيفته */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
