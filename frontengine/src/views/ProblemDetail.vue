<template>
  <div class="problemArea">
    <b-tabs content-class="mt-3">
      <b-tab title="ホーム" active>
        <div class="checkBoxes">
          <span v-for="(value, key) of viewCheckBox" :key="key">
            <input :id="key" type="checkbox" v-model="viewCheckBox[key]" />
            {{ checkBoxString[key] }}
          </span>
        </div>
        <div class="problemView" v-if="viewCheckBox.exam">
          <h1>問題：{{ getExam.name }}</h1>
          <span v-if="!getLoginId">※ログインしていない場合提出できません</span>
          <!--<h1>難易度：{{getExam.difficult}}</h1>-->
          <b-card class="b-card">
            <b-card-text>
              <span v-for="value of getExplain" :key="value"
                >{{ value }}<br /></span
              ><br />
              <span v-for="value of getEnter" :key="value"
                >{{ value }}<br /></span
              ><br />
              <b-card>
                <b-card-text>
                  入力例1<br />
                  {{ getSumpleInput.join(",") }}<br />
                </b-card-text>
                <b-card-text>
                  出力例1<br />
                  <span
                    v-for="(smCase, key) in Object.keys(getSumpleOutput || {})"
                    :key="key"
                  >
                    {{ String(getSumpleOutput[key]) }}<br />
                  </span>
                </b-card-text>
              </b-card>
            </b-card-text>
          </b-card>
        </div>
        <br />
        <!-- Answer Form Area -->
        <div class="sample-output" v-if="viewCheckBox.sumpleOutput">
          <span>サンプル出力:testCase</span>
          <b-form-textarea
            v-model="sumpleOutputText"
            :disabled="true"
            :rows="8"
          />
        </div>
        <div class="problemdetail" v-if="viewCheckBox.inputArea">
          <b-button variant="outline-primary" @click="sumplePush()"
            >サンプルを設置する</b-button
          >
          <b-form-textarea
            id="textarea"
            v-model="text"
            :state="text.length > 0"
            placeholder="解答を入力してください。"
            rows="6"
          ></b-form-textarea>
          <div class="detail-buttons">
            <b-button v-if="getLoginId" @click="getDom()">送信</b-button>
            <b-button @click="sumpleTest()">サンプルを出力</b-button>
          </div>
          <!-- <br><br><br><router-link :to="{name: 'ProblemResult', params: {examId: $route.params.examId}}">問題結果画面に遷移します。</router-link> -->
        </div>
        <preview-field :dom="getDomTree" v-if="viewCheckBox.previewArea">
        </preview-field>
      </b-tab>
      <b-tab title="プレビュー画面">
        <preview-field :dom="getDomTree" unique="tabPage"> </preview-field>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
