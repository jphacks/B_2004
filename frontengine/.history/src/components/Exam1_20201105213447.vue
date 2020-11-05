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
            <td>{{ item.UserName }}</td>
        </tr>
    </tbody>
</table>
<!--     <li v-for="item in items" :key="item.userId">
        社員ID : {{ item.userId }}  社員名: {{ item.userName }}
    </li> -->
    <h3>これをIDで並び変えて</h3>

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
      ]
    }
  },
  props: {
    input: Array
  },
  methods: {
    sortBy(key) {
    this.sort_key = key;
  },

  }
}
</script>
