import { defineStore } from "pinia";
import { useAuthToken } from '~/composable/useAuthToken'

export const useVideoStore = defineStore("video", {
  state: () => ({
    videoData: [],
  }),
  actions: {
    async getVideoData() {
      try {
        const { token } = useAuthToken();
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const response = await axios.get(`${apiBaseUrl}/api/video/videos`, {
          params: {
            page: 1,
            page_size: 100 // Fetch all videos at once
          },
          headers: {
            'Authorization': token.value,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        this.videoData = response
      } catch (err) {
        console.error(err)
      }
    }
  }
});
