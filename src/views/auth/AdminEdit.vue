<script setup>
import { storeToRefs } from 'pinia';
import { useUsersStore, useAuthStore } from '@/stores';
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';

const usersStore = useUsersStore();
const route = useRoute();
const router = useRouter()
const uid = route.params.uid;
const adminRole = useAuthStore().userinfo.isAdmin

const username = ref("")
const password = ref("")
const checked = ref(false)


let title = 'Add User';
let adduser = true
const user = ref()
if (uid) {
    // edit mode
    title = 'Edit User';
    adduser = false
    const { users } = storeToRefs(usersStore);
    //console.log(users)
    if (users.value.length >1){
      user.value = users.value[uid]
    } else {
      user.value = users.value[0]
    }
    //usersStore.getById(uid);
    username.value = user.value.username
    //console.log("username:", username.value)
}

const doEdit = async function() {
  let value = {username:username.value, password:password.value, isAdmin:checked.value}
  if (!adduser) {
      await usersStore.update(user.value.id, value)
      router.push('/account')
  } else {
      // console.log("user not exist: ",value)
      await usersStore.register(value)
      router.push('/account')
  }
}

</script>

<template>

  <!-- <div>
    <h1>[ {{ title }} ]  routeID : [ {{ uid }} ]  EditorRole : [ {{ adminRole }}] </h1>
  </div> -->
  <div >
		<h1 style="text-align:center; color:green">[ {{ title }} ]  [ routeID : {{ uid }} ] [ ISADMIN : {{ adminRole }} ]</h1>
	</div><br/>

  <template v-if="!(user?.loading || user?.error)">
    <div id="form">
      <form @submit.prevent="doEdit">
        <label for="username">Username</label>
        <div v-if="adduser">
          <input type="text" id="username" v-model="username" placeholder="elon@musk.io" autocomplete="off" required></div>
        <div v-else>
          <input type="text" id="username" v-model="username" readonly>
        </div>
        
        <label for="password">Password</label>
        <!-- <i class="fas" :class="[passwordFieldIcon]" @click="hidePassword = !hidePassword"></i> -->
        <input type="password" id="password" v-model="password" placeholder="**********" required>

        <div v-if="adminRole" id="checkid">
          <input type="checkbox" id="isAdminCheck" name="isAdminCheck" v-model="checked"><label for="isAdminCheck">isAdmin {{ checked }}</label>
        </div>


        <button type="submit">{{ title }}</button>
        
      </form>
    </div>
    
  </template>

  <template v-if="user?.loading">
        <div class="text-center m-5">
            <span class="spinner-border spinner-border-lg align-center"></span>
        </div>
  </template>
  <template v-if="user?.error">
      <div class="text-center m-5">
          <div class="text-danger">Error loading user: {{user.error}}</div>
      </div>
  </template>

</template>

<style>



div#form {
    background-color: #34495e;
    border-radius: 5px;
    box-shadow: 0px 0px 30px 0px #666;
    color: #ecf0f1;
    margin: 0 auto;
    margin-top: 5%;
    width: 30%;
    padding: 35px;
  }
  
div#form label,
div#form input {
    outline: none;
    width: 100%;
  }
  
div#form label {
    color: #e6edee;
    font-size: 0.8em;
  }
  
div#form input {
    background-color: transparent;
    border: none;
    color: #ecf0f1;
    font-size: 1em;
    margin-bottom: 20px;
  }
  
div#form ::placeholder {
    color: #b0b4b6;
    opacity: 1;
  }
  
div#form button {
    background-color: #ffffff;
    cursor: pointer;
    border: none;
    padding: 10px;
    transition: background-color 0.2s ease-in-out;
    width: 100%;
  }
  
div#form button:hover {
    background-color: #eeeeee;
  }

div#checkid label {
  padding-left: 20px;
  font-size: 18px;
}

div#checkid input {
  width: 15px;
}


</style>
