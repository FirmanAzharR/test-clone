<template>
  <UContainer class="py-8">
    <!-- Error Alert -->
    <div v-if="error" class="mb-4">
      <UAlert :title="'Error loading analytics data'" color="red" variant="soft" icon="i-heroicons-exclamation-triangle">
        {{ error }}
        <template #footer>
          <UButton color="red" variant="ghost" label="Retry" @click="fetchTokenFromServer" />
        </template>
      </UAlert>
    </div>
    
    <!-- Analytics Dashboard -->
    <div v-if="ready" class="grid grid-cols-1 gap-6 md:grid-cols-3 dark:text-slate-100">
      <!-- Summary Stats -->
      <div class="grid grid-cols-1 gap-4 col-span-full sm:grid-cols-3">
        <UCard class="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Total Visitors</p>
              <h3 class="text-2xl font-bold">{{ totalStats.visitors.toLocaleString() }}</h3>
            </div>
            <div class="p-3 bg-purple-100 rounded-full dark:bg-purple-800">
              <UIcon name="i-heroicons-users" class="w-6 h-6 text-purple-600 dark:text-purple-300" />
            </div>
          </div>
          <div class="mt-2 text-xs text-green-600 dark:text-green-400" v-if="totalStats.visitorsTrend > 0">
            <UIcon name="i-heroicons-arrow-trending-up" class="inline" /> +{{ totalStats.visitorsTrend }}% from last month
          </div>
          <div class="mt-2 text-xs text-red-600 dark:text-red-400" v-else>
            <UIcon name="i-heroicons-arrow-trending-down" class="inline" /> {{ totalStats.visitorsTrend }}% from last month
          </div>
        </UCard>
        
        <UCard class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Total Pageviews</p>
              <h3 class="text-2xl font-bold">{{ totalStats.pageviews.toLocaleString() }}</h3>
            </div>
            <div class="p-3 bg-blue-100 rounded-full dark:bg-blue-800">
              <UIcon name="i-heroicons-document-text" class="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
          <div class="mt-2 text-xs text-green-600 dark:text-green-400" v-if="totalStats.pageviewsTrend > 0">
            <UIcon name="i-heroicons-arrow-trending-up" class="inline" /> +{{ totalStats.pageviewsTrend }}% from last month
          </div>
          <div class="mt-2 text-xs text-red-600 dark:text-red-400" v-else>
            <UIcon name="i-heroicons-arrow-trending-down" class="inline" /> {{ totalStats.pageviewsTrend }}% from last month
          </div>
        </UCard>
        
        <UCard class="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Avg. Session Duration</p>
              <h3 class="text-2xl font-bold">{{ formatTime(totalStats.avgSessionDuration) }}</h3>
            </div>
            <div class="p-3 bg-teal-100 rounded-full dark:bg-teal-800">
              <UIcon name="i-heroicons-clock" class="w-6 h-6 text-teal-600 dark:text-teal-300" />
            </div>
          </div>
          <div class="mt-2 text-xs text-green-600 dark:text-green-400" v-if="totalStats.durationTrend > 0">
            <UIcon name="i-heroicons-arrow-trending-up" class="inline" /> +{{ totalStats.durationTrend }}% from last month
          </div>
          <div class="mt-2 text-xs text-red-600 dark:text-red-400" v-else>
            <UIcon name="i-heroicons-arrow-trending-down" class="inline" /> {{ totalStats.durationTrend }}% from last month
          </div>
        </UCard>
      </div>
      
      <!-- Grafik Pengunjung -->
      <UCard class="col-span-full">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold">Grafik Pengunjung</h2>
            <div class="flex items-center gap-2">
              <USelect v-model="selectedPeriod" :options="periodOptions" size="sm" />
              <UBadge color="info">{{ selectedPeriod }}</UBadge>
            </div>
          </div>
        </template>
        <p class="mb-4 text-sm text-gray-500">
          Grafik pengunjung atau user {{ selectedPeriod.toLowerCase() }} di portal
        </p>
        <div class="h-64 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div v-if="loading" class="flex flex-col items-center justify-center h-full">
            <UIcon name="i-heroicons-chart-bar" class="text-6xl text-gray-400" />
            <p class="mt-2 text-sm text-gray-500">Loading data...</p>
          </div>
          <div v-else class="w-full h-full">
            <canvas ref="chartTotal"></canvas>
          </div>
        </div>
      </UCard>

      <!-- Jenis Perangkat -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">Jenis Perangkat</h2>
            <UButton v-if="!loading" size="xs" color="gray" variant="ghost" icon="i-heroicons-arrow-path" @click="refreshDeviceData" />
          </div>
        </template>
        <p class="mb-4 text-sm text-gray-500">
          Perangkat yang digunakan pengunjung
        </p>
        <div class="h-48 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div v-if="loading" class="flex flex-col items-center justify-center h-full">
            <UIcon name="i-heroicons-device-phone-mobile" class="text-4xl text-gray-400" />
            <p class="mt-2 text-sm text-gray-500">Loading data...</p>
          </div>
          <div v-else class="w-full h-full">
            <canvas ref="chartDevice"></canvas>
          </div>
        </div>
      </UCard>

      <!-- Jenis Browser -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">Jenis Browser</h2>
            <UButton v-if="!loading" size="xs" color="gray" variant="ghost" icon="i-heroicons-arrow-path" @click="refreshBrowserData" />
          </div>
        </template>
        <p class="mb-4 text-sm text-gray-500">
          Browser yang digunakan pengunjung
        </p>
        <div class="h-48 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div v-if="loading" class="flex flex-col items-center justify-center h-full">
            <UIcon name="i-heroicons-globe-alt" class="text-4xl text-gray-400" />
            <p class="mt-2 text-sm text-gray-500">Loading data...</p>
          </div>
          <div v-else class="w-full h-full">
            <canvas ref="chartBrowser"></canvas>
          </div>
        </div>
      </UCard>

      <!-- Halaman Terpopuler -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">Halaman Terpopuler</h2>
            <UButton v-if="!loading" size="xs" color="gray" variant="ghost" icon="i-heroicons-arrow-path" @click="refreshPopularPages" />
          </div>
        </template>
        <p class="mb-4 text-sm text-gray-500">
          Halaman yang paling sering dikunjungi di portal
        </p>
        <UTable :columns="columns" :rows="populerURL" :ui="{ wrapper: 'mt-4' }">
          <template #cell-title="{ row }">
            <div class="max-w-xs truncate" :title="row.title">pcok{{ row }}</div>
          </template>
          <template #cell-views="{ row }">
            <UBadge color="primary" size="sm">{{ row.views.toLocaleString() }}</UBadge>
          </template>
          <template #empty-state>
            <div class="flex flex-col items-center justify-center px-4 py-6">
              <UIcon name="i-heroicons-document-magnifying-glass" class="mb-2 text-4xl text-gray-400" />
              <p class="text-sm text-gray-500">{{ loading ? 'Loading data...' : 'Belum ada data.' }}</p>
            </div>
          </template>
        </UTable>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, computed } from 'vue'
