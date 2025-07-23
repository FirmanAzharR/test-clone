import { defineStore } from "pinia";
import { useAuthToken } from '~/composable/useAuthToken'

export const useAdminStore = defineStore("admin", {
  state: () => ({
    allAgendaData: [],
    allProfileData: [],
    allPagesData: [],
    allWidgetData: [],
    allPermohonanData: [],
    allSoalData: [],
    allJawabanData: [],
    detailProfileData: [],
    dataAddProflie: [],
    dataEditProfileAdmin: [],
    dataDeleteProfile: [],
    dataDeletePages: [],
    dataEditPages: [],
    dataAddPages: [],
    dataDetailPages: [],
    allDataWidgetHome: [],
  }),
  getters: {
    // getMenuData: (state) => state.menuData,
  },
  actions: {
    async getAllAgenda() {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        const response = await axios.get(
          `${apiBaseUrl}/api/agenda/allagenda?page=1&page_size=2`,
          {
            headers: {
              Authorization: `Bearer ${localStorageToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        this.allAgendaData = response.data;
      } catch (err) {
        console.error("Failed to fetch all agenda data:", err);
      }
    },
    async getAllProfile() {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        const response = await axios.get(
          `${apiBaseUrl}/api/profil/allprofils?page=1&page_size=1000000`,
          {
            headers: {
              Authorization: `Bearer ${localStorageToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        this.allProfileData = response.data;
      } catch (err) {
        console.error("Failed to fetch all profile data:", err);
      }
    },
    async detailProfileDataAdmin(id) {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        const response = await axios.get(
          `${apiBaseUrl}/api/profil/editprofil/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorageToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        this.detailProfileData = response.data.data;
      } catch (err) {
        console.error("Failed to fetch detail profile data:", err);
      }
    },
    async addProfileDataAdmin(payload) {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        const response = await axios.post(
          `${apiBaseUrl}/api/profil/profil`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorageToken}`,
              Accept: "application/json",
              "Content-Type": "multipart/form-data",
            },
          }
        );
        this.dataAddProflie = response.data;
        return response;
      } catch (err) {
        console.error("Failed to add berita data:", err);
        throw err;
      }
    },
    async editProfileDataAdmin(id, payload) {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        const response = await axios.put(
          `${apiBaseUrl}/api/profil/profil?id=${id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorageToken}`,
              Accept: "application/json",
              "Content-Type": "multipart/form-data",
            },
          }
        );
        this.dataEditProfileAdmin = response.data;
      } catch (err) {
        console.error("Failed to edit profile data:", err);
      }
    },
    async deleteProfileAdmin(id) {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        const response = await axios.delete(
          `${apiBaseUrl}/api/profil/profil/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorageToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        this.dataDeleteProfile = response.data;
      } catch (err) {
        console.error("Failed to delete profile data:", err);
        throw err;
      }
    },
    async getAllPages() {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        const response = await axios.get(
          `${apiBaseUrl}/api/page/allpages?page=2&page_size=1000000`,
          {
            headers: {
              Authorization: `Bearer ${localStorageToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        this.allPagesData = response.data;
      } catch (err) {
        console.error("Failed to fetch all pages data:", err);
      }
    },
    async detailPagesAdmin(id) {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        const response = await axios.get(
          `${apiBaseUrl}/api/page/editpage/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorageToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        this.dataDetailPages = response.data.data;
      } catch (err) {
        console.error("Failed to fetch detail berita data:", err);
      }
    },
    async addPagesAdmin(payload) {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        const response = await axios.post(
          `${apiBaseUrl}/api/page/page`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorageToken}`,
              Accept: "application/json",
              "Content-Type": "multipart/form-data",
            },
          }
        );
        this.dataAddPages = response.data;
        return response;
      } catch (err) {
        console.error("Failed to add berita data:", err);
        throw err;
      }
    },
    async editPagesAdmin(id, payload) {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }

        const response = await axios.put(
          `${apiBaseUrl}/api/page/page?id=${id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorageToken}`,
              Accept: "application/json",
              "Content-Type": "multipart/form-data",
            },
          }
        );
        this.dataEditPages = response.data;
      } catch (err) {
        console.error("Failed to delete berita data:", err);
      }
    },
    async deletePagesAdmin(id) {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }

        const response = await axios.delete(
          `${apiBaseUrl}/api/page/page/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorageToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        this.dataDeletePages = response.data;
      } catch (err) {
        console.error("Failed to delete berita data:", err);
      }
    },
    async getAllWidget() {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        const response = await axios.get(
          `${apiBaseUrl}/api/widget/allwidgets?page=1&page_size=1000000`,
          {
            headers: {
              Authorization: `Bearer ${localStorageToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        this.allWidgetData = response.data;
      } catch (err) {
        console.error("Failed to fetch all widget data:", err);
      }
    },
    async getAllPermohonan() {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        const response = await axios.get(
          `${apiBaseUrl}/api/permohonan/allpermohonans`,
          {
            headers: {
              Authorization: `Bearer ${localStorageToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        this.allPermohonanData = response.data;
      } catch (err) {
        console.error("Failed to fetch all permohonan data:", err);
      }
    },
    async getAllSoal() {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        const response = await axios.get(
          `${apiBaseUrl}/api/skm/allquestions`,
          {
            headers: {
              Authorization: `Bearer ${localStorageToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        this.allSoalData = response.data;
      } catch (err) {
        console.error("Failed to fetch all soal data:", err);
      }
    },
    async getAllJawaban() {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        const response = await axios.get(
          `${apiBaseUrl}/api/skm/allanswerss`,
          {
            headers: {
              Authorization: `Bearer ${localStorageToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        this.allJawabanData = response.data;
      } catch (err) {
        console.error("Failed to fetch all jawaban data:", err);
      }
    },
    async getAllWidgetHome() {
      try {
        const { token } = useAuthToken();
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const response = await axios.get(
          `${apiBaseUrl}/api/widget/widgets?page=undefined`,
          {
            headers: {
              Authorization: `${token.value}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        this.allDataWidgetHome = response.data.data;
      } catch (err) {
        console.error("Failed to fetch all widget home data:", err);
      }
    },
  },
});
