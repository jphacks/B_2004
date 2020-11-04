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
      <div v-if="loginType === 'login'" >
        <b-button type="ok" variant="primary" >ログイン</b-button>
      </div>
      <div v-else>
        <b-button type="submit" variant="primary" >登録</b-button>
      </div>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
    <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ form }}</pre>
    </b-card>
    <div v-if="loginType === 'login'" >
      <b-button @click="onChangeLoginType()">未登録の方はこちら</b-button>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import { mapActions, mapGetters } from 'vuex'

export default {
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
      show: true,
      loginType: 'login'
    }
  },
  methods: {
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
      } else {
        this.loginType = 'login'
      }
    },
    createOrRegist (email, password) {
      console.log('check', email, password)
      if (this.loginType === 'login') {
        // login
        firebase.auth().signInWithEmailAndPassword(email, password).then(
          user => {
            console.log('user', user)
            alert('Success!')

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
            alert('Create account: ', user.email)
          })
          .catch(error => {
            alert(error.message)
          })
      }
    },
    ...mapActions(['login']),
    user

  }
}
</script>
