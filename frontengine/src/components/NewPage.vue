<template>
  <div>
    <span>{{pageName}}</span>
    <div class="file-url">
      <b-form-textarea
        id="urltext"
        v-model="pageInfo.url"
        rows="1"
        no-resize
        :disabled="true"
      ></b-form-textarea>
    </div>
    <div>
      <preview-field :dom="parseToDom" @vueDom="propagateDom" @style-check="emitDom" :unique="pageName">
      </preview-field>
    </div>
    <div class="problemdetail">
      <b-form-textarea
        id="textarea"
        v-model="text"
        :state="text.length > 0"
        placeholder="解答を入力してください。"
        rows="6"
      ></b-form-textarea>
      <div class="detail-buttons">
        <b-button @click="sumpleTest()">出力</b-button>
      </div>
    </div>
  </div>
</template>

<script>
import PreviewField from "@/components/preview/PreviewField"
import { MainProcess } from "@/process/MainProcess.js"
import { mapGetters, mapActions } from "vuex"
import { earth, pageAdd, getMyPageInfo } from '@/process/ProjectProcess.js'
import { pureDomPreviewParse, domPreviewParse } from '@/process/ScriptUtility/domPreviewParse.js'
import firebase from "firebase"
export default {
  name: "NewPage",
  props: {
    pageName: String,
    exam: Object
  },
  components: {
    PreviewField
  },
  data () {
    return {
      urltext: "",
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
      // exam: {},
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
      checked: false,
      pageInfo: { url: '' }
    }
  },
  methods: {
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
            if (take.name === 'answerCard') {
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
                        console.log('依存してないがアウト', take.style[key].min, take.style[key].max, domStyle[key], key)
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
      // console.log('previewDom:style', value.children, targetStyle)
      // console.log('previewDom:exam', this.getExam)
      this.previewDom = value
    },
    propagateDom: function (value) {
      this.checkStyleDom = value
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
    sumpleTest: function () {
      if (this.text.length > 0 && !this.wait) {
        this.sumpleOutput = []
        const exam = this.exam
        console.log("exam", this.exam)
        const sumpleInput = exam.examInfo.testCases.sampleCase.enter
        const sumpleClear = exam.examInfo.testCases.sampleCase.exit
        const option = exam.examInfo.option
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
        MainProcess(this.text, sumpleInput, sumpleClear, option, this.pageName, true).then((res) => {
          this.sumpleOutput.pop()
          this.sumpleOutput.push("")
          this.getDomTree = res.domTree
          console.log(res.domTree, "aaaa")
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
          console.log('res', res.earth)
          if (res.earth) {
            console.log('pageInfo:res', Object.assign({}, res.earth.pages[this.pageName]))
            this.pageInfo = res.earth.pages[this.pageName]
          }
          this.wait = false
          console.log('res', res)
        })
      }
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
          // console.log("this.exam", output[examId])
          // this.exam = output[examId]
        })
    },
    createEvent: function () {}
  },
  computed: {
    ...mapGetters(["getExams", "getUserId"]),
    getText () {
      return "''"
    },
    pageURL () {
      if (this.pageInfo) {
        return this.pageInfo.url
      }
      return 'localhost'
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
    // getExam () {
    //   return this.exam
    // },
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
    }
  }
}
</script>

<style scoped>
.file-url {
  height: 30px;
  overflow-y: hidden;
}
</style>
