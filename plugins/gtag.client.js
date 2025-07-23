import VueGtag, { trackRouter } from 'vue-gtag-next'

export default defineNuxtPlugin(async (nuxtApp) => {
  // Fetch GTAG ID from server
  let gtagId
  try {
    const response = await fetch('/api/gtag/id')
    const data = await response.json()
    gtagId = data.gtagId
  } catch (error) {
    console.error('Failed to fetch Google Analytics ID:', error)
    return
  }

  if (!gtagId) {
    console.error('Google Analytics ID not found')
    return
  }

  // Initialize gtag
  window.dataLayer = window.dataLayer || []
  function gtag() {
    dataLayer.push(arguments)
  }
  gtag('js', new Date())
  gtag('config', gtagId)

  nuxtApp.vueApp.use(VueGtag, {
    property: {
      id: gtagId
    },
    appName: 'Website OPD Frontend',
    enabled: true,
    enableTracking: true,
    defaultGroupName: 'default',
    includes: [],
    useDebugger: process.env.NODE_ENV !== 'production',
    trackOnNextTick: false,
    bootstrap: true,
    pageTrackerEnabled: true,
    pageTrackerScreenviewEnabled: true,
    pageTrackerTemplate: () => ({
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
      send_page_view: true
    })
  })

  // Track router changes with enhanced data
  const router = useRouter()
  if (router) {
    trackRouter(router, {
      template: (to) => ({
        page_title: to.name?.toString() || document.title,
        page_path: to.fullPath,
        page_location: window.location.href,
        page_hostname: window.location.hostname,
        send_page_view: true,
        send_to: gtagId
      })
    })
  }
})
