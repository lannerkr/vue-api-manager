<script setup>
import {ref} from 'vue'
import { useAuthStore } from '@/stores'
import axios from 'axios'
//import { useToast } from "primevue/usetoast";

//const toast = useToast();

const apiServerUrl = config.VUE_CONFIG_APP_API
const authStore = useAuthStore()

const dropdownItems = ref([
    { name: 'STORE', code: 'store' },
    { name: 'PARTNER', code: 'partner' },
    { name: 'EMP-GOTP', code: 'EMP-GOTP' }
])

const selectedItem = ref({name:"STORE", code:"store"})

const userid = ref("")
const userip = ref("")
const usermac = ref("")

const userCreate = async function() {

    if (usermac.value && !macValidate(usermac.value)) {
        addMessages(2, usermac.value+" is invalid MAC address format ...")
        return
    }

    let value = {userid:userid.value, userrealm:selectedItem.value.code, userip:userip.value, usermac:usermac.value}
    let url = apiServerUrl + "user/create"
    await axios.post(url, value, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authStore.userinfo.jwtToken}`
        }
    })
    .then(function(response) {
        if (response.status == 200){
            let res1 = "user: [ " + userid.value + " ]"
            if (usermac.value != "") {
                res1 = res1 + ", mac : [ " + usermac.value + " ]"
            }
            res1 = res1 + " is created successfully."
            addMessages(1, res1)
            //toast.add({ severity: 'success', summary: 'Create Success', detail: res1, life: 6000 });
        } else {
            addMessages(2, response.data)
            //toast.add({ severity: 'warn', summary: 'Create Failed', detail: response.data, life: 6000 });
        }
    })
    .catch((error) => {
        addMessages(2, error)
        //alert(error)
    })
}

const messages = ref([]);
let count = ref(0);
const addMessages = (num, msg) => {
  switch(num) {
    case 1:
      messages.value = [{ severity: 'success', content: msg, id: count.value++ }]
      break
    case 2:
      messages.value = [{ severity: 'warn', content: msg, id: count.value++ }]
      break
    default:
      messages.value = [{ severity: 'info', content: msg, id: count.value++ }]
  }

}

function macValidate(mac) {
    let reg = /[0-9a-fA-F]{2}(:[0-9a-fA-F]{2}){5}/
    return reg.test(mac)
}

</script>

<template>

    <div style="height: 50px; color:green; font-size: x-large; text-align: center;">
        USER CREATE<span v-if="selectedItem"> : For Realm {{ selectedItem.name }}</span>
    </div>
 
 <div style="width: 70%; margin-left: 15%;">
    <div>
        <transition-group name="p-message" tag="div">
            <Message v-for="msg of messages" :key="msg.id" :severity="msg.severity">{{ msg.content }}</Message>
        </transition-group>
    </div>
    <div class="card p-fluid">
        <form @submit.prevent="userCreate">
        <div class="field col-12 md:col-3">
            <label for="realm" style="font-size: larger;">REALM</label>
            <Dropdown id="realm" v-model="selectedItem" :options="dropdownItems" optionLabel="name" placeholder="Select Realm"></Dropdown>
        </div>
        <div class="field">
            <label for="username1">Name</label>
            <InputText id="username1" type="text" v-model="userid" required placeholder="Enter User ID" />
        </div>
        <div class="field">
            <label for="staticip1">고정 IP (optional)</label>
            <InputMask id="staticip1" type="text" v-model="userip" minlength="7" maxlength="15" mask="99.99.99.99?9" placeholder="71.65.61.100" />
        </div>
        <div class="field">
            <label for="macaddr1">Mac Address (optional)</label>
            <InputMask id="macaddr1" type="text" v-model="usermac" minlength="17" maxlength="17" mask="**:**:**:**:**:**" placeholder="00:EE:EE:00:00:FF" />
        </div>

        <Button label="Submit" type="submit"></Button>
        </form>
    </div>

    <!-- <div>
        <ConfirmDialog></ConfirmDialog>
        <div class="card flex flex-wrap gap-2 justify-content-center">
            <Button @click="confirm1()" label="Save" outlined></Button>
            <Button @click="confirm2()" label="Delete" severity="danger" outlined></Button>
        </div>
    </div> -->
</div>
<Toast />

</template>

<style scoped>

</style>