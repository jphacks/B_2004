export default function (script) {
  var esprima = require('esprima')
  var code = 'console.log("Hello, World!")'
  // 引数のコードをASTに変換する
  var ast = esprima.parseModule(script)
  console.log(JSON.stringify(ast))
  // 引数のコードをTokenの一覧を取得する
  var tokens = esprima.tokenize(code)
  console.log(JSON.stringify(tokens))
}
