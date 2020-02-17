import Vue from 'vue'
import SvgIcon from '@comp/SvgIcon'// svg组件

// 引入 iconfont 成套图标
import './iconfont/';

// register globally
Vue.component('svg-icon', SvgIcon)

// 引入 ./svg 下自定义的 svg 图标
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)