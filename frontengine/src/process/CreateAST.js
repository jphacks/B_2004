export default function (script) {
  // var esprima = require('esprima')
  const code = 'console.log("Hello, World!")'
  // console.log('script', script)
  const { parse } = require('@babel/parser')
  const ast = parse(script, { sourceType: 'module' })
  // console.log('ast', JSON.stringify(ast, null, 2))
  return ast
}
