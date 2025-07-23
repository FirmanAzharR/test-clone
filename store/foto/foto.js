import { defineStore } from "pinia";
import { useAuthToken } from '~/composable/useAuthToken'

export const useFotoStore = defineStore("foto", {
  state: () => ({
    fotoData: [],
    allGaleriesData: [],
    allVideosData: [],
    allSliderData: [],
    deleteGalleryData: [],
    detailGaleriData: [],
    dataAddGaleri: [],
    dataAEditBeritaAdmin: [],
    detailVideoData: [],
    dataAddVideo: [],
    dataEditVideosAdmin: [],
    dataDeleteVideo: [],
    detailSliderData: [],
    dataEditSliderAdmin: [],
    deleteSliderData: [],
    dataAddSlider: [],
    page: 1,
    recordsPerPage: 8,
    detailFotoData: null,

  }),

  actions: {
    // GALERI/FOTO FUNCTIONS
    async getFotoData() {
      try{
        const { token } = useAuthToken();
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const response = await axios.get(`${apiBaseUrl}/api/galeri/galeries`, {
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
        this.detailFotoData = response
        return response.data
      } catch (err) {
        console.error(err)
      }
    },

    async getAllGaleries() {
      try{
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        
        const response = await axios.get(`${apiBaseUrl}/api/galeri/allgaleries`, {
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
        this.allGaleriesData = response
      } catch (err) {
        console.error(err)
      }
    },
    async detailGaleri(id){
      try{
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        
        const response = await axios.get(`${apiBaseUrl}/api/galeri/editgaleri/` + id, {
          headers: {
            'Authorization': `Bearer ${localStorageToken}`, 
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        this.detailGaleriData = response.data
      } catch (err) {
        console.error(err)
      }
    },

    async addGaleriDataAdmin(payload) {
      try{
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        
        const response = await axios.post(
          `${apiBaseUrl}/api/galeri/galeri`, 
          payload,
          {
            headers: {
              'Authorization': `Bearer ${localStorageToken}`,
              'Accept': 'application/json',
              'Content-Type': 'multipart/form-data'
            }
          }
        ); 
        this.dataAddGaleri = response.data;
        return response;

      } catch (err) {
        console.error(err)
        throw err
      }
    },

    async editGalleriesDataAdmin(id, payload) {
      try{
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        
        const response = await axios.put(`${apiBaseUrl}/api/galeri/galeri?id=${id}`, payload, {
          headers: {
            'Authorization': `Bearer ${localStorageToken}`,
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
          }
        })
        this.dataAEditBeritaAdmin = response
        return response
      } catch (err) {
        console.error(err)
        throw err
      }
    },

    async deleteGalleryAdmin(id) {
      try{
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        
        const response = await axios.delete(`${apiBaseUrl}/api/galeri/galeri/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorageToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        return response
      } catch (err) {
        console.error(err)
        throw err
      }
    },    async getAllVideo() {
      try{
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        
        const response = await axios.get(`${apiBaseUrl}/api/video/allvideos`, {
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

        this.allVideosData = response.data;
      } catch (err) {
        console.error(err)
      }
    },
    async detailDataVideosAdmin(id){
      try{
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        
        const response = await axios.get(`${apiBaseUrl}/api/video/editvideo/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorageToken}`, 
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        this.detailVideoData = response.data
        return response
      } catch (err) {
        console.error(err)
      }
    },

    async addVideosDataAdmin(payload) {
      try{
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        
        const response = await axios.post(
          `${apiBaseUrl}/api/video/video`, 
          payload,
          {
            headers: {
              'Authorization': `Bearer ${localStorageToken}`,
              'Accept': 'application/json',
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        this.dataAddVideo = response.data
        return response
      } catch (err) {
        console.error(err)
        throw err
      }
    },

    async editVideosDataAdmin(id, payload) {
      try{
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        
        const response = await axios.put(`${apiBaseUrl}/api/video/video?id=${id}`, payload, {
          headers: {
            'Authorization': `Bearer ${localStorageToken}`,
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
          }
        })
        this.dataEditVideosAdmin = response
        return response
      } catch (err) {
        console.error(err)
        throw err
      }
    },

    async deleteVideoAdmin(id) {
      try{
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        
        const response = await axios.delete(`${apiBaseUrl}/api/video/video/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorageToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
          }
        })
        return response
      } catch (err) {
        console.error(err)
        throw err
      }
    },    async getAllSlider() {
      try{
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        
        const response = await axios.get(`${apiBaseUrl}/api/slider/allsliders`, {
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

        this.allSliderData = response.data;
      } catch (err) {
        console.error(err)
      }
    },
    async detailSliderAdmin(id){
      try{
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        
        const response = await axios.get(`${apiBaseUrl}/api/slider/editslider/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorageToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        this.detailSliderData = response
        return response
      } catch (err) {
        console.error(err)
      }
    },

    async addSliderDataAdmin(payload) {
      try{
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        
        const response = await axios.post(
          `${apiBaseUrl}/api/slider/slider`, 
          payload,
          {
            headers: {
              'Authorization': `Bearer ${localStorageToken}`,
              'Accept': 'application/json',
              'Content-Type': 'multipart/form-data', 
            }
          }
        )
        this.dataAddSlider = response
        return response
      } catch (err) {
        console.error(err)
        throw err
      }
    },

    async editSliderDataAdmin(id, payload) {
      try{
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        
        const response = await axios.put(`${apiBaseUrl}/api/slider/slider?id=${id}`, payload, {
          headers: {
            'Authorization': `Bearer ${localStorageToken}`,
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
          }
        })
        return response
      } catch (err) {
        console.error(err)
        throw err
      }
    },

    async deleteSliderDataAdmin(id) {
      try{
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        
        const response = await axios.delete(`${apiBaseUrl}/api/slider/slider/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorageToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        this.deleteSliderData = response.data;
      } catch (err) {
        console.error("Failed to delete berita data:", err);
      }
    },
    async getDetailFoto(id) {
      try{
        const { token } = useAuthToken();
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const response = await axios.get(`${apiBaseUrl}/api/galeri/galeri/${id}`, {
          headers: {
            'Authorization': token.value,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        this.detailFotoData = response.data.data
        return response.data.data
      } catch (err) {
        console.error(err)
        throw err
      }
    }
  }
});
