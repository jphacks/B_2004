import { ProjectProcess, earth } from '@/process/ProjectProcess.js'
import { getProperty } from '@/process/ScriptUtility/utility.js'
function routerProcess (text) {
  const script = text
  const routerAst = routerCreateAST(script)
  const astList = routerAst.program.body
  const router = {}
  const pages = Object.assign({}, earth.pages)
  for (let i = 0; i < astList.length; i++) {
    const value = astList[i]
    if (value.type === 'VariableDeclaration') {
      for (let i = 0; i < value.declarations; i++) {
        const decVal = value.declarations[i]
        router[decVal.id.name] = getProperty()
      }
    }
  }
  console.log('routerjs', routerAst)
}

function routerCreateAST (script) {
  const code = 'console.log("Hello, World!")'
  console.log('script', script)
  const { parse } = require('@babel/parser')
  const ast = parse(script, { sourceType: 'module' })
  return ast
}

export { routerProcess }
