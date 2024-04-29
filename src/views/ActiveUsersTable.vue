<script setup>
import { ref } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { useRouter } from "vue-router";
import { useDataStore } from '@/stores'


const router = useRouter();
const { updateActive } = useDataStore()
const number = ref("200")
updateActive(number.value)


const filters1 = ref({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });
const rowsItems = [10, 25, 50, 100]

const reloadUsers = function() {
    updateActive(number.value)
}

const onRowSelect = (event) => {
    if (event.data['authentication-realm'] != "Admin") {
      let url = "/users/"+event.data['authentication-realm']+"/"+event.data['active-user-name']
      router.push(url)
    }
}

</script>

<template>

<div style="margin-left: 100px;">
<table class="headtable">
    <td style="width: 250px; height: 50px; vertical-align: middle; color:green; font-size: x-large;">ActiveUsers Table : </td>
    <td style="width: 130px; height: 50px; vertical-align: middle;"><input v-model="number" style="margin-right: 10px; width: 50px;"/> users </td>
    <td style="width: 100px; height: 50px; vertical-align: middle;">
        <Button label="reload" class="w-full p-1 text-m" raised @click="reloadUsers()"></Button>
    </td>
</table>

</div>
<br/>

<div class="card">
  <DataTable
      :value="useDataStore().aUserData"
      :paginator="true"
      :rows="25"
      dataKey="id"
      :rowHover="true"
      v-model:filters="filters1"
      filterDisplay="menu"
      :filters="filters1"
      :globalFilterFields="['active-user-name', 'authentication-realm', 'user-roles', 'pulse-client-version', 'network-connect-ip', 'user-sign-in-time']"
      showGridlines
      :sortSingle="true"
      sortField="user-sign-in-time" 
      :sortOrder="-1"
      :rowsPerPageOptions="rowsItems"
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink JumpToPageInput"
      stripedRows
      @rowSelect="onRowSelect"
      selectionMode="single"
  >
    
      <template #header>
          <div class="flex justify-content-between flex-column sm:flex-row">
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

      <Column field="active-user-name" header="사용자 ID" style="min-width: 10rem" :sortable="true" />
      <Column field="authentication-realm" header="REALM" style="min-width: 10rem" :sortable="true" />
      <Column field="user-roles" header="ROLE" style="min-width: 10rem" :sortable="true" />
      <Column field="pulse-client-version" header="Agent Version" style="min-width: 10rem" :sortable="true" />
      <Column field="network-connect-ip" header="사용 IP" style="min-width: 10rem" :sortable="true" />
      <Column field="user-sign-in-time" header="로그인 시간" style="min-width: 10rem" :sortable="true" />
      
  </DataTable>
</div>










</template>

<style scoped>

</style>