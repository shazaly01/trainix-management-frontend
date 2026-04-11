<template>
  <div class="print-portrait-container bg-white text-black p-6 font-sans" dir="rtl">
    <div
      class="print:hidden flex justify-end gap-3 mb-6 bg-gray-50 border border-gray-200 p-3 rounded shadow-sm"
    >
      <button
        @click="printReport"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded flex items-center gap-2 transition-colors"
      >
        طباعة التقرير
      </button>
    </div>

    <div class="flex justify-between items-center border-b-2 border-gray-900 pb-4 mb-6">
      <div class="flex items-center gap-4">
        <img src="/MainLogo2.png" alt="Logo" class="w-16 h-16 object-contain" />
        <div>
          <p class="text-base font-bold text-gray-600">نظام إدارة الموارد البشرية والدورات</p>
        </div>
      </div>
      <div class="text-center">
        <h2
          class="text-xl font-black border-2 border-black py-1 px-8 bg-gray-100 uppercase shadow-sm"
        >
          تقرير المتقدمين للدورات التدريبية
        </h2>
      </div>
      <div class="text-left text-xs font-medium text-gray-500 border-r-2 border-gray-200 pr-4">
        <p>تاريخ التقرير: {{ currentDate }}</p>
        <p>وقت الاستخراج: {{ currentTime }}</p>
      </div>
    </div>

    <div class="bg-gray-50 border border-gray-200 rounded p-3 mb-6">
      <p class="text-[10px] text-gray-500 font-bold uppercase mb-1">المعايير المطبقة حالياً:</p>
      <p class="text-sm font-black text-gray-900 leading-relaxed">
        {{ activeFiltersText }}
      </p>
    </div>

    <div class="grid grid-cols-4 gap-3 mb-6">
      <div class="border border-gray-300 p-2 rounded bg-white shadow-sm flex flex-col items-center">
        <p class="text-gray-500 text-[9px] font-bold mb-1">إجمالي العدد</p>
        <p class="text-lg font-black">{{ printData?.reportData?.length || 0 }}</p>
      </div>
      <div class="border border-gray-300 p-2 rounded bg-white shadow-sm flex flex-col items-center">
        <p class="text-gray-500 text-[9px] font-bold mb-1">لائق طبياً</p>
        <p class="text-lg font-black text-emerald-700">{{ countStats.fit }}</p>
      </div>
      <div class="border border-gray-300 p-2 rounded bg-white shadow-sm flex flex-col items-center">
        <p class="text-gray-500 text-[9px] font-bold mb-1">تدريب داخلي</p>
        <p class="text-lg font-black text-blue-700">{{ countStats.internal }}</p>
      </div>
      <div class="border border-gray-300 p-2 rounded bg-white shadow-sm flex flex-col items-center">
        <p class="text-gray-500 text-[9px] font-bold mb-1">تدريب خارجي</p>
        <p class="text-lg font-black text-purple-700">{{ countStats.external }}</p>
      </div>
    </div>

    <table class="w-full text-right border-collapse border-2 border-black shadow-sm">
      <thead>
        <tr class="bg-gray-800 text-white print:bg-gray-200 print:text-black text-[10px]">
          <th class="p-2 border border-black w-8 text-center">#</th>
          <th class="p-2 border border-black text-right">اسم المتقدم</th>
          <th class="p-2 border border-black text-center w-32">الرقم الوطني</th>
          <th class="p-2 border border-black text-center">المؤهل</th>
          <th class="p-2 border border-black text-center">السكن</th>
          <th class="p-2 border border-black text-center w-28">الهاتف</th>
          <th class="p-2 border border-black text-center">اللياقة</th>
          <th class="p-2 border border-black text-center">التدريب</th>
        </tr>
      </thead>
      <tbody class="text-[11px]">
        <tr
          v-for="(item, index) in printData?.reportData"
          :key="item.id"
          class="border-b border-gray-400 break-inside-avoid odd:bg-white even:bg-gray-50/50"
        >
          <td class="p-2 border border-gray-400 text-center font-bold">{{ index + 1 }}</td>
          <td class="p-2 border border-gray-400 font-black text-xs">{{ item.Name }}</td>
          <td class="p-2 border border-gray-400 text-center font-mono">{{ item.NationalNo }}</td>
          <td class="p-2 border border-gray-400 text-center">{{ item.Qualification || '-' }}</td>
          <td class="p-2 border border-gray-400 text-center">{{ item.Residence || '-' }}</td>
          <td class="p-2 border border-gray-400 text-center font-mono" style="direction: ltr">
            {{ item.Phone }}
          </td>
          <td class="p-2 border border-gray-400 text-center font-bold">
            <span :class="item.IsFit ? 'text-emerald-700' : 'text-rose-700'">{{
              item.IsFit ? 'لائق' : 'غير لائق'
            }}</span>
          </td>
          <td class="p-2 border border-gray-400 text-center">
            {{ item.TrainingType === 'external' ? 'خارجي' : 'داخلي' }}
          </td>
        </tr>
      </tbody>
    </table>

    <div
      class="mt-12 grid grid-cols-3 gap-8 text-center pt-8 border-t-2 border-gray-100 break-inside-avoid"
    >
      <div class="space-y-12">
        <p class="font-bold text-gray-800 text-sm">إعداد القسم المختص</p>
        <div class="border-b border-gray-400 w-40 mx-auto"></div>
      </div>
      <div class="space-y-12">
        <p class="font-bold text-gray-800 text-sm">المراجعة والتدقيق</p>
        <div class="border-b border-gray-400 w-40 mx-auto"></div>
      </div>
      <div class="space-y-12">
        <p class="font-bold text-gray-800 text-sm">يعتمد / مدير الإدارة</p>
        <div class="border-b border-gray-400 w-40 mx-auto"></div>
      </div>
    </div>

    <div
      class="fixed bottom-0 left-0 w-full text-center text-[9px] text-gray-400 py-2 hidden print:block border-t border-gray-100"
    >
      صفحة <span class="page-number"></span> | تم الاستخراج من نظام Panda ERP لإدارة الدورات
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const printData = ref(null)
const currentDate = new Date().toLocaleDateString('ar-EG')
const currentTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })

