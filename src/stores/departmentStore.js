import { defineStore } from 'pinia'
import { ref } from 'vue'
import departmentService from '@/services/DepartmentService'

export const useDepartmentStore = defineStore('department', () => {
  // --- State ---
  const departments = ref([])
  const activeDepartments = ref([]) // مخصص للقوائم المنسدلة
  const pagination = ref({})
  const currentDepartment = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---
  async function fetchDepartments(page = 1, search = '') {
    loading.value = true
    error.value = null
    try {
      const response = await departmentService.get(page, search)
      departments.value = response.data.data
      pagination.value = response.data.meta || {}
    } catch (err) {
      error.value = 'فشل في جلب الإدارات.'
      console.error(err)
      departments.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchActiveDepartments() {
    loading.value = true
    error.value = null
    try {
      const response = await departmentService.getActive()
      activeDepartments.value = response.data.data
    } catch (err) {
      error.value = 'فشل في جلب الإدارات المفعلة.'
      console.error(err)
      activeDepartments.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchDepartment(id) {
    loading.value = true
    error.value = null
    currentDepartment.value = null
    try {
      const response = await departmentService.find(id)
      currentDepartment.value = response.data.data
    } catch (err) {
      error.value = 'فشل في جلب تفاصيل الإدارة.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function createDepartment(payload) {
    loading.value = true
    error.value = null
    try {
      await departmentService.create(payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في إضافة الإدارة.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateDepartment(id, payload) {
    loading.value = true
    error.value = null
    try {
      await departmentService.update(id, payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في تحديث بيانات الإدارة.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteDepartment(id) {
    loading.value = true
    error.value = null
    try {
      await departmentService.delete(id)
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في حذف الإدارة.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    departments,
    activeDepartments,
    pagination,
    currentDepartment,
    loading,
    error,
    fetchDepartments,
    fetchActiveDepartments,
    fetchDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  }
})
