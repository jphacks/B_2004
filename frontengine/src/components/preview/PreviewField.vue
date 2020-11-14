<template>
  <div class="PreviewField">
    <b-button v-if="dom" @click="previewParse()">プレビューを表示する</b-button>
    <b-card>
      <!-- {{ getDom }} -->
    </b-card>
  </div>
</template>

<script>
// @ is an alias to /src
import { domPreviewParse } from '@/process/ScriptUtility/domPreviewParse.js'

export default {
  name: 'PreviewField',
  components: {
  },
  props: {
    dom: {},
    inputScript: {}
  },
  computed: {
    getDom () {
      return this.dom
    }
  },
  methods: {
    domEvent: function (order, path, ...args) {
      // domのfunction系を一旦ここに噛ませる
      // orderはfunction名
      // pathはcomponentファイル名
    },
    previewParse: function () {
      domPreviewParse(this.dom)
    }
  }
}
</script>
