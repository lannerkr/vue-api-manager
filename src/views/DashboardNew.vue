<script setup>
import { useAuthStore } from '@/stores';
import { ref } from 'vue';
import SearchFunc from "../components/SearchFunc.vue";
import { fetchWrapper } from '@/helpers';
import { useRouter, routerKey } from 'vue-router';
//const apiServerUrl = `${import.meta.env.VITE_API_URL}/`;
const apiServerUrl = config.VUE_CONFIG_APP_API
//const apiServerUrl = `https://192.168.0.157:8099/`;

const router = useRouter()
const authStore = useAuthStore()
const { jwtToken, isAdmin } = authStore.userinfo
//console.log("Hello token: "+`Bearer ${jwtToken}`+" , isAdmin:"+isAdmin)

const sysStatus = ref({})
const cluster = ref([{}])

fetchWrapper.get(apiServerUrl+"system/status")
.then((result)=>{
    sysStatus.value = result
	cluster.value = result.ClusterMem
})

function userCreate() {
	router.push("/users/create")
}

</script>

<template>
<div>
	<div >
		<h1 style="text-align:center; color:green">SSLVPN DashBoard, ISADMIN : [ {{ isAdmin }} ]</h1>
	</div>
    <br/>

	<div class="container">
		<table style="margin-left: 10%; margin-right: 10%; width: 80%">
			<td style="width: 33%;"><SearchFunc textholder="매장 사용자" realm="store"/></td>
			<td style="width: 33%;"><SearchFunc textholder="임직원 사용자" realm="EMP-GOTP"/></td>
			<td style="width: 33%; vertical-align: middle; text-align: center;"><Button label="Create User" class="w-full p-1 text-m" raised @click="userCreate" style=" max-width: 150px;"></Button></td>
		</table><br/>

		<h2 style="text-align: center; padding-top:50px;">System Status</h2>
		<table class="dashtable">
			<tbody>
				<tr>
					<th>System Date</th>
					<td><div>{{ sysStatus.sysdate }}</div></td>
					<th>System UPtime</th>
					<td><div>{{ sysStatus.uptime }}</div></td>
					<th>Config update time</th>
					<td><div>{{ sysStatus.configdate }}</div></td>
				</tr>
				<tr>
					<th>Total Licensed Users</th>
					<td><div>{{ sysStatus.licensed }}</div>
						
					</td>
					<th>Current Users</th>
					<td><div>{{ sysStatus.current }}</div>
						
					</td>
					<th>Last 24hrs Max Users</th>
					<td><div>{{ sysStatus.maxlast }}</div>
						
					</td>
				</tr>
				<tr>
					<th>CPU-UTILIZATION</th>
					<td><div>{{ sysStatus.cpu }}</div>
						
					</td>
					<th>SWAP-UTILIZATION</th>
					<td><div>{{ sysStatus.swap }}</div>
						
					</td>
					<th>DISK-UTILIZATION</th>
					<td><div>{{ sysStatus.disk }}</div>
						
					</td>
				</tr>
			</tbody>
		</table><br/>

		<h2 style="text-align: center; padding-top:50px;">Clutster Status</h2>
		<table class="dashtable">
			<tbody>
				<tr>
					<td style="width:150px"><th>Cluster Mamber 1</th></td>
					<td><th>Member Name</th></td>
					<td>{{ cluster[0].name }}
					</td>
					<td><th>Member Role</th></td>
					<td>{{ cluster[0].notes }}
					</td>
					<td><th>Member Status</th></td>
					<td>{{ cluster[0].statuscode }}
					</td>
				</tr>
				<tr v-if="cluster[1]">
					<td><th>Cluster Mamber 2</th></td>
					<td><th>Member Name</th></td>
					<td>
						{{ cluster[1].name }}
					</td>
					<td><th>Member Role</th></td>
					<td> 
						{{ cluster[1].notes }}
					</td>
					<td><th>Member Status</th></td>
					<td>
						{{ cluster[1].statuscode }}
					</td>
				</tr>
			</tbody>
		</table>

  	</div>


</div>


</template>

<style scoped>

.dashtable {
	margin-left: 5%; 
	margin-right: 5%; 
	width: 90%;
}
.dashtable td {
	height: 40px;
	font-size: 14px;
	border-bottom: 1px solid #ddd;
}
.dashtable td div {
	text-align: center;
	color:rgb(1, 85, 85);
}
</style>
