<script setup>
import { useDataStore } from '@/stores'

const Coloring = function(loglines){

  var logline = String(loglines)
  if ( logline.search("Account Still LockedOut") >= 0 ){
    var slog = logline.split("Account Still LockedOut")
    logline = slog[0] + "<strong style=\"color: red;\">Account Still LockedOut</strong>" +slog[1]
  } else if ( logline.search("failed") >= 0 ){
    var slog = logline.split("failed")
    logline = slog[0] + "<strong style=\"color: orange;\">failed</strong>" +slog[1]
  } else if ( logline.search("unlocked") >= 0 ){
    var slog = logline.split("unlocked")
    logline = slog[0] + "<strong style=\"color: blue;\">unlocked</strong>" +slog[1]
  } else if ( logline.search("Modified") >= 0 ){
    var slog = logline.split("Modified")
    logline = slog[0] + "<strong style=\"color: blue;\">Modified</strong>" +slog[1]
  } else if ( logline.search("modified") >= 0 ){
    var slog = logline.split("modified")
    logline = slog[0] + "<strong style=\"color: blue;\">modified</strong>" +slog[1]
  } else if ( logline.search("Created") >= 0 ){
    var slog = logline.split("Created")
    logline = slog[0] + "<strong style=\"color: blue;\">Created</strong>" +slog[1]
  } else if ( logline.search("Forcing off ") >= 0 ){
    var slog = logline.split("Forcing off ")
    logline = slog[0] + "<strong style=\"color: blue;\">Forcing off </strong>" +slog[1]
  } else if ( logline.search("updated") >= 0 ){
    var slog = logline.split("updated")
    logline = slog[0] + "<strong style=\"color: blue;\">updated</strong>" +slog[1]
  } else if ( logline.search("address cannot be allocated") >= 0 ){
    var slog = logline.split("address cannot be allocated")
    logline = slog[0] + "<strong style=\"color: orange;\">address cannot be allocated</strong>" +slog[1]
  } else if ( logline.search("ocked") >= 0 ){
    var slog = logline.split("- ")
    logline = slog[0] + "- " + slog[1] + "- <strong style=\"color: red;\">" + slog[2] + "</strong> -" + slog[3]
  }

  return logline
}


</script>

<template>
  <Accordion>
      <AccordionTab header="TOGGLE SHOW LATEST LOGS">
          <p class="line-height-3 m-0">
            <table style="border: 2px solid black; width: 100%;">
              <thead>
                <th>DATE</th>
                <th>CODE</th>
                <th>LOG</th>
              </thead>
              <tbody>
                <tr v-for="log in useDataStore().singleUser.getlog">
                  <td>{{ log.date }}</td>
                  <td>{{ log.code }}</td>
                  <td v-html="Coloring(log.log)"></td>
                </tr>
              </tbody>
            </table>
          </p>
      </AccordionTab>
  </Accordion>

</template>

<style scoped>

th, td {
  border: 0.8px solid black;
}
th {
  text-align: center;
  background-color: #456c8b;
  color: white;
  height: 50px;
}
td {
  font-size: small;
  padding-left: 10px;
}
</style>