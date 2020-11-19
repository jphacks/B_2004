<template>
  <div class="terminal">
    <v-shell
      :banner = "banner"
      :shell_input = "send_to_terminal"
      :commands = "commands"
      @shell_output="prompt"
    ></v-shell>
  </div>
</template>

<script>
import Vue from "vue"
import shell from 'vue-shell'
Vue.use(shell)
export default {
  data () {
    return {
      send_to_terminal: "",
      banner: {
        header: "Vue Shell",
        subHeader: "Shell is power just enjoy 🔥",
        helpHeader: 'Enter "help" for more information.',
        emoji: {
          first: "🔅",
          second: "🔅",
          time: 750
        },
        sign: "VueShell $",
        img: {
          align: "left",
          link: "/logo.png",
          width: 100,
          height: 100
        }
      },
      commands: [
        {
          name: "info",
          get () {
            return '<p>With ❤️ By Salah Bentayeb @halasproject.</p>'
          }
        },
        {
          name: "uname",
          get () {
            return navigator.appVersion
          }
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
      this.$emit('frontEngine', commandArray)
    }
  }
}
</script>
<style scoped>
.terminal {
  width: 670px;
  align-self: center;
  border: 1px #00adb5;
}
</style>
