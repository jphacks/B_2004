<template>
  <div class="problemArea">
    <div class="terminal">
      <Terminal @frontEngineCommand="terminalCommand"/>
    </div>
    <b-tabs content-class="mt-3" v-model="tabIndex">
      <b-tab title="ホーム" :active="getActives[0]">
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
                  {{ getSumpleInput }}<br />
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
            <b-button @click="sumpleSakai()">テスト（坂井）</b-button>
            <b-btn @click="routerFilePush()">router提出</b-btn>
            <b-button @click="sumpleTest()">サンプルを出力</b-button>
          </div>
          <!-- <br><br><br><router-link :to="{name: 'ProblemResult', params: {examId: $route.params.examId}}">問題結果画面に遷移します。</router-link> -->
        </div>
        <preview-field :dom="parseToDom" v-if="viewCheckBox.previewArea" @vueDom="propagateDom" @style-check="emitDom" @router-change="routerChange">
        </preview-field>
      </b-tab>
      <b-tab title="router設定">
        <b-card>
        <span v-for="(value, key) of getReturnRouterStr" :key="key">{{ value }}<br/></span>
        </b-card>
        <b-form-textarea
          id="routerArea"
          v-model="routerSetArea"
          :state="routerSetArea.length > 0"
          placeholder="解答を入力してください。"
          rows="6"
        ></b-form-textarea>
        <b-btn @click="routerFilePush()">router提出</b-btn>
      </b-tab>
      <div v-if="page">
      <b-tab :title="pageName" v-for="(pageName, index) in page" :key="index" :active="pageFlags[index]">
        <NewPage :pageName="pageName" :exam="getExam"/>
      </b-tab>
      </div>
      <b-tab title="+" :active="plus">
        <AddTab @fileName="newPageName"/>
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
// import AnswerCard from "@/components/preview/AnswerCard"
import { pureDomPreviewParse, domPreviewParse } from '@/process/ScriptUtility/domPreviewParse.js'
import { routerProcess, outputRouterString } from '@/process/ScriptUtility/routerProcess.js'
import { earth, ProjectProcess, outputRouterInfo } from '@/process/ProjectProcess.js'
// import Exam1 from '@/components/Exam1.vue'
// import Exam2 from '@/components/Exam2.vue'
import Terminal from '@/components/Terminal.vue'
import AddTab from '@/components/AddTab.vue'
import NewPage from '@/components/NewPage.vue'
export default {
  name: "ProblemDetail",
  components: {
    PreviewField,
    Terminal,
    AddTab,
    NewPage
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
      home: true,
      routerPage: false,
      plus: false,
      pageFlags: [],
      sumpleOutput: [],
      wait: false,
      getDomTree: {},
      previewDom: {},
      checkStyleDom: {},
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
      },
      routerSetArea: '',
      checked: false,
      page: [],
      command: [],
      tabIndex: 0,
      checkFlug: false
    }
  },
  props: {
  },
  mounted: function () {
    this.setExam()
    ProjectProcess()
    console.log("exam", this.exam)
  },
  methods: {
    ...mapActions(["setExams"]),
    routerChange: function (param) {
      // name か pathか調べる
      const keys = Object.keys(param)
      let params = {}
      if (keys.indexOf('params')) {
        params.$route = {}
        params.$route.params = param.params
      }
      console.log('params', param)
      if (keys.indexOf('name') >= 0 && keys.indexOf('path') >= 0) {
        console.error('both name and path exist.')
        return false
      } else if (keys.indexOf('name') >= 0) {
        console.log('name', keys, earth)
        if (earth && earth.router && earth.router.routes && earth.router.routes.name[param.name]) {
          const routeInfo = earth.router.routes.name[param.name]
          console.log('routeInfo', routeInfo)
          const componentName = routeInfo.component
          if (earth.pages[componentName]) {
            this.sumpleTest(earth.pages[componentName].pure, params)
          }
        }
      } else if (keys.indexOf('path') >= 0) {
      }
    },
    emitDom: function () {
      // console.log('previewDom', value, value.children, value.children[0])
      const value = this.checkStyleDom
      console.log('previewDom:func', value.children[0], value.children[0].children[1].children[0].getBoundingClientRect(), value.children[0].getBoundingClientRect(), [value.children[0]])
      console.log('preview:style', value.children[0].children[0].children[0].getBoundingClientRect(), value.children[0].children[1].children[0].getBoundingClientRect(), value.children[0].children[2].children[0].getBoundingClientRect())
      let targetStyle = this.getExam.examInfo
      let targetBool = true
      if (targetStyle && targetStyle.option && targetStyle.option.styleCheck) {
        targetStyle = targetStyle.option.styleCheck
      } else {
        this.checked = true
        return true
      }
      if (!targetStyle.hasOwnProperty('children')) {
        // bugでroot層だけchildrenがないパターン(必要なのに)ないパターンがある
        targetStyle.children = {}
        Object.keys(targetStyle).forEach(key => {
          if (key !== 'count' && key !== 'style' && key !== 'children') {
            targetStyle.children[key] = targetStyle[key]
          }
        })
      }
      let que = [targetStyle]
      let domQue = [value.children[0]]
      while (que.length > 0) {
        // 正答判定
        let take = que.shift()
        let countDomTake = []
        if (take.count > 0) {
          for (let i = 0; i < take.count; i++) {
            countDomTake.push(domQue.shift())
          }
        }
        console.log('ccck', take, countDomTake)
        const diffStyleCheck = {}
        const diffStyles = []
        let NextChild = countDomTake[0]
        for (let i = 0; i < countDomTake.length; i++) {
          let domTake = countDomTake[i]
          let domStyle = domTake.getBoundingClientRect()
          let domRawStyle = countDomTake[i].style
          if (!take.hasOwnProperty('name')) {
            // noname
          } else {
            // nameつき
            if (take.name === 'AnswerCard') {
              domTake = countDomTake[i].children[0]
              NextChild = countDomTake[0].children[0]
            }
          }
          console.log('countDomTake', domTake, domStyle)
          diffStyles.push(domStyle)
          if (take.hasOwnProperty('style')) {
            for (let parentKey of Object.keys(take.style)) {
              // _区切りでor判定とする
              console.log('take.style', parentKey, take.style)
              const splitKeys = parentKey.split('_')
              let splitBool = []
              for (let i = 0; i < splitKeys.length; i++) {
                const key = splitKeys[i]
                for (let subKey of Object.keys(take.style[key])) {
                  console.log('subKey', subKey, domStyle, key)
                  if (subKey === 'max' || subKey === 'min') {
                    // 幅指定
                    if (subKey.match('max')) {
                      // minの時だけ判定
                      continue
                    }
                    if (domStyle[key]) {
                      // 他に依存しない
                      if (take.style[key].min <= domStyle[key] && domStyle[key] <= take.style[key].max) {
                        continue
                      } else {
                        splitBool.push(false)
                      }
                    } else {
                      // 他要素と依存関係にあるstylecheck
                      diffStyleCheck[parentKey] = true
                    }
                  } else if (!(subKey === domRawStyle[key])) {
                    // absolute指定
                    if (key === 'overflow') {
                      // 例外処理
                      console.log('overflow', key)
                      const upperSubKey = subKey.toUpperCase()
                      if (domRawStyle[key + upperSubKey]) {
                        console.log('overflow', domRawStyle[key + upperSubKey])
                      } else {
                        console.log('absolute指定:アウト', subKey, domRawStyle[key], [domRawStyle], [countDomTake[i]])
                        splitBool.push(false)
                      }
                    } else {
                      console.log('absolute指定:アウト', subKey, domRawStyle[key], [domRawStyle], [countDomTake[i]])
                      splitBool.push(false)
                    }
                  } else {
                    // trueをいれとく
                    splitBool.push(true)
                  }
                }
                let continueBool = false
                for (let take of splitBool) {
                  if (take) {
                    continueBool = true
                    break
                  }
                }
                if (continueBool || splitBool.length == 0) {
                  continue
                }
                // false
                this.checked = false
                console.log('style:False', splitBool, take, [domTake])
                return false
              }
            }
          }
        }
        if (diffStyles.length > 0) {
          let xDiffs = [...diffStyles]
          let yDiffs = [...diffStyles]
          for (let i = 0; i < xDiffs.length; i++) {
            xDiffs[i].index = i
            yDiffs[i].index = i
          }
          xDiffs.sort((a, b) => a.x - b.x)
          yDiffs.sort((a, b) => a.y - b.y)
          for (let i = 1; i < xDiffs.length; i++) {
            const xDiff = xDiffs[i].x - (xDiffs[i - 1].x + xDiffs[i - 1].width)
            const yDiff = yDiffs[i].y - (yDiffs[i - 1].y + yDiffs[i - 1].height)
            xDiffs[i - 1].xDiffRight = xDiff // 右側との差
            xDiffs[i].xDiffLeft = xDiff // 左側との差
            yDiffs[i - 1].yDiffBottom = yDiff // 下側との差
            yDiffs[i].yDiffTop = yDiff // 上側との差
          }
          let orders = Object.keys(diffStyleCheck)
          console.log('orders', orders, diffStyles, countDomTake)
          for (let order of orders) {
            let splitOrders = order.split('_')
            const splitBool = []
            console.log('order', order, xDiffs)
            for (let key of splitOrders) {
              const max = take.style[order].max
              const min = take.style[order].min
              console.log('checcker', min, max, key)
              switch (key) {
                case 'padding':
                case 'margin':
                  // とりあえずこれらをまとめてお互いの距離感として処理する
                  // とりあえず左右だけ見るようにする -> 縦軸も一応取得してるから、見たい時は違う命令で
                  let marginCheck = true
                  console.log('paddingOrMargin', xDiffs, key)
                  for (let i = 0; i < xDiffs.length; i++) {
                    console.log('xDiffs', xDiffs[i], xDiffs[i].xDiffLeft)
                    if (xDiffs[i].xDiffLeft || typeof xDiffs[i].xDiffLeft === 'number') {
                      console.log('xDiffLeft', xDiffs[i])
                      if (!(min <= xDiffs[i].xDiffLeft && xDiffs[i].xDiffLeft <= max)) {
                        console.log('style:DiffFalseLeft', key, xDiffs[i], min, max, xDiffs[i].xDiffLeft)
                        marginCheck = false
                        break
                      }
                    }
                    if (xDiffs[i].xDiffRight || typeof xDiffs[i].xDiffRight === 'number') {
                      console.log('xDiffRight', xDiffs[i])
                      if (!(min <= xDiffs[i].xDiffRight && xDiffs[i].xDiffRight <= max)) {
                        console.log('style:DiffFalseRight', key, xDiffs[i], min, max, xDiffs[i].xDiffRight)
                        marginCheck = false
                        break
                      }
                    }
                  }
                  splitBool.push(marginCheck)
                  break
              }
            }
            let checkSplitBool = false
            splitBool.forEach(flag => {
              if (flag) {
                checkSplitBool = true
              }
            })
            if (!checkSplitBool && splitBool.length > 0) {
              this.checked = false
              return false
            }
          }
        }
        if (NextChild && NextChild.children) {
          console.log('NextChild.children', NextChild.children)
          domQue.push(...NextChild.children)
        } else {
          console.log('NextChild.children:none', [NextChild])
        }
        if (take.hasOwnProperty('children')) {
          console.log('take.children', take.children)
          que.push(...Object.values(take.children))
        }
      }
      console.log('previewDom:targetStyle', que, domQue)
      for (let child of value.children[0].children) {
        console.log('previewDom:dom', child.children[0], child.children[0].getBoundingClientRect())
      }
      console.log('previewDom:style', value.children, targetStyle)
      console.log('previewDom:exam', this.getExam)
      this.previewDom = value
    },
    propagateDom: function (value) {
      this.checkStyleDom = value
    },
    routerFilePush: function (val) {
      routerProcess(this.routerSetArea)
    },
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
    sumpleSakai: function () {
      this.$router.push({
        name: "ProblemResult",
        params: { examId: this.$route.params.examId }
      })
    },
    sumpleTest: function (routerText, routerInput) {
      this.checkFlug = false
      if (this.text.length > 0 && !this.wait) {
        this.sumpleOutput = []
        const getExam = this.getExam
        let sumpleInput = getExam.examInfo.testCases.sampleCase.enter
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
        if (routerText) {
          this.text = routerText
        }
        if (routerInput) {
          sumpleInput = routerInput
        }
        console.log('sumpleOutput', sumpleInput, this.text)
        MainProcess(this.text, sumpleInput, sumpleClear, option).then((res) => {
          this.sumpleOutput.pop()
          this.sumpleOutput.push("")
          this.getDomTree = res.domTree
          console.log('getDomTree', this.getDomTree)
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
    createEvent: function () {},
    terminalCommand: function (commandArray) {
      const reserveWords = ['home', 'plus', 'router']
      console.log(commandArray.join(" "), 'ProblemDetail')
      this.command.push(...commandArray)
      console.log(this.command)
      if (this.command[0] === "page") {
        switch (this.command[1]) {
          case 'create':
          case '-c':
            if (this.page.indexOf(this.command[2]) === -1 && this.command[2] != null && reserveWords.indexOf(this.command[2]) < 0) {
              this.page.push(this.command[2])
              this.pageFlags.push(false)
            }
            this.command = []
            break
          case 'change':
          case '-ch':
            let target = this.command[2]
            if (this.command[2] === "-c") {
              target = this.command[3]
              // this.page.push(this.command[3])
              // // this.pageFlags.push(false)
              // const output = []
              // for (let i = 0; i < this.pageFlags.length; i++) {
              //   output.push(false)
              // }
              // this.home = false
              // this.plus = false
              // if (this.command[3] === 'home') {
              //   this.home = true
              // } else if (this.command[3] === 'plus') {
              //   this.plus = true
              // } else {
              //   const getIndex = this.page.indexOf(this.command[3])
              //   if (getIndex >= 0) {
              //     output[getIndex] = true
              //   }
              // }
              // this.pageFlags = output
              // // this.getActives[this.page.indexOf(this.command[3])+1] = true
              // console.log(this.page, this.tabIndex, this.pageFlags, 'pageFlag見る', this.getActives)
              // console.log(this.page.indexOf(target))
              // this.command = []
              this.command = []
            } else {
              const output = []
              for (let i = 0; i < this.pageFlags.length; i++) {
                output.push(false)
              }
              this.home = false
              this.plus = false
              if (target === 'home') {
                this.home = true
              } else if (target === 'plus') {
                this.plus = true
              } else if (target === 'router') {
                this.routerPage = true
              } else {
                const getIndex = this.page.indexOf(target)
                if (getIndex >= 0) {
                  output[getIndex] = true
                }
              }
              this.pageFlags = output
              this.command = []
            }
            break
          default:
            this.command = []
            break
        }
      } else {
        this.command = []
      }
    },
    newPageName: function (fileName) {
      console.log(fileName)
      if (this.page.indexOf(fileName) === -1) {
        this.page.push(fileName)
      }
    }
  },
  computed: {
    ...mapGetters(["getExams", "getUserId"]),
    getText () {
      return "''"
    },
    getReturnRouterStr () {
      if (outputRouterString) {
        return outputRouterString
      }
      return []
    },
    getActives () {
      const home = this.home
      const plus = this.plus
      const routerPage = this.routerPage
      const pageActives = this.pageFlags
      let output = []
      output.push(home)
      output.push(routerPage)
      output.push(...pageActives)
      output.push(plus)
      console.log(output, "getActives")
      return output
    },
    parseToDom () {
      return domPreviewParse(this.getDomTree, 'default')
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
    getProjectStatus () {
      return this.exam && this.exam.examInfo && this.exam.examInfo.option && this.exam.examInfo.option.project
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
      return Array.isArray(this.getExamInfo.testCases.sampleCase.enter) ? this.getExamInfo.testCases.sampleCase.enter.join(",") : this.getExamInfo.testCases.sampleCase.enter
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
.terminal{
  float: right;
}
</style>
