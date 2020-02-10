import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import login from '@/components/pages/login.vue'
import dashboard from '@/components/dashboard.vue'
import products from '@/components/pages/products.vue'
import OrderList from '@/components/pages/OrderList.vue'
import CustomerOrders from '@/components/pages/CustomerOrders.vue'
import CustomerCheckout from '@/components/pages/CustomerCheckout.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    redirect: 'login'
  },
  // {
  //   path: '/',
  //   name: 'home',
  //   component: Home,
  //   meta: { requiresAuth: true }
  // },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/admin',
    name: 'dashboard',
    component: dashboard,
    meta: { requiresAuth: true },
    children:[
      {
        path: 'products',
        name: 'products',
        component: products,
        meta: { requiresAuth: true },
      },
      {
        path: 'order-list',
        name: 'OrderList',
        component: OrderList,
        meta: { requiresAuth: true },
      },
    ]
  },
  {
    path: '/',
    name: 'dashboard',
    component: dashboard,
    children:[
      {
        path: 'customer_orders',
        name: 'CustomerOrders',
        component: CustomerOrders,        
      },
      {
        path: 'customer_checkout/:orderId',
        name: 'CustomerCheckout',
        component: CustomerCheckout,        
      },
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
