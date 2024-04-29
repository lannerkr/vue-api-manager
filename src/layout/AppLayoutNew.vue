<script setup>
import AppTopbar from './AppTopbarNew.vue';
import AppFooter from './AppFooter.vue';

</script>

<template>
    <!-- <div class="layout-wrapper" :class="containerClass"> -->
    <div class="layout-wrapper">
        <app-topbar></app-topbar>

        <div class="layout-main-container">
            <div class="layout-main">
                <router-view></router-view>
            </div>
            <app-footer></app-footer>
        </div>

        <div class="layout-mask"></div>
    </div>

</template>

<style lang="scss" scoped></style>
