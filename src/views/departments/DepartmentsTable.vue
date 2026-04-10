<template>
  <div
    class="bg-[#0f172a] rounded-[1.5rem] shadow-2xl border border-slate-800/50 overflow-hidden font-sans"
  >
    <AppTable
      :headers="filteredHeaders"
      :items="items"
      :isLoading="isLoading"
      @row-click="$emit('row-click', $event)"
      class="departments-dark-table"
    >
      <template #cell-id="{ item }">
        <span class="text-slate-500 font-mono text-xs font-bold">#{{ item.id }}</span>
      </template>

      <template #cell-DeptCode="{ item }">
        <span
          class="font-mono text-sky-400 font-black bg-sky-500/10 px-2 py-1 rounded border border-sky-500/20 text-xs"
        >
          {{ item.DeptCode }}
        </span>
      </template>

      <template #cell-Name="{ item }">
        <span class="text-white font-black text-sm tracking-tight uppercase">
          {{ item.Name }}
        </span>
      </template>

      <template #cell-IsActive="{ item }">
        <span
          class="px-3 py-1 text-[10px] font-black rounded-full border uppercase tracking-tighter"
          :class="
            item.IsActive
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          "
        >
          {{ item.IsActive ? 'نشط' : 'غير نشط' }}
        </span>
      </template>

      <template #cell-actions="{ item }">
        <div class="flex items-center gap-2">
          <button
            v-if="auth.can('department.update')"
            @click.stop="$emit('edit', item)"
            class="w-9 h-9 bg-slate-800 text-sky-400 rounded-xl hover:bg-sky-500 hover:text-white transition-all flex items-center justify-center border border-slate-700/50 shadow-lg"
            title="تعديل الإدارة"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                stroke-width="2.5"
              />
            </svg>
          </button>

          <button
            v-if="auth.can('department.delete')"
            @click.stop="$emit('delete', item.id)"
            class="w-9 h-9 bg-slate-800 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center border border-slate-700/50 shadow-lg"
            title="حذف الإدارة"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                stroke-width="2.5"
              />
            </svg>
          </button>
        </div>
      </template>
    </AppTable>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import AppTable from '@/components/ui/AppTable.vue'
import { useAuthStore } from '@/stores/authStore' // 👈 استيراد الستور

const props = defineProps({
  items: { type: Array, required: true },
  isLoading: { type: Boolean, default: false },
})

defineEmits(['edit', 'delete', 'row-click'])

const auth = useAuthStore() // 👈 تفعيل الستور

// 🌟 تصفية الأعمدة: يختفي عمود الإجراءات بالكامل لمن لا يملك الصلاحية
const filteredHeaders = computed(() => {
  const baseHeaders = [
    { key: 'id', label: 'الرقم' },
    { key: 'DeptCode', label: 'كود الإدارة' },
    { key: 'Name', label: 'اسم الإدارة' },
    { key: 'IsActive', label: 'الحالة' },
  ]

  // إذا كان للمستخدم صلاحية التعديل أو الحذف (أو هو Super Admin)
  if (auth.can('department.update') || auth.can('department.delete')) {
    baseHeaders.push({ key: 'actions', label: 'الإجراءات', class: 'w-24 text-left' })
  }

  return baseHeaders
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Almarai:wght@400;700;800&display=swap');

:deep(table) {
  font-family: 'Almarai', sans-serif;
  @apply bg-[#0f172a] border-separate border-spacing-0;
}

:deep(th) {
  @apply bg-[#1e293b] text-slate-400 font-black text-[11px] uppercase tracking-wider py-4 border-b border-slate-800 text-right px-6;
}

:deep(td) {
  @apply py-4 px-6 border-b border-slate-800/50 align-middle transition-colors text-slate-300;
}

:deep(tr:hover td) {
  @apply bg-slate-800/40;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: #0f172a;
}
::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 10px;
}
</style>
