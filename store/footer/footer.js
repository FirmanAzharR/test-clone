import axios from "axios";
import { defineStore } from "pinia";
import { useAuthToken } from '~/composable/useAuthToken'

export const useFooterStore = defineStore("footer", {
  state: () => ({
    footerData: [],
    page: 1,
    recordsPerPage: 8,
    token: null,
    isLoading: false,
    retryCount: 0,
    maxRetries: 3,
    totalSums: {
      activeUsers: 0,
      newUsers: 0,
      screenPageViews: 0
    },
    total7Sums: {
      screenPageViews: 0,
      activeUsers: 0
    },
    totalTodaySums: {
      screenPageViews: 0,
      activeUsers: 0
    }
  }),
  
  getters: {
    // getMenuData: (state) => state.menuData,
  },
  
  actions: {
    async getFooterData() {
      try {
        const { token } = useAuthToken();
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const response = await axios.get(`${apiBaseUrl}/api/profil/profils`, {
          params: {
            page: this.page,
            page_size: this.recordsPerPage
          },
          headers: {
            Authorization: token.value
          }
        });
        this.footerData = response.data;
      } catch (err) {
        console.error('Error fetching footer data:', err)
      }
    },

    async TokenGenerateAnalytic() {
      try {
        this.isLoading = true;
        const startTime = Date.now();
        const config = useRuntimeConfig();
        
        console.log('Starting TokenGenerateAnalytic...');
        const response = await fetch('/api/analytics/token');
        const data = await response.json();
        this.token = data.accessToken;

        await Promise.all([
          this.FunGetTotal(),
          new Promise(resolve => setTimeout(resolve, 500)).then(() => this.FunGet7Total()),
          new Promise(resolve => setTimeout(resolve, 1000)).then(() => this.FunGetTodayTotal())
        ]);
        
        this.retryCount = 0;
      } catch (error) {
        console.error('Error in TokenGenerateAnalytic:', error);
        if (this.retryCount < this.maxRetries) {
          this.retryCount++;
          console.log(`Retrying... Attempt ${this.retryCount} of ${this.maxRetries}`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          await this.TokenGenerateAnalytic();
        }
      } finally {
        this.isLoading = false;
      }
    },

    async FunGetTotal() {
      try {
        const config = useRuntimeConfig();
        const propertyId = config.public.propertyId;
        const apiUrl = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;

        const requestBody = {
          dimensions: [{ name: 'month' }],
          metrics: [
            { name: 'activeUsers' },
            { name: 'screenPageViews' }
          ],
          dateRanges: [{
            startDate: '2020-01-01',
            endDate: 'today'
          }]
        };

        const response = await axios.post(apiUrl, requestBody, {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.data.rows && response.data.rows.length > 0) {
          const totals = response.data.rows.reduce((acc, row) => ({
            activeUsers: acc.activeUsers + parseInt(row.metricValues[0].value || '0', 10),
            screenPageViews: acc.screenPageViews + parseInt(row.metricValues[1].value || '0', 10)
          }), { activeUsers: 0, screenPageViews: 0 });

          this.totalSums = {
            ...this.totalSums,
            ...totals
          };

        }
      } catch (error) {
        console.error('Error fetching total analytics:', error);
        this.totalSums = { activeUsers: 0, screenPageViews: 0, newUsers: 0 };
      }
    },

    async FunGet7Total() {
      try {
        const config = useRuntimeConfig();
        const propertyId = config.public.propertyId;
        const apiUrl = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;

        const requestBody = {
          metrics: [
            { name: 'screenPageViews' },
            { name: 'activeUsers' }
          ],
          dateRanges: [{ 
            startDate: '7daysAgo', 
            endDate: 'today' 
          }]
        };

        const response = await axios.post(apiUrl, requestBody, {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.data.rows?.[0]) {
          const row = response.data.rows[0];
          this.total7Sums = {
            screenPageViews: parseInt(row.metricValues[0].value || '0', 10),
            activeUsers: parseInt(row.metricValues[1].value || '0', 10)
          };
        }
      } catch (error) {
        console.error('Error fetching 7-day analytics:', error);
        this.total7Sums = { screenPageViews: 0, activeUsers: 0 };
      }
    },

    async FunGetTodayTotal() {
      try {
        const config = useRuntimeConfig();
        const propertyId = config.public.propertyId;
        const apiUrl = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;

        const requestBody = {
          metrics: [
            { name: 'screenPageViews' },
            { name: 'activeUsers' }
          ],
          dateRanges: [{ 
            startDate: 'today', 
            endDate: 'today' 
          }]
        };

        const response = await axios.post(apiUrl, requestBody, {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.data.rows?.[0]) {
          const row = response.data.rows[0];
          this.totalTodaySums = {
            screenPageViews: parseInt(row.metricValues[0].value || '0', 10),
            activeUsers: parseInt(row.metricValues[1].value || '0', 10)
          };
        }
      } catch (error) {
        console.error('Error fetching today analytics:', error);
        this.totalTodaySums = { screenPageViews: 0, activeUsers: 0 };
      }
    },

    trackSocialClick(platform) {
      try {
        const config = useRuntimeConfig();
        // If you have a tracking library, you can use it here
      } catch (error) {
        console.error('Error tracking social click:', error);
      }
    }
  }
});