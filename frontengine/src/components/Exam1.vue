<template>
  <div class="exam1">
    <!-- <h1>{{ msg }}</h1> -->
    <h1>
      {{name}}
    </h1>
    <b-card class="exam1Card">
      <b-card-text>あなたは業務で、社員ID、社員名がセットになったデータを”社員ID”が昇順になるように出力するようなタスクを依頼されました。<br>
        以下に、コードを入力し、データ名のボタンをクリックするとそれをキーとしてカラムを並べ替えるようにしてください。<br><br>
      </b-card-text>
      <b-card-text>＜例＞IdとNameをキーとして並べ替えるようにしたもの</b-card-text>
      <!-- こっちは動的に表をソートするバージョン。methodを用いて並べ替えてる。 -->
      <!-- ソートが各１回しかできない。。なぜ -->
      <table class="exam1Table">
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
      <b-card-text><br>用いるデータは以下の形式である。<br><br></b-card-text>
      <b-card-text class="format">"要素としてuserId,userNameの２つを持つObject型,すべての要素は一致することはない。"<br><br></b-card-text>
      <b-card-text>例として用いたデータを以下に示す。</b-card-text>
      <b-card title="入力例">
        <b-card-text>
          items: [
            { userId: '123', userName: 'Takahashi' },
            { userId: '221', userName: 'Ueda' },
            { userId: '212', userName: 'Katou' },
            { userId: '213', userName: 'Itou' },
            { userId: '412', userName: 'Okubo' },
            { userId: '1', userName: 'Gotou' }
          ]
        </b-card-text>
        <b-button href="#" variant="primary">Go somewhere</b-button>
      </b-card>
    </b-card>
    <br>
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
    input: Array,
    name: String
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
    .exam1Table{
        margin: 0px 40px 0px;
        border-collapse: collapse;
        width:80%
    }
    td, th {
        border: 1px solid #dddddd;
        text-align: center;
        padding: 5px;
    }
    th {
        color:white;
        background-color: #00adb5;
    }
    .exam1Card {
      border: 2px solid gray;
    }
    .format {
      text-decoration: underline
    }
</style>
