<template>
<h1>{{ this.$route.params.context.data }}</h1>
</template>

<script>
export default {
  name: "Exam5Detail",
  components: {
  },
  data () {
    return {
    }
  },
  props: {

  }
}
</script>

<style scoped>
.problemArea {
  margin: 40px 40px 40px;
}
.b-buttonArea {
  text-align: center;
}
.b-card {
  border: solid 0.5px gray;
  margin: auto;
}
.detail-buttons {
  display: flex;
}
</style>
