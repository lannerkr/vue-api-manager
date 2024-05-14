<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores';
import { useRouter } from "vue-router";
import DownloadFile from '../../components/DownloadFile.vue';

const router = useRouter()
const authStore = useAuthStore();
authStore.logout()

const username = ref('');
const password = ref('');
const checked = ref(false);

const doLogin = async function() {
    //const authStore = useAuthStore();
    //console.log(username.value, password.value)
    await authStore.login(username.value,password.value);
    router.push('/');
  }

const downloadUrl = '/download/ca.ilmovdi.com.crt'
const downloadFileName = 'ca.ilmovdi.com.crt'
const downloadButtonName = 'CA 인증서'

</script>

<template>


    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <span class="text-600 font-medium">Sign in to continue ...</span>
                        
                    </div>
                    <div class="text-right">
                        <DownloadFile :download-url="downloadUrl" :download-file-name="downloadFileName" :download-button-name="downloadButtonName" />
                    </div>

                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">UserID</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="username" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>

                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <div class="flex align-items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Remember me</label>
                            </div>
                            
                        </div>
                        <Button label="Sign In" class="w-full p-3 text-xl" @click="doLogin"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
