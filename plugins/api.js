import { jwtDecode } from 'jwt-decode';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const getInstansiId = () => {
    const tokenAdmin = config.public.apiAuth;
    if (!tokenAdmin) return "1";

    try {
      const decoded = jwtDecode(tokenAdmin);
      return decoded.instansi_id || "1";
    } catch (error) {
      console.warn('Failed to decode token:', error);
      return "1";
    }
  };

  return {
    provide: {
      getInstansiId
    }
  };
});