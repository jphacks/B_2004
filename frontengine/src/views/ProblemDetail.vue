<template>
  <div class="problemdetail">
      <b-form-textarea
      id="textarea"
      v-model="text"
      placeholder="Enter something..."
      rows="6"
    ></b-form-textarea>
    <b-button>送信</b-button>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  components: {
  },
  data () {
    return {
      text: ''
    }
  }
}
</script>
