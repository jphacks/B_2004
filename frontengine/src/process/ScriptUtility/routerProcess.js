import { ProjectProcess, earth } from '@/process/ProjectProcess.js'
import { getProperty } from '@/process/ScriptUtility/utility.js'
function routerProcess (text) {
  const script = text
  const routerAst = routerCreateAST(script)
  const astList = routerAst.program.body
  const router = {}
  console.log('astList', astList)
  const pages = Object.assign({}, earth.pages)
  const toPages = {} // とりあえず文字列として渡す?
  Object.keys(pages).forEach(key => {
    toPages[key] = key
  })
  toPages.Home = 'home'
  toPages.ProblemList = 'ProblemList'
  for (let i = 0; i < astList.length; i++) {
    const value = astList[i]
    console.log('value', value)
    if (value.type === 'VariableDeclaration') {
      for (let i = 0; i < value.declarations.length; i++) {
        let decVal = value.declarations[i]
        let valInit = decVal.init
        if (valInit.type === 'NewExpression') {
          // maybeargument one?
          valInit = valInit.arguments[0]
          let childRouter = {}
          console.log('valInit', valInit, value)
          for (let i = 0; i < valInit.properties.length; i++) {
            if (valInit.properties[i].key.name === valInit.properties[i].value.name && valInit.properties[i].value.type === 'Identifier') {
              // routes?
              const getRouteKey = valInit.properties[i].key.name
              childRouter = Object.assign(childRouter, getProperty(valInit.properties[i].value, toPages))
              childRouter[getRouteKey] = routerPushFunc(childRouter[getRouteKey])
              continue
            }
            childRouter[valInit.properties[i].key.name] = getProperty(valInit.properties[i].value, toPages)
          }
          console.log('router', childRouter)
        }
        const valRoute = getProperty(valInit, toPages)
        console.log('decVal.id.name', decVal.id.name, valRoute, decVal)
        router[decVal.id.name] = valRoute
        const toRouter = Object.assign({}, router)
        toPages[decVal.id.name] = toRouter
      }
    }
  }
  console.log('routerjs', routerAst, router)
}

function routerCreateAST (script) {
  const code = 'console.log("Hello, World!")'
  console.log('script', script)
  const { parse } = require('@babel/parser')
  const ast = parse(script, { sourceType: 'module' })
  return ast
}

function routerPushFunc (arg) {
  const path = {}
  const name = {}
  let pure = []
  pure = [...arg]
  for (let i = 0; i < arg.length; i++) {
    const val = arg[i]
    if (arg[i].hasOwnProperty('name')) {
      name[val.name] = val
    }
    if (arg[i].hasOwnProperty('path')) {
      path[val.path] = val
    }
  }
  return { path: path, name: name, pure: pure }
}

export { routerProcess }
