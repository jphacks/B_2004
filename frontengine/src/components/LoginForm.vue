<template>
  <div>
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <b-form-group
        id="input-group-1"
        label="Email address:"
        label-for="input-1"
        description="We'll never share your email with anyone else."
      >
        <b-form-input
          id="input-1"
          v-model="form.email"
          type="email"
          required
          placeholder="Enter email"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Your Password:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.password"
          required
          placeholder="Enter password"
        ></b-form-input>
      </b-form-group>
      <div class="loginReset">
        <div v-if="loginType === 'login'" >
          <b-button type="ok" variant="primary" >submit</b-button>
        </div>
        <div v-else>
          <b-button type="submit" variant="primary" >submit</b-button>
        </div>
      </div>
    </b-form>
    <div v-if="loginType === 'login'" >
      <span v-on:click="onChangeLoginType()" class="LoginModeChange">未登録の方はこちら</span>
    </div>
    <div v-else>
      <span v-on:click="onChangeLoginType()" class="LoginModeChange">ログインはこちら</span>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    loginType: {
      type: String,
      default: 'login'
    }
  },
  data () {
    return {
      form: {
        email: '',
        name: '',
        password: '',
        food: null,
        checked: []
      },
      foods: [{ text: 'Select One', value: null }, 'Carrots', 'Beans', 'Tomatoes', 'Corn'],
      show: true
    }
  },
  methods: {
    ...mapActions(['login']),
    onSubmit (evt) {
      evt.preventDefault()
      // alert(JSON.stringify(this.form))
      this.createOrRegist(this.form.email, this.form.password)
    },
    onOk (evt) {
      evt.preventDefault()
      // alert(JSON.stringify(this.form))
      this.createOrRegist(this.form.email, this.form.password)
    },
    onReset (evt) {
      evt.preventDefault()
      // Reset our form values
      this.form.email = ''
      this.form.name = ''
      this.form.food = null
      this.form.checked = []
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },
    onChangeLoginType () {
      if (this.loginType === 'login') {
        this.loginType = 'regist'
        this.$emit('loginType', 'regist')
      } else {
        this.loginType = 'login'
        this.$emit('loginType', 'login')
      }
    },
    createOrRegist (email, password) {
      console.log('check', email, password)
      if (this.loginType === 'login') {
        // login
        firebase.auth().signInWithEmailAndPassword(email, password).then(
          user => {
            console.log('user', user)
            this.login(user.user)
            // this.$router.push('/')
          },
          err => {
            alert(err.message)
          })
      } else {
        // regist
        firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(user => {
            console.log('user', user)
            this.login(user.user)
            alert('Create account: ', user.email)
          })
          .catch(error => {
            alert(error.message)
          })
      }
    }
  }
}
</script>

<style scoped>
.loginReset {
  display: flex;
}
.LoginModeChange {
  float: right;
  cursor: pointer;
}
</style>
