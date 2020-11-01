<template>
  <body class="problemArea">
  <div class="problemdetail">
    <b-button variant="outline-primary" @click="sumplePush()">サンプルを設置する</b-button>
      <b-form-textarea
      id="textarea"
      v-model="text"
      placeholder="Enter something..."
      rows="6"
    ></b-form-textarea>
    <b-button @click="getDom()">送信</b-button>
  </div>
  </body>
</template>

<script>
// @ is an alias to /src
import MainProcess from '@/process/MainProcess.js'
export default {
  name: 'Home',
  components: {
  },
  data () {
    return {
      text: ''
    }
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
    getText () {
      return "''"
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
      output.push('<img src="./peace.jpg"/>')
      output.push('<b-button @click="getDom(text)"><span class="goto">送信</span></b-button>')
      output.push('</div>')
      output.push('</template>')
      output.push('<script>')
      output.push('import MainProcess from \'@/process/MainProcess.js\'')
      output.push('export default {')
      output.push('  name: \'Home\',')
      output.push('  components: {')
      output.push('  },')
      output.push('  data () {')
      output.push('    return {')
      output.push('      text: \'\'')
      output.push('    }')
      output.push('  },')
      output.push('  methods: {')
      output.push('    getDom: function (text) {')
      output.push('      MainProcess(text)')
      output.push('    }')
      output.push('  },')
      output.push('  computed: {')
      output.push('    getText () {')
      output.push('      return "\'\'"')
      output.push('    },')
      output.push('  }')
      output.push('}')
      output.push('</ ' + 'script>')
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
