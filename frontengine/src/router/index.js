import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import ProblemList from '@/views/ProblemList.vue'
import ProblemDetail from '@/views/ProblemDetail.vue'
import MyProfile from '@/views/MyProfile.vue'
import Entry from '@/views/Entry.vue'
import ProblemResult from '@/views/ProblemResult.vue'
import Exam5 from '@/views/Exam5.vue'
import Exam5Detail from '@/views/Exam5Detail.vue'
import createExam from '@/views/createExam.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/problemList',
    name: 'ProblemList',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: ProblemList // () => import(/* webpackChunkName: "about" */ '../views/ProblemList.vue')
  },
  {
    path: '/problemDetail/:examId',
    name: 'ProblemDetail',
    component: ProblemDetail
  },
  {
    path: '/myProfile',
    name: 'myProfile',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: MyProfile // () => import(/* webpackChunkName: "about" */ '../views/MyProfile.vue')
  },
  {
    path: '/entry',
    name: 'Entry',
    component: Entry
  },
  {
    path: '/problemResult/:examId',
    name: 'ProblemResult',
    component: ProblemResult
  },
  {
    path: '/test',
    name: 'Exam5',
    component: Exam5
  },
  {
    path: '/test/:examId',
    name: 'Exam5Detail',
    component: Exam5Detail
  },
  {
    path: '/problemCreate',
    name: 'problemCreate',
    component: createExam
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
