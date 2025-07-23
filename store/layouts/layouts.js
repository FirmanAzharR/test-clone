import { defineStore } from "pinia";

export const useLayout = defineStore("layout", {
  state: () => ({
    theme_data: "",
    notification_data: {
      show: false,
      title: "",
      message: "",
      type: "",
    },
    isLoading_data: false,
    isModalSuccess_data: false,
    isModalDelete_data: false,
  }),    getters: {
    theme: (state) => {
      // Jika sudah ada di state, gunakan itu
      if (state.theme_data) {
        return state.theme_data;
      }

      // Cek cookie terlebih dahulu
      const cookieTheme = useCookie("theme").value;
      if (cookieTheme && (cookieTheme === 'dark' || cookieTheme === 'light')) {
        state.theme_data = cookieTheme;
        return cookieTheme;
      }

      // Fallback ke sistem preferensi
      const getSystemTheme = () => {
        if (process.client && typeof window !== 'undefined') {
          return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        }
        return "light"; // Default untuk SSR
      };

      const systemTheme = getSystemTheme();
      state.theme_data = systemTheme;
      
      // Simpan ke cookie
      if (process.client) {
        useCookie("theme").value = systemTheme;
      }

      return state.theme_data;
    },
    notification: (state) => state.notification_data,
    isLoading: (state) => state.isLoading_data,
    isModalSuccess: (state) => state.isModalSuccess_data,
    isModalDelete: (state) => state.isModalDelete_data,
  },  actions: {
    themeSwitch() {
      const newTheme = this.theme === "dark" ? "light" : "dark";
      this.theme_data = newTheme;
      useCookie("theme").value = newTheme;
      
      // Langsung terapkan ke DOM
      if (process.client && typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        document.documentElement.setAttribute('data-theme', newTheme);
      }
    },

    initThemeListener() {
      if (process.client && typeof window !== 'undefined') {
        const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        
        const handleThemeChange = (e) => {
          // Hanya update jika user belum set manual preference
          const cookieTheme = useCookie("theme").value;
          if (!cookieTheme) {
            const newTheme = e.matches ? "dark" : "light";
            this.theme_data = newTheme;
            useCookie("theme").value = newTheme;
            document.documentElement.classList.toggle('dark', newTheme === 'dark');
            document.documentElement.setAttribute('data-theme', newTheme);
          }
        };
        
        darkModeMediaQuery.addEventListener("change", handleThemeChange);
        
        // Cleanup
        return () => {
          darkModeMediaQuery.removeEventListener("change", handleThemeChange);
        };
      }
    },

    setInitialTheme() {
      if (process.client && typeof window !== 'undefined') {
        const cookieTheme = useCookie("theme").value;
        const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        
        // Gunakan cookie jika ada, jika tidak gunakan sistem preferensi
        const finalTheme = cookieTheme || systemPreference;
        this.theme_data = finalTheme;
        
        // Simpan ke cookie jika belum ada
        if (!cookieTheme) {
          useCookie("theme").value = finalTheme;
        }
        
        // Langsung apply ke DOM
        document.documentElement.classList.toggle('dark', finalTheme === 'dark');
        document.documentElement.setAttribute('data-theme', finalTheme);
      }
    },
    setNotification(notification) {
      this.notification_data = notification;
    },
    setLoading(isLoading) {
      this.isLoading_data = isLoading;
    },
    setModalSuccess(isSuccess) {
      this.isModalSuccess_data = isSuccess;
    },
    setModalDelete(isDelete) {
      this.isModalDelete_data = isDelete;
    },
  },
});