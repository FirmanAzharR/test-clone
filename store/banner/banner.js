import { defineStore } from "pinia";
import { useAuthToken } from '~/composable/useAuthToken'

export const useBannerStore = defineStore("banner", {
  state: () => ({
    bannerData: [],
    allBannerData: [],
    dataDetailLayanan: [],
    dataAddLayanan: [],
    dataEditLayanan: [],
    dataDeleteLayanan: [],
  }),

  actions: {
    async getBannerData() {
      try {
        const { token } = useAuthToken();
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const response = await axios.get(`${apiBaseUrl}/api/banner/banners`, {
          headers: {
            'Authorization': token.value,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        this.bannerData = response.data
      } catch (err) {
        console.error(err)
      }
    },
    async getAllBanner() {
      try {
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const response = await axios.get(`${apiBaseUrl}/api/banner/allbanners`, {
          params: {
            page: 1,
            page_size: 1000000
          },
          headers: {
            'Authorization': `Bearer ${localStorageToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        this.allBannerData = response;
      } catch (err) {
        console.error("Failed to fetch all banner data:", err);
      }
    },    
    async getDetailBanner(id) {
      try {
        const { token } = useAuthToken();
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const response = await axios.get(`${apiBaseUrl}/api/banner/banner/${id}`, {
          headers: {
            'Authorization': token.value,
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
          }
        });
        return response;
      } catch (err) {
        console.error("Failed to fetch banner data:", err);
        throw err;
      }
    },
    async detailLayananAdmin(id){
      try {
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const response = await axios.get(`${apiBaseUrl}/api/banner/editbanner/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorageToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
          }
        });
        this.dataDetailLayanan = response.data;
      } catch (err) {
        console.error("Failed to fetch detail banner data:", err);
      }
    },
    async addLayananAdmin(payload) {
      try {
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const response = await axios.post(
          `${apiBaseUrl}/api/banner/banner`, 
          payload,
          {
            headers: {
              'Authorization': `Bearer ${localStorageToken}`,
              'Accept': 'application/json',
              'Content-Type': 'multipart/form-data', 
            }
          }
        }); 
        this.dataAddLayanan = response
        return response;
      } catch (err) {
        console.error("Failed to add banner data:", err);
        throw err; 
      }
    },
    async editLayananAdmin(id, payload) {
      try {
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const response = await axios.put(`${apiBaseUrl}/api/banner/banner?id=${id}`, payload, {
          headers: {
            'Authorization': `Bearer ${localStorageToken}`,
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
          }
        });
        this.dataEditLayanan = response
        return response;
      } catch (err) {
        console.error("Failed to edit banner data:", err);
      }
    },
    async deleteLayananAdmin(id) {
      try {
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const response = await axios.delete(`${apiBaseUrl}/api/banner/banner/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorageToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
          }
        });
        this.dataDeleteLayanan = response;
        return response;
      } catch (err) {
        console.error("Failed to delete banner data:", err);
        throw err;
      }
    },
  }
});
