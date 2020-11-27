<template>
</template>

<script>
// @ is an alias to /src
import { MainProcess } from "@/process/MainProcess.js"
import { mapGetters, mapActions } from "vuex"
import Exam1 from "@/components/Exam1.vue"
import firebase from "firebase"
import PreviewField from "@/components/preview/PreviewField"
// import Exam1 from '@/components/Exam1.vue'
// import Exam2 from '@/components/Exam2.vue'
export default {
  name: "ProblemDetail",
  components: {
    PreviewField
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