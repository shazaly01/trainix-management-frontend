import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

// --- استيراد التخطيطات الرئيسية (Layouts) ---
import AppLayout from '@/components/layout/AppLayout.vue'
import AuthLayout from '@/components/layout/AuthLayout.vue'
import PublicLayout from '@/components/layout/PublicLayout.vue'

// --- استيراد الصفحات الأساسية ---
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/dashboard/DashboardView.vue'

const CandidatesList = () => import('@/views/candidates/CandidatesList.vue')
// --- استيراد صفحات نظام التوظيف الجديد (استيراد ديناميكي) ---

// 1. إعدادات النظام
const CitiesList = () => import('@/views/cities/CitiesList.vue')
const DepartmentsList = () => import('@/views/departments/DepartmentsList.vue')

// 2. إدارة المستخدمين والصلاحيات
const UsersList = () => import('@/views/users/UsersList.vue')
const RolesList = () => import('@/views/roles/RolesList.vue')

// 3. نظام التوظيف (العمليات الأساسية)
const ApplicantsList = () => import('@/views/applicants/ApplicantsList.vue')
const JobRequestsList = () => import('@/views/job-requests/JobRequestsList.vue')
const ApplicationsList = () => import('@/views/applications/ApplicationsList.vue')
const InterviewsList = () => import('@/views/interviews/InterviewsList.vue')
const CandidatesPrint = () => import('@/views/candidates/CandidatesReportView.vue')

const routes = [
  // --- المسارات العامة (لا تتطلب مصادقة) ---
  {
    path: '/',
    component: AuthLayout,
    children: [
      { path: 'login', name: 'Login', component: LoginView },
      { path: '', redirect: '/login' },
    ],
  },

  // ✅ مسار التوظيف الخارجي (للموظفين)
  {
    path: '/apply',
    component: PublicLayout,
    children: [
      // 1. مسار التقديم العام (بدون وظيفة محددة)
      {
        path: '',
        name: 'ExternalApplication',
        component: () => import('@/views/external-application/ApplicationWizard.vue'),
      },
      // 2. التقديم لوظيفة محددة عبر الرابط
      {
        path: ':slug',
        name: 'PublicJobApply',
        component: () => import('@/views/external-application/PublicJobApplyView.vue'),
      },
    ],
  },

  // ✅ المسار الجديد: التقديم الخارجي للدورات التدريبية (للمتدربين)
  {
    path: '/training',
    component: PublicLayout, // نستخدم نفس التخطيط العام
    children: [
      {
        path: ':slug', // استقبال النص الفريد للدورة (Slug)
        name: 'PublicTrainingApply',
        component: () => import('@/views/external-application/PublicTrainingApplyView.vue'),
      },
    ],
  },

  {
    path: '/candidates-print',
    name: 'CandidatesPrint',
    component: CandidatesPrint,
    meta: { requiresAuth: true }, // لا يزال يتطلب تسجيل دخول لكنه خارج الـ AppLayout
  },

  // --- المسارات المحمية (تتطلب مصادقة) ---
  {
    path: '/app',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: DashboardView,
        meta: { permission: 'dashboard.view' },
      },
      // --- مسارات إدارة المستخدمين والصلاحيات ---
      {
        path: 'users',
        name: 'UsersList',
        component: UsersList,
        meta: { permission: 'user.view' },
      },
      {
        path: 'roles',
        name: 'RolesList',
        component: RolesList,
        meta: { permission: 'role.view' },
      },
      // --- مسارات إعدادات النظام الأساسية ---
      {
        path: 'settings/cities',
        name: 'CitiesList',
        component: CitiesList,
        meta: { permission: 'city.view' },
      },
      {
        path: 'settings/departments',
        name: 'DepartmentsList',
        component: DepartmentsList,
        meta: { permission: 'department.view' },
      },
      // --- مسارات نظام التوظيف ---

      {
        path: 'candidates',
        name: 'CandidatesList',
        component: CandidatesList,
        meta: { permission: 'candidate.view' },
      },
      {
        path: 'candidates/form/:id?',
        name: 'CandidateForm',
        component: () => import('@/views/candidates/CandidateForm.vue'),
        meta: { title: 'ملف المترشح' },
      },

      {
        path: 'applicants',
        name: 'ApplicantsList',
        component: ApplicantsList,
        meta: { permission: 'applicant.view' },
      },
      {
        path: '/applicants/profile/:id?',
        name: 'ApplicantProfile',
        component: () => import('@/views/applicants/ApplicantProfile.vue'),
        meta: { title: 'ملف المتقدم' },
      },
      {
        path: 'job-requests',
        name: 'JobRequestsList',
        component: JobRequestsList,
        meta: { permission: 'job_request.view' },
      },
      {
        path: 'applications',
        name: 'ApplicationsList',
        component: ApplicationsList,
        meta: { permission: 'application.view' },
      },

      {
        path: 'applications/:id/review',
        name: 'ApplicationReview',
        component: () => import('@/views/applications/ApplicationReview.vue'),
        meta: { permission: 'application.view' },
      },

      {
        path: '/interviews/create',
        name: 'InterviewCreate',
        component: () => import('@/views/interviews/InterviewFormView.vue'),
        meta: { title: 'جدولة مقابلة جديدة' },
      },
      {
        path: '/interviews/edit/:id',
        name: 'InterviewEdit',
        component: () => import('@/views/interviews/InterviewFormView.vue'),
        props: true,
        meta: { title: 'تعديل وتقييم المقابلة' },
      },

      {
        path: '/interviews/evaluate/:id',
        name: 'InterviewEvaluation',
        component: () => import('@/views/interviews/InterviewEvaluationView.vue'),
        props: true,
        meta: { title: 'تقييم المقابلة الفعلية' },
      },
      {
        path: 'interviews',
        name: 'InterviewsList',
        component: InterviewsList,
        meta: { permission: 'interview.view' },
      },
      // إعادة توجيه المسار الرئيسي للتطبيق إلى لوحة التحكم
      { path: '', redirect: '/app/dashboard' },
    ],
  },

  // مسار للتعامل مع الصفحات غير الموجودة (404 Fallback)
  { path: '/:pathMatch(.*)*', redirect: '/login' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// --- حارس التنقل العام (Global Navigation Guard) ---
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const { isAuthenticated, can } = authStore

  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      authStore.returnUrl = to.fullPath
      next({ name: 'Login' })
    } else {
      const requiredPermission = to.meta.permission
      // التحقق من الصلاحية إذا كانت مطلوبة للمسار
      if (requiredPermission && !can(requiredPermission)) {
        console.warn(
          `Access denied: route "${String(to.name)}" requires permission "${requiredPermission}"`,
        )
        next({ name: 'Dashboard' })
      } else {
        next()
      }
    }
  } else {
    next()
  }
})

export default router
