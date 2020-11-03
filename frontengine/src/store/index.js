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
    exams: {}
  },
  mutations: {
    loginMutation (state, loginInfo) {
      state.user = user
      console.log('checkstate',state)
    },
    examMutation (state, exam) {
      state.exams[exam.id] = exam.data
      console.log('checkstate', state)
    }
  },
  actions: {
    login ({ commit }) {
      console.log('loginActioneed')
      commit('loginMutation',state.user = user)
    },
    fetchExams ({ commit }) {
      console.log('actioned')
      firebase.firestore().collection('exams').get().then(snapsshot => {
        snapsshot.forEach(doc => {
          console.log('??')
          commit('examMutation', { id: doc.id, data: doc.data() })
        })
      })
    },
    regist ({ commit }) {
    }
  },
  getters: {
    getUserInfo: (state) => {
      if (state.login) {
        console.log('user',state.user)
        return state.user
      }
    },
    getExams: (state) => {
      console.log('exams', state.exams)
      return state.exams
    }
  }
})
