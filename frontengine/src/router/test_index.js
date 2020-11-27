
const routes = [
  {
    path: '/',
    name: 'Exam5',
    component: Exam5
  },
  {
    path: '/Exam5Detail',
    name: 'Exam5Detail',
    component: Exam5Detail
  }
]

const router = new VueRouter({
  mode: 'history',
  base: baseURL,
  routes
})

export default router
