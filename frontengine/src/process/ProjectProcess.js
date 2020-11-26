import { routerProcess } from '@/process/ScriptUtility/routerProcess.js'
const earth = { pages: {}, targetURL: '/', baseURL: 'localhost:8080', router: {} } // プロジェクト単位
// pagesにはそのページの{pageName: {template: template, script: global, style: style}}
function ProjectProcess () {
}

function pageAdd (pageName, template, script, style, pure) {
  earth[pageName] = {}
  if (template) {
    earth[pageName].template = template
  }
  if (script) {
    earth[pageName].script = script
  }
  if (style) {
    earth[pageName].style = style
  }
  if (pure) {
    earth[pageName].pure = pure
  }
}
export { earth, ProjectProcess, pageAdd, routerProcess }
