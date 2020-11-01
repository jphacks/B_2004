var esprima = require('esprima')
export default function (script) {
var code = 'console.log("Hello, World!")'
var ast = esprima.parse(code)
console.log(ast)
}