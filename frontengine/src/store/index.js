import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentId: [],
    login: false,
    user: {
    },
    exams: {},
    getExam: {}
  },
  mutations: {
    loginMutation (state, loginInfo) {
    },
    examMutation (state, exam) {
      state.exams = { ...state.exams, [exam.id]: exam.data }
      console.log('checkstate', state)
    }
  },
  actions: {
    login ({ commit }) {
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
        return state.user
      }
    },
    getExams: (state) => {
      if (Object.keys(state.exams).length === 0) {
        return state.exams
      }
    },
    getActionAndExams: (state) => {
    }
  }
})