const printReport = () => window.print()

const activeFiltersText = computed(() => {
  if (!printData.value) return 'جاري التحميل...'
  const f = printData.value.filters || {}
  const s = printData.value.search
  const parts = []

  if (s) parts.push(`بحث: ${s}`)
  if (f.Residence) parts.push(`السكن: ${f.Residence}`)
  if (f.Qualification) parts.push(`المؤهل: ${f.Qualification}`)
  if (f.Size) parts.push(`المقاس: ${f.Size}`)
  if (f.ShoeSize) parts.push(`رقم الحذاء: ${f.ShoeSize}`)
  if (f.IsFit !== undefined && f.IsFit !== '')
    parts.push(`الحالة: ${f.IsFit == 1 ? 'لائق' : 'غير لائق'}`)
  if (f.TrainingType) parts.push(`التدريب: ${f.TrainingType === 'external' ? 'خارجي' : 'داخلي'}`)

  return parts.length > 0 ? parts.join(' | ') : 'عرض كافة المتقدمين (بدون فلاتر)'
})

const countStats = computed(() => {
  const data = printData.value?.reportData || []
  return {
    fit: data.filter((i) => i.IsFit == 1).length,
    internal: data.filter((i) => i.TrainingType === 'internal').length,
    external: data.filter((i) => i.TrainingType === 'external').length,
  }
})

onMounted(() => {
  const savedData = sessionStorage.getItem('candidatesPrintData')
  if (savedData) {
    printData.value = JSON.parse(savedData)
    setTimeout(() => {
      window.print()
    }, 1000)
  }
})
</script>

<style scoped>
@media print {
  @page {
    size: A4 portrait;
    margin: 10mm;
  }
  body {
    background-color: white !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .page-number::after {
    content: counter(page);
  }
}
table {
  border-spacing: 0;
  width: 100%;
}
thead {
  display: table-header-group;
}
tfoot {
  display: table-footer-group;
}
tr {
  break-inside: avoid;
}
.print-portrait-container {
  counter-reset: page;
}
</style>
