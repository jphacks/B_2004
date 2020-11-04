<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      このアプリではフロントエンジニア向けの問題を提供しています。
    </p>
    <h3>なんども問題を解いていくことでスキルがみにつく。<br>
      レーティングシステムによって自分がどの位置にいるのかすぐわかる
    </h3>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
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

li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
