<template>
  <div class="problemList" >
    <!--{{ exams }}-->
    <h6>例題１標準入力で受け取った例題（Object型）をWEBサイト上に実装してください。
      手順としてはPloblemList上に受け取った問題の概要をProblemCardで表示し、
      それをクリックしたときに問題の詳細をProblemDetailによって表示できるようにしてください。
    </h6>
    <b-container class="bv-example-row">
      <b-row>
        <b-col>
          <h1>問題一覧</h1>
          <div class="examList" v-if="exams">
          <div v-for="(naiyou, index) in Object.keys(exams || {})" :key="index" :exams="exams[naiyou]">
            <div class="b-card" v-if="exams">
    <h1>aaaaa</h1>
    <b-card bg-variant="white" text-variant="black" class="text-center">
      <b-card-body>
        <b-card-text>問題名：{{ exams.name ? exams.name : "" }}<br /></b-card-text>
        <b-card-text>難易度：{{ exams.diff ? exams.diff : "" }}<br /></b-card-text>
        <router-link
          :to="{ name: 'Exam5Detail', params: { examId: exams.name, context: exams.body } }"
          >参加登録</router-link
        >
      </b-card-body>
    </b-card>
  </div>
          </div>
          </div>
          <div v-else>
          読み込み中...
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
// プロジェクト単位の例題１
export default {
  name: 'Exam5',
  components: {
  },
  data () {
    return {
      exams: {
        problem1: {
          name: "example1",
          diff: 100,
          body: "例題1です。"
        },
        problem2: {

          name: "example2",
          diff: 200,
          body: "例題2です。"

        },
        problem3: {
          name: "example3",
          diff: 300,
          body: "例題3です。"

        },
        problem4: {
          name: "example4",
          diff: 400,
          body: "例題4です。"

        },
        problem5: {
          name: "example5",
          diff: 500,
          body: "例題5です。"

        }
      }
    }
  },
  props: {

  },
  mounted: function () {
    console.log("hyouzi", this.exams)
  }
}

</script>

<style scoped>
.examList {
  max-height: 800px;
  overflow-y: scroll;
  border: solid 0.5px gray;
}
</style>
