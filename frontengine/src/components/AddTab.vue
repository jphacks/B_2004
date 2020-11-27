<template>
  <div>
    <b-form>
      <b-form-group
        id="input-group-1"
        label="FileName:"
        label-for="input-1"
        description="追加したいファイル名を入力してください。"
      >
        <b-form-input
          id="input-1"
          v-model="form.fileName"
          required
          :state="form.fileName.length > 0"
          placeholder="Enter filename"
        ></b-form-input>
      </b-form-group>
    </b-form>
    <b-button type="sendPageName" variant="primary" @click="sendPageName" v-if="show">このファイル名を追加</b-button>

  </div>
</template>

<script>
export default {
  name: "AddTab",
  data () {
    return {
      form: {
        fileName: ''
      },
      show: true
    }
  },
  methods: {
    sendPageName: function () {
      if (this.form.fileName.length > 0) {
        this.$emit('fileName', this.form.fileName)
        console.log(this.form.fileName)
      }
    }
  }
}
</script>
