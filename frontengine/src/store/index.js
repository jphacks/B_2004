import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentId: '',
    login: false,
    user: {
    },
    exams: {},
    getExam: {}
  },
  mutations: {
    loginMutation (state, user) {
      state.login = true
      state.currentId = user.uid
      const changeUser = {}
      changeUser.uid = user.uid
      changeUser.email = user.email || 'example@email.com'
      changeUser.name = user.name || 'exampleName'
      state.user = changeUser
      console.log('checkstate', state)
    },
    logOutMutation (state) {
      state.login = false
      state.user = {}
    },
    examMutation (state, exam) {
      state.exams = { ...state.exams, [exam.id]: exam.data }
      console.log('checkstate', state)
    }
  },
  actions: {
    login ({ commit }, user) {
      commit('loginMutation', user)
    },
    logOut ({ commit }) {
      commit('logOutMutation')
    },
    fetchExams ({ commit, state }) {
      console.log('actioned')
      firebase.firestore().collection('exams').get().then(snapsshot => {
        snapsshot.forEach(doc => {
          console.log('??')
          commit('examMutation', { id: doc.id, data: doc.data() })
          return state.exams
        })
      })
    },
    setExams ({ commit }, get) {
      commit('examMutation', { id: get.id, data: get.data() })
    },
    regist ({ commit }) {
    }
  },
  getters: {
    getUserInfo: (state) => {
      if (state.login) {
        console.log('user', state.user)
        return state.user
      }
    },
    getExams: (state) => {
      return state.exams
    },
    getLogin: (state) => {
      const output = {}
      output.status = state.login
      if (state.login) {
        output.user = state.user
      }
      return output
    },
    getLoginState: (state) => {
      return state.login
    },
    getEmailState: (state) => {
      return state.user.email
    },
    getUserId: (state) => {
      return state.currentId
    }
  }
})
