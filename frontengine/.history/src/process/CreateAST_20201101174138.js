export default function (script) {
    var esprima = require('esprima')
    var code = 'console.log("Hello, World!")'
    var ast = esprima.parse(code)
    console.log(ast)
    return 
}
