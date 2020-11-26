
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
  }
]

const router = new VueRouter({
  mode: 'history',
  base: baseURL,
  routes
})

export default router
