export default function (script) {
  // var esprima = require('esprima')
  const code = 'console.log("Hello, World!")'
  // console.log('script', script)
  const { parse } = require('@babel/parser')
  const ast = parse(script, { sourceType: 'module' })
  // console.log('ast', JSON.stringify(ast, null, 2))
  return ast
  // 引数のコードをASTに変換する
  // var ast = esprima.parseModule(script)
  // console.log(JSON.stringify(ast))
  // 引数のコードをTokenの一覧を取得する
  // var tokens = esprima.tokenize(code)
  // console.log(JSON.stringify(tokens))
}
