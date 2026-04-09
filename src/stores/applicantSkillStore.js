import { defineStore } from 'pinia'
import { ref } from 'vue'
import applicantSkillService from '@/services/ApplicantSkillService'

export const useApplicantSkillStore = defineStore('applicantSkill', () => {
  // --- State ---
  const skills = ref([])
  const applicantSkills = ref([])
  const pagination = ref({})
  const currentSkill = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---
  async function fetchSkills(page = 1, search = '') {
    loading.value = true
    error.value = null
    try {
      const response = await applicantSkillService.get(page, search)
      skills.value = response.data.data
      pagination.value = response.data.meta || {}
    } catch (err) {
      error.value = 'فشل في جلب المهارات.'
      console.error(err)
      skills.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchSkillsByApplicant(applicantId) {
    loading.value = true
    error.value = null
    try {
      const response = await applicantSkillService.getByApplicant(applicantId)
      applicantSkills.value = response.data.data
    } catch (err) {
      error.value = 'فشل في جلب مهارات المتقدم.'
      console.error(err)
      applicantSkills.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchSkill(id) {
    loading.value = true
    error.value = null
    currentSkill.value = null
    try {
      const response = await applicantSkillService.find(id)
      currentSkill.value = response.data.data
    } catch (err) {
      error.value = 'فشل في جلب تفاصيل المهارة.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function createSkill(payload) {
    loading.value = true
    error.value = null
    try {
      await applicantSkillService.create(payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في إضافة المهارة.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateSkill(id, payload) {
    loading.value = true
    error.value = null
    try {
      await applicantSkillService.update(id, payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في تحديث المهارة.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteSkill(id) {
    loading.value = true
    error.value = null
    try {
      await applicantSkillService.delete(id)
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في حذف المهارة.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    skills,
    applicantSkills,
    pagination,
    currentSkill,
    loading,
    error,
    fetchSkills,
    fetchSkillsByApplicant,
    fetchSkill,
    createSkill,
    updateSkill,
    deleteSkill,
  }
})
