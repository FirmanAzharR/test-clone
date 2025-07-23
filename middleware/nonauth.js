import { useLoginStore } from "~/store/auth/login";

export default defineNuxtRouteMiddleware((to, from) => {
  if(useLoginStore().isAuth){
    return navigateTo("/")
  }
});
