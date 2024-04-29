<script setup>
import DTable from '../components/Table.vue';

const tableRealm = "EMP-GOTP"
</script>

<template>
    <div>
        <DTable :realm="tableRealm" />
    </div>
</template>

<style scoped>

</style>