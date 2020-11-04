<template>
  <div>
    <span class="b-botton" v-on:click="modalShow = !modalShow">{{loginText}}</span>

    <b-modal v-model="modalShow" :title="loginTitle" id="bv-modal-example" hide-footer><LoginForm :loginType="loginType" @loginType="loginChange"/></b-modal>
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
  },
  computed: {
    loginText () {
      if (this.loginType === 'login') {
        return 'ログイン/登録'
      } else {
        return '未登録'
      }
    },
    loginTitle () {
      if (this.loginType === 'login') {
        return 'ログイン'
      } else {
        return '登録'
      }
    }
  },
  methods: {
    loginChange: function (loginType) {
      this.loginType = loginType
    }
  },
  data () {
    return {
      modalShow: false,
      loginType: 'login'
    }
  }
}
</script>

<style scoped>
.b-botton {
  float: right;
}

</style>
