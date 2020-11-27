import { routerProcess } from '@/process/ScriptUtility/routerProcess.js'
let earth = { pages: {}, targetURL: '/', baseURL: 'localhost:8080', router: {}, earchParam: {}, designChecker: {} } // プロジェクト単位
// pagesにはそのページの{pageName: {template: template, script: global, style: style}}
function ProjectProcess () {
  // init
  earth = { pages: {}, targetURL: '/', baseURL: 'localhost:8080', router: {}, earchParam: {}, designChecker: {} }
}
function render () {
  const nextEarth = Object.assign({}, earth)
  earth = nextEarth
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
function getMyPageInfo (pageName) {
  console.log('pagename', pageName)
  if (earth.pages[pageName]) {
    return earth.pages[pageName]
  } else {
    console.log('errNotPage', pageName, earth)
  }
}
function CheckDesign (pageName) {

}
function CheckClearDesign () {

}
function pageAdd (pageName, template, script, style, domTree, pure, global) {
  earth.pages[pageName] = {}
  if (template) {
    earth.pages[pageName].template = template
  }
  if (script) {
    earth.pages[pageName].script = script
  }
  if (style) {
    earth.pages[pageName].style = style
  }
  if (pure) {
    earth.pages[pageName].pure = pure
  }
  if (domTree) {
    earth.pages[pageName].domTree = domTree
  }
  if (global) {
    earth.pages[pageName].global = global
  }
  earth.pages[pageName].pageName = pageName
  if (!earth.pages[pageName].hasOwnProperty('url')) {
    earth.pages[pageName].url = ''
  }
  console.log('done:PageAdd!!', earth)
}
export { earth, ProjectProcess, pageAdd, routerProcess, getMyPageInfo, CheckDesign, CheckClearDesign, outputRouterInfo, render }
