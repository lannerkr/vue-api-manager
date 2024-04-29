<script setup>
import { ref } from 'vue';
import LogTable from '../components/LogTable.vue';
import { useRouter } from "vue-router";
import { fetchWrapper } from '@/helpers';
import { useDataStore } from '@/stores'
import { useConfirm } from "primevue/useconfirm";
const confirmN = useConfirm();

const router = useRouter();
const { updateSingleTable } = useDataStore()
//const apiServerUrl = `${import.meta.env.VITE_API_URL}/`
const apiServerUrl = config.VUE_CONFIG_APP_API

const props = defineProps(
    ['realm', 'username']
)
const username = props.username
const realms = props.realm
updateSingleTable(realms, username)

const items = ref([
    {
        index: 0,
        label: 'MAC 승인',
        command: () => {
          confirmMassage(11)
        }
    },
    {
        index: 1,
        label: 'MAC 미승인',
        command: () => {
          confirmMassage(12)
        }
    },
    {
        index: 2,
        label: 'USB 허용',
        command: () => {
          confirmMassage(13)
        }
    },
    {
        index: 3,
        label: 'USB 차단',
        command: () => {
          confirmMassage(14)
        }
    },
])

//const selectedItems = ref(items.value)
const selectedItemsAS = ref([items.value[1],items.value[2]])
const selectedItemsUS = ref([items.value[0]])
const selectedItemsPS = ref([items.value[3]])

const selectedItemsAE = ref([items.value[1]])
const selectedItemsUE = ref([items.value[0]])

const putStatus = function(url) {
  return fetchWrapper.get(url)
  .then((result)=>{
    return result
  })
  .catch(error=>{
    return error
  })
}

const message = ["", "활성화", "비활성화", "비밀번호 초기화", "비밀번호 잠김해제 및 초기화", "OTP 잠김 해제", "OTP 초기화", "연결 종료"]
message[11] = "MAC 승인처리"
message[12] = "MAC 미승인처리"
message[13] = "USB 허용처리"
message[14] = "USB 차단처리"

const confirmMassage = function(num) {
  let confirm_ask = "사용자 " + message[num] + " 하시겠습니까?"
  let confirm_cancle = "사용자 " + message[num] + " 취소하였습니다."

  // if (confirm(confirm_ask) == true) {
  //   confirmClick(num)
  // } else {
  //   alert(confirm_cancle)
  // }
  confirmN.require({
        message: confirm_ask,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'p-button-secondary p-button-outlined',
        rejectLabel: 'Cancel',
        acceptLabel: 'OK',
        accept: () => {
            //toast.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
            confirmClick(num)
        },
        reject: () => {
            //toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
            //alert(confirm_cancle)
            addMessages(0, confirm_cancle)
        }
    })
}

const confirmClick = function(num) {

  let url = apiServerUrl+"users/" + props.realm + "/" + props.username

  switch(num) {
    case 1:
      url = url + "/true"
      break
    case 2:
      url = url + "/false"
      break
    case 3:
      url = url + "/pwreset"
      break
    case 4:
      url = url + "/pwunlock"
      break
    case 5:
      url = url + "/otpunlock"
      break
    case 6:
      url = url + "/otpreset"
      break
    case 7:
      url = url + "/disconnect/"+ useDataStore().singleUser.records.sid
      break
    case 11:
      url = apiServerUrl+"user/approve/" + useDataStore().singleUser.records.realm + "/" + useDataStore().singleUser.records.username
      break
    case 12:
      url = apiServerUrl+"user/unapprove/" + useDataStore().singleUser.records.realm + "/" + useDataStore().singleUser.records.username
      break
    case 13:
      url = apiServerUrl+"user/permit/"+ useDataStore().singleUser.records.realm +"/"+ useDataStore().singleUser.records.username
      break
    case 14:
      url = apiServerUrl+"user/protect/" + useDataStore().singleUser.records.realm + "/" + useDataStore().singleUser.records.username
  }

  putStatus(url)
  .then((result)=>{
    if (result == 200) {
        addMessages("suc", "사용자를 "+message[num]+" 완료 하였습니다.")
        //alert("사용자를 "+message[num]+" 완료 하였습니다.")
        updateSingleTable(props.realm, props.username)
      } else {
        addMessages("warn", "사용자를 "+message[num]+" 실패 하였습니다."+"\n["+result+"]")
        //alert("사용자를 "+message[num]+" 실패 하였습니다."+"\n["+result+"]")
        
      }
  })

}

const messages = ref([]);
let count = ref(0);
const addMessages = (sev, msg) => {
  switch(sev) {
    case "suc":
      messages.value = [{ severity: 'success', content: msg, id: count.value++ }]
      break
    case "warn":
      messages.value = [{ severity: 'warn', content: msg, id: count.value++ }]
      break
    default:
      messages.value = [{ severity: 'info', content: msg, id: count.value++ }]
  }
};

</script>

