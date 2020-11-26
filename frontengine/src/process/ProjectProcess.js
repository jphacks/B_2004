import { routerProcess } from '@/process/ScriptUtility/routerProcess.js'
const earth = { pages: {}, targetURL: '/', baseURL: 'localhost:8080', router: {}, earchParam: {}} // プロジェクト単位
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

function pageAdd (pageName, template, script, style, pure, global) {
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
  if (global) {
    earth.pages[pageName].global = global
  }
}
export { earth, ProjectProcess, pageAdd, routerProcess, getMyPageInfo }
