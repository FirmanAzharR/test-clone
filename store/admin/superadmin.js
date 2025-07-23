import { defineStore } from "pinia";

export const useSuperAdminStore = defineStore("superadmin", {
  state: () => ({
    allDataUser: [],
    allDataRoles: [],
    detailRolesData: [],
    dataAddRoles: [],
    dataEditRolesData: [],
    allDataApps: [],
    detailAppsData: [],
    dataEditAppsData: [],
    allDataInstansi: [],
    dataDeleteApps: [],
    dataAddApps: [],
    allDataToken: [],
    dataGenerateToken: [],
    detailTokenData: [],
    dataAddToken: [],
    dataDeleteToken: [],
    dataEditTokenData: [],
    allDataUserRole: [],
    detailDataUserRole: [],
    dataAddUserRole: [],
    dataEditUserRoles: [],
    dataDeleteUserRoles: [],
  }),

  actions: {
    async getAllUsers() {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        const response = await axios.get(
          `${apiBaseUrl}/api/user/users?page=1&page_size=1000000`,
          {
            headers: {
              Authorization: `Bearer ${localStorageToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        this.allDataUser = response.data;
      } catch (err) {
        console.error("Failed to fetch all users data:", err);
      }
    },
    async getAllRoles() {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }

        const response = await axios.get(
          `${apiBaseUrl}/api/user/roles?page=1&page_size=1000000`,
          {
            headers: {
              Authorization: `Bearer ${localStorageToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        this.allDataRoles = response.data;
      } catch (err) {
        console.error("Failed to fetch all roles data:", err);
      }
    },
    async addRolesData(payload) {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }

        const response = await axios.post(
          `${apiBaseUrl}/api/user/roles`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorageToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        this.dataAddRoles = response.data;
        return response;
      } catch (err) {
        console.error("Failed to add berita data:", err);
        throw err;
      }
    },
    async getDetailRoles(id) {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        const response = await axios.get(
          `${apiBaseUrl}/api/user/roles/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorageToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        this.detailRolesData = response.data.data;
      } catch (err) {
        console.error("Failed to fetch detail roles data:", err);
      }
    },
    async editRolesData(id, payload) {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        const response = await axios.put(
          `${apiBaseUrl}/api/user/roles/${id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorageToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        this.dataEditRolesData = response.data;
      } catch (err) {
        console.error("Failed to edit roles data:", err);
      }
    },
    async getAllApps() {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        const response = await axios.get(
          `${apiBaseUrl}/api/user/apps?page=1&page_size=1000000`,
          {
            headers: {
              Authorization: `Bearer ${localStorageToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        this.allDataApps = response.data;
      } catch (err) {
        console.error("Failed to fetch all apps data:", err);
      }
    },
    async getOptionInstansi() {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const response = await axios.get(
          `${apiBaseUrl}/api/pegawai/instansi`,
          {
            headers: {
              Authorization:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M",
              "Content-Type": "application/json",
            },
          }
        );

        this.allDataInstansi = response.data.data;
      } catch (err) {
        console.error("Failed to fetch all instansi data:", err);
      }
    },
    async addAppsData(payload) {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        const response = await axios.post(
          `${apiBaseUrl}/api/user/apps`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorageToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        this.dataAddApps = response.data;
        return response;
      } catch (err) {
        console.error("Failed to add berita data:", err);
        throw err;
      }
    },
    async getDetailApps(id) {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }

        const response = await axios.get(
          `${apiBaseUrl}/api/user/apps/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorageToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        this.detailAppsData = response.data.data;
      } catch (err) {
        console.error("Failed to fetch detail video data:", err);
      }
    },
    async editAppsData(id, payload) {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        const response = await axios.put(
          `${apiBaseUrl}/api/user/apps/${id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorageToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        this.dataEditAppsData = response.data;
      } catch (err) {
        console.error("Failed to delete berita data:", err);
      }
    },
    async deleteApps(id) {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        const response = await axios.delete(
          `${apiBaseUrl}/api/user/apps/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorageToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        this.dataDeleteApps = response.data;
      } catch (err) {
        console.error("Failed to delete berita data:", err);
      }
    },
    async getAllToken() {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        const response = await axios.get(
          `${apiBaseUrl}/api/user/tokens?page=1&page_size=1000000`,
          {
            headers: {
              Authorization: `Bearer ${localStorageToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        this.allDataToken = response.data;
      } catch (err) {
        console.error("Failed to fetch all berita data:", err);
      }
    },
    async generateToken(id) {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        const response = await axios.get(
          `${apiBaseUrl}/api/user/gen-token/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorageToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        this.dataGenerateToken = response.data.data;
      } catch (err) {
        console.error("Failed to fetch all berita data:", err);
      }
    },
    async getDetailToken(id) {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        const response = await axios.get(
          `${apiBaseUrl}/api/user/token/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorageToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        this.detailTokenData = response.data.data;
      } catch (err) {
        console.error("Failed to fetch detail video data:", err);
      }
    },
    async addTokenData(payload) {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        const response = await axios.post(
          `${apiBaseUrl}/api/user/token`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorageToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        this.dataAddToken = response.data;
        return response;
      } catch (err) {
        console.error("Failed to add berita data:", err);
        throw err;
      }
    },
    async deleteToken(id) {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        const response = await axios.delete(
          `${apiBaseUrl}/api/user/token/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorageToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        this.dataDeleteToken = response.data;
      } catch (err) {
        console.error("Failed to delete berita data:", err);
      }
    },
    async editTokenData(id, payload) {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        const response = await axios.put(
          `${apiBaseUrl}/api/user/token/${id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorageToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        this.dataEditTokenData = response.data;
      } catch (err) {
        console.error("Failed to delete berita data:", err);
      }
    },
    async getAllUserRole() {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        const response = await axios.get(
          `${apiBaseUrl}/api/api/user/userroles?page=1&page_size=1000000`,
          {
            headers: {
              Authorization: `Bearer ${localStorageToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        this.allDataUserRole = response.data;
      } catch (err) {
        console.error("Failed to fetch all berita data:", err);
      }
    },
    async getDetailUserRole(id) {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        const response = await axios.get(
          `${apiBaseUrl}/api/user/userroles/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorageToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        this.detailDataUserRole = response.data.data;
      } catch (err) {
        console.error("Failed to fetch detail video data:", err);
      }
    },
    async addUserRoles(payload) {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        const response = await axios.post(
          `${apiBaseUrl}/api/user/userroles`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorageToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        this.dataAddUserRole = response.data;
        return response;
      } catch (err) {
        console.error("Failed to add berita data:", err);
        throw err;
      }
    },
    async deleteUserRoles(id) {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        const response = await axios.delete(
          `${apiBaseUrl}/api/user/userroles/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorageToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        this.dataDeleteUserRoles = response.data;
      } catch (err) {
        console.error("Failed to delete berita data:", err);
      }
    },
    async editUserRoles(id, payload) {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        const response = await axios.put(
          `${apiBaseUrl}/api/user/userroles/${id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorageToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        this.dataEditUserRoles = response.data;
      } catch (err) {
        console.error("Failed to delete berita data:", err);
      }
    },
  },
});
