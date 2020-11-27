<template>
  <div class="terminal">
    <b-button class="md-raised md-primary" @click="dialogToggle">ターミナルを表示</b-button>
    <transition>
      <div class="dialog" v-drag v-if="isShow" :style="dialogStyle">
        <div class="terminal-header">
          <img alt="frontEngine logo" src="../assets/frontEngineSmallIcon.png">
          <span>frontengine-Shell</span>
          <i class="terminal-close" @click="dialogToggle">
            ×
          </i>
        </div>
        <v-shell class="shell"
          :banner = "banner"
          :shell_input = "send_to_terminal"
          :commands = "commands"
          @shell_output="prompt"
        ></v-shell>
      </div>
    </transition>
  </div>
</template>

<script>
import Vue from "vue"
import shell from 'vue-shell'
import drag from '@branu-jp/v-drag'
Vue.use(shell)

export default {
  name: "Terminal",
  directives: {
    drag
  },
  data () {
    return {
      isShow: false,
      dialogStyle: {
        top: 16 + "px",
        right: 16 + "px"
      },
      send_to_terminal: "",
      banner: {
        // subHeader: "Shell is power just enjoy 🔥",
        helpHeader: 'Enter "help" for more information.',
        emoji: {
          time: 750
        },
        sign: "$"
      },
      commands: [
        {
          name: "info",
          get () {
            return '<p>With ❤️ By Salah Bentayeb @halasproject.</p>'
          }
        },
        {
          name: "uname"
        }
      ]
    }
  },
  methods: {
    prompt (value) {
      if (value == "node -v") {
        this.send_to_terminal = process.versions.node
      }
      var commandArray = value.split(' ')
      console.log(commandArray, 'Terminal')
      this.$emit('frontEngineCommand', commandArray)
    },
    dialogToggle: function () {
      this.isShow = !this.isShow
    }
  }
}
</script>
<style scoped>
.dialog {
  position: absolute;
  width: 480px;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  z-index: 99999;
  border-radius: 2px;
  border: 1px solid gray;
  cursor: move;
}
.terminal-header{
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 8px;
}
.terminal-close {
  color: #ff0000;
  font-size: 25px;
}
.shell {
  max-height: 300px;
  overflow-y: scroll;
}
</style>
