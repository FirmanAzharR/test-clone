import { defineStore } from 'pinia'
import { useAuthToken } from '~/composable/useAuthToken'

export const useSoalStore = defineStore('soal', {
  state: () => ({
    questions: [],
    data: null,
    errors: null,
    answer: null,
    questionsFE: [],
    answers: []
  }),

  actions: {
    async getAllSoal() {
      try{
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        
        const { data } = await useFetch(`${apiBaseUrl}/api/skm/allquestions`, {
          headers: {
            'Authorization': `Bearer ${localStorageToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        this.questions = response.data || response
      } catch (err) {
        console.error("Failed to fetch all questions data:", err)
        this.errors = err
        throw err
      }
    },

    async getDataSoal(id) {
      try{
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        
        const { data } = await useFetch(`${apiBaseUrl}/api/skm/editquestion/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorageToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        this.data = response.data || response
        return this.data
      } catch (err) {
        console.error("Failed to fetch question detail:", err)
        this.errors = err
        throw err
      }
    },

    async updateSoal(id, formData) {
      try{
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        
        await $fetch(`${apiBaseUrl}/api/skm/question?id=${id}`, {
          method: 'PUT',
          query: { id },
          body: formData,
          headers: {
            'Authorization': `Bearer ${localStorageToken}`,
            'Accept': 'application/json'
          }
        })
        await this.getAllSoal()
        return response
      } catch (err) {
        console.error("Failed to update question:", err)
        this.errors = err
        throw err
      }
    },

    async storeSoal(formData) {
      try{
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        
        await $fetch(`${apiBaseUrl}/api/skm/question`, {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${localStorageToken}`,
            'Accept': 'application/json'
          }
        })
        await this.getAllSoal()
        return response
      } catch (err) {
        console.error("Failed to create question:", err)
        this.errors = err
        throw err
      }
    },

    async deleteSoal(id) {
      try{
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        
        await $fetch(`${apiBaseUrl}/api/skm/question/${id}`, {
          method: 'DELETE',
          query: { id },
          headers: {
            'Authorization': `Bearer ${localStorageToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        await this.getAllSoal()
        return response
      } catch (err) {
        console.error("Failed to delete question:", err)
        this.errors = err
        throw err
      }
    },

    async getQuestions() {
      try{
        const { token } = useAuthToken();
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const response = await $fetch(`${apiBaseUrl}/api/skm/questions`, {
          method: 'GET',
          headers: {
        'Authorization': token.value,
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data'
          }
        });
          this.questionsFE = response.data;
          return this.questionsFE;
      } catch (err) {
        console.error("Failed to fetch questions:", err)
        this.errors = err
        return []
      }
    },

    async submitAnswers(answers) {
      const config = useRuntimeConfig();
      const apiBaseUrl = config.public.apiBaseUrl;
      const promises = answers.map(({ qid, opt_value }) => {
        const formData = new FormData();
        formData.append('qid', qid);
        formData.append('user_id', '99');
        formData.append('opt_value', opt_value);

        return useFetch(`${apiBaseUrl}/api/skm/answersfromfe`, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
      });

      return Promise.all(promises);
    },

    async getAnswerData() {
      try{
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageToken = localStorage.getItem("userToken");
        if (!localStorageToken) {
          throw new Error("Local storage token not available");
        }
        
        const { data } = await $fetch(`${apiBaseUrl}/api/skm/allanswerss`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorageToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'

          }
        })
        this.answers = response.data || response
        return this.answers
      } catch (err) {
        console.error("Failed to fetch answer data:", err)
        this.errors = err
        return []
      }
    },

    // Helper methods
    clearErrors() {
      this.errors = null
    },

    resetData() {
      this.data = null
      this.errors = null
    },

    resetState() {
      this.questions = []
      this.data = null
      this.errors = null
      this.answer = null
      this.questionsFE = []
      this.answers = []
    }
  },
})
