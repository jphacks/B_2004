<template>
  <div class="PreviewField">
    <b-button v-if="dom" @click="previewParse()">プレビューを表示する</b-button>
    <b-card>
      <div :id="'targetPreview'" class="targetPreviewFiled">
        <div>
        </div>
      </div>
    </b-card>
  </div>
</template>

<script>
// @ is an alias to /src
import { domPreviewParse } from '@/process/ScriptUtility/domPreviewParse.js'
import Vue from 'vue/dist/vue.esm.js'
export default {
  name: 'PreviewField',
  components: {
  },
  props: {
    dom: {},
    inputScript: {}
  },
  data () {
    return {
      outputDom: {},
      pushPreview: ''
    }
  },
  computed: {
    getDom () {
      return this.dom
    }
  },
  mounted: function () {
    this.testPush()
  },
  methods: {
    domEvent: function (order, path) {
      // domのfunction系を一旦ここに噛ませる
      // orderはfunction名
      // pathはcomponentファイル名
      console.log('order', order, path)
    },
    classEvent: function (path, ...orders) {
      // class名を受け取る
      console.log('class', path, orders)
    },
    previewParse: function () {
      const getDDD = domPreviewParse(this.dom, 'default')
      this.outputDom = getDDD
      const self = this
      const domEvent = this.domEvent
      const classEvent = this.classEvent
      const testSumple = getDDD
      console.log('checce', getDDD)
      let newPreviewDom = Vue.component('newPreviewDom', {
        template: getDDD,
        methods: {
          domEvent: domEvent,
          classEvent: classEvent
        },
        style: {
          size: {
            width: '500px',
            position: 'absolute'
          }
        }
      })
      let vm = new Vue({
        render: h => h(newPreviewDom)
      })
      // this.pushPreview = newPreviewDom
      const targetDomChange = document.getElementById('targetPreview').children[0]
      console.log('check', vm)
      vm.$mount(targetDomChange)
    },
    testPush: function () {
      console.log('document', document, this.document)
      const sumpleText = [`<div> aaaa </div>`]
      return sumpleText
    }
  }
}
</script>
