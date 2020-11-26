<template>
  <div class="home">
    <img alt="frontEngine logo" src="../assets/frontEngineLogo.png">
    <HomeDesign msg="frontEngineへようこそ"/>
    <Terminal @frontEngine="engine"/>
    <b-card><exam-4 :input="input"/></b-card>
  </div>
</template>

<script>
// @ is an alias to /src
import HomeDesign from '@/components/HomeDesign.vue'
import Terminal from '@/components/Terminal.vue'
import Exam4 from '@/components/Exam4.vue'

export default {
  name: 'Home',
  components: {
    HomeDesign,
    Terminal,
    Exam4
  },
  methods: {
    engine: function (abc) {
      console.log(abc.join(" "), 'Home')
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
