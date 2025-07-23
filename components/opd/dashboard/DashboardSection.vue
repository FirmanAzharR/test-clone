<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white p-4 rounded-lg shadow">
        <h2 class="text-lg font-semibold">Total Revenue</h2>
        <p class="text-3xl font-bold">$34,152</p>
        <p class="text-green-500">↑ 2.65% since last week</p>
      </div>
      <div class="bg-white p-4 rounded-lg shadow">
        <h2 class="text-lg font-semibold">Orders</h2>
        <p class="text-3xl font-bold">5,643</p>
        <p class="text-red-500">↓ 0.82% since last week</p>
      </div>
      <div class="bg-white p-4 rounded-lg shadow">
        <h2 class="text-lg font-semibold">Customers</h2>
        <p class="text-3xl font-bold">45,254</p>
        <p class="text-red-500">↓ 6.24% since last week</p>
      </div>
      <div class="bg-white p-4 rounded-lg shadow">
        <h2 class="text-lg font-semibold">Growth</h2>
        <p class="text-3xl font-bold">+12.58%</p>
        <p class="text-green-500">↑ 10.51% since last week</p>
      </div>
    </div>
    
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-lg font-semibold mb-4">Sales Analytics</h2>
      <LineChart :chart-data="chartData" :chart-options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { defineComponent } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

// Data untuk chart
const chartData = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "Sales",
      backgroundColor: "#4f46e5",
      borderColor: "#4f46e5",
      data: [40, 39, 10, 40, 39, 80, 40],
      fill: false,
    },
  ],
};

// Opsi untuk chart
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

// Komponen Chart
const LineChart = defineComponent({
  components: { Line },
  props: {
    chartData: {
      type: Object,
      required: true,
    },
    chartOptions: {
      type: Object,
      required: false,
      default: () => ({
        responsive: true,
        maintainAspectRatio: false,
      }),
    },
  },
  template: `<Line :data="chartData" :options="chartOptions" />`,
});
</script>

<style scoped>
/* Tambahkan styling tambahan jika diperlukan */
</style>
