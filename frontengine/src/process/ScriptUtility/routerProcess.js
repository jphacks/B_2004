import { ProjectProcess, earth, render } from '@/process/ProjectProcess.js'
import { getProperty } from '@/process/ScriptUtility/utility.js'
import { assign } from 'core-js/fn/object'
let outputRouterString = []
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
  toPages.Home = 'Home'
  toPages.ProblemList = 'ProblemList'
  toPages.baseURL = earth.baseURL
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
          console.log('router', childRouter, decVal.id.name)
          router[decVal.id.name] = childRouter
          continue
        }
        const valRoute = getProperty(valInit, toPages)
        console.log('decVal.id.name', decVal.id.name, valRoute, decVal)
        router[decVal.id.name] = valRoute
        const toRouter = Object.assign({}, router)
        toPages[decVal.id.name] = toRouter
      }
    } else if (value.type === 'ExportDefaultDeclaration') {
      earth[value.declaration.name] = router[value.declaration.name]
      if (value.declaration.name === 'router') {
        // routerの時に特殊な処理
        const routerVal = router.router
        if (routerVal.routes && routerVal.routes.component) {
          for (let i = 0; i < Object.keys(routerVal.routes.component).length; i++) {
            const key = Object.keys(routerVal.routes.component)[i]
            if (earth.pages[key]) {
              const endpoint = routerVal.routes.component[key].path
              earth.pages[key].endpoint = endpoint
              earth.pages[key].url = routerVal.base + endpoint
              render()
            }
          }
        }
        outputRouterString = outputRouterInfo()
      }
    }
  }
  console.log('routerjs', routerAst, router, earth)
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
  const component = {}
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
    if (arg[i].hasOwnProperty('component')) {
      component[val.component] = val
    }
  }
  return { path: path, name: name, component: component, pure: pure }
}

function outputRouterInfo () {
  // 画面上に出力させたい用
  const routes = []
  if (earth && earth.router && earth.router.routes) {
    routes.push(...earth.router.routes.pure)
  }
  const outputStr = []
  for (let i = 0; i < routes.length; i++) {
    Object.keys(routes[i]).forEach(key => {
      outputStr.push(key + ': ' + routes[i][key])
    })
    outputStr.push('---------')
  }
  console.log('outputStr', outputStr)
  return outputStr
}

export { routerProcess, outputRouterString }
