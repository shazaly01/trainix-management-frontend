<template>
  <div
    class="min-h-screen flex flex-col bg-white md:bg-[#F8FAFC] text-slate-800 font-sans"
    dir="rtl"
  >
    <header class="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <div class="flex items-center gap-4">
            <img src="/MainLogo.png" alt="شعار النظام" class="h-10 md:h-12 w-auto object-contain" />

            <div class="hidden sm:block border-r-2 border-slate-100 pr-4 mr-2">
              <h1 class="text-xl font-black text-slate-900 tracking-wide">بوابة التدريب</h1>
              <p class="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">
                انضم إلى برامجنا التطويرية
              </p>
            </div>
          </div>

          <div class="hidden md:flex items-center gap-6 text-sm font-bold">
            <a
              href="mailto:training@yourcompany.com"
              class="flex items-center text-blue-700 bg-blue-50 px-5 py-2.5 rounded-xl hover:bg-blue-100 transition-colors border border-blue-100"
            >
              إدارة التدريب والتطوير
            </a>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-grow pb-0 md:pb-12">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="bg-white border-t border-slate-200 py-6 mt-auto">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <p class="text-xs font-bold text-slate-400">
          &copy; {{ new Date().getFullYear() }} جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup></script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Almarai:wght@400;700;800&display=swap');
.font-sans {
  font-family: 'Almarai', sans-serif;
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
