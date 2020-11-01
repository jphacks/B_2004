<template>
  <body class="problemArea">
  <div class="problemdetail">
      <b-form-textarea
      id="textarea"
      v-model="text"
      placeholder="Enter something..."
      rows="6"
    ></b-form-textarea>
    <b-button @click="getDom(text)">送信</b-button>
  </div>
  </body>
</template>

<script>
// @ is an alias to /src
import MainProcess from '@/process/MainProcess.js'
import CreateAST from '@/process/CreateAST.js'
export default {
  name: 'Home',
  components: {
  },
  data () {
    return {
      text: ''
    }
  },
  methods: {
    getDom: function (text) {
      MainProcess(text)
    }
  }
}
</script>

<style scoped>
.problemArea {
  margin: 40px 40px 40px;
}
</style>
