import axios from "axios";
import { defineStore } from "pinia";
import { useAuthToken } from '~/composable/useAuthToken'

export const useCarouselStore = defineStore("carousel", {
  state: () => ({
    carouselData: []
  }),

  actions: {
    async getCarouselData() {
      try {
        const { token } = useAuthToken();
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const response = await axios.get(`${apiBaseUrl}/api/slider/sliders`, {
          headers: {
            'Authorization': token.value,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        this.carouselData = response.data 
      } catch (err) {
        console.error("Failed to fetch carousel data:", err)
      }
    }
  }
})