import Chart from 'chart.js/auto'
import axios from 'axios'

// State variables
const loading = ref(true)
const error = ref(null)
const ready = ref(false)
const token = ref(null)
const propertyId = ref(null)
const populerURL = ref([])
const chartTotalLabels = ref([])
const chartTotalData = ref({
  activeUsers: [],
  screenPageViews: []
})

// Period selection
const selectedPeriod = ref('Bulanan')
const periodOptions = [
  { label: 'Harian', value: 'Harian' },
  { label: 'Mingguan', value: 'Mingguan' },
  { label: 'Bulanan', value: 'Bulanan' }
]

// Summary statistics
const totalStats = ref({
  visitors: 0,
  pageviews: 0,
  avgSessionDuration: 120, // Default 2 minutes
  visitorsTrend: 5.2,
  pageviewsTrend: 3.8,
  durationTrend: -1.5
})

// Chart refs
const chartTotal = ref(null)
const chartDevice = ref(null)
const chartBrowser = ref(null)

// Chart instances
let myChart = null
let deviceChart = null
let browserChart = null

// Chart data storage
const deviceChartData = ref({
  labels: [],
  values: []
})

const browserChartData = ref({
  labels: [],
  values: []
})

// Table columns configuration
const columns = [
  { key: 'no', label: 'No' },
  { key: 'title', label: 'Judul' },
  { key: 'views', label: 'View' }
]