// @ is an alias to /src
import { MainProcess } from "@/process/MainProcess.js"
import { mapGetters, mapActions } from "vuex"
import Exam1 from "@/components/Exam1.vue"
import firebase from "firebase"
import PreviewField from "@/components/preview/PreviewField"
// import Exam1 from '@/components/Exam1.vue'
// import Exam2 from '@/components/Exam2.vue'
export default {
  name: "ProblemDetail",
  components: {
    PreviewField
  },
  data () {
    return {
      text: "",
      input: ["pen", "pineapple", "apple", "pen"],
      clear: [
        "pen",
        "penpineapple",
        "penpineappleapple",
        "penpineappleapplepen"
      ],
      option: {
        mode: "answerDOM",
        existString: true
      },
      exam: {},
      sumpleOutput: [],
      wait: false,
      getDomTree: {},
      viewCheckBox: {
        exam: true,
        sumpleOutput: true,
        inputArea: true,
        previewArea: true
      },
      checkBoxString: {
        exam: "問題詳細",
        sumpleOutput: "サンプル出力",
        inputArea: "解答入力欄",
        previewArea: "プレビュー画面"
      }
    }
  },
  props: {
  },
  mounted: function () {
    this.setExam()
    console.log("exam", this.exam)
  },
  methods: {
    ...mapActions(["setExams"]),
    getDom: function () {
      //  MainProcess(this.text)
      const submitExam = firebase.functions().httpsCallable("submitExam")
      const examId = this.$route.params.examId
      submitExam({
        userId: this.getLoginId,
        examId: examId,
        examText: this.text,
        testCase: this.input,
        outputSumple: this.clear,
        optionSumple: this.option
      })
        .then((res) => {
          console.log("res", res)
          const self = this
          firebase
            .firestore()
            .collection("users")
            .doc(String(this.getLoginId))
            .collection("join")
            .doc(String(examId))
            .get()
            .then(function (doc) {
              console.log("checkstartat", doc.data().endAt)
              if (!doc.data().endAt) {
                console.log("kiteruyo")
                firebase
                  .firestore()
                  .collection("users")
                  .doc(self.getLoginId)
                  .collection("join")
                  .doc(String(examId))
                  .update({
                    endAt: firebase.firestore.Timestamp.fromDate(new Date())
                  })
              }
            })
          this.$router.push({
            name: "ProblemResult",
            params: { examId: this.$route.params.examId, resOutput: res }
          })
        })
        .catch((e) => {
          // console.log("feiofjow", this.getLoginId, examId)
          const self = this
          firebase
            .firestore()
            .collection("users")
            .doc(String(this.getLoginId))
            .collection("join")
            .doc(String(examId))
            .get()
            .then(function (doc) {
              console.log("checkstartat", doc.data().endAt)
              if (!doc.data().endAt) {
                console.log("kiteruyo")
                firebase
                  .firestore()
                  .collection("users")
                  .doc(self.getLoginId)
                  .collection("join")
                  .doc(String(examId))
                  .update({
                    endAt: firebase.firestore.Timestamp.fromDate(new Date())
                  })
              }
            })
          console.log("e", e)
        })
    },
    sumpleTest: function () {
      if (this.text.length > 0 && !this.wait) {
        this.sumpleOutput = []
        const getExam = this.getExam
        const sumpleInput = getExam.examInfo.testCases.sampleCase.enter
        const sumpleClear = getExam.examInfo.testCases.sampleCase.exit
        const option = getExam.examInfo.option
        this.sumpleOutput.push("input testCases...")
        for (let i = 0; i < sumpleInput.length; i++) {
          this.sumpleOutput.push(sumpleInput[i])
        }
        this.sumpleOutput.push("input option...")
        Object.keys(option || {}).forEach((key) => {
          this.sumpleOutput.push(key + ": " + String(option[key]))
        })
        this.sumpleOutput.push("読み込み中...")
        this.wait = true
        MainProcess(this.text, sumpleInput, sumpleClear, option).then((res) => {
          this.sumpleOutput.pop()
          this.sumpleOutput.push("")
          this.getDomTree = res.domTree
          if (res.reason === "noneClear") {
            this.sumpleOutput.push(res.reason)
            this.sumpleOutput.push(
              "failed: [" + res.targetIndex + "]: " + res.targetNone
            )
            this.sumpleOutput.push(
              "clearCase: [" + res.targetIndex + "]: " + res.target
            )
          } else {
            this.sumpleOutput.push(res.reason)
          }
          if (res.noneTarget) {
            this.sumpleOutput.push("failedIndex: " + res.noneTarget)
          }
          if (res.output) {
            this.sumpleOutput.push("output: " + res.output)
          }
          this.wait = false
        })
      }
      this.$router.push({
        name: "ProblemResult",
        params: { examId: this.$route.params.examId }
      })
    },
    sumplePush: function () {
      this.text = this.getSumpleText
    },
    setExam: function () {
      const examId = this.$route.params.examId
      return firebase
        .firestore()
        .collection("exams")
        .get()
        .then((snapsshot) => {
          let output = {}
          console.log("ss", snapsshot)
          snapsshot.forEach((doc) => {
            this.setExams(doc)
            output[doc.id] = doc.data()
          })
          console.log("this.exam", output[examId])
          this.exam = output[examId]
        })
    },
    createEvent: function () {}
  },
  computed: {
    ...mapGetters(["getExams", "getUserId"]),
    getText () {
      return "''"
    },
    sumpleOutputText () {
      const out = []
      let k = 0
      for (let i = 0; i < this.sumpleOutput.length; i++) {
        if (this.sumpleOutput[i].length == 0) {
          out.push("")
          k--
          continue
        }
        out.push("[" + (i + k) + "]: " + this.sumpleOutput[i])
      }
      return out.join("\n")
    },
    getExam () {
      return this.exam
    },
    getLoginId () {
      console.log("check", this.getUserId)
      return this.getUserId
    },
    getSumpleText () {
      const output = []
      output.push("<template>")
      output.push('<div class="problemdetail">')
      output.push(
        '<answer v-for="(item, index) of input" :key="index">{{jointStr(input, index)}}<br/></answer>'
      )
      output.push("</div>")
      output.push("</template>")
      output.push("<script>")
      // output.push('import MainProcess from \'@/process/MainProcess.js\'')
      output.push("export default {")
      output.push("  name: 'Home',")
      output.push("  components: {")
      output.push("  },")
      output.push("props: {")
      output.push("input: Array")
      output.push("},")
      output.push("  data () {")
      output.push("    return {")
      output.push("      text: '',")
      output.push("      number: 0")
      output.push("    }")
      output.push("  },")
      output.push("  methods: {")
      output.push("    jointStr: function (items, index) {")
      output.push("      let output = ''")
      output.push("      for (let i = 0; i < index + 1; i = i + 1) {")
      output.push("        output = output + items[i]")
      output.push("      }")
      output.push("      return output")
      output.push("    }")
      output.push("  },")
      output.push("  computed: {")
      output.push("    getText () {")
      output.push("      return \"''\"")
      output.push("    },")
      output.push("    getMergeText () {")
      output.push("     return this.input.join('')")
      output.push("    }")
      output.push("  }")
      output.push("}")
      output.push("</" + "script>")
      output.push("<style scoped>")
      output.push(".testClass {")
      output.push("  display: flex;")
      output.push("  width: 100px;")
      output.push(" }")
      output.push(" h1 {")
      output.push("  height: 50px;")
      output.push(" }")
      output.push(" #targetId {")
      output.push("   color: red;")
      output.push("  }")
      output.push(" .problemdetail {")
      output.push("  width: 300px;")
      output.push("}")
      output.push("</style>")
      return output.join("\n")
    },
    getClearModel () {
      let output = {}
      output.exists = [] // eventに対応したやつ
      output.events = [] // event
      output.events.push({ id: "sortButtonId", event: "click" })
      output.events.push({ id: "sortButtonName", event: "click" })
      return output
    },
    getEnter () {
      if (!this.getExam || !this.getExam.examInfo) {
        return {}
      }
      return this.getExam.examInfo.exEnter
    },
    getExplain () {
      if (!this.getExam || !this.getExam.examInfo) {
        return {}
      }
      return this.getExam.examInfo.explain
    },
    getExamInfo () {
      if (!this.getExam || !this.getExam.examInfo) {
        return {}
      }
      return this.getExam.examInfo
    },
    getSumpleOutput () {
      if (!this.getExamInfo.testCases) {
        return {}
      }
      return this.getExamInfo.testCases.sampleCase.exit
    },
    getSumpleInput () {
      if (!this.getExamInfo.testCases) {
        return []
      }
      return this.getExamInfo.testCases.sampleCase.enter
    },
    getTimeStamp () {
      return {}
    }
  }
}
</script>

<style scoped>
.problemArea {
  margin: 40px 40px 40px;
}
.b-buttonArea {
  text-align: center;
}
.b-card {
  border: solid 0.5px gray;
  margin: auto;
}
.detail-buttons {
  display: flex;
}
</style>
