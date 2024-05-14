<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores'
import axios from 'axios'
import DownloadFile from '../../components/DownloadFile.vue';
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";

const confirm = useConfirm();
const toast = useToast();
const apiServerUrl = config.VUE_CONFIG_APP_API
const authStore = useAuthStore()
const baseurl = "/download/"
const download = ref([])
const checked = ref([])

async function updateFileInfo() {
    await axios.get(apiServerUrl+"login/files", {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authStore.userinfo.jwtToken}`
        }
    })
    .then((response) => {
        if (response.data) {
            download.value = response.data
        }
        
    }) 
    .catch((error) => {
        alert(error)
    })
}

const onUpload = async (event) => {
    await updateFileDb(event.files[0].name)
    updateFileInfo()
    toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 })
}
async function updateFileDb(newfile) {
    let value = [{fileName:newfile, description:newfile}]
    await axios.post(apiServerUrl+"login/files", value, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authStore.userinfo.jwtToken}`
                }
    })
    .catch((error) => {
        toast.add({ severity: 'error', summary: 'Rejected', detail: error, life: 3000 })
    })
}

const confirm1 = (event, files) => {
    confirm.require({
        target: event.currentTarget,
        message: 'Are you sure you want to proceed?',
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
        acceptClass: 'p-button-sm',
        rejectLabel: 'Cancel',
        acceptLabel: 'Save',
        accept: async () => {
            await uploadFileInfo(files)
            
        },
        reject: () => {
            toast.add({ severity: 'error', summary: 'Rejected', detail: 'Save '+files+' is canceled', life: 3000 })
        }
    })
}
async function uploadFileInfo(files) {
    let value = []
    for ( let element of download.value){
        if (checked.value.includes(element.fileName)) {
            value.push(element)
        }
    }

    await axios.post(apiServerUrl+"login/files", value, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authStore.userinfo.jwtToken}`
        }
    })
    .then(function(response) {
        if (response.status == 200) {
            toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Save '+files+' is succeded', life: 3000 })
        } else {
            toast.add({ severity: 'error', summary: 'Rejected', detail: 'Save '+files+' is failed', life: 3000 })
        }
    }) 
    .catch((error) => {
        toast.add({ severity: 'error', summary: 'Rejected', detail: error, life: 3000 })
    })

    checked.value = []
}

function deleteFile(event, filename) {
    confirm.require({
        target: event.currentTarget,
        message: 'Are you sure you want to proceed?',
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
        acceptClass: 'p-button-sm',
        rejectLabel: 'Cancel',
        acceptLabel: 'Delete',
        accept: async () => {
            await deleteFileDB(filename)
            toast.add({ severity: 'info', summary: 'Confirmed', detail: 'delete '+filename+' is succeded', life: 3000 })
            updateFileInfo()
        },
        reject: () => {
            toast.add({ severity: 'error', summary: 'Rejected', detail: 'delete '+filename+' is canceled', life: 3000 })
        }
    })
}
async function deleteFileDB(filename) {
    //let value = [{fileName:filename}]
    await axios.delete(apiServerUrl+"login/files/del/"+filename, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authStore.userinfo.jwtToken}`
                }
    })
    .catch((error) => {
        toast.add({ severity: 'error', summary: 'Rejected', detail: error, life: 3000 })
    })
}

updateFileInfo()

</script>

<template>
    <Toast />
    <ConfirmPopup></ConfirmPopup>

    <div >
        <div class="flex flex-column align-items-center justify-content-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%); width: 80%; min-width: 500px;">
                <div class="w-full surface-card py-8" style="border-radius: 53px">
                    <div class="text-center mb-5 align-items-center" style="width: 100%;">
                        <table style="margin-left:auto;margin-right:auto;">
                        <thead><tr>
                            <th>File Manager</th>
                            <td>
                                <Button @click="updateFileInfo" text rounded icon="pi pi-refresh" style="font-size: 1rem" />
                            </td>
                        </tr></thead></table>
                    </div>

                    <table class="table" style="margin-left:auto;margin-right:auto; width:90%;">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th style="width: 10%;"></th>
                                <th>DownloadFile</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-if="download.length">
                                <tr v-for="down in download" :key="down.key" style="height: 50px;">
                                    <td>
                                        <div class="flex flex-column gap-3">
                                        <div class="flex align-items-center">
                                                <div>
                                                    <Button @click="deleteFile($event, down.fileName)" text rounded icon="pi pi-times" severity="danger" style="font-size: 1rem" />
                                                </div>
                                                <Checkbox v-model="checked" :inputId="down.key" name="down" :value="down.fileName" />
                                                <label :for="down.key" style="margin-left: 30px;">
                                                    <div v-if="checked.includes(down.fileName)">
                                                        <div v-if="down.description"><input v-model="down.description" :placeholder="down.description" size="30" /></div>
                                                        <div v-else><input v-model="down.description" :placeholder="down.fileName" size="30" /></div>
                                                    </div>
                                                    <div v-else>
                                                        <div v-if="down.description">{{ down.description }}</div>
                                                        <div v-else>{{ down.fileName }}</div>
                                                    </div>
                                                </label>
                                        </div>
                                        </div>
                                    </td>
                                    <td>
                                    </td>
                                    <td>
                                        <DownloadFile :download-url="baseurl+down.fileName" :download-file-name="down.fileName" :download-button-name="down.fileName" />
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="card" style="width: 80%; min-width: 500px;">
                <td style="min-width: 400px;">
                    <div >
                        <FileUpload name="file" url="/upload" @upload="onUpload($event)" :multiple="false" :previewWidth="400">
                        </FileUpload>
                    </div>
                </td>
                
                <td style="padding-left: 50px;">
                    <div v-if="Array.isArray(checked) && checked.length">
                        <Button @click="confirm1($event, checked)" label="Save" outlined></Button>
                    </div>
                    <div v-else>
                        <div>
                            <Button @click="confirm1($event, checked)" label="Save" outlined disabled ></Button>
                        </div>
                        
                    </div>
                </td>
            </div>

        </div>
    </div>


</template>

<style scoped>

</style>
