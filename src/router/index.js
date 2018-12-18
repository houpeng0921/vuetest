import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login/login.vue'
import home from '../components/home/home.vue'
import users from '../components/users/users.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', redirect: {path: '/home'}},
    {path: '/login', name: 'login', component: login},
    {path: '/home',
      name: 'home',
      component: home,
      children: [
        {path: '/users', name: 'users', component: users}
      ]}

  ]
})
