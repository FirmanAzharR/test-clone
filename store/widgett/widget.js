import axios from "axios";
import { defineStore } from "pinia";

export const useWidgetStore = defineStore('widget', {
  state: () => ({
    widgets: {
      data: []
    },
    detailWidget: null,
    errors: []
  }),

  actions: {
    async selectWidget() {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        
        const response = await axios.get(`${apiBaseUrl}/api/widget/allwidgets`, {
          params: {
            page: 1,
            page_size: 1000000
          },
          headers: {
            'Authorization': `Bearer ${localStorageToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })

        // Handle both possible API response structures
        if (response && typeof response === 'object') {
          if (Array.isArray(response)) {
            this.widgets = { data: response }
          } else if (response.data && Array.isArray(response.data)) {
            this.widgets = response
          } else {
            this.widgets = { data: [] }
          }
        } else {
          this.widgets = { data: [] }
        }
        
        return this.widgets
      } catch (err) {
        console.error("Failed to fetch all widget data:", err)
        this.widgets = { data: [] }
        this.errors = err.response?.data || []
        throw err
      }
    },

    async getData(id) {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }

        const response = await axios.get(`${apiBaseUrl}/api/widget/editwidget/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorageToken}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        })

        // Save the widget detail data
        this.detailWidget = response.data || response
        return this.detailWidget
      } catch (error) {
        console.error("Failed to fetch widget detail:", error)
        this.errors = error.response?.data || []
        throw error
      }
    },

    async storeWidget(formData) {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        
        const response = await axios({
          method: 'post',
          url: `${apiBaseUrl}/api/widget/widget`,
          data: formData,
          headers: {
            'Authorization': `Bearer ${localStorageToken}`,
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
          }
        })

        await this.selectWidget()
        return response
      } catch (error) {
        console.error("Failed to create widget:", error)
        this.errors = error.response?.data || []
        throw error
      }
    },

    async updateWidget(data) {
      try {
        const [id, formData] = data;
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        
        const response = await axios({
          method: 'put',
          url: `${apiBaseUrl}/api/widget/widget?id=${id}`,
          data: formData,
          headers: {
            'Authorization': `Bearer ${localStorageToken}`,
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
          }
        })

        await this.selectWidget()
        return response
      } catch (error) {
        console.error("Failed to update widget:", error)
        this.errors = error.response?.data || []
        throw error
      }
    },

    async destroyWidgetData(id) {
      try {
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        
        const response = await axios({
          method: 'delete',
          url: `${apiBaseUrl}/api/widget/widget/${id}`,
          headers: {
            'Authorization': `Bearer ${localStorageToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })

        await this.selectWidget()
        return response
      } catch (error) {
        console.error("Failed to delete widget:", error)
        this.errors = error.response?.data || []
        throw error
      }
    },

    // Helper methods
    clearErrors() {
      this.errors = []
    },

    resetData() {
      this.detailWidget = null
      this.errors = []
    },

    resetState() {
      this.widgets = { data: [] }
      this.detailWidget = null
      this.errors = []
    }
  },
})
