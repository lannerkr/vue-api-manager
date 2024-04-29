<script setup>
import { ref } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { useRouter } from "vue-router";
import { useDataStore } from '@/stores'

const { updateTable, updateTableNew } = useDataStore()

const router = useRouter();
const props = defineProps(['realm'])
const realms = props.realm
const overDate = ref(60)
if (realms == "EMP-GOTP") {
    overDate.value = 90
}


updateTableNew(realms, false)
const realmName = props.realm.toUpperCase()

const filters1 = ref({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

const rowsItems = [10, 25, 50, 100]

const dbupdate = () => {
    updateTableNew(realms, true)
}

const onRowSelect = (event) => {
    let url = "/users/"+realms+"/"+event.data.username
    router.push(url)
}

function checkExpired(exp) {
    if (Date.parse(exp) < Date.now()) {
        return true
    }
    return false
}
function checkLastloginOver(last) {
    let timeDiff = Date.now() - Date.parse(last)
    let dateDiff = Math.ceil((timeDiff) / (1000 * 3600 * 24))
    
    if (dateDiff > overDate.value) {
        return true
    }
    return false
}
</script>

<template>
    <div style="text-align: center; padding-bottom: 10px;"><a style="height: 50px; vertical-align: middle; color:green; font-size: x-large;">{{ realmName }} Users Table</a></div>
    <div class="card">
        <DataTable
            :value="useDataStore().dbUserData"
            :paginator="true"
            :rows="10"
            dataKey="id"
            :rowHover="true"
            v-model:filters="filters1"
            filterDisplay="menu"
            :filters="filters1"
            :globalFilterFields="['username', 'enabled', 'dbtable.Static_IP', 'dbtable.framedip', 'dbtable.laststring', 'dbtable.expirestring']"
            showGridlines
            :sortSingle="true"
            sortField="dbtable.laststring" 
            :sortOrder="-1"
            :rowsPerPageOptions="rowsItems"
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink JumpToPageInput"
            stripedRows
            @rowSelect="onRowSelect"
            selectionMode="single"
            
        >
            <template #header>
                <div class="flex justify-content-between flex-column sm:flex-row">
                    <Button type="button" icon="pi pi-refresh" label="사용자DB업데이트" raised outlined @click="dbupdate()" />
                    <IconField iconPosition="left">
                        <InputIcon class="pi pi-search" />
                        <InputText v-model="filters1['global'].value" placeholder="Keyword Search" style="width: 100%" />
                    </IconField>
                </div>
            </template>
            <template #empty> No Users found. </template>
            <template #loading> Loading Users data. Please wait. 
                <img
                    src="../assets/loading.gif"
                    style="width: 100px; height: 80px;"
                />
            </template>

            <Column field="username" header="사용자 ID" style="min-width: 10rem" :sortable="true">
                {{ data.username }}
            </Column>
            <Column field="fullname" header="비 고" style="min-width: 10rem" :sortable="true">
                {{ data.fullname }}
            </Column>
            <Column field="enabled" header="사용자 상태" style="min-width: 10rem;" :sortable="true">
                <template #body="slotProps">
                    <div v-if="(slotProps.data.enabled == 'false')" style="color:red;">{{ slotProps.data.enabled }}</div>
                    <div v-else>{{ slotProps.data.enabled }}</div>
                </template>
            </Column>
            <Column field="dbtable.Static_IP" header="할당 IP" style="min-width: 10rem" :sortable="true">
                {{ data.dbtable.Static_IP }}
            </Column>
            <Column field="dbtable.framedip" header="사용 IP" style="min-width: 10rem" :sortable="true">
                {{ data.dbtable.framedip }}
            </Column>
            <Column field="dbtable.laststring" header="마지막 로그인" style="min-width: 10rem" :sortable="true">
                <template #body="slotProps">
                    <div v-if="checkLastloginOver(slotProps.data.dbtable.laststring)" style="color:red;">{{ slotProps.data.dbtable.laststring }}</div>
                    <div v-else>{{ slotProps.data.dbtable.laststring }}</div>
                </template>
            </Column>
            <Column field="dbtable.expirestring" header="계정 만료일" style="min-width: 10rem" :sortable="true">
                <template #body="slotProps">
                    <div v-if="checkExpired(slotProps.data.dbtable.expirestring)" style="color:red;">{{ slotProps.data.dbtable.expirestring }}</div>
                    <div v-else>{{ slotProps.data.dbtable.expirestring }}</div>
                </template>
            </Column>
        </DataTable>
    </div>

</template>

<style scoped lang="scss">

</style>