// Format time helper
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}m ${remainingSeconds}s`
}

// Initialize analytics when component mounts
onMounted(async () => {
  console.log('Analytics component mounted')
  ready.value = true
  
  // Fetch propertyId first
  try {
    const propertyIdResponse = await fetch('/api/analytics/property-id')
    const propertyIdData = await propertyIdResponse.json()
    propertyId.value = propertyIdData.propertyId
    await fetchTokenFromServer()
  } catch (error) {
    console.error('Error fetching propertyId:', error)
    error.value = `Error fetching propertyId: ${error.message}`
  }
})

// Watch for period changes to update chart
watch(() => selectedPeriod.value, async () => {
  if (token.value) {
    loading.value = true
    await funGetTotal()
    loading.value = false
  }
})

// Watch for loading state changes to render charts after loading finishes
watch(() => loading.value, async (newVal) => {
  if (!newVal) {
    await nextTick()
    renderCharts()
    calculateTotalStats()
  }
}, { immediate: false })

// Calculate total statistics from chart data
function calculateTotalStats() {
  if (chartTotalData.value.activeUsers.length > 0) {
    totalStats.value.visitors = chartTotalData.value.activeUsers.reduce((a, b) => a + b, 0)
    totalStats.value.pageviews = chartTotalData.value.screenPageViews.reduce((a, b) => a + b, 0)
    
    // Calculate trends (comparing last two periods)
    const lastIndex = chartTotalData.value.activeUsers.length - 1
    if (lastIndex > 0) {
      const currentVisitors = chartTotalData.value.activeUsers[lastIndex]
      const prevVisitors = chartTotalData.value.activeUsers[lastIndex - 1]
      
      const currentPageviews = chartTotalData.value.screenPageViews[lastIndex]
      const prevPageviews = chartTotalData.value.screenPageViews[lastIndex - 1]
      
      if (prevVisitors > 0) {
        totalStats.value.visitorsTrend = Number(((currentVisitors - prevVisitors) / prevVisitors * 100).toFixed(1))
      }
      
      if (prevPageviews > 0) {
        totalStats.value.pageviewsTrend = Number(((currentPageviews - prevPageviews) / prevPageviews * 100).toFixed(1))
      }
    }
  }
}

// Render all charts using refs
function renderCharts() {
  console.log('Rendering all charts')
  
  // Only render if there's data
  if (chartTotalLabels.value.length > 0) {
    renderTotalChart()
  }

  if (deviceChartData.value.labels.length > 0) {
    renderDeviceChart()
  }

  if (browserChartData.value.labels.length > 0) {
    renderBrowserChart()
  }
}

// Render the main chart
function renderTotalChart() {
  console.log('Rendering total chart')
  
  if (!chartTotal.value) {
    console.error('Chart total ref not found')
    return
  }

  if (myChart) {
    myChart.destroy()
  }

  // Create gradient for chart
  const ctx = chartTotal.value.getContext('2d')
  const visitorGradient = ctx.createLinearGradient(0, 0, 0, 300)
  visitorGradient.addColorStop(0, 'rgba(54, 162, 235, 0.8)')
  visitorGradient.addColorStop(1, 'rgba(54, 162, 235, 0.1)')
  
  const pageviewGradient = ctx.createLinearGradient(0, 0, 0, 300)
  pageviewGradient.addColorStop(0, 'rgba(255, 99, 132, 0.8)')
  pageviewGradient.addColorStop(1, 'rgba(255, 99, 132, 0.1)')

  myChart = new Chart(chartTotal.value, {
    type: 'line',
    data: {
      labels: chartTotalLabels.value,
      datasets: [
        {
          label: 'Visitors',
          data: chartTotalData.value.activeUsers,
          backgroundColor: visitorGradient,
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          tension: 0.3,
          fill: true,
          pointBackgroundColor: 'rgba(54, 162, 235, 1)',
          pointRadius: 3,
          pointHoverRadius: 5
        },
        {
          label: 'Pageviews',
          data: chartTotalData.value.screenPageViews,
          backgroundColor: pageviewGradient,
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          tension: 0.3,
          fill: true,
          pointBackgroundColor: 'rgba(255, 99, 132, 1)',
          pointRadius: 3,
          pointHoverRadius: 5
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(200, 200, 200, 0.1)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            boxWidth: 6
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#333',
          bodyColor: '#666',
          borderColor: 'rgba(200, 200, 200, 0.5)',
          borderWidth: 1,
          padding: 10,
          boxPadding: 5,
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.raw.toLocaleString()}`
            }
          }
        }
      }
    }
  })
}

