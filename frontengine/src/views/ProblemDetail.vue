<template>
  <body class="problemArea">
  <div class="ploblemBody">
    <span>{{ getExam ? getExam.name : 'testmode' }}</span>
  </div>
  <!-- Answer Form Area -->
  <div class="problemdetail">
    <b-button variant="outline-primary" @click="sumplePush()">サンプルを設置する</b-button>
      <b-form-textarea
      id="textarea"
      v-model="text"
      :state="text.length > 0"
      placeholder="解答を入力してください。"
      rows="6"
    ></b-form-textarea>
    <b-button @click="getDom()">送信</b-button>

    <br><br><br><router-link :to="{name: 'ProblemResult', params: {examId: $route.params.examId}}">問題結果画面に遷移します。</router-link>
  </div>
  </body>
</template>

<script>
// @ is an alias to /src
import MainProcess from '@/process/MainProcess.js'
import { mapGetters } from 'vuex'
export default {
  name: 'ProblemDetail',
  components: {
  },
  data () {
    return {
      text: ''
    }
  },
  props: {
  },
  methods: {
    getDom: function () {
      MainProcess(this.text)
    },
    sumplePush: function () {
      this.text = this.getSumpleText
    }
  },
  computed: {
    ...mapGetters(['getExams']),
    getText () {
      return "''"
    },
    getExam () {
      const examId = this.$route.params.examId
      console.log('getExam', examId, this.getExams)
      if (!this.getExams || !this.getExams[examId]) {
        return { name: 'testmode' }
      }
      return this.getExams[examId]
    },
    getSumpleText () {
      const output = []
      output.push('<template>')
      output.push('<div class="problemdetail">')
      output.push('<b-form-textarea')
      output.push('id="textarea"')
      output.push('v-model="text"')
      output.push('placeholder="Enter something..."')
      output.push('rows="6"')
      output.push('></b-form-textarea>')
      output.push(' {{ text }} ')
      output.push('<div v-if="text">')
      output.push('')
      output.push('</div>')
      output.push('<div v-else>')
      output.push('</div>')
      output.push('<div v-for="(value, index) of Array" :key="index" />')
      output.push('<img src="./peace.jpg"/>')
      output.push('<b-button @click="getDom(text)"><span class="goto">送信</span></b-button>')
      output.push('</div>')
      output.push('</template>')
      output.push('<script>')
      // output.push('import MainProcess from \'@/process/MainProcess.js\'')
      output.push('export default {')
      output.push('  name: \'Home\',')
      output.push('  components: {')
      output.push('  },')
      output.push('props: {')
      output.push('input: String,')
      output.push('testCase: {')
      output.push('type: String,')
      output.push('default: \'testcase\'')
      output.push(' }')
      output.push('},')
      output.push('  data () {')
      output.push('    return {')
      output.push('      text: \'\',')
      output.push('      number: 0,')
      output.push('      obj: {a: {}, c:{d:50, e:{}}},')
      output.push('      array: [0,1,2]')
      output.push('    }')
      output.push('  },')
      output.push('  methods: {')
      output.push('    getDom: function (text) {')
      output.push('      MainProcess(text)')
      output.push('    },')
      output.push('    test: function () {')
      output.push('      this.getDom()')
      output.push('     }')
      output.push('  },')
      output.push('  computed: {')
      output.push('    getText () {')
      output.push('      return "\'\'"')
      output.push('    },')
      output.push('  }')
      output.push('}')
      output.push('</' + 'script>')
      return output.join('\n')
    }
  }
}
</script>

<style scoped>
.problemArea {
  margin: 40px 40px 40px;
}
</style>
