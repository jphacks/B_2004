<template>
  <div class="home">
    <img alt="frontEngine logo" src="../assets/frontEngineLogo.png">
    <HomeDesign msg="frontEngineへようこそ"/>
    <Terminal @frontEngine="engine"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HomeDesign from '@/components/HomeDesign.vue'
import Terminal from '@/components/Terminal.vue'

export default {
  name: 'Home',
  components: {
    HomeDesign,
    Terminal
  },
  methods: {
    engine: function (abc) {
      console.log(abc.join(" "), 'Home')
    }
  }
}
</script>

<style scoped>
.home {
  text-align: center;
}
</style>
