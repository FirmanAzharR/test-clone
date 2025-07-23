import { defineStore } from "pinia";
import { useAuthToken } from '~/composable/useAuthToken'

export const useBeritaStore = defineStore("berita", {
  state: () => ({
    beritaData: [],
    allBeritaData: [],
    detailBeritaAdmin: [],
    deleteData: [],
    selectedBerita: [],
    dataAddBeritaAdmin: [],
    dataAEditBeritaAdmin: [],
    detailBeritaData: [],
    detailPageData: [],
    dataToEdit: [],
    dataSlider: [],
    artikelData: [],
    renstraData: [],
    informasiData: [],
    kegiatanData: [],
    asetData: [],
    generalData: [],
    page: 1,
    recordsPerPage: 6,
  }),
  getters: {
    // getMenuData: (state) => state.menuData,
    gettdataberita: (state) => state.dataAddBeritaAdmin,
    gettdataedit: (state) => state.dataAEditBeritaAdmin
  },
  actions: {
    async getBeritaData() {
      try {
        const { token } = useAuthToken();
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const response = await axios.get(`${apiBaseUrl}/api/artikel/artikels/berita`, {
          params: {
            page: this.page,
            page_size: this.recordsPerPage
          },
          headers: {
            'Authorization': token.value,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        this.beritaData = response.data
      } catch (err) {
        console.error(err)
        console.error("Failed to fetch berita data:", err)
      }
    },
    async getDetailBeritaData(detail) {
      try {
        const { token } = useAuthToken();
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const response = await axios.get(`${apiBaseUrl}/api/artikel/artikel/${detail}`, {
          headers: {
            'Authorization': token.value,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        this.detailBeritaData = response
      } catch (err) {
        console.error(err)
      }
    },
    async getDetailPageData(detail) {
      try {
        const { token } = useAuthToken();
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const response = await axios.get(`${apiBaseUrl}/api/page/page/${detail}`, {
          headers: {
            'Authorization': token.value,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        this.detailPageData = response
      } catch (err) {
        console.error(err)
      }
    },

    // Admin
    async getAllBeritaDataAdmin(konten) {
      try {
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }

        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const response = await axios.get(`${apiBaseUrl}/api/artikel/allartikels/${konten}`, {
          headers: {
            'Authorization': `Bearer ${localStorageToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        this.allBeritaData = response;
        // // return response;
      } catch (err) {
        console.error("Failed to fetch all berita data:", err);
      }
    },
    async editArtikelData(id) {
      try {
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }

        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const response = await axios.get(`${apiBaseUrl}/api/artikel/editartikel/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorageToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        this.detailBeritaAdmin = response;
        this.dataToEdit = response.data

      } catch (err) {
        console.error("Failed to fetch detail berita data:", err);
      }
    },
    async deleteBeritaDataAdmin(id) {
      try {
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }

        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const response = await axios.delete(`${apiBaseUrl}/api/artikel/artikel/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorageToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        this.deleteResponse = response;
        return response;
      } catch (err) {
        console.error("Failed to delete berita data:", err);
        throw err;
      }
    },
    async addBeritaDataAdmin(payload) {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }

        const response = await axios.post(
          `${apiBaseUrl}/api/artikel/artikel`,
          payload,
          {
            headers: {
              'Authorization': `Bearer ${localStorageToken}`,
              'Accept': 'application/json',
              'Content-Type': 'multipart/form-data',
            }
          }
        )

        this.dataAddBeritaAdmin = response
        return response
      } catch (err) {
        console.error("Failed to add berita data:", err)
        throw err
      }
    },
    async editBeritaDataAdmin(id, payload) {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem('userToken');
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        const response = await axios.put(`${apiBaseUrl}/api/artikel/artikel?id=${id}`, payload, {
          headers: {
            'Authorization': `Bearer ${localStorageToken}`,
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
          }
        }
        );

        this.dataAEditBeritaAdmin = response.data;
      } catch (err) {
        console.error("Failed to delete berita data:", err);
      }
    },
    async setSelectedBerita(value) {
      this.selectedBerita = value
      console.log("haii", this.selectedBerita)
    },
    async toSlider(payload) {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem('userToken');
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }

        // Buat FormData
        const formData = new FormData();
        for (const key in payload) {
          formData.append(key, payload[key]);
        }

        const response = await axios.post(`${apiBaseUrl}/api/slider/slider`, formData, {
          headers: {
            'Authorization': `Bearer ${localStorageToken}`,
            'Accept': 'application/json',
            "Content-Type": "multipart/form-data",
          },
        });

        this.dataSlider = response.data;
      } catch (err) {
        console.error("Failed to post in slider:", err);
      }
    },
    async getArtikelData() {
      try {
        const { token } = useAuthToken();
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const response = await axios.get(`${apiBaseUrl}/api/artikel/artikels/artikel`, {
          params: {
            page: this.page,
            page_size: this.recordsPerPage
          },
          headers: {
            'Authorization': token.value,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        this.artikelData = response.data
      } catch (err) {
        console.error("Failed to fetch articles:", err)
      }
    },

    async getKegiatanData() {
      try {
        const { token } = useAuthToken();
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const response = await axios.get(`${apiBaseUrl}/api/artikel/artikels/kegiatan`, {
          params: {
            page: this.page,
            page_size: this.recordsPerPage
          },
          headers: {
            'Authorization': token.value,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        this.kegiatanData = response.data
      } catch (err) {
        console.error("Failed to fetch events:", err)
      }
    },
    async getRenstraData() {
      try {
        const { token } = useAuthToken();
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const response = await axios.get(`${apiBaseUrl}/api/artikel/artikels/renstra`, {
          params: {
            page: 1,
            page_size: 100
          },
          headers: {
            'Authorization': token.value,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        this.renstraData = response.data
      } catch (err) {
        console.error("Failed to fetch renstra:", err)
      }
    },
    async getCategoryData(category) {
      try {
        const { token } = useAuthToken();
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const response = await axios.get(`${apiBaseUrl}/api/artikel/artikels/${category}`, {
          params: {
            page: 1,
            page_size: 100
          },
          headers: {
            'Authorization': token.value,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })

        // Store data in the appropriate state property
        switch (category) {
          case 'renstra':
            this.renstraData = response.data
            break
          case 'informasi':
            this.informasiData = response.data
            break
          case 'kegiatan':
            this.kegiatanData = response.data
            break
          case 'aset':
            this.asetData = response.data
            break
          case 'general':
            this.generalData = response.data
            break
          default:
            console.warn(`Unknown category: ${category}`)
        }
      } catch (err) {
        console.error(`Failed to fetch ${category} data:`, err)
      }
    },
    async getDetailRenstra(id) {
      try {
        const { token } = useAuthToken();
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const response = await axios.get(`${apiBaseUrl}/api/artikel/artikel/${id}`, {
          headers: {
            'Authorization': token.value,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        return response.data
      } catch (err) {
        console.error("Failed to fetch article detail:", err)
        throw err
      }
    },
  }
});
