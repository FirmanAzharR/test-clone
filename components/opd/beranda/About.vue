<template>
    <div class="p-20" :class="[
      isDark
        ? 'dark bg-gradient-to-t from-green-900 to-green-800/45'
        : 'bg-gradient-to-b from-slate-100 via-blue-50 to-blue-100',
    ]">
        <section
        class="container h-[430px] mx-auto p-6 rounded-lg shadow-md mb-0"
        :class="isDark ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'"
    >
        <div class="flex flex-row gap-12 text-center">
            <div
                v-for="(item, idx) in data"
                :key="idx"
                class="flex-1 m-5 flex flex-col items-center"
            >
                <h2
                    class="text-2xl md:text-2xl font-bold mb-2 uppercase tracking-wide"
                    :class="isDark ? 'text-blue-300' : 'text-blue-700'"
                >
                    {{ item.title }}
                </h2>
                <div
                    class="w-16 h-1 rounded mb-4"
                    :class="isDark ? 'bg-blue-700' : 'bg-blue-300'"
                ></div>
                <p
                    class="text-base md:text-lg text-justify leading-relaxed mt-2"
                    :class="isDark ? 'text-gray-200' : 'text-gray-700'"
                >
                    {{ item.deskripsi }}
                </p>
            </div>
        </div>
    </section>
    </div>
    
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useLayout } from '@/store/layouts/layouts.js';

const data = ref([])
const layoutStore = useLayout();
const isDark = computed(() => layoutStore.theme === 'dark');
async function fetchData() {
    data.value = [
        {
            title: 'Apa itu Warisan Dunia UNESCO?',
            deskripsi: 'Warisan Dunia adalah suatu warisan budaya atau alam yang memiliki arti penting secara universal. Situs-situs yang dinominasikan akan ditetapkan sebagai Warisan Dunia setelah melalui seleksi dan dinyatakan sebagai contoh terbaik dari suatu warisan budaya atau alam di seluruh dunia.'
        },
        {
            title: 'Apa itu Konvensi Warisan Dunia?',
            deskripsi: 'Konvensi Warisan Dunia dimulai pada tahun 1972 dan bertujuan untuk mempromosikan kerja sama di antara negara-negara untuk melindungi warisan dari seluruh dunia yang memiliki \'Nilai Universal yang Luar Biasa\' sehingga konservasinya penting bagi generasi sekarang dan yang akan datang.'
        },
        {
            title: 'Dimana saja Situs Warisan Budaya Dunia di Indonesia?',
            deskripsi: 'Kompleks Candi Borobudur (1991), Kompleks Candi Prambanan (1991), Situs Manusia Purba Sangiran (1996), Lanskap Budaya Provinsi Bali (2012), Warisan Tambang Batubara Ombilin Sawahlunto (2019)'
        }
    ]
}

onMounted(fetchData)
</script>
