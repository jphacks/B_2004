<template>
  <div class="exam1">
    <!-- <h1>{{ msg }}</h1> -->
    <p>
      問題１
    </p>
    <h3>あなたは業務で、社員ID、社員名がセットになったデータを”社員ID”が昇順になるように出力するようなタスクを依頼されました。<br>
      以下に、コードを入力し、データ名のボタンをクリックするとそれをキーとしてカラムを並べ替えるようにしてください。
    </h3>
    <!-- こっちはお手本みたいなもの。固定？したいのでわかる人なおしてください。暫定的にコメントアウト -->
    <b-button variant="outline-primary" @click="pushData()">出力を確認する。</b-button>
<!--     <table>
    <thead>
        <tr>
            <th>id</th>
            <th>name</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="item in items" :key="item.userId">
            <td>{{ item.userId }}</td>
            <td>{{ item.userName }}</td>
        </tr>
    </tbody>
</table> -->
    <h3>＜例＞IdとNameをキーとして並べ替えるようにしたもの</h3>
    <!-- こっちは動的に表をソートするバージョン。methodを用いて並べ替えてる。 -->
    <!-- ソートが各１回しかできない。。なぜ -->
    <table>
    <thead>
        <tr>
            <th @click="sort('userId')">id</th>
            <th @click="sort('userName')">name</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="item in items" :key="item.userId">
            <td>{{ item.userId }}</td>
            <td>{{ item.userName }}</td>
        </tr>
    </tbody>
</table>
<h3>用いるデータは以下の形式である。<br>
要素としてuserId,userNameの２つを持つObject型<br>
例として用いたデータを以下に示す。
</h3>
    <b-card
    title="入力例"
  >
    <b-card-text>
      items: [
        { userId: '123', userName: 'Takahashi' },
        { userId: '221', userName: 'Ueda' },
        { userId: '212', userName: 'Katou' },
        { userId: '212', userName: 'Itou' },
        { userId: '412', userName: 'Okubo' },
        { userId: '1', userName: 'Gotou' }
      ]
    </b-card-text>

    <b-button href="#" variant="primary">Go somewhere</b-button>
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
        { userId: '212', userName: 'Itou' },
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
