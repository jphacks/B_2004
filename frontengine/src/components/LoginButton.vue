<template>
  <div>
    <b-button class="b-botton" @click="modalShow = !modalShow">{{loginText}}</b-button>

    <b-modal v-model="modalShow"><LoginForm/></b-modal>
  </div>
</template>

<script>
import LoginForm from '@/components/LoginForm.vue'

export default {
  name: 'LoginButton',
  components: {
    LoginForm
  },
  props: {
    loginType: {
      type: String,
      default: 'login'
    }
  },
  computed: {
    loginText () {
      if (this.loginType === 'login') {
        return 'ログイン/登録'
      } else {
        return '未登録'
      }
    }
  },
  data () {
    return {
      modalShow: false
    }
  }
}
</script>

<style scoped>
.b-botton {
  float: right;
}

</style>
