import { jsx, jsxDEV } from './jsx'

export default {
  version: '0.0.1',
  createElement: __DEV__ ? jsxDEV : jsx,
}
