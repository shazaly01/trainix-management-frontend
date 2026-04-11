// src/services/apiClient.js
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // إضافة مهمة
  },
})

// 1. نقطة تفتيش الإرسال (Request Interceptor) - كودك الأصلي
apiClient.interceptors.request.use(
  (config) => {
    // ملاحظة: يجب استدعاء الـ store داخل الـ interceptor لتجنب التحميل الدائري
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// 2. 🌟 [الحل هنا] نقطة تفتيش الاستقبال (Response Interceptor)
apiClient.interceptors.response.use(
  (response) => {
    // إذا كان الرد سليماً، يمر بسلام
    return response
  },
  (error) => {
    // التقاط أي خطأ قادم من السيرفر
    if (error.response && error.response.status === 401) {
      // 401 يعني أن التوكين انتهى أو تم تغييره من جهاز آخر
      const authStore = useAuthStore()

      // نستدعي دالتك الممتازة التي تنظف الذاكرة وتوجه المستخدم لصفحة الدخول
      authStore.logout()
    }

    // تمرير الخطأ لباقي الأكواد (مثل 422 أو 404)
    return Promise.reject(error)
  },
)

export default apiClient
