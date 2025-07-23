import axios from "axios";
import { defineStore } from "pinia";
import { useAuthToken } from '~/composable/useAuthToken'

export const useMenuStore = defineStore("menu", {
  state: () => ({
    menuData: [],
    dataAllMenu: [],
    dataAddMenu: [],
    dataDeleteMenu: [],
    dataDetailPageMenu: [],
    dataSearchMenu: []
  }),

  actions: {
    async getMenuData() {
      try {
        const { token } = useAuthToken();
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const response = await axios.get(`${apiBaseUrl}/api/menu/menus`, {
          headers: {
            'Authorization': token.value,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        this.menuData = response.data
      } catch (err) {
        console.error(err)
      }
    },

    async getSearchMenuData(value) {
      try {
        const { token } = useAuthToken();
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;        
        const response = await axios.get(`${apiBaseUrl}/api/artikel/search?q=${value}`, {
          headers: {
            'Authorization': token.value,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        this.dataSearchMenu = response.data.data
      } catch (err) {
        console.error(err)
      }
    },

    async getAllMenuDataAdmin() {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;            
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        
        const response = await axios.get(`${apiBaseUrl}/api/menu/allmenus`, {
          params: {
            page: 1,
            page_size: 5
          },
          headers: {
            'Authorization': `Bearer ${localStorageToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        this.dataAllMenu = response.data.data;
      } catch (err) {
        console.error("Failed to fetch all berita data:", err);
      }
    },
    async addMenuAdmin(payload) {
          try {
            const config = useRuntimeConfig();
            const apiBaseUrl = config.public.apiBaseUrl;                
            const localStorageToken = localStorage.getItem('userToken');
            if (!localStorageToken) {
              throw new Error("Local storage token not available");
            }
            const response = await axios.post(
              `${apiBaseUrl}/api/menu/menu`, 
              payload,
              {
                headers: {
                  'Authorization': `Bearer ${localStorageToken}`,
                  'Content-Type': 'multipart/form-data',
                  'Accept': 'application/json'
                }
              }
            ); 
            this.dataAddMenu = response.data;
            return response;
          } catch (err) {
            console.error("Failed to add berita data:", err);
            throw err; 
          }
    },
    async deleteMenuAdmin(id) {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;                
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        
        const response = await axios.delete(`${apiBaseUrl}/api/menu/menu/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorageToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        this.dataDeleteMenu = response.data;
      } catch (err) {
        console.error("Failed to delete berita data:", err);
      }
    },
    async getDetailPageMenu(id) {
      try {
        const { token } = useAuthToken();
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;                
        const response = await axios.get(`${apiBaseUrl}/api/page/page/${id}`, {
          headers: {
            'Authorization': token.value,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        this.dataDetailPageMenu = response.data
      } catch (err) {
        console.error(err)
      }
    },
  }
})
