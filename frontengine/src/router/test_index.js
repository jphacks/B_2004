
const routes = [
  {
    path: '/',
    name: 'Exam5',
    component: Exam5
  },
  {
    path: '/Exam5Detail',
    name: 'Exam5Detail',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Exam5Detail // () => import(/* webpackChunkName: "about" */ '../views/ProblemList.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: baseURL,
  routes
})

export default router
