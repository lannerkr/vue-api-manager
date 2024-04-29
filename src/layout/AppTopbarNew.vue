<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useLayout } from '@/layout/composables/layout';
import TabMenuNew from '../components/TabMenu.vue';
import SearchFunc from "../components/SearchFunc.vue";
import { useAuthStore } from '@/stores'

const { layoutConfig, onMenuToggle } = useLayout();
const router = useRouter();

const tabChange = function({item}){
router.push(item.to)
}
const userEdit = function(){
    router.push('/account')
}

const nestedRouteItems = ref([
    {
        label: 'Home',
        to: '/home',
        command: tabChange
    },
    {
        label: 'ActiveUsers',
        to: '/activeUsers',
        command: tabChange
    },
    {
        label: 'STORE',
        to: '/store',
        command: tabChange
    },
    {
        label: 'PARTNER',
        to: '/partner',
        command: tabChange
    },
    {
        label: 'EMPGOTP',
        to: '/EMP-GOTP',
        command: tabChange
    }
])

const overlayMenuItems = ref([
    {
        label: useAuthStore().userinfo.username,
        icon: 'pi pi-fw pi-user'
    },
    {
        label: 'Edit User',
        icon: 'pi pi-fw pi-user-edit',
        command: userEdit
    },
    {
        separator: true
    },
    {
        label: 'Log Out',
        icon: 'pi pi-fw pi-sign-out',
        command: useAuthStore().logout
    }
])
const menu = ref(null);
const toggleMenu = (event) => {
    menu.value.toggle(event);
};
// function alertLogout() {
//     alert("logout")
// }
// function onMenuToggle() {
//     alert("menu toggle")
// }

</script>

<template>
    <div class="layout-topbar">
        <div>
            <router-link to="/" >
            <!-- <img :src="logoUrl" alt="logo" /> -->
            <span>API-Manager</span>
            </router-link>

            <Menu ref="menu" :model="overlayMenuItems" :popup="true" />
            <!-- <Button type="button" label="Options" icon="pi pi-angle-down" @click="toggleMenu" style="width: auto" /> -->
            <button class="p-link layout-menu-button layout-topbar-button" @click="toggleMenu">
                <i class="pi pi-bars"></i>
            </button>
        </div>

        <div style="padding-left: 20px;">
            <TabMenuNew :model="nestedRouteItems" />
        </div>

        <div>
            <SearchFunc textholder="매장 사용자" realm="store"/>
        </div>
    </div>

</template>

<style lang="scss" scoped></style>
