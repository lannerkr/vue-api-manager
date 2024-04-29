<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useDataStore } from '@/stores'

const props = defineProps(
    ['textholder', 'realm']
)
const realms = ref("store")
if (props.realm != undefined) {
    realms.value = props.realm
}
const searchtext = ref("search ...")
if (props.textholder != undefined) {
    searchtext.value = props.textholder
}


let input = ref("");
const router = useRouter();

const goSearch = function () {
    useDataStore().updateSingleTable(realms.value, input.value)
    let url = "/users/"+realms.value+"/"+input.value
    router.push(url)
}

</script>

<template>
    <div class="grid formgrid">
        <div class="col-12 mb-2 lg:col-6 lg:mb-0">
            <IconField iconPosition="left">
                <InputText type="text" v-model="input" :placeholder="searchtext" @keydown.enter="goSearch" style="width:300px;"/>
                <InputIcon class="pi pi-search" />
            </IconField>
        </div>
    </div>
</template>