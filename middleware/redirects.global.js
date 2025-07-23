export default defineNuxtRouteMiddleware((to, from) => {
  // Handle redirects to the centralized informasi page with appropriate filters
  
  // Redirect from /artikel to /informasi with Article filter
  if (to.path === '/artikel' || to.path === '/artikel/') {
    // Set a temporary flag in sessionStorage to indicate the user came from /artikel
    if (process.client) {
      sessionStorage.setItem('fromArtikel', 'true');
    }
    return navigateTo('/informasi');
  }
  
  // Redirect from /berita to /informasi with Berita filter
  if (to.path === '/berita' || to.path === '/berita/') {
    // Set a temporary flag in sessionStorage to indicate the user came from /berita
    if (process.client) {
      sessionStorage.setItem('fromBerita', 'true');
    }
    return navigateTo('/informasi');
  }

  // Redirect /beranda to home
  if (to.path === '/beranda') {

    return navigateTo('/');
  }
});