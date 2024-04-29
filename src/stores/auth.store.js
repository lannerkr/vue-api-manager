import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';
import router from '@/router';
import { ref } from 'vue';

//const baseUrl = `${import.meta.env.VITE_API_URL}/login/users`;
const baseUrl = config.VUE_CONFIG_APP_API+"login/users"
//const baseUrl = `https://192.168.0.157:8099/login/users`;

export const useAuthStore = defineStore('auth', () => {

    const userinfo = ref({
    })
    if (localStorage.getItem('userinfo')){
        userinfo.value = JSON.parse(localStorage.getItem('userinfo'))
        //console.log("userinfo is updated from localStorage")
    }
    
    async function login(username, password) {
        try {
            userinfo.value = await fetchWrapper.post(`${baseUrl}/authenticate`, { username, password })
            //console.log("LogIN: ",userinfo.value.username)
            localStorage.setItem('userinfo', JSON.stringify(userinfo.value))

            // redirect to previous url or default to home page
            router.replace('/')
        } catch (error) {
            alert(error)                
        }
    }

    function logout() {
        userinfo.value = {
            }
        localStorage.removeItem('userinfo')
        router.push('/auth/login')
    }

    return { userinfo, login, logout }
})