// Render the device chart
function renderDeviceChart() {
  console.log('Rendering device chart')
  
  if (!chartDevice.value) {
    console.error('Chart device ref not found')
    return
  }

  if (deviceChart) {
    deviceChart.destroy()
  }

  deviceChart = new Chart(chartDevice.value, {
    type: 'doughnut',
    data: {
      labels: deviceChartData.value.labels,
      datasets: [{
        label: 'Count',
        data: deviceChartData.value.values,
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(153, 102, 255)'
        ],
        borderWidth: 1,
        hoverOffset: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: {
          position: 'right',
          labels: {
            usePointStyle: true,
            boxWidth: 8,
            padding: 15
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0)
              const percentage = Math.round((context.raw / total) * 100)
              return `${context.label}: ${context.raw.toLocaleString()} (${percentage}%)`
            }
          }
        }
      }
    },
  })
}

// Render the browser chart
function renderBrowserChart() {
  console.log('Rendering browser chart')
  
  if (!chartBrowser.value) {
    console.error('Chart browser ref not found')
    return
  }

  if (browserChart) {
    browserChart.destroy()
  }

  browserChart = new Chart(chartBrowser.value, {
    type: 'doughnut',
    data: {
      labels: browserChartData.value.labels,
      datasets: [{
        label: 'Count',
        data: browserChartData.value.values,
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)'
        ],
        borderColor: [
          'rgb(54, 162, 235)',
          'rgb(255, 99, 132)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(153, 102, 255)'
        ],
        borderWidth: 1,
        hoverOffset: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: {
          position: 'right',
          labels: {
            usePointStyle: true,
            boxWidth: 8,
            padding: 15
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0)
              const percentage = Math.round((context.raw / total) * 100)
              return `${context.label}: ${context.raw.toLocaleString()} (${percentage}%)`
            }
          }
        }
      }
    },
  })
}

// Refresh individual data sections
async function refreshDeviceData() {
  try {
    await funGetDevice()
    renderDeviceChart()
  } catch (error) {
    console.error('Error refreshing device data:', error)
  }
}

async function refreshBrowserData() {
  try {
    await funGetBrowser()
    renderBrowserChart()
  } catch (error) {
    console.error('Error refreshing browser data:', error)
  }
}

async function refreshPopularPages() {
  try {
    await funGetURLPopular()
  } catch (error) {
    console.error('Error refreshing popular pages:', error)
  }
}

