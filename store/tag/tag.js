import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthToken } from '~/composable/useAuthToken'

export const useTagStore = defineStore('tag', {
state: () => ({
  tagList: [],
  taggedArticles: [], // Ubah dari object ke array
  articlesMeta: {}, // Pisahkan metadata
  isLoading: false,
  error: null,
  selectedTag: null,
  page: 1,
  recordsPerPage: 10,
  totalPages: 1,
  totalRecords: 0
}),

getters: {
  getTagList: (state) => state.tagList,
  getTaggedArticles: (state) => state.taggedArticles,
  getArticlesMeta: (state) => state.articlesMeta,
  getIsLoading: (state) => state.isLoading,
  getError: (state) => state.error,
  getTotalPages: (state) => state.totalPages,
  getSelectedTag: (state) => state.selectedTag,
},

actions: {
  async getArticlesByTag(tag, page = 1, pageSize = 10) {
    try {
      const { token } = useAuthToken();
      const config = useRuntimeConfig();
      const apiBaseUrl = config.public.apiBaseUrl;
      
      // Prevent duplicate requests
      if (this.isLoading && this.selectedTag === tag && this.page === page) {
        return;
      }
      
      this.isLoading = true;
      this.error = null;

      const response = await axios.get(`${apiBaseUrl}/api/artikel/articles`, {
        params: {
          tags: tag,
          page: page,
          page_size: pageSize
        },
        headers: {
        'Authorization': token.value,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      // Ensure we have data structure
      const articles = response.data.data || response.data || [];
      
      // Update state
      this.taggedArticles = Array.isArray(articles) ? articles : [];
      this.selectedTag = tag;
      this.page = page;
      this.recordsPerPage = pageSize;
      
      // Handle pagination metadata
      if (response.data.meta) {
        this.articlesMeta = response.data.meta;
        this.totalPages = response.data.meta.last_page || 1;
        this.totalRecords = response.data.meta.total || 0;
      } else {
        // Fallback if no meta
        this.totalPages = 1;
        this.totalRecords = this.taggedArticles.length;
      }
      
      return {
        articles: this.taggedArticles,
        meta: this.articlesMeta
      };
    } catch (err) {
      console.error(`Failed to fetch articles with tag '${tag}':`, err);
      this.error = err.message || "Failed to fetch tagged articles";
      this.taggedArticles = [];
      this.articlesMeta = {};
      throw err;
    } finally {
      this.isLoading = false;
    }
  },
  
  setPage(page) {
    this.page = page;
  },
  
  setRecordsPerPage(size) {
    this.recordsPerPage = size;
  },

  // Check if we already have data for this tag and page
  hasDataFor(tag, page) {
    return this.selectedTag === tag && 
           this.page === page && 
           this.taggedArticles.length > 0 && 
           !this.isLoading &&
           !this.error;
  },

  clearTaggedArticles() {
    this.taggedArticles = [];
    this.articlesMeta = {};
    this.selectedTag = null;
    this.page = 1;
    this.totalPages = 1;
    this.totalRecords = 0;
    this.error = null;
  },

  resetStore() {
    this.tagList = [];
    this.taggedArticles = [];
    this.articlesMeta = {};
    this.isLoading = false;
    this.error = null;
    this.selectedTag = null;
    this.page = 1;
    this.recordsPerPage = 10;
    this.totalPages = 1;
    this.totalRecords = 0;
  }
}
});