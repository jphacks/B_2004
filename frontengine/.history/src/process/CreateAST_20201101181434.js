export default function (script) {
  var esprima = require('esprima')
  var code = 'console.log("Hello, World!")'
  var ast = esprima.parse(code)
  var ast2 = esprima.parse(script)
  console.log(ast)
  console.log(ast2)
}
