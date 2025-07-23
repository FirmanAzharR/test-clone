import axios from "axios";
import { defineStore } from "pinia";
import { useAuthToken } from '~/composable/useAuthToken'

export const useAgendaStore = defineStore('agenda', {
  state: () => ({
    agendaData: [],
    allAgendaData: [],
    detailAgendaAdmin: [],
    deleteData: [],
    selectedAgenda: [],
    page: 1,
    recordsPerPage: 6,
    persons: [],
  }),

  actions: {
    async getAgendaData() {
      try {
        const { token } = useAuthToken();
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const response = await axios.get(
          `${apiBaseUrl}/api/agenda/agendas`,
          {
            params: {
              publish: 1,
              today: true,
            },
            headers: {
              Authorization: token.value,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        this.agendaData = response.data;
      } catch (err) {
        console.error("Failed to fetch agenda data:", err)
        this.errors = err
        throw err
      }
    },

    async getAllAgenda() {
      try {
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }

        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const response = await axios.get(
          `${apiBaseUrl}/api/agenda/allagenda`,
          {
            params: {
              page: 1,
              page_size: 1000000,
            },
            headers: {
              Authorization: `Bearer ${localStorageToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        this.allAgendaData = response.data;
      } catch (err) {
        console.error("Failed to fetch all agenda data:", err)
        this.errors = err
        throw err
      }
    },

    async editAgendaData(id) {
      try {
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const response = await axios.get(
          `${apiBaseUrl}/api/agenda/editagenda/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorageToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        this.detailAgendaAdmin = response.data;
        return response.data;
      } catch (err) {
        console.error("Failed to fetch agenda detail:", err)
        this.errors = err
        throw err
      }
    },

    async updateAgenda(id, formData) {
      try {
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }

        // Add timezone offset to match server expectations
        const date = new Date(formData.created_at);
        const offset = -date.getTimezoneOffset();
        const hours = Math.floor(Math.abs(offset) / 60);
        const minutes = Math.abs(offset) % 60;
        const tzString = `${offset >= 0 ? "+" : "-"}${String(hours).padStart(
          2,
          "0"
        )}:${String(minutes).padStart(2, "0")}`;

        // Convert formData to match API format exactly
        const apiData = {
          kegiatan: formData.kegiatan.trim(),
          lokasi: formData.lokasi.trim(),
          person: formData.person,
          publish: String(formData.publish),
          created_at: formData.created_at.replace("Z", tzString),
        };

        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const response = await axios({
          method: "put",
          url: `${apiBaseUrl}/api/agenda/agenda/${id}`,
          data: apiData,
          headers: {
            Authorization: `Bearer ${localStorageToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }).catch((error) => {
          // Log detailed error information
          console.error("=== UPDATE AGENDA ERROR ===");
          console.error("Error status:", error.response?.status);
          console.error("Error data:", error.response?.data);
          console.error("Error headers:", error.response?.headers);
          throw error;
        });

        if (response.status === 200) {
          await this.getAllAgenda();
          return response.data;
        }
        throw new Error(response.data?.message || "Failed to update agenda");
      } catch (err) {
        console.error("Failed to update agenda:", err)
        this.errors = err
        throw err
      }
    },

    async createAgenda(formData) {
      try {
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }

        // Add timezone offset to match server expectations
        const date = new Date(formData.created_at);
        const offset = -date.getTimezoneOffset();
        const hours = Math.floor(Math.abs(offset) / 60);
        const minutes = Math.abs(offset) % 60;
        const tzString = `${offset >= 0 ? "+" : "-"}${String(hours).padStart(
          2,
          "0"
        )}:${String(minutes).padStart(2, "0")}`;

        // Convert formData to match API format exactly
        const apiData = {
          kegiatan: formData.kegiatan.trim(),
          lokasi: formData.lokasi.trim(),
          person: formData.person,
          publish: String(formData.publish),
          created_at: formData.created_at.replace("T", " ").replace("Z", ""),
        };

        // Use exact same axios configuration as updateAgenda which works correctly
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const response = await axios({
          method: "post",
          url: `${apiBaseUrl}/api/agenda/agenda/`,
          data: apiData,
          headers: {
            Authorization: `Bearer ${localStorageToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          // Add any CORS-related settings that updateAgenda might have
          withCredentials: false,
        }).catch((error) => {
          // Log detailed error information
          console.error("=== CREATE AGENDA ERROR ===");
          console.error("Error status:", error.response?.status);
          console.error("Error data:", error.response?.data);
          console.error("Error headers:", error.response?.headers);
          throw error;
        });

        if (response.status === 200 || response.status === 201) {
          await this.getAllAgenda();
          return response.data;
        }
        throw new Error(response.data?.message || "Failed to create agenda");
      } catch (err) {
        console.error("Failed to create agenda:", err)
        this.errors = err
        throw err
      }
    },

    async deleteAgenda(id) {
      try {
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }

        // Ambil config di sini
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;

        await axios.delete(`${apiBaseUrl}/api/agenda/agenda/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorageToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        await this.getAllAgenda();
      } catch (err) {
        console.error("Failed to delete agenda:", err)
        this.errors = err
        throw err
      }
    },

    async getPersons() {
      try {
        const nuxtApp = useNuxtApp();
        const instansi_id = nuxtApp.$getInstansiId();

        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M";

        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const response = await axios.get(
          `${apiBaseUrl}/api/pegawai/pegawaiall/${instansi_id}`,
          {
            headers: {
              Authorization: token,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.data?.data) {
          throw new Error("Invalid response format");
        }

        this.persons = response.data.data;
      } catch (error) {
        console.error("Error in getPersons:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("TokenInAuth");
          localStorage.removeItem("userId");
          localStorage.removeItem("appId");
          if (typeof window !== "undefined" && window.$nuxt?.$auth) {
            await window.$nuxt.$auth.logout();
          }
        }
        throw error
      }
    },
  },
});