// Fetch token from server-side API endpoint
async function fetchTokenFromServer() {
  console.log('Fetching analytics token from server')
  loading.value = true
  error.value = null
  
  try {
    // Call our server endpoint to get the token
    const response = await fetch('/api/analytics/token')
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Server responded with status ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    
    if (data.success && data.accessToken) {
      console.log('Successfully received token from server')
      token.value = data.accessToken
      
      // Fetch all analytics data in parallel
      try {
        await Promise.all([
          funGetTotal(),
          funGetDevice(),
          funGetBrowser(),
          funGetURLPopular()
        ])
        
        // Set loading to false after all data is fetched
        loading.value = false
      } catch (dataError) {
        console.error('Error fetching analytics data:', dataError)
        error.value = `Error loading analytics data: ${dataError.message}`
        loading.value = false
      }
    } else {
      console.error('Failed to get token from server:', data.error)
      error.value = `Failed to get analytics token: ${data.error}`
      loading.value = false
    }
  } catch (fetchError) {
    console.error('Error fetching token from server:', fetchError)
    error.value = `Error connecting to analytics service: ${fetchError.message}`
    loading.value = false
  }
}

// Process API response for total visitors chart
function processApiResponse(data) {
  console.log('Processing total analytics data')
  const labels = []
  const activeUsersData = []
  const screenPageViewsData = []

  // Assuming the response contains rows with dimension and metric values
  if (data.rows && data.rows.length > 0) {
    data.rows.forEach(row => {
      const yearMonth = row.dimensionValues[0].value
      const year = yearMonth.slice(0, 4)
      const month = yearMonth.slice(4, 6)
      
      // Format date based on selected period
      let date
      if (selectedPeriod.value === 'Harian') {
        date = `${month}/${yearMonth.slice(6, 8)}/${year}`
      } else if (selectedPeriod.value === 'Mingguan') {
        date = `W${Math.ceil(parseInt(yearMonth.slice(6, 8)) / 7)} ${month}/${year}`
      } else {
        date = `${month}/${year}`
      }

      const activeUsers = row.metricValues[1].value
      const screenPageViews = row.metricValues[0].value

      labels.push(date)
      activeUsersData.push(Number(activeUsers))
      screenPageViewsData.push(Number(screenPageViews))
    })

    chartTotalLabels.value = labels
    chartTotalData.value.activeUsers = activeUsersData
    chartTotalData.value.screenPageViews = screenPageViewsData

    console.log('Chart data prepared')
  } else {
    console.log('No data rows found in response')
  }
}

// Data fetching functions
async function funGetTotal() {
  console.log('Fetching total analytics data')
  const apiUrl = '/api/analytics/proxy'

  // Adjust date range based on selected period
  let dateRange = "350daysAgo"
  let dimension = "yearMonth"
  
  if (selectedPeriod.value === 'Harian') {
    dateRange = "30daysAgo"
    dimension = "date"
  } else if (selectedPeriod.value === 'Mingguan') {
    dateRange = "90daysAgo"
    dimension = "yearWeek"
  }
  const payload = {
    "dateRanges": [
      {
        "startDate": dateRange,
        "endDate": "today"
      }
    ],
    "dimensions": [
      {
        "name": dimension
      }
    ],
    "metrics": [
      {
        "name": "screenPageViews"
      },
      {
        "name": "activeUsers"
      },
    ]
  }

  try {
    const response = await axios.post(apiUrl, {
      endpoint: 'runReport',
      payload,
      token: token.value
    })

    console.log('Total analytics data received')
    processApiResponse(response.data)
  } catch (error) {
    console.error('Error fetching total analytics data:', error)
    throw new Error(`Failed to fetch visitor data: ${error.message}`)
  }
}

