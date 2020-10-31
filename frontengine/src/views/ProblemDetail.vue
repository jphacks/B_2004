<template>
  <div class="problemdetail">
      <b-form-textarea
      id="textarea"
      v-model="text"
      placeholder="Enter something..."
      rows="6"
    ></b-form-textarea>
    <b-button @click="getDom(text)">送信</b-button>
  </div>
</template>

<script>
// @ is an alias to /src
import MainProcess from '@/process/MainProcess.js'
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
