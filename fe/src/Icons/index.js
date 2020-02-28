// 引入 iconfont 成套图标
import './iconfont/'

// 引入 ./svg 下自定义的 svg 图标
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)