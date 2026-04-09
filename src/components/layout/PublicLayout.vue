<template>
  <div class="min-h-screen flex flex-col bg-surface-ground text-text-primary font-sans dir-rtl">
    <header class="bg-surface-section border-b border-surface-border shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <div class="flex items-center gap-4">
            <img src="/MainLogo.png" alt="شعار الشركة" class="h-12 w-auto object-contain" />
            <div class="hidden sm:block border-r border-surface-border pr-4 mr-2">
              <h1 class="text-xl font-bold text-text-primary tracking-wide">بوابة التوظيف</h1>
              <p class="text-xs text-text-muted mt-0.5">انضم إلى فريقنا المتميز</p>
            </div>
          </div>

          <div class="flex items-center gap-6 text-sm font-medium">
            <a href="#" class="text-text-muted hover:text-primary transition-colors">الرئيسية</a>
            <a href="#" class="text-text-muted hover:text-primary transition-colors">عن الشركة</a>
            <a
              href="mailto:hr@yourcompany.com"
              class="flex items-center text-primary bg-primary/10 px-4 py-2 rounded-full hover:bg-primary/20 transition-colors"
            >
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
              </svg>
              تواصل مع الموارد البشرية
            </a>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-grow pb-12">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="bg-surface-section border-t border-surface-border py-6 mt-auto">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <p class="text-sm text-text-muted">
          &copy; {{ new Date().getFullYear() }} جميع الحقوق محفوظة. نظام إدارة التوظيف.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
// هذا التخطيط لا يحتاج إلى منطق معقد، فهو مجرد غلاف بصري.
</script>

<style scoped>
/* تأثير الدخول والخروج الناعم */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
