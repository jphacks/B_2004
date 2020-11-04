<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      このアプリではフロントエンジニア向けの問題を提供しています。
    </p>
    <h3>なんども何度でも問題を解いていくことでスキルがみにつく。<br>
      レーティングシステムによって自分のレベルを可視化
    </h3>
  </div>
</template>

<script>
export default {
  name: 'HomeDesigin',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

</style>