async function funGetDevice() {
  console.log('Fetching device data')
  const apiUrl = '/api/analytics/proxy'
  const payload = {
    "dateRanges": [
      {
        "startDate": "350daysAgo",
        "endDate": "today"
      }
    ],
    "dimensions": [
      {
        "name": "deviceCategory"
      }
    ],
    "metrics": [
      {
        "name": "sessions"
      }
    ]
  }

  try {
    const response = await axios.post(apiUrl, {
      endpoint: 'runReport',
      payload,
      token: token.value
    })

    if (response.data && Array.isArray(response.data.rows)) {
      const dataDevices = []
      const dataDeviceValues = []

      response.data.rows.forEach(row => {
        if (row.dimensionValues && row.metricValues) {
          const deviceCategory = row.dimensionValues[0]?.value
          const sessions = parseInt(row.metricValues[0]?.value, 10)

          if (deviceCategory && !isNaN(sessions)) {
            // Capitalize first letter of device category
            const formattedCategory = deviceCategory.charAt(0).toUpperCase() + deviceCategory.slice(1)
            dataDevices.push(formattedCategory)
            dataDeviceValues.push(sessions)
          }
        }
      })

      console.log('Device data processed')
      
      // Store data for later rendering
      deviceChartData.value = {
        labels: dataDevices,
        values: dataDeviceValues
      }
    }
  } catch (error) {
    console.error('Error fetching device data:', error)
    throw new Error(`Failed to fetch device data: ${error.message}`)
  }
}

async function funGetBrowser() {
  console.log('Fetching browser data')
  const apiUrl = '/api/analytics/proxy'
  const payload = {
    "dateRanges": [
      {
        "startDate": "350daysAgo",
        "endDate": "today"
      }
    ],
    "dimensions": [
      {
        "name": "browser"
      }
    ],
    "metrics": [
      {
        "name": "sessions"
      }
    ],
    "orderBys": [
      {
        "metric": {
          "metricName": "sessions"
        },
        "desc": true
      }
    ],
    "limit": 10
  }

  try {
    const response = await axios.post(apiUrl, {
      endpoint: 'runReport',
      payload,
      token: token.value
    })

    if (response.data && Array.isArray(response.data.rows)) {
      const dataBrowsers = []
      const dataBrowserValues = []

      response.data.rows.forEach(row => {
        if (row.dimensionValues && row.metricValues) {
          const browserCategory = row.dimensionValues[0]?.value
          const sessions = parseInt(row.metricValues[0]?.value, 10)

          if (browserCategory && !isNaN(sessions)) {
            dataBrowsers.push(browserCategory)
            dataBrowserValues.push(sessions)
          }
        }
      })

      console.log('Browser data processed')
      
      // Store data for later rendering
      browserChartData.value = {
        labels: dataBrowsers,
        values: dataBrowserValues
      }
    }
  } catch (error) {
    console.error('Error fetching browser data:', error)
    throw new Error(`Failed to fetch browser data: ${error.message}`)
  }
}

async function funGetURLPopular() {
  console.log('Fetching popular URLs')
  const apiUrl = '/api/analytics/proxy'
  const payload = {
    "dateRanges": [
      {
        "startDate": "350daysAgo",
        "endDate": "today"
      }
    ],
    "dimensions": [
      {
        "name": "pagePath"
      },
      {
        "name": "pageTitle"
      }
    ],
    "metrics": [
      {
        "name": "sessions"
      }
    ],
    "orderBys": [
      {
        "metric": {
          "metricName": "sessions"
        },
        "desc": true
      }
    ],
    "limit": 10
  }

  try {
    const response = await axios.post(apiUrl, {
      endpoint: 'runReport',
      payload,
      token: token.value
    })

    const results = []
    
    if (response.data && Array.isArray(response.data.rows)) {
      response.data.rows.forEach((row, index) => {
        const pagePath = row.dimensionValues[0].value
        const pageTitle = row.dimensionValues[1].value || pagePath
        const sessions = parseInt(row.metricValues[0].value, 10)

        results.push({
          no: index + 1,
          title: pageTitle || pagePath,
          path: pagePath,
          views: sessions
        })
      })
    }

    console.log('Popular URLs processed')
    populerURL.value = results.slice(0, 5)
  } catch (error) {
    console.error('Error fetching popular URLs:', error)
    throw new Error(`Failed to fetch popular URLs: ${error.message}`)
  }
}
</script>

<style scoped>
.dark .recharts-cartesian-grid-horizontal line,
.dark .recharts-cartesian-grid-vertical line {
  stroke: rgba(255, 255, 255, 0.1);
}

.dark .recharts-text {
  fill: rgba(255, 255, 255, 0.7);
}
</style>