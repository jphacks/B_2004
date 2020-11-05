<template>
  <div class="exam1">
    <!-- <h1>{{ msg }}</h1> -->
    <p>
      問題2
    </p>
    <h3>あなたは先日学校の課題で出た、”九九を表示するプログラム”をvue上で作ろうとしています。<br>
      適切なプログラムを書くことによって、九九の表を画面上に提示できるようにしてください。
    </h3>
    <b-button variant="outline-primary" @click="pushData()">出力を確認する。</b-button>
  </div>
</template>

<script>
export default {
  name: 'Exam1',
  data () {
      return {
          userObject: {'name':'', 'value': ''}
      }
  },
  props: {
    input: Array
  },
  methods: {
      sumplePush: function () {
          this.userId = this.getSumpleData

      }
  }
}
</script>
