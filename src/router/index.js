import Vue from 'vue'
import Router from 'vue-router'
import SvgJelly from '@/components/SvgJelly'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
			name: 'SvgJelly',
			component: SvgJelly
    }
  ]
})
