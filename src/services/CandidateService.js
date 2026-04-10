import apiClient from './apiClient'

const resource = '/candidates'

export default {
  /**
   * ✅ تم إضافة دعم الفلاتر كما طلبت.
   * يمكنك تمرير كائن (Object) يحتوي على الفلاتر الإضافية من الواجهة
   * مثال: filters = { IsFit: 1, Size: 'XL' }
   */
  get(page = 1, search = '', filters = {}) {
    return apiClient.get(resource, {
      params: {
        page: page,
        search: search,
        ...filters, // دمج أي فلاتر إضافية يتم تمريرها
      },
    })
  },

  find(id) {
    return apiClient.get(`${resource}/${id}`)
  },

  create(payload) {
    // Axios سيتعرف تلقائياً على أن الـ payload هو FormData (لوجود صورة)
    // ويقوم بضبط الـ Headers المناسبة.
    return apiClient.post(resource, payload)
  },

  update(id, payload) {
    if (payload instanceof FormData) {
      // 1. إضافة حقل الـ Method Spoofing
      // تأكد أنك لا تضيفه مرتين، الكود أدناه يضمن ذلك
      if (!payload.has('_method')) {
        payload.append('_method', 'PUT')
      }

      // 2. ⚠️ أهم خطوة: الإرسال عبر POST حصراً
      // لارافيل سيفهم أنها PUT بسبب الحقل أعلاه، وسيقوم بقراءة الملفات بنجاح
      return apiClient.post(`${resource}/${id}`, payload)
    }

    // إذا لم تكن البيانات FormData (نصوص فقط)، نستخدم put العادي
    return apiClient.put(`${resource}/${id}`, payload)
  },

  delete(id) {
    return apiClient.delete(`${resource}/${id}`)
  },

  submitPublic(payload) {
    // إرسال طلب جديد
    return apiClient.post('/public/candidates/submit', payload)
  },

  verifyPublic(payload) {
    // التحقق من هوية المتدرب لاسترجاع بياناته
    return apiClient.post('/public/candidates/verify', payload)
  },

  updatePublic(payload) {
    // تحديث الطلب (الباك إند هنا مجهز لاستقبال POST لتسهيل التعامل مع الـ FormData والصور)
    return apiClient.post('/public/candidates/update', payload)
  },
}
