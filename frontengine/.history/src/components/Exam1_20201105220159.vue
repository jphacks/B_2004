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
<!--     <li v-for="item in items" :key="item.userId">
        社員ID : {{ item.userId }}  社員名: {{ item.userName }}
    </li> -->
    <h3>これをIDで並び変えて</h3>
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
  </div>
</template>

<script>
export default {
  name: 'Exam1',
  data () {
    return {
      items: [
        { userId: '123', userName: '高橋' },
        { userId: '221', userName: '上田' },
        { userId: '212', userName: '加藤' },
        { userId: '212', userName: '伊藤' },
        { userId: '412', userName: '大久保' },
        { userId: '1', userName: '後藤' }
      ],
      sort_key: ''
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

  },
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
