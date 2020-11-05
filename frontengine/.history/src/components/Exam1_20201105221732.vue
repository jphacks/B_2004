<template>
  <div class="exam1">
    <!-- <h1>{{ msg }}</h1> -->
    <p>
      問題１
    </p>
    <h3>あなたは業務で、社員ID、社員名がセットになったデータを”社員ID”が昇順になるように出力するようなタスクを依頼されました。<br>
      以下に、コードを入力し、ボタンをクリックするとデータがすべて列挙されるようにしてください。
    </h3>
    <!-- こっちはお手本みたいなもの。固定？したいのでわかる人なおしてください。 -->
    <b-button variant="outline-primary" @click="pushData()">出力を確認する。</b-button>
    <table>
    <thead>
        <tr>
            <th>UserId</th>
            <th>UserName</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="item in items" :key="item.userId">
            <td>{{ item.userId }}</td>
            <td>{{ item.userName }}</td>
        </tr>
    </tbody>
</table>
    <h3>これをIDで並び変えて</h3>
    <!-- こっちは動的に表をソートするバージョン。methodを用いて並べ替えてる。 -->
    <table>
    <thead>
        <tr>
            <th @click="sort('userId')">Userid</th>
            <th @click="sort('userName')">Name</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="item in items" :key="item.userId">
            <td>{{ item.userId }}</td>
            <td>{{ item.userName }}</td>
        </tr>
    </tbody>
</table>
<h3>用いるデータは<h3>
    <b-card
    title="Sample data"
  >
    <b-card-text>
      Some quick example text to build on the card title and make up the bulk of the card's content.
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
