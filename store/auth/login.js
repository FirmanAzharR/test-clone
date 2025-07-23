import { defineStore } from "pinia";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useAuthToken } from '~/composable/useAuthToken'

export const useLoginStore = defineStore("login", {
  state: () => ({
    user: null,
    loginData: [],
    token: null,
    isAuthenticated: false,
    isAuth_data: false,
    getUsersData: [],
    tokenUserData: null,
    appIdUserData: null
  }),

  getters: {
    isAuth: (state) => {
      const cookieToken = useCookie("access_token").value;
      return state.isAuthenticated || (cookieToken ? true : false);
    },
  },
  actions: {
    async loginAdmin(values) {
      try {
        const config = useRuntimeConfig();
        const formData = new URLSearchParams();
        for (const key in values) {
          formData.append(key, values[key]);
        }
        const response = await axios.post(`${config.LoginBaseUrl}/login-sso`, formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        });

        this.loginData = response.data;
        const accessToken = response.data.data.access_token;
        const idToken = response.data.data.id_token;
        const expiresIn = response.data.data.expires_in;

        const decodedIdToken = jwtDecode(idToken);
        this.user = decodedIdToken; // Store decoded token data in state
        localStorage.setItem('userEmail', this.user.email);
        const expiresInDays = expiresIn / (60 * 60 * 24);

        Cookies.set('access_token', accessToken, { expires: expiresInDays });
        this.token = accessToken;
        this.isAuthenticated = true;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    async getUsers() {
      try {
        const { token } = useAuthToken();
        const config = useRuntimeConfig();
        const apiBaseUrl = config.public.apiBaseUrl;
        const localStorageUser = localStorage.getItem('userEmail');
        if (!localStorageUser) {
          throw new Error("User email not available");
        }
        const email = localStorageUser;
        const response = await axios.get(`${apiBaseUrl}/api/user/getusers/${email}`, {
          headers: {
            Authorization: token.value
          }
        });
        this.getUsersData = response.data.data;
        this.tokenUserData = response.data.data.token;
        this.appIdUserData = response.data.data.id;

        if (!this.appIdUserData) {
          throw new Error("App ID is not available in the response");
        }

        localStorage.setItem('userToken', this.tokenUserData);
        localStorage.setItem('appId', this.appIdUserData);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        throw new Error("Unable to load dashboard. Please check your app ID.");
      }
    },
    logout() {
      const accessTokenCookie = useCookie('access_token');
      accessTokenCookie.value = null;
      
      this.token = null;
      this.isAuthenticated = false;
      this.user = null;
      this.loginData = [];
      
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userToken');
      localStorage.removeItem('appId');
    }
  },
});
