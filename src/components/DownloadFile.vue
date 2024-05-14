<template>
  <div v-if="props.downloadButtonName">
    <Button severity="info" outlined raised @click="downloadPdf">{{ props.downloadButtonName }}</Button>
  </div>
  <div v-else>
    <Button severity="info" outlined raised @click="downloadPdf">{{ props.downloadFileName }}</Button>
  </div>
</template>

<script setup>
const props = defineProps(['downloadUrl', 'downloadFileName', 'downloadButtonName'])

//console.log(props.downloadButtonName, props.downloadFileName, props.downloadUrl)

const downloadPdf = function() {
      // create element <a> for download PDF
      const link = document.createElement('a');
      link.href = props.downloadUrl;
      link.target = '_blank';
      link.download = props.downloadFileName;

      // Simulate a click on the element <a>
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
}

</script>