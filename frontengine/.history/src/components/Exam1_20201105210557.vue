<template>
  <div class="exam1">
    <!-- <h1>{{ msg }}</h1> -->
    <p>
      問題１
    </p>
    <h3>あなたは業務で、社員ID、社員名がセットになったデータを”社員ID”が昇順になるように出力するようなタスクを依頼されました。<br>
      以下に、コードを入力し、ボタンをクリックするとデータがすべて列挙されるようにしてください。
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
