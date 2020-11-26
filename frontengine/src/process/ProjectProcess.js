import { routerProcess } from '@/process/ScriptUtility/routerProcess.js'
const earth = { pages: {}, targetURL: '/', baseURL: 'localhost:8080', router: {}, earchParam: {} } // プロジェクト単位
// pagesにはそのページの{pageName: {template: template, script: global, style: style}}
function ProjectProcess () {

}

function getMyPageInfo (pageName) {
  console.log('pagename', pageName)
  if (earth.pages[pageName]) {
    return earth.pages[pageName]
  } else {
    console.log('errNotPage', pageName, earth)
  }
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
  console.log('done:PageAdd!!', earth)
}
export { earth, ProjectProcess, pageAdd, routerProcess, getMyPageInfo }
