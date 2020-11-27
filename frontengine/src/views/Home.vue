<template>
  <div class="home">
    <img alt="frontEngine logo" src="../assets/frontEngineLogo.png">
    <b-button @click="testSakai()">テスト5（坂井）</b-button>
    <HomeDesign msg="frontEngineへようこそ"/>
    <b-card><exam-4 :input="input"/></b-card>
  </div>
</template>

<script>
// @ is an alias to /src
import HomeDesign from '@/components/HomeDesign.vue'
import Exam4 from '@/components/Exam4.vue'

export default {
  name: 'Home',
  components: {
    HomeDesign,
    Exam4
  },
  methods: {
    testSakai: function () {
      this.$router.push({
        name: "Exam5"
      })
    },
    getter: function (params) {
      console.log('params', params)
    }
  },
  data () {
    return {
      input: ['aada', 'dasda', 'dwdww', 'ww', 'dadaw', 'tanuki']
    }
  }
}
</script>

<style scoped>
.home {
  text-align: center;
}
</style>
