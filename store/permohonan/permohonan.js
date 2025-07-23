import { defineStore } from "pinia";
import { useAuthToken } from '~/composable/useAuthToken'

export const usePermohonanStore = defineStore("permohonan", {
  state: () => ({
    permohonans: [],
    detailPermohonan: null,
    errors: [],
  }),
  
  actions: {
    async getAllPermohonan() {
      try{
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        
        const response = await axios.get(`${apiBaseUrl}/api/permohonan/allpermohonans`, {
          headers: {
            'Authorization': `Bearer ${localStorageToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
          }
        })
        this.permohonans = response
      } catch (err) {
        console.error("Failed to fetch all permohonan data:", err)
        throw err
      }
    },
    
    async getPermohonanDetail(id) {
      try{
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
                
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        
        
        const response = await axios.get(
          `${apiBaseUrl}/api/permohonan/editpermohonan/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorageToken}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json' 
            }
          }
        })

        // Handle response data structure
        const responseData = response?.data || response
        
        this.detailPermohonan = {
          ...responseData,
          kategori: responseData.KatPemohon,
          nama: responseData.NamaPemohon,
          status: responseData.Status,
          alasan_ditolak: responseData.alasan_ditolak,
          NoPermohonan: responseData.NoPermohonan,
          ID: responseData.ID
        }
        
        return this.detailPermohonan
      } catch (error) {
        console.error("Failed to fetch permohonan detail:", error)
        throw error
      }
    },
    
    async createPermohonan(formData) {
      try{
        const { token } = useAuthToken();
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        
        // Convert formData array to FormData object
        const payload = new FormData()
        formData.forEach(([key, value]) => {
          payload.append(key, value || '')
        })
        
        const response = await axios({
          method: 'post',
          url: `${apiBaseUrl}/api/permohonan/permohonan`,
          data: data,
          headers: {
            'Authorization': token.value,
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data', 
          }
        }).catch(error => {
          console.error('=== CREATE PERMOHONAN ERROR ===');
          console.error('Error status:', error.response?.status);
          console.error('Error data:', error.response?.data);
          console.error('Error headers:', error.response?.headers);
          throw error;
        });

        if (response.status === 200 || response.status === 201) {
          await this.getAllPermohonan();
          return response.data;
        }
        throw new Error(response.data?.message || 'Failed to create permohonan');
      } catch (error) {
        console.error("Failed to create permohonan:", error)
        this.errors = error.data || []
        throw error
      }
    },
    
    async updatePermohonan(id, formData) {
      try{
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
                
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        
        
        // Convert formData array to FormData object
        const payload = new FormData()
        formData.forEach(([key, value]) => {
          payload.append(key, value || '')
        })
        
        const response = await axios({
          method: 'put',
          url: `${apiBaseUrl}/api/permohonan/permohonan?id=${id}`,
          data: data,
          headers: {
            'Authorization': `Bearer ${localStorageToken}`,
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data', 
          }
        })

        await this.getAllPermohonan()
        return response
      } catch (error) {
        console.error("Failed to update permohonan:", error)
        this.errors = error.data || []
        throw error
      }
    },
    
    async deletePermohonan(id) {
      try{
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        
        
        const response = await axios({
          method: 'delete',
          url: `${apiBaseUrl}/api/permohonan/permohonan/${id}`,
          headers: {
            'Authorization': `Bearer ${localStorageToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
          }
        })
        
        await this.getAllPermohonan()
        return response
      } catch (error) {
        console.error("Failed to delete permohonan:", error)
        this.errors = error.data || []
        throw error
      }
    },

    async createUserPermohonan(formData) {
      try{
        const { token } = useAuthToken();
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        // Convert form data to FormData format
        const data = new FormData();
        formData.forEach(([key, value]) => {
          payload.append(key, value || '')
        })
        
        const response = await axios({
          method: 'post',
          url: `${apiBaseUrl}/api/permohonan/permohonan`,
          data: data,
          headers: {
            'Authorization': token.value,
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.status === 200 || response.status === 201) {
          await this.getAllPermohonan();
          return response.data;
        }
        throw new Error(response.data?.message || 'Failed to create permohonan');
      } catch (error) {
        console.error("Failed to create user permohonan:", error)
        this.errors = error.data || []
        throw error
      }
    },

    async trackPermohonan(no_permohonan) {
      try{
        const { token } = useAuthToken();
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const response = await axios.get(`${apiBaseUrl}/api/permohonan/permohonan/${no_permohonan}`, {
          headers: {
            'Authorization': token.value,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (response.data) {
          const res = response.data
          return {
            kategori: res.KatPemohon,
            nama: res.NamaPemohon,
            no_an: res.no_an,
            alamat: res.alamat,
            email: res.email,
            telp: res.telp,
            pekerjaan: res.pekerjaan,
            status: res.Status,
            created_at: res.created_at,
            alasan: res.alasan_ditolak
          }
        }
        return null
      } catch (error) {
        console.error("Failed to track permohonan:", error)
        throw error
      }
    }
  }
})
