export default defineNuxtPlugin(() => {
  // Script ini dijalankan di client untuk mencegah flash of unstyled content (FOUC)
  
  const getSystemTheme = () => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  }

  const applyTheme = (theme) => {
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
        document.documentElement.setAttribute('data-theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        document.documentElement.setAttribute('data-theme', 'light')
      }
    }
  }

  // Segera terapkan tema sebelum komponen Vue dimuat
  if (process.client) {
    const cookieTheme = useCookie('theme', {
      default: () => getSystemTheme(),
      sameSite: 'lax',
      secure: true,
      httpOnly: false
    })

    // Terapkan tema segera
    applyTheme(cookieTheme.value)

    // Listen untuk perubahan sistem
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = (e) => {
      // Hanya update jika belum ada preferensi manual user
      const currentCookie = useCookie('theme').value
      if (!currentCookie) {
        const newTheme = e.matches ? 'dark' : 'light'
        cookieTheme.value = newTheme
        applyTheme(newTheme)
      }
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)

    // Cleanup
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        mediaQuery.removeEventListener('change', handleSystemThemeChange)
      })
    }
  }
})