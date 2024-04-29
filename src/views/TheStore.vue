<script setup>
//import Tables from '../components/Tables.vue';
import DTable from '../components/Table.vue';

const tableRealm = "store"
</script>

<template>
    <div>
        <DTable :realm="tableRealm" />
    </div>
</template>

<style scoped>

</style>