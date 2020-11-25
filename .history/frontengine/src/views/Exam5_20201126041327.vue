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
          <Exam5Card v-for="(naiyou, index) in Object.keys(exams || {})" :key="index" :exams="exams[naiyou]" />
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
import Exam5Card from '@/components/Exam5Card.vue'
export default {
  name: 'Exam5',
  components: {
    Exam5Card
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
  max-height: 400px;
  overflow-y: scroll;
  border: solid 0.5px gray;
}
</style>
