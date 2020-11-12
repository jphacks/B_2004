export default function (script) {
  const { parse } = require('@babel/parser')
  const ast = parse(script, { sourceType: 'module' })
  return ast
}
