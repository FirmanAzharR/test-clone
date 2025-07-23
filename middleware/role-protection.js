import { useLoginStore } from '~/store/auth/login'

export default defineNuxtRouteMiddleware((to, from) => {
  // Hanya berjalan di client side untuk menghindari SSR issues
  if (process.server) return

  const loginStore = useLoginStore()
  const userRole = loginStore.getUsersData?.role?.toLowerCase()

  // Halaman yang tidak boleh diakses oleh kontributor
  const kontributorRestrictedPaths = [
    '/dashboard/agenda',
    '/dashboard/profil', 
    '/dashboard/menu',
    '/dashboard/widget',
    '/dashboard/permohonan',
    '/dashboard/survey-masyarakat',
    '/dashboard/user',
    '/dashboard/manajemen-role'
  ]

  // Halaman yang hanya boleh diakses oleh superadmin
  const superadminOnlyPaths = [
    '/dashboard/user',
    '/dashboard/manajemen-role'
  ]

  // Cek apakah kontributor mencoba mengakses halaman terlarang
  if (userRole === 'kontributor') {
    const isRestrictedPath = kontributorRestrictedPaths.some(path => 
      to.path.startsWith(path)
    )
    
    if (isRestrictedPath) {
      console.log(`Access denied: Kontributor cannot access ${to.path}`)
      return navigateTo('/dashboard')
    }
  }

  // Cek apakah non-superadmin mencoba mengakses halaman superadmin
  if (userRole !== 'superadmin') {
    const isSuperadminOnlyPath = superadminOnlyPaths.some(path => 
      to.path.startsWith(path)
    )
    
    if (isSuperadminOnlyPath) {
      console.log(`Access denied: Only superadmin can access ${to.path}`)
      return navigateTo('/dashboard')
    }
  }
})
