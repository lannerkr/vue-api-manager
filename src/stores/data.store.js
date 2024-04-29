import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { fetchWrapper } from '@/helpers'
import { useAuthStore } from '@/stores'
import axios from 'axios'

//const apiServerUrl = `${import.meta.env.VITE_API_URL}/`
const apiServerUrl = config.VUE_CONFIG_APP_API

export const useDataStore = defineStore('userdata', () => {

    const authStore = useAuthStore()
    const aUserData = ref()
    const dbUserData = ref()
    const singleUser = {
        pcsdata: ref(),
        dbtable: ref(),
        getlog: ref(),
        records: ref({
            username: "",
        })
    }

    function updateActive(number) {
        fetchWrapper.get(apiServerUrl + "activeusers/" + number)
        .then((result)=>{
            aUserData.value = result
        })
    }

    function updateTable(realm, upstate) {
        if (upstate) {
            fetchWrapper.get(apiServerUrl+"table/" + realm + "?update=true")
            .then((result)=>{
                dbUserData.value = result.data
            })
        } else {
            fetchWrapper.get(apiServerUrl+"table/" + realm)
            .then((result)=>{
                dbUserData.value = result.data
            })
        }
    }

    async function updateTableNew(realm, upstate) {
        if (upstate) {
            await axios.get(apiServerUrl+"table/"+ realm+"?update=true", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authStore.userinfo.jwtToken}`
                }
            })
            .then((response) => {
                //console.log(response.data)
                dbUserData.value = response.data.data
            }) 
            .catch((error) => {
                alert(error)
            })
        } else {
            await axios.get(apiServerUrl+"table/"+ realm, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authStore.userinfo.jwtToken}`
                }
            })
            .then((response) => {
                //console.log(response)
                dbUserData.value = response.data.data
            }) 
            .catch((error) => {
                alert(error)
            })
        }
    }


    function updateSingleTable(realm, username) {
        fetchWrapper.get(apiServerUrl+"users/" + realm + "/" + username)
        .then((result)=>{
          let rec = result
          singleUser.pcsdata.value = result
          singleUser.pcsdata.value.pcas = rec['change-password-at-signin']
          singleUser.dbtable.value = result.dbtable
          singleUser.getlog.value = result.userlog

          singleUser.records.value.username = rec.records['active-user-name']
          singleUser.records.value.realm = rec.records['authentication-realm']
          singleUser.records.value.connip = rec.records['network-connect-ip']
          singleUser.records.value.version = rec.records['pulse-client-version']
          singleUser.records.value.role = rec.records['user-roles']
          singleUser.records.value.logintime = rec.records['user-sign-in-time']
          singleUser.records.value.sid = rec.records['session-id']
        })
        .catch(function (error) {
          alert(error.message)
        })
    }

  return { aUserData, dbUserData, singleUser, updateActive, updateTable, updateSingleTable, updateTableNew }
})