<template>
  <ConfirmDialog></ConfirmDialog>
  <div>
    <h3 style="text-align:center; color:green">
      {{ props.realm.toUpperCase() }}'s USER [ {{ props.username }} ] Table
    </h3>
  </div><br/>
  
  <transition-group name="p-message" tag="div">
            <Message v-for="msg of messages" :key="msg.id" :severity="msg.severity">{{ msg.content }}</Message>
            <!-- <Message v-if="messagesN" :key="messagesN.id" :severity="messagesN.severity">{{ messagesN.content }}</Message> -->
  </transition-group>

  <Divider layout="horizontal" />
  <Divider layout="horizontal" />
  <div>
  <section>
    <table>
        <thead>
          <th>사용자 ID</th> 
          <th>설정된 고정 IP</th> 
          <th>사용자 상태</th> 
          <th>비밀번호 초기화 상태</th> 
          <th>마지막 로그인 날짜</th>
        </thead>
        <tbody v-if="useDataStore().singleUser.pcsdata && useDataStore().singleUser.dbtable">
            <tr>
                <td>
                  <Button class="p-1 text-m" severity="info" text @click="updateSingleTable(props.realm, props.username)">{{ useDataStore().singleUser.pcsdata.username }}</Button>
                </td>
                <td>{{ useDataStore().singleUser.dbtable.Static_IP }}</td>
                <td>
                  <div v-if="useDataStore().singleUser.pcsdata.enabled != 'true'">
                    <Button label="Disabled" class="p-1 text-m" severity="danger" raised @click="confirmMassage(1)"></Button>
                  </div>
                  <div v-else>
                    <Button label="Enabled" class="p-1 text-m" raised @click="confirmMassage(2)"></Button>
                  </div>
                </td>
                <td>
                    <div v-if="useDataStore().singleUser.pcsdata.pcas == 'true'">
                      <Button label="Default Password" class="p-1 text-m" :disabled="true"></Button>
                    </div>
                    <div v-else>
                      <Button label="Changed" class="p-1 text-m" raised @click="confirmMassage(3)"></Button>
                    </div>
                </td>
                <td>{{ useDataStore().singleUser.dbtable.days }} 일전</td>
              </tr>
        </tbody>
    </table>

    <Divider layout="horizontal" />
    <div v-if="useDataStore().singleUser.records.username == ''">
      <table>
        <thead>
          <th style="width: 33.3%;">비밀번호 잠김 해제</th> <th style="width: 33.3%;">OTP 잠김 해제</th> <th style="width: 33.3%;">OTP 초기화</th>
        </thead>
        <tbody>
            <tr>
              <td>
                <Button label="PWD Unlock" class="p-1 text-m" severity="help" raised @click="confirmMassage(4)"></Button>
              </td>
              <td>
                <Button label="OTP Unlock" class="p-1 text-m" severity="help" raised @click="confirmMassage(5)"></Button>
              </td>
              <td>
                <Button label="OTP Reset" class="p-1 text-m" severity="help" raised @click="confirmMassage(6)"></Button>
              </td>
            </tr>
        </tbody>
      </table>
    </div>

    <Divider layout="horizontal" />
    <div v-if="useDataStore().singleUser.records.username != ''">
      <table>
        <thead>
          <th>realm</th> <th>roles</th> <th>connect-ip</th> <th>client-version</th> <th>Sign-in-time</th>
        </thead>
        <tbody>
            <tr>
              <td>
                {{ useDataStore().singleUser.records.realm }}
              </td>
              <td>
                <!-- <div v-if="useDataStore().singleUser.records.role.includes('unapproved') || useDataStore().singleUser.records.role.includes('permit')">
                  <div v-if="(useDataStore().singleUser.records.realm == 'EMP-GOTP')">
                    <SplitButton :label="useDataStore().singleUser.records.role" :model="selectedItemsUE" severity="warning" />
                  </div>
                  <div v-else>
                    <SplitButton :label="useDataStore().singleUser.records.role" :model="selectedItemsUS" severity="warning" />
                  </div>
                </div>
                <div v-else>
                  <div v-if="(useDataStore().singleUser.records.realm == 'EMP-GOTP')">
                    <SplitButton :label="useDataStore().singleUser.records.role" :model="selectedItemsAE" />
                  </div>
                  <div v-else>
                    <SplitButton :label="useDataStore().singleUser.records.role" :model="selectedItemsAS" />
                  </div>
                </div> -->

                <div v-if="(useDataStore().singleUser.records.realm == 'EMP-GOTP')">
                  <div v-if="useDataStore().singleUser.records.role.includes('unapproved')">
                      <SplitButton :label="useDataStore().singleUser.records.role" :model="selectedItemsUE" severity="warning" />
                  </div>
                  <div v-else>
                    <SplitButton :label="useDataStore().singleUser.records.role" :model="selectedItemsAE" />
                  </div>
                </div>

                <div v-else>
                  <div v-if="useDataStore().singleUser.records.role.includes('unapproved')">
                    <SplitButton :label="useDataStore().singleUser.records.role" :model="selectedItemsUS" severity="warning" />
                  </div>
                  <div v-else-if="useDataStore().singleUser.records.role.includes('permit')">
                    <SplitButton :label="useDataStore().singleUser.records.role" :model="selectedItemsPS" severity="warning" />
                  </div>
                  <div v-else>
                    <SplitButton :label="useDataStore().singleUser.records.role" :model="selectedItemsAS" />
                  </div>
                </div>





              </td>
              <td>{{ useDataStore().singleUser.records.connip }}</td>
              <td>{{ useDataStore().singleUser.records.version }}</td>
              <td>
                {{ useDataStore().singleUser.records.logintime }}
              </td>
              <td style="width: 80px;">
                <Button label="연결해제" class="p-1 text-m" severity="warning" raised @click="confirmMassage(7)"></Button>
              </td>
            </tr>
        </tbody>
      </table>
      
    </div>

    <Divider layout="horizontal" />
    <div v-if="useDataStore().singleUser.getlog">
      <LogTable />
    </div>

  </section>
  </div>

</template>

<script>

</script>

<style scoped>
table {
  width: 90%;
  margin-left: 5%;
  text-align: center;
}
table td {
  height: 50px;
  vertical-align: middle;
}
</style>
