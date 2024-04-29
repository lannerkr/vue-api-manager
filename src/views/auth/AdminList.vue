<script setup>
import { storeToRefs } from 'pinia';
import { useAuthStore, useUsersStore } from '@/stores';
import { useRouter } from "vue-router";
import AppConfig from '@/layout/AppConfig.vue';

const router = useRouter()
const usersStore = useUsersStore()
const { users } = storeToRefs(usersStore)

const authStore = useAuthStore();
const isLoggedIn = (!!authStore.userinfo.jwtToken)
//console.log("AdminListVue:isLoggedIn: "+isLoggedIn)
if (!isLoggedIn) {
    router.push('/login')
}
if (authStore.userinfo.isAdmin){
    //console.log(decoded.isadmin)
    usersStore.getAll();
} else {
    usersStore.getById(authStore.userinfo.id);
}

function delAlert(id) {
    if (confirm(id+" Delete ???") == true) {
        usersStore.delete(id)
    } else {
        alert(id+" deleting canceled")
    }
}
function routePush(route) {
    router.push(route)
}


</script>

<template>
    <!-- <h1 style="text-align: center; ">Users LIST</h1> -->
    <div >
		<h1 style="text-align:center; color:green">Users LIST [ ISADMIN : {{ authStore.userinfo.isAdmin }} ]</h1>
	</div><br/>
    <div style="padding-left: 10%;">
        <Button v-show="authStore.userinfo.isAdmin" label="Add User" class="w-full p-1 text-m" raised @click="routePush('/account/add')" style=" max-width: 150px;"></Button>
    </div><br/>
    
    <!-- <router-link v-show="authStore.userinfo.isAdmin" to="/account/add" >Add User</router-link></h1> -->
    <table class="table" style="text-align: center; width: 90%; max-width: 1000px; margin-left: 5%;">
        <thead>
            <tr>
                <th style="width: 20%">User ID</th>
                <th style="width: 20%">User Name</th>
                <th style="width: 20%">AdminRole</th>
                <th style="width: 10%"></th>
                <th style="width: 10%"></th>
            </tr>
        </thead>
        <tbody>
            <template v-if="users.length">
                <tr v-for="usera in users" :key="usera.id" style="height: 50px;">
                    <td>{{ usera.id }}</td>
                    <td>{{ usera.username }}</td>
                    <td>{{ usera.isAdmin }}</td>
                    <td>
                        <Button label="EDIT" class="w-full p-1 text-m" raised @click="routePush(`/account/edit/${usera.id}`)" style=" max-width: 100px;"></Button>
                        <!-- <button class="btn-primary">
                            <router-link :to="`/account/edit/${usera.id}`" class="btn-primary">Edit</router-link>
                        </button> -->
                    </td>
                    <td>
                        <Button v-show="authStore.userinfo.isAdmin" label="DELETE" severity="warning" class="w-full p-1 text-m" raised @click="delAlert(usera.id)" style=" max-width: 100px;"></Button>
                    </td>
                </tr>
            </template>
            <tr v-if="users.loading">
                <td colspan="4" class="text-center">
                    <span class="spinner-border spinner-border-lg align-center"></span>
                </td>
            </tr>
            <tr v-if="users.error">
                <td colspan="4">
                    <div class="text-danger">Error loading users: {{users.error}}</div>
                </td>
            </tr>            
        </tbody>
    </table>
    <AppConfig simple />
</template>

<style scoped>
.btn-primary {
    width: 80px;
    font-size: 18px;
    text-decoration: none;
    color: white; /* White text color */
    border-radius: 5px 5px 5px 5px; /* Rounded corners on the top right and bottom right side */
    background-color: #2196F3; /* Blue */
}

.btn-danger {
    width: 80px; /* Set a specific width */
    text-decoration: none; /* Remove underline */
    font-size: 18px; /* Increase font size */
    color: white; /* White text color */
    border-radius: 5px 5px 5px 5px; /* Rounded corners on the top right and bottom right side */
    background-color: #f44336; /* Red */
}

td {
    border-bottom: 1px solid #ddd;
}
</style>