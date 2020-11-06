<template>
  <div class="exam1">
    <!-- <h1>{{ msg }}</h1> -->
    <h1>
      問題2
    </h1>
    <h3>あなたは、文字列を結合する仕事をしています。ある日,お得意先から大量の文字列が与えられたため,先輩のもじもじ君と一緒に結合することにしました。<br><br>複数の文字列が与えられるので、それらを結合して出力してください。<br><br></h3>
    <h3>＜例＞与えられた文字列を結合して出力する。</h3>
    <!-- こっちは動的に表をソートするバージョン。methodを用いて並べ替えてる。 -->
    <!-- ソートが各１回しかできない。。なぜ -->
<h3>用いるデータは以下の形式である。<br><br>
要素としてString列, strPart[]が与えられるのでこれらの要素をすべて結合したものを出力してください。<br><br>
＜例＞要素が４つの場合
</h3>

    <b-card
    title="入力例"
  >
    <b-card-text>
      <h2>pen , pineapple , apple , pen <b-badge>文字列：4個</b-badge></h2>
    </b-card-text>
    <h3>出力例</h3>
    <b-card-text>
      <h2>pen , pineapple , apple , pen <b-badge>文字列：4個</b-badge></h2>
    </b-card-text>
  </b-card>

  </div>
</template>

<script>
export default {
  name: 'Exam1',
  data () {
    return {
      items: [
        { userId: '123', userName: 'Takahashi' },
        { userId: '221', userName: 'Ueda' },
        { userId: '212', userName: 'Katou' },
        { userId: '213', userName: 'Itou' },
        { userId: '412', userName: 'Okubo' },
        { userId: '1', userName: 'Gotou' }
      ]
    }
  },
  props: {
    input: Array
  },
  methods: {
    sort (index) {
      switch (index) {
        case 'userId':
          this.items.sort(function (a, b) {
            if (a.userId < b.userId) return -1
            if (a.userId > b.userId) return 1
            return 0
          })
          break
        case 'userName':
          this.items.sort(function (a, b) {
            if (a.userName < b.userName) return -1
            if (a.userName > b.userName) return 1
            return 0
          })
          break
        default:
      }
    }

  }
}
</script>
<style>
h1{
  margin: 40px 40px 40px;
  text-align: center;

}
    table{
        border-collapse: collapse;
        width:100%
    }
    td, th {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
    }
    th {
        color:white;
        background-color: #a4bacf;
    }
</style>
