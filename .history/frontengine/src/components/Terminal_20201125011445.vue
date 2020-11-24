<template>

    <div class="terminal">
    <b-button class="md-raised md-primary" @click="dialogToggle">ターミナルを表示</b-button>
    <transition>
      <div class="dialog" v-drag v-if="isShow" :style="dialogStyle">
        <moveable
          class="moveable"
          v-bind="moveable"
          @drag="handleDrag"
          @resize="handleResize"
          @scale="handleScale"
          @rotate="handleRotate"
          @warp="handleWarp"
          @pinch="handlePinch"
        >
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
        </moveable>
      </div>
    </transition>
  </div>
</template>

<script>
import Vue from "vue"
import shell from 'vue-shell'
import drag from '@branu-jp/v-drag'
import Moveable from 'vue-moveable'
Vue.use(shell)
Vue.component('moveable', Moveable)

export default {
  name: "Terminal",
  directives: {
    // drag
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
      ],
      moveable: {
        draggable: true,
        scalable: true,
        resizable: false,
        warpable: false,
        throttleDrag: 0,
        throttleResize: 1,
        keepRatio: false,
        throttleScale: 0,
        rotatable: false,
        throttleRotate: 0,
        pinchable: false,
        origin: false
      }
    }
  },
  methods: {
    prompt (value) {
      if (value == "node -v") {
        this.send_to_terminal = process.versions.node
      }
      var commandArray = value.split(' ')
      console.log(commandArray, 'Terminal')
      this.$emit('frontEngine', commandArray)
    },
    dialogToggle: function () {
      this.isShow = !this.isShow
    },
    changeProp: function (prop) {
      this.moveable.scalable = false
      this.moveable.resizable = false
      this.moveable.warpable = false
      this.moveable[prop] = true
    },
    handleDrag ({ target, transform }) {
      target.style.transform = transform
    },
    handleResize ({
      target, width, height, delta
    }) {
      delta[0] && (target.style.width = `${width}px`)
      delta[1] && (target.style.height = `${height}px`)
    },
    handleScale ({ target, transform, scale }) {
      target.style.transform = transform
    },
    handleRotate ({ target, dist, transform }) {
      target.style.transform = transform
    },
    handleWarp ({ target, transform }) {
      target.style.transform = transform
    },
    handlePinch ({ target }) {
    }
  }
}
</script>
<style scoped>
.dialog {
  /* position: relative; */
  width: 480px;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  z-index: 99999;
  border-radius: 2px;
  border: 1px solid gray;
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
.moveable {
  position: absolute;
  width:100%;
}
/* .moveable terminal-header {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  white-space: nowrap;
}
.moveable v-shell {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  white-space: nowrap;
} */
</style>
