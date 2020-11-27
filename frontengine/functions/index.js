const functions = require('firebase-functions');
const admin = require('firebase-admin')
const items = 'tesutetuett';
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
admin.initializeApp(functions.config().firebase)
const db = admin.firestore()
const global = {}
exports.submitExam = functions.https.onCall((data, context) => {
  
  const getId = data.examId;
  const userId = data.userId;
  const examRef = db.collection('exams').doc(getId)
  // Initialize
  if (userId) {
    db.collection('exams').doc(getId).collection('users').doc(userId).set({output: []})
  }
  return examRef.get().then(snapsshot => {
    const doc = snapsshot
    if (!doc.exists) {
      return {status: 'WA', reason: 'none firebase data'}
    } else {
    const acData = doc.data()
    console.log('data', acData, doc.data().testCasses)
    console.log('datadata', doc.data().testCases, userId)
    let output = []
    Object.values(doc.data().examInfo.testCases || {}).forEach( value => {
      console.log('value,value', value)
      output.push(MainProcess(data.examText, value.enter, value.exit, acData.examInfo.option))
    })
    if (userId) {
      db.collection('exams').doc(getId).collection('users').doc(userId).set({output: output, inputScript: data.examText})
    }
    console.log('output', output)
    return output;
    }
  })
  });

let globalStyle = {}
let checkClear = 0
let lastOutput = []
let outputIndex = 0
function MainProcess (text, props, clear, option, fileName, event, eventIndex, init) {
  console.log('MainProcess', text, props, clear, option, fileName, event, eventIndex, init)
  let toProps = {}
  // if (init) {
  //   initGlobal()
  // }
  if (Array.isArray(props)) {
    toProps.input = props
  } else {
    // obj型
    toProps = Object.assign(toProps, props)
  }
  const fileInfo = {} // ここに単一ファイル情報を記載
  let pageName = 'default'
  if (fileName) {
    pageName = fileName
  }
  fileInfo.fileName = pageName
  const templateLength = '<template>'.length
  const scriptLength = '<script>'.length
  const styleLength = '<style scoped>'.length
  const templates = text.substr(text.indexOf('<template>') + templateLength, text.indexOf('</template>') - templateLength)
  const script = text.substr(text.indexOf('<script>') + scriptLength, text.indexOf('</script>') - scriptLength - text.indexOf('<script>'))
  const style = text.substr(text.indexOf('<style scoped>') + styleLength, text.indexOf('</style>') - styleLength - text.indexOf('<style scoped>'))
  const domTree = DomProcess(templates)
  ScriptProcess(script, toProps)
  globalStyle = styleProperty(style)
  const errors = []
  const getClear = clear
  let targetIndex = 0
  let output = { status: 'WA', reason: '' }
  const vForGlobal = {}
  const parseOutput = []
  if (props) {
    Object.keys(toProps || {}).forEach(key => {
      global[key] = toProps[key]
    })
  }
  const snapShotFileGlobalInfo = Object.assign({}, global)
  console.log('global', global, toProps, props)
  let resultOutput = [] // 文字列型の場合は、outputが見れるはず
  let tooru = true
  // let target = domTree
  const targets = []
  targets.push(domTree)
  pageAdd(pageName, templates, script, style, domTree, text, global)
  while (targets.length > 0) {
    const ifBool = true
    const getTar = targets.pop()
    const tar = Object.assign({}, getTar)
    if (tar.params) {
      // console.lo('targets!!', tar.params, tar)
    }
    tooru = false
    // -- v-for
    if (tar['v-for']) {
      const target = tar['v-for']
      if (target.type === 'variable' || target.type === 'function') {
        let data = domProperty(target.right, tar.params)
        // とりあえずdataはArray想定 本来ではObjectも考えないといけないよ
        if (Array.isArray(data)) {
          for (let i = data.length - 1; i >= 0; i--) {
            // tar.params = {}
            let nextTarget = Object.assign({}, tar)
            const params = {}
            const textParams = {}
            const keys = Object.values(target.target)
            params[keys[0]] = data[i]
            textParams[keys[0]] = String(keys[0] + '[' + i + ']')
            console.log('chh', data[i], data, target)
            if (keys.length === 2) {
              params[keys[1]] = i
              textParams[keys[1]] = i
            }
            nextTarget.paramIndex = i
            nextTarget.paramValue = data[i]
            nextTarget.params = Object.assign({}, params)
            nextTarget.textParams = Object.assign({}, params)
            // console.lo('nextTarget', nextTarget)
            delete nextTarget['v-for']
            targets.push(nextTarget)
          }
        } else if (typeof data === 'object') {
          // obj
          const keys = Object.keys(data)
          data = Object.values(data)
          for (let i = data.length - 1; i >= 0; i--) {
            // tar.params = {}
            let nextTarget = Object.assign({}, tar)
            const params = {}
            const textParams = {}
            const keys = Object.values(target.target)
            params[keys[0]] = data[i]
            console.log('chh', data[i], data)
            // textParams[key[0]] =
            if (keys.length === 2) {
              params[keys[1]] = keys[i]
            }
            nextTarget.paramIndex = keys[i]
            nextTarget.paramValue = data[i]
            nextTarget.params = Object.assign({}, params)
            // console.lo('nextTarget', nextTarget)
            delete nextTarget['v-for']
            targets.push(nextTarget)
          }
        }
        continue
      } else {
        // func
      }
    }
    // 8-- v-for
    // v-if
    if (tar['v-if']) {
      let data = !!domProperty(tar['v-if'].right, tar.params)
      if (!data) {
        continue
      }
    }
    // 8-- v-if
    parseOutput.push(tar)
    if (tar.name === 'reserveText') {
      // console.log('tarValue:none', tar)
      const output = []
      for (let reserve of Object.values(tar.reserves)) {
        const strValueStart = tar.value.substr(0, reserve.start)
        const strValueEnd = tar.value.substr(reserve.end + 1, tar.value.length)
        if (reserve.type === 'function') {
          const get = domProperty(reserve.textRawValue, tar.params)
          // とりあえずglobalのみ対応
          const args = []
          const toStr = String(get)
          output.push(toStr)
        } else if (reserve.type === 'variable') {
          const get = domProperty(reserve.textRawValue, tar.params)
          let toStr = String(get)
          // tar.value = strValueStart + toStr + strValueEnd
          output.push(toStr)
          // console.log('pppRRR', reserve, tar.value, global)
        } else if (reserve.type === 'direct') {
          output.push(reserve.text)
        }
      }
      tar.value = output.join('')
    }
    if (option && option.mode === 'answerDOM') {
      if (option.existString) {
        if (tar.answer && tar.name === 'reserveText') {
          // とりあえずexistStringなので....
          // console.log('tarValue', tar, targetIndex)
          if (typeof lastOutput[outputIndex] !== 'string') {
            lastOutput[outputIndex] = ''
          }
          lastOutput[outputIndex] = lastOutput[outputIndex] + tar.value
        } else if (tar.answer) {
          // console.log('tarValue:without', tar)
        }
        // -- lastPropagate
        // 子供に伝播
        if (tar.name === 'br') {
          outputIndex++
        }
        if (tar.open) {
          let closeObject = {}
          closeObject.open = false
          closeObject.close = true
          closeObject.name = tar.name
          closeObject.unique = tar.unique
          closeObject.depth = tar.depth
          targets.push(closeObject)
        }
        let pushChildren = tar.children || []
        for (let i = pushChildren.length - 1; i >= 0; i--) {
          const value = pushChildren[i]
          let nextObject = {}
          nextObject = Object.assign({}, value)
          if (tar.hasOwnProperty('params')) {
            nextObject.params = Object.assign({}, tar.params)
          }
          if (tar.hasOwnProperty('textParams')) {
            nextObject.textParams = Object.assign({}, tar.textParams)
          }
          if (tar.hasOwnProperty('paramIndex')) {
            nextObject.paramIndex = tar.paramIndex
          }
          if (tar.hasOwnProperty('answer')) {
            nextObject.answer = tar.answer
          }
          if (tar.name === 'answer') {
            nextObject.answer = true
            nextObject.answerIndex = i
          }
          // console.log('cheek', nextObject)
          targets.push(nextObject)
          // -- lastPrpagate
        }
      }
    }
  }
  console.log('parse', parseOutput)
  console.log('!!event!!', event)
  console.log('domTree', domTree, event, eventIndex)
  console.log('eventIndex, !!event!!', event, eventIndex)
  if (Object.keys(event).length > eventIndex) {
    const getEvent = event[eventIndex]
    let count = 0
    let openCount = 0
    const clickEvent = getEvent.click
    let Target = clickEvent.point
    if (getEvent.hasOwnProperty('click')) {
      if (!Target) {
        Target = clickEvent.component
      } else {
        Target = Target.component
      }
    }
    for (let i = 0; i < parseOutput.length; i++) {
      let target = parseOutput[i]
      console.log('!!event!!', Target, target, count, Target.depth, target.depth)
      if (target.name === Target.name && target.depth === Target.depth && !target.close) {
        count++
        console.log('!!event!!:click!!', target, Target)
        console.log('click:tansaku', count)
        if (count === Target.count) {
          count = 0
          console.log('click', count)
          if (Target.hasOwnProperty('component')) {
            console.log('seni: !!event!!', Target, Target.component)
            Target = Target.component
          } else {
            console.log('!!event!!: target', target, target.others, i, parseOutput)
            for (let k = 0; k < (target.others || []).length; k++) {
              const other = target.others[k]
              if (other.left.indexOf('click') >= 0) {
                const arrays = []
                let toGlobal = Object.assign({}, global)
                toGlobal = Object.assign(toGlobal, target.params)
                for (let p = 0; p < other.functionArgument.length; p++) {
                  arrays.push(getProperty(other.functionArgument[p], toGlobal))
                }
                const data = getScript(global[other.functionTarget], arrays, global)
                console.log('!!event!!returnMainProcess', eventIndex, init, data, global[other.functionTarget], arrays, toGlobal)
                return MainProcess(text, props, clear, option, fileName, event, eventIndex + 1, false)
              }
            }
          }
        }
      }
    }
  }
  if (option.existString) {
    let flag = true
    let noneTarget = []
    if (clear && Array.isArray(clear)) {
      for (let i = 0; i < clear.length; i++) {
        if (lastOutput[i] !== clear[i]) {
          flag = false
          noneTarget.push(i)
        }
      }
    }
    if (flag) {
      return {
        status: 'AC',
        reason: 'all Accept',
        info: checkClear,
        option: option,
        clear: clear,
        output: lastOutput,
        domTree: domTree,
        earth: earth,
        fileInfo: fileInfo
      }
    } else {
      return {
        status: 'WA',
        reason: 'noClear',
        info: checkClear,
        option: option,
        clear: clear,
        output: lastOutput,
        noneTarget: noneTarget,
        domTree: domTree,
        earth: earth,
        fileInfo: fileInfo
      }
    }
  } else {
    return {
      status: 'WA',
      reason: 'runCode',
      info: checkClear,
      option: option,
      clear: clear,
      output: lastOutput,
      domTree: domTree,
      earth: earth,
      fileInfo: fileInfo
    }
  }
}

function runVueDom (targetDomTree, option) {
  const targets = [targetDomTree]
  const parseOutput = []
  let tooru = true
  console.log('targets', targets, targetDomTree, parseOutput)
  while (targets.length > 0) {
    const ifBool = true
    const getTar = targets.pop()
    const tar = Object.assign({}, getTar)
    if (tar.params) {
      // console.lo('targets!!', tar.params, tar)
    }
    tooru = false
    // -- v-for
    if (tar['v-for']) {
      const target = tar['v-for']
      if (target.type === 'variable' || target.type === 'function') {
        let data = domProperty(target.right, tar.params)
        // とりあえずdataはArray想定 本来ではObjectも考えないといけないよ
        if (typeof data === 'string') {
          // たぶんparseする時にjoin(',')で参照渡し的にこっちもmergeされちゃってるので...
          data = data.split(',')
        }
        if (Array.isArray(data)) {
          for (let i = data.length - 1; i >= 0; i--) {
            // tar.params = {}
            let nextTarget = Object.assign({}, tar)
            const params = {}
            const parseParams = {}
            const keys = Object.values(target.target)
            params[keys[0]] = data[i]
            // parseParams[keys[0]] = data[i]
            parseParams[keys[0]] = target.right + '[' + i + ']'
            if (keys.length === 2) {
              params[keys[1]] = i
              parseParams[keys[1]] = i
            }
            console.log('parrrr', params, parseParams, keys)
            nextTarget.paramIndex = i
            nextTarget.paramValue = data[i]
            nextTarget.params = Object.assign({}, params)
            nextTarget.parseParams = Object.assign({}, parseParams)
            // console.lo('nextTarget', nextTarget)
            delete nextTarget['v-for']
            targets.push(nextTarget)
          }
        } else if (typeof data === 'object') {
          // obj
          const keys = Object.keys(data)
          data = Object.values(data)
          for (let i = data.length - 1; i >= 0; i--) {
            // tar.params = {}
            let nextTarget = Object.assign({}, tar)
            const params = {}
            const parseParams = {}
            const keys = Object.values(target.target)
            params[keys[0]] = data[i]
            parseParams[keys[0]] = target.right + '[' + i + ']'
            if (keys.length === 2) {
              params[keys[1]] = keys[i]
              parseParams[keys[1]] = keys[i]
            }
            nextTarget.paramIndex = keys[i]
            nextTarget.paramValue = data[i]
            nextTarget.params = Object.assign({}, params)
            nextTarget.parseParams = Object.assign({}, parseParams)
            // console.lo('nextTarget', nextTarget)
            delete nextTarget['v-for']
            targets.push(nextTarget)
          }
        }
        continue
      } else {
        // func
      }
    }
    // 8-- v-for
    // v-if
    if (tar['v-if']) {
      let data = !!domProperty(tar['v-if'].right, tar.params)
      if (!data) {
        continue
      }
    }
    // 8-- v-if
    parseOutput.push(tar)
    if (tar.name === 'reserveText') {
      // console.log('tarValue:none', tar)
      const output = []
      for (let reserve of Object.values(tar.reserves)) {
        const strValueStart = tar.value.substr(0, reserve.start)
        const strValueEnd = tar.value.substr(reserve.end + 1, tar.value.length)
        if (reserve.type === 'function') {
          const get = domProperty(reserve.textRawValue, tar.params)
          // とりあえずglobalのみ対応
          const args = []
          const toStr = String(get)
          output.push(toStr)
        } else if (reserve.type === 'variable') {
          const get = domProperty(reserve.textRawValue, tar.params)
          let toStr = String(get)
          // tar.value = strValueStart + toStr + strValueEnd
          output.push(toStr)
          // console.log('pppRRR', reserve, tar.value, global)
        } else if (reserve.type === 'direct') {
          output.push(reserve.text)
        }
      }
      tar.value = output.join('')
    }
    if (tar.name === 'br') {
      outputIndex++
    }
    let pushChildren = tar.children || []
    if (tar.open) {
      let closeObject = {}
      closeObject.name = tar.name
      closeObject.close = true
      closeObject.unique = tar.unique
      closeObject.open = false
      closeObject.depth = tar.depth
      targets.push(closeObject)
    }
    for (let i = pushChildren.length - 1; i >= 0; i--) {
      const value = pushChildren[i]
      let nextObject = {}
      nextObject = Object.assign({}, value)
      if (tar.hasOwnProperty('params')) {
        nextObject.params = Object.assign({}, tar.params)
      }
      if (tar.hasOwnProperty('parseParams')) {
        nextObject.parseParams = Object.assign({}, tar.parseParams)
      }
      if (tar.hasOwnProperty('paramIndex')) {
        nextObject.paramIndex = tar.paramIndex
      }
      if (tar.hasOwnProperty('answer')) {
        nextObject.answer = tar.answer
      }
      if (tar.name === 'answer') {
        nextObject.answer = true
        nextObject.answerIndex = i
      }
      // console.log('cheek', nextObject)
      targets.push(nextObject)
      // -- lastPrpagate
    }
  }

  return parseOutput
}

function moduleProcess(ast, props) {
  // console.log('ast', ast)
  global = {}
  console.log('check@@', ast.program.body[0])
  let targetBody = null
  for (let i = 0; i < ast.program.body.length; i++) {
    // とりあえずimportを無視するように
    if (ast.program.body[i].hasOwnProperty('declaration')) {
      targetBody = ast.program.body[i].declaration
    }
  }
  const firstBody = targetBody.properties
  const modules = {}
  console.log('props', props, global)
  if (props) {
    Object.keys(props || {}).forEach(key => {
      global[key] = props[key]
    })
  }
  for (const body of firstBody) {
    // console.log('body', body)
    modules[body.key.name] = body
  }
  for (const key of Object.keys(modules)) {
    switch (key) {
      case 'props':
        // mergeObject(propsProcess(modules[key]))
        break
      case 'methods':
        mergeObject(methodsProcess(modules[key]))
        break
      case 'data':
        mergeObject(dataProcess(modules[key]))
        break
      case 'computed':
        mergeObject(computedProcess(modules[key]))
        break
      case 'mounted':
        break
    }
  }
  // console.log('srhjeosije', global.text)
  // const output = execScript(global.testObject, global.text)
  // console.log('moduleOutput', global, modules)
  return modules
}
function mergeObject (obj) {
  Object.keys(obj).forEach(key => {
    global[key] = obj[key]
  })
}

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
function findBlock (text, firstIndex) {
  let cntFirst = 0
  let cntEnd = 0
  const slice = []
  for (let i = firstIndex; i < text.length; i++) {
    if (cntFirst !== 0 && cntFirst === cntEnd) {
      const str = slice.join('')
      return str
    }
    if (text.charAt(i) === '{') {
      cntFirst++
      continue
    }
    if (text.charAt(i) === '}') {
      cntEnd++
      continue
    }
    slice.push(text.charAt(i))
  }
}

 function ScriptProcess (text, props) {
  const generate = require('@babel/generator').default
  const ast = CreateAST(text)
  const module = moduleProcess(ast, props)
  // const generated = generate(ast)
  // ('interpre', myInterpreter, myInterpreter.run())
  // ('generate', generate.code(ast, { sourceType: 'module', sourceMaps: true }))
  const dataLength = 'data ()'.length
  const methodLength = 'methods:'.length
  const dataFirst = text.indexOf('data ()') + dataLength
  const methodFirst = text.indexOf('methods:') + methodLength
  const dataBlock = findBlock(text, dataFirst)
  const methodBlock = findBlock(text, methodFirst)
  return module
  // (dataBlock, methodBlock)
}

function styleProperty (style, path) {
  console.log('style:test', style)
  const output = {}
  output.class = {}
  output.id = {}
  output.tag = {}
  let target = []
  for (let i = 0; i < style.length; i++) {
    const val = style[i]
    if (val == ' ' || val == '\n' || val == '/s' || val == '↵') {
      continue
    }
    if (val === '{') {
      let targetInput = 'tag'
      switch (target[0]) {
        case '.':
          targetInput = 'class'
          target.shift()
          break
        case '#':
          targetInput = 'id'
          target.shift()
          break
      }
      let targetVal = target.join('')
      console.log('style:target', targetVal, targetInput)
      output[targetInput][targetVal] = {}
      i++
      let outputKey = []
      let value = []
      let coron = false
      for (;i < style.length; i++) {
        if (style[i] == '}') {
          // とりあえずclassの階層構造は無視
          break
        }
        if (style[i] != ';') {
          if (style[i] == ':') {
            coron = true
            continue
          }
          if (!coron) {
            if (style[i] == ' ' || style[i] == '\n' || style[i] == '/s' || style[i] == '↵') {
              continue
            }
            outputKey.push(style[i])
          } else {
            value.push(style[i])
          }
        } else {
          output[targetInput][targetVal][outputKey.join('')] = value.join('')
          outputKey = []
          value = []
          coron = false
        }
      }
      target = []
    } else {
      target.push(val)
    }
  }
  console.log('style:output', output)
  let str = path
  if (!str) {
    str = 'default'
  }
  return { [str]: output }
}
function DomProcess(text) {
  const tags = []
  const tagCount = {} // そのタグが開かれている時true
  const domTree = {}
  const depths = {}
  // let hierarchy = 0
  // const err = []
  let unique = 0 // 各々のタグにuniqueIdを付与する
  let parentId = null
  let depth = 0
  for (let i = 0; i < text.length; i++) {
    const mozi = text.charAt(i)
    if (mozi === '<') {
      const slice = []
      for (; ; i++) {
        slice.push(text.charAt(i))
        if (text.charAt(i) === '>') {
          break
        }
      }
      const str = slice.join('')
      const info = DOMAnalysis(str)
      if (info.name && info.name.length > 0) {
        tags[unique] = info
        if (!unique || !info) {

        }

        if (parentId || parentId === 0) {
          tags[unique].parentId = parentId
        }
        tags[unique].unique = unique
        tags[unique].depth = depth
        if (parentId) {
          domTree[tags[unique].name] = {}
        }
        if (info.open && !info.close) {
          if (!tagCount[info.name]) {
            tagCount[info.name] = 0
          }
          tagCount[info.name]++
          depth++
          parentId = unique // 今代入したもの(++してないもの)を親とする
        }
        if (info.close) {
          tagCount[info.name]--
          tags[unique].depth--
          depth--
          if (!tags[parentId]) {
            console.error('maybe is not openTag')
            return
          }
          parentId = tags[parentId].parentId
        }
        if (!depths[tags[unique].depth]) {
          depths[tags[unique].depth] = {}
        }
        depths[tags[unique].depth][unique] = tags[unique]
        unique++
      }
    } else {
      const slice = []
      for (; ; i++) {
        slice.push(text.charAt(i))
        if (i + 1 === text.length || text.charAt(i + 1) === '<') {
          break
        }
      }
      if ((slice.join('').match(/\s/g) || []).length === slice.length) {
        continue
      }
      const preText = slice
      const texts = textAnalysis(preText)
      if (!texts) {
        continue
      }
      texts.parentId = parentId
      tags[unique] = texts
      tags[unique].unique = unique
      tags[unique].depth = depth
      tags[unique].name = 'reserveText'
      if (!depths[tags[unique].depth]) {
        depths[tags[unique].depth] = {}
      }
      depths[tags[unique].depth][unique] = tags[unique]
      unique++
    }
  }
  const tree = createDomTree(depths)

  return tree
}

function DOMAnalysis (dom) {
  //
  const info = {}
  info.open = true // 閉じられているか
  const others = []
  const candidatetag = []
  let nameLength = 0
  if (dom.substr(0, 2) === '</') {
    info.close = true
    nameLength++
  } else {
    info.close = false
  }
  const tags = []
  const candidateTags = dom.split(' ')
  for (const tag of candidateTags) {
    //
    tags.push(...tag.split('\n'))
  }

  console.log('tagssss', tags)
  // const info = {}
  if (tags.length === 1) {
    // tag一つのみ
    const tag = tags[0]
    info.name = tag.substr(1 + nameLength, tag.length - 2 - nameLength)
    if (tag.substr(tag.length - 2, 2) === '/>') {
      info.open = false
      info.name = tag.substr(1 + nameLength, tag.length - 3 - nameLength)
    }
    if (info.name === 'router-link') {
      info.routerPush = true
    }
  } else {
    info.name = tags[0].substr(1 + nameLength, tags[0].length - nameLength)
    if (info.name === 'router-link') {
      info.routerPush = true
    }
    // let blank = false
    // let blanckCount = []
    //
    const candidateOthers = []
    if (tags[tags.length - 1].substr(tags[tags.length - 1].length - 1, 1) === '>') {
      tags[tags.length - 1] = tags[tags.length - 1].split('>')[0]
      // tags.push('>')
    } else if (tags[tags.length - 1].substr(tags[tags.length - 1].length - 2, 2) === '/>') {
      tags[tags.length - 1] = tags[tags.length - 1].split('/>')[0]
      info.close = true
      // tags.push('/>')
    }
    let tagslength = tags.length
    for (let i = 1; i < tagslength; i++) {
      const tag = tags[i]
      candidateOthers.push(tag)
      if (tag.length > 0) {
        candidatetag.push(candidateOthers.length - 1)
      }
    }
    let rensei = []
    let kisu = false
    for (let i = 0; i < candidatetag.length; i++) {
      const candidateKey = candidatetag[i]
      const other = candidateOthers[candidateKey]
      if (other === '>' || other === '/>') {
        continue
      }
      const quoteLength = (other.match(/"/g) || []).length
      //
      if (kisu) {
        rensei.push(' '.repeat(candidateKey - candidatetag[i - 1]))
      }
      if (quoteLength % 2 !== 0) {
        // 貰ったのが奇数
        if (kisu) {
          kisu = false
          rensei.push(other)
          others.push(rensei.join(''))
          rensei = []
          continue
        } else {
          kisu = true
          rensei.push(other)
          continue
        }
      } else {
        // 貰ったのが偶数
        if (kisu) {
          rensei.push(other)
          continue
        } else {
          others.push(other)
          continue
        }
      }
    }
    const lastTag = tags[tags.length - 1]
    if (lastTag.substr(lastTag.length - 2, 2) === '/>') {
      // />
      info.open = false
      if (lastTag.substr(0, lastTag.length - 2).length > 0) {
        others.push(lastTag.substr(0, lastTag.length - 2))
      }
    } else {
      if (lastTag.substr(0, lastTag.length - 1).length > 0) {
        others.push(lastTag.substr(0, lastTag.length - 1))
      }
      // >
    }
  }
  info.others = []
  //
  for (const other of others) {
    const otherInfo = otherAnalysis(other)
    info.others.push(otherInfo)
    if (otherInfo.hasOwnProperty('id')) {
      info.id = otherInfo.id
    }
    if (otherInfo.hasOwnProperty('left')) {
      if (otherInfo.left === 'v-for') {
        info['v-for'] = otherInfo
      }
      if (otherInfo.left === 'v-if') {
        info['v-if'] = otherInfo
      }
      if (otherInfo.left === 'class') {
        info.class = otherInfo
        info.class.variables = []
        const candidateClassVariables = otherInfo.right.split(' ')
        for (let i = 0; i < candidateClassVariables.length; i++) {
          const variab = candidateClassVariables[i]
          if (variab.length === 0) {
            continue
          }
          info.class.variables.push(variab)
        }
      }
    }
    if (otherInfo.hasOwnProperty('key')) {
      info.key = otherInfo
    }
  }
  //
  console.log('info', info)
  return info
}

function otherAnalysis (other) {
  /*
    directive: true or false
    type: 'function' or variable
    variableType:
    functionArgument:
  */
  const target = {}
  target.left = ''
  const otherSplit = other.split('"')
  if (otherSplit.length > 1) {
    target.left = otherSplit[0].split('=')[0]
    target.right = otherSplit[1]
    if (target.left.indexOf(':') === 0) {
      target.directive = true
      target.left = otherSplit[0].split('=')[0].split(':')[1]
    } else {
      target.directive = false
    }
    if (target.left === 'v-if') {
      target.directive = true
    }
    if (target.left === 'v-for') {
      target.directive = true
      let splitTarget = target.right.split(' of ')
      if (splitTarget.length === 1) {
        splitTarget = target.right.split(' in ')
      }
      target.target = {}

      target.right = splitTarget[1]
      if (splitTarget[0].indexOf('(') >= 0 && splitTarget[0].indexOf(')') >= 0) {
        const catchCandidate = []
        let candidate = []
        const catchTargets = splitTarget[0].substr(1, splitTarget[0].length - 2).split(',')

        for (const tarKey of catchTargets) {
          tarKey.split('').forEach(mozi => {
            if (mozi !== ' ' && mozi !== '/n') {
              candidate.push(mozi)
            }
          })
          catchCandidate.push(candidate.join(''))
          candidate = []
        }
        target.target.value = catchCandidate[0]
        target.target.index = catchCandidate[1]
      } else {
        target.target.value = splitTarget[0]
      }
      target.right = splitTarget[1]
      //
    }
    if (target.right.indexOf('(') > 0 && target.right.indexOf(')') > 0) {
      // function
      target.type = 'function'
      // target.right = otherSplit[1].split('(')[0]
      const argument = target.right.split('(')[1].substr(0, target.right.split('(')[1].length - 1)
      //
      target.functionTarget = target.right.split('(')[0]
      target.functionArgument = argument.split(',')
    } else {
      // variable
      target.type = 'variable'
      if (((target.right.match(/'/g) || []).length >= 2 || !target.directive)) {
        target.variableType = 'String'
      } else if ((target.right.match(/\[/g) || []).length >= 1 && (target.right.match(/\]/g) || []).length >= 1) {
        target.variableType = 'Array'
      } else if ((target.right.match(/\{/g) || []).length >= 1 && (target.right.match(/\}/g) || []).length >= 1) {
        target.variableType = 'Object'
      } else if ((target.right.match(/[0-9]/g) || []).length === target.right.length) {
        target.variableType = 'Integer'
        target.right = Number(target.right)
      } else if (target.right === 'true' || target.right === 'false') {
        target.variableType = 'boolean'
        if (target.right === 'true') {
          target.right = true
        } else {
          target.right = false
        }
      } else {
        //
        target.variableType = 'global'
      }
    }
  } else {
    // length == 1
    target.left = otherSplit[0].split('\n')[0]
    target.right = true
    target.type = 'variable'
    target.variableType = 'bool'
  }

  return target
}

function createDomTree (depths) {
  const length = Object.keys(depths).length - 1
  for (let i = length; i > 0; i--) {
    for (const seed of Object.values(depths[i])) {
      if (!seed.close && seed.parentId >= 0) {
        if (!depths[i - 1][seed.parentId].children) {
          depths[i - 1][seed.parentId].children = []
        }
        // if (!depths[i - 1][seed.parentId].children[seed.name]) {
        //   depths[i - 1][seed.parentId].children[seed.name] = []
        // }
        depths[i - 1][seed.parentId].children.push(seed)
      } else {
      }
    }
  }
  for (const seed of Object.values(depths[0])) {
    if (!seed.close) {
      return seed
    }
  }
}
function textAnalysis (text) {
  // 配列で受け取る?
  const output = {}
  output.value = text.join('')
  output.reserves = []
  let targetText = ''
  for (let i = 0; i < text.length; i++) {
    targetText = text[i]
    //
    if (targetText === '{' && text[i + 1] === '{') {
      // {{ <- これ
      // ホントは正規表現でいい感じにしたいね...
      const target = {}
      target.start = i
      const targetTexts = []
      i += 2
      for (; ; i++) {
        targetText = text[i]
        if (targetText === '/s' || targetText === ' ') {
          continue
        }
        if (targetText === '}' && text[i + 1] === '}') {
          target.end = i + 1
          break
        }
        targetTexts.push(targetText)
      }
      i += 1
      const targetCheck = targetTexts.join('')
      target.text = targetCheck
      target.textRawValue = targetCheck
      if (targetTexts.indexOf('(') > 0 && targetTexts.indexOf(')') > 0) {
        // function
        target.type = 'function'
        target.text = targetCheck.split('(')[0]
        const argument = targetCheck.split('(')[1].substr(0, targetCheck.split('(')[1].length - 1)
        //
        target.functionArgument = argument.split(',')
      } else {
        // variable
        target.type = 'variable'
        target.variableType = 'global'
      }
      output.reserves.push(target)
    } else if (targetText !== '{') {
      // {{}} でかこまれてないやつ
      // console.lo('aaaa', targetText, text.length)
      const target = {}
      target.start = i
      const targetTexts = []
      for (;i < text.length; i++) {
        targetText = text[i]
        if (targetText === '{' && text[i + 1] === '{') {
          target.end = i - 1
          i--
          break
        }
        targetTexts.push(targetText)
      }
      const targetCheck = targetTexts.join('')
      target.text = targetCheck
      target.textRawValue = targetCheck
      target.type = 'direct'
      target.variableType = 'string'
      output.reserves.push(target)
    }
  }
  return output
}

function CreateAST(script) {
  // var esprima = require('esprima')
  const code = 'console.log("Hello, World!")'
  // console.log('script', script)
  const { parse } = require('@babel/parser')
  const ast = parse(script, { sourceType: 'module' })
  // console.log('ast', JSON.stringify(ast, null, 2))
  return ast
}

// データの代入を支援するfunction {name: value}の形で返される
// checkPropertyのreserveしてるname
const reserveName = 'reserveNameName'
function CheckProperty (body, local, option) {
  // name,valueは予約されている??
  // output {name: name, value: value}
  const output = {}
  if (body && body.key && body.key.name) {
    output[reserveName] = body.key.name
  }
  let bodyType = body.value && body.value.type ? body.value.type : body.type
  let bodyValue = body.value || body
  if (bodyType === 'ArrayExpression') {
    output.value = []
    const targetElement = bodyValue.elements || body.elements
    for (const element of targetElement) {
      const get = getProperty(element, local)
      // console.log('arrayGet', get, element, local)
      output.value.push(get)
    }
  } else if (bodyType === 'ObjectExpression') {
    for (const property of bodyValue.properties) {
      const get = getProperty(property.value, local)
      const key = getProperty(property.key, local)
      console.log('get:objectExpression', get, key, bodyValue)
      output[key] = get
      // for (const key of Object.keys(get || {})) {
      //   if (key !== 'noneDataEDEKQWLDCOLASXMW') {
      //     output[key] = get[key]
      //   }
      // }
    }
    if (bodyValue.properties.length === 0) {
      output.value = {}
    }
  } else if (bodyType === 'CallExpression') {
    let argument = []
    if (bodyValue.hasOwnProperty('arguments')) {
      argument = bodyValue.argument
    }
    let target = bodyValue
    let couho = []
    while (true) {
      const flag = false

      if (!flag) {
        break
      }
    }
  } else if (bodyType === 'BooleanLiteral') {
    // true or false
    output.value = body.value
  } else if (bodyType === 'ThisExpression') {
    output.value = global
  } else {
    // 配列でもオブジェクトでもない型
    if (body.value && body.value.extra) {
      output.value = body.value.extra.rawValue
    } else if (body.extra) {
      output.value = body.extra.rawValue
    } else {

    }
  }
  let out
  if (output.hasOwnProperty('value')) {
    out = output.value
  } else {
    // noneDataEDEKQWLDCOLASXMW はdataがない時のやつ
    out = {}
  }
  for (const key of Object.keys(output || {})) {
    if (key === 'd') {
    }
    if (key !== [reserveName] && key !== 'value' && key !== 'noneDataEDEKQWLDCOLASXMW') {
      out[key] = output[key]
    }
  }

  if (output[reserveName]) {
    return { [output[reserveName] || [reserveName]]: out }
  } else {
    return { name: out }
  }
}

function getProperty (body, local, funcArguments) {
  if (!body) {
    console.error('maybe body is null or undifiend?', body, local)
    return false
  }
  console.log('getts', body, local)
  const key = Object.keys(body || {})[0]
  if (body && body.type === 'ThisExpression') {
    return global
  } else if (body.type && body.type === 'Identifier' && body.name) {
    // console.log('first:maybe', body, local, !!local[body.name])
    if (local && local.hasOwnProperty(body.name)) {
      if (local[body.name] && local[body.name].hasOwnProperty('func') && local[body.name].computed) {
        return getScript(local[body.name], [], local)
      }
      return local[body.name]
    } else {
      // maybe javascript default item
      switch (body.name) {
        case 'Object':
          return Object
        case 'Array':
          return Array
        case 'Number':
          return Number
        case 'String':
          return String
        case 'Boolean':
          return Boolean
      }
      return body.name
    }
  } else if (body.type && body.type === 'MemberExpression' && body.object) {
    if (body.name) {
      return getProperty(body.object, local)[body.name]
    } else if (body.property) {
      const outputData = getProperty(body.object, local)
      console.log('outputData', outputData, body)
      if (!outputData) {
        return outputData
      }
      // // console.log('join?', body, outputData, body.property.name, outputData[body.property.name](''), funcArguments)
      // // console.log('join', outputData[body.property.name](...funcArguments), !!funcArguments)
      // const testGlobal = Object.assign({}, global)
      if (!!funcArguments && outputData && outputData[body.property.name]) {
        return outputData[body.property.name](...funcArguments)
      } else if (body.property.name) {
        // console.log('bodymemberrr', outputData[body.property.name], outputData, body.property.name)
        if (!outputData.hasOwnProperty(body.property.name)) {
          return outputData[getProperty(body.property, local)]
        } else {
          return outputData[body.property.name]
        }
      } else if (body.property.extra) {
        if (outputData) {
          const index = getProperty(body.property, local)
          return outputData[index]
        }
      }
    }
    return getProperty(body.object, local)
  } else if (body.type === 'CallExpression') {
    let propertyArguments = []
    if (body.arguments) {
      for (let param of body.arguments) {
        if (param.type === 'FunctionExpression') {
          console.error('sorry!! argument dont use function!!')
          return false
        } else {
          propertyArguments.push(getProperty(param, local))
        }
      }
      if (body.callee) {
        // console.log('callee', propertyArguments, local, body)
        const outputData = getProperty(body.callee, local, propertyArguments)
        if (!outputData) {
          return outputData
        }
        if (outputData && outputData.type === 'FunctionExpression') {
          // この処理は少しおかしい気がするぞ...
          return getProperty(outputData, local, propertyArguments)
        } else if (outputData.computed) {
          return getScript(outputData, [], local)
        }
        return outputData
      }
    }
  } else if (body.type === 'FunctionExpression') {
    console.log('functionExpress', body, funcArguments, local)
    return getScript(body, funcArguments, local)
  } else if (body.type === 'BlockStatement' && body.computed) {
    // console.log('computed', body)
    return getScript(body, [], local)
  } else if (body.type === 'ObjectProperty') {
    const lustGet = getProperty(body.value, local, funcArguments)
    console.log('body:data::', lustGet, body)
    return lustGet
  } else {
    let data = CheckProperty(body, local)
    let key = 'key'
    if (typeof data === 'object') {
      key = Object.keys(data || {})[0]
    }
    return data[key]
  }
}


function styleCheckProcess (template, imports) {
  // const getDDD = domPreviewParse(this.dom, 'default')
  console.log('outputdom', this.dom, this.outputDom)
  const getDDD = template
  const self = this
  const domEvent = this.domEvent
  const classEvent = this.classEvent
  const testSumple = getDDD
  let newPreviewDom = Vue.component('newPreviewDom', {
    template: getDDD,
    methods: {
      domEvent: domEvent,
      classEvent: classEvent
    },
    components: {
      ...imports
    },
    style: {
      size: {
        width: '500px',
        position: 'absolute'
      }
    }
  })
  let vm = new Vue({
    Answer,
    render: h => h(newPreviewDom)
  })
  // this.pushPreview = newPreviewDom
  const targetDomChange = document.getElementById(this.uniqueKey).children[0]
  vm.$mount(targetDomChange)
  console.log('vueStatus', vm.$el, vm)
}

function domEvent (order, path, userAction, ...arg) {
  // domのfunction系を一旦ここに噛ませる
  // orderはfunction名
  // pathはcomponentファイル名
  console.log('orderPPP', order, path, userAction, arg, global)
  let toParam = Object.assign({}, global)
  arg.forEach(x => {
    toParam = Object.assign(toParam, x)
  })
  const domPro = domProperty(order, toParam)
  if (userAction) {
    console.log('userAction!', toParam, order)
    this.outputDom = domPreviewParse(saveDomTree, path)
    this.previewParse()
  }
  console.log('domproprety', domPro, global, order, arg)
  return domPro
}
function classEvent (path, ...orders) {
  // class名を受け取る
  let outputObj = {}
  orders.forEach(key => {
    outputObj = Object.assign(outputObj, globalStyle[path].class[key])
  })
  console.log('class', path, orders, globalStyle, outputObj)
  return outputObj
}

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

function propsProcess(body) {
  const output = {}
  console.log('take', body)
  if (body.value.type === 'ObjectExpression') {
    // オブジェクト??
    for (const take of body.value.properties) {
      if (take.value.type === 'Identifier') {
        // 変数: type型
        output[take.key.name] = {}
        output[take.key.name].name = take.key.name
        output[take.key.name].type = take.value.name
      } else {
        // 変数: {}
        output[take.key.name] = {}
        output[take.key.name].name = take.key.name
        for (const property of take.value.properties) {
          if (property.value.type === 'Identifier') {
            output[take.key.name][property.key.name] = property.value.name
            continue
          }
          if (property.value.type === 'StringLiteral') {
            output[take.key.name][property.key.name] = property.value.value
          }
        }
      }
    }
  } else if (body.value.type === 'ArrayExpression') {
    // 配列??
    for (const take of body.value.elements) {
      if (take.value.type === 'Identifier') {
        // 変数: type型
        output[take.key.name] = {}
        output[take.key.name].name = take.key.name
      }
    }
  }
  return output
}
function methodsProcess(body) {
  const output = {}
  for (const property of body.value.properties) {
    output[property.key.name] = property.value
    if (output[property.key.name]) {
      output[property.key.name].func = true
    }
  }
  return output
}

function getScript (body, array, preLocal) {
  return execScript(body, array, preLocal).returnArguments
}
function execScript (body, array, preLocal) {
  // name,valueは予約されている??
  // output {name: name, value: value}
  let local = {}
  if (preLocal) {
    // console.lo('local', local, preLocal)
    local = Object.assign(local, preLocal)
  }
  const localInfo = {}
  const error = []
  let access = body
  // 引数をとる
  if (array && body.params) {
    for (let i = 0; i < body.params.length; i++) {
      local[body.params[i].name] = array[i]
    }
  }
  // console.lo('array', array, local)
  for (let key of Object.keys(local || {})) {
    // console.lo('output', local[key])
  }
  //
  //
  // 実際に読み込む
  //
  // console.lo('body', body)
  if (body.body && body.body.type === 'BlockStatement') {
    access = body.body
  }
  if (access.hasOwnProperty('consequent')) {
    if (!access.body) {
      access.body = []
    }
    access.body.push(...access.consequent)
  }
  const rowParams = Object.keys(body.params || {}).length
  const row = Object.keys(access.body || {}).length
  for (let i = 0; i < row; i++) {
    //
    if (!access || !access.body[i] || !access.body[i].type) {
      continue
    }

    switch (access.body[i].type) {
      // 宣言
      case 'VariableDeclaration':
        //
        if (!access.body[i].declarations) {
          continue
        }

        for (const decalate of Object.values(access.body[i].declarations || {})) {
          if (local[decalate.id.name]) {
            error.push(decalate)
            continue
          }
          local[decalate.id.name] = decalate.init ? calculation(decalate.init, local) : null
          localInfo[decalate.id.name] = decalate.kind
        }
        break
      case 'ExpressionStatement':
        // console.lo('argument', access.body[i])
        if (access.body[i].expression && access.body[i].expression.type === 'CallExpression') {
          const target = access.body[i].expression.callee
          if (target.object && target.object.type === 'ThisExpression') {
            execScript(global[target.property.name], access.body[i].expression.arguments)
          } else {
            const args = []
            const getRawArgs = access.body[i].expression.arguments
            for (let i = 0; i < getRawArgs.length; i++) {
              args.push(getProperty(getRawArgs[i], local))
            }
            getProperty(target, local, args)
            // console.log('getter', getter, args)
          }
        } else if (access.body[i].expression && access.body[i].expression.type === 'AssignmentExpression') {
          // console.log('functionExpress::!!!:assign', body, array, preLocal)
          // console.lo('chhhhhh', access.body[i].expression)
          if (access.body[i].expression.left.name && local.hasOwnProperty(access.body[i].expression.left.name)) {
            local[access.body[i].expression.left.name] = calculation(access.body[i].expression.right, local)
            // console.lo('checcer', calculation(access.body[i].expression.right, local))
          } else if (access.body[i].expression.left.property && access.body[i].expression.left.property.name) {
            global[access.body[i].expression.left.property.name] = calculation(access.body[i].expression.right, local)
          }
        } else if (access.body[i].expression && access.body[i].expression.type === 'UpdateExpression') {
          // console.lo('update:argument')
          const targetUpate = access.body[i].expression.argument
          if (targetUpate.name && local.hasOwnProperty(targetUpate.name)) {
            // console.lo('update:argument:local', calculation(targetUpate, local))
            local[targetUpate.name] = calculation(access.body[i].expression, local)
          } else if (targetUpate.name && global.hasOwnProperty(targetUpate.name)) {
            // console.lo('update:argument:glbal')
            global[targetUpate.name] = calculation(access.body[i].expression, local)
          }
        }
        break
      case 'ForStatement':

        const target = access.body[i]
        const initTarget = target.init.declarations[0]
        const initName = initTarget.id.name
        let initIndex = calculation(initTarget.init, local)
        const readyupdate = target.update
        let updateCalculation = target.update.right
        if (!target.update.right) {
          // argument?
          updateCalculation = target.update
        }
        // console.lo('update', readyupdate)
        let updateName = ''
        if (readyupdate.left) {
          updateName = readyupdate.left.name
        } else {
          // argument
          updateName = readyupdate.argument.name
        }
        // const updateName = readyupdate.left.name
        const readyBool = target.test
        // console.lo('isBool(readyBool, { ...local, [initName]: initIndex })', isBool(readyBool, { ...local, [initName]: initIndex }))
        while (isBool(readyBool, { ...local, [initName]: initIndex })) {
          let get = execScript(target.body, array, { ...local, [initName]: initIndex })
          Object.keys(get.returnLocal || {}).forEach(key => {
            if (key !== initName) {
              local[key] = get.returnLocal[key]
            }
          })
          if (get.returnOrder === 'break') {
            break
          }
          // updateFunc
          if (initName === updateName) {
            initIndex = calculation(updateCalculation, { ...local, [initName]: initIndex })
            if (initIndex === false) {
              console.error('why false!?', updateCalculation, initIndex)
              break
            }
          } else {
            local[updateName] = calculation(updateCalculation, { ...local, [initName]: initIndex })
          }
        }
        break
      case 'BreakStatement':
        let output = { returnArguments: {}, returnLocal: { ...preLocal }, returnOrder: 'break' }
        Object.keys(preLocal || {}).forEach(key => {
          output.returnLocal[key] = local[key]
        })
        return output
      case 'IfStatement':
        let targetGO = access.body[i]
        let targetDo = null
        while (true) {
          if (!targetGO.hasOwnProperty('test')) {
            // else
            // -> つまりifでないものが全てとおる
            targetDo = targetGO
            break
          }
          let resultBool = isBool(targetGO.test, local)
          if (!resultBool) {
            // false
            if (targetGO.alternate) {
              targetGO = targetGO.alternate
            } else {
              break
            }
          } else {
            // true
            targetDo = targetGO.consequent
            break
          }
        }
        if (targetDo) {
          let get = execScript(targetDo, array, local)

          Object.keys(get.returnLocal || {}).forEach(key => {
            local[key] = get.returnLocal[key]
          })
        }
        break
      case 'ReturnStatement':
        const argument = access.body[i].argument
        let outputReturn = { returnArguments: {}, returnLocal: { ...preLocal }, returnOrder: 'return' }
        const returnData = getProperty(argument, local)
        outputReturn.returnArguments = returnData
        // console.lo('getter', outputReturn, argument, returnData, local)
        Object.keys(preLocal || {}).forEach(key => {
          outputReturn.returnLocal[key] = local[key]
        })
        return outputReturn
      case 'ContinueStatement':
        let ContinueOutput = { returnArguments: {}, returnLocal: { ...preLocal }, returnOrder: 'break' }
        Object.keys(preLocal || {}).forEach(key => {
          ContinueOutput.returnLocal[key] = local[key]
        })
        return ContinueOutput
      case 'SwitchStatement':
        const cases = access.body[i].cases
        const discriminant = access.body[i].discriminant
        const discriminantValue = getProperty(discriminant, local)
        for (let takeCase of cases) {
          const testValue = getProperty(takeCase.test, local)
          // console.lo('discriminantValue', discriminantValue, 'testValue', testValue)
          if (!testValue) {
            // maybeDefault
            const get = execScript(takeCase, array, local)
            // console.lo('switchGet', get)
            if (get.returnOrder === 'break') {
              break
            }
            continue
          }
          const createBool = scriptCreateAST(String(discriminantValue) + '===' + String(testValue)).expression
          const check = isBool(createBool, local)
          // console.lo('checkerr', check, createBool)
          // console.lo('checker', createBool)
          if (check) {
            // このケースに該当する
            // console.lo('bbo', createBool)
            const get = execScript(takeCase, array, local)
            // console.lo('switchGet', get)
            if (get.returnOrder === 'break') {
              break
            }
          }
        }
        break
    }
  }
  let output = { returnArguments: {}, returnLocal: { ...preLocal }, returnOrder: 'end' }
  Object.keys(preLocal || {}).forEach(key => {
    output.returnLocal[key] = local[key]
  })

  return output
}

function calculation (body, local, params, err, type) {
  if (err) {
    return 'err'
  }
  if (!local) {
    return 'err'
  }
  if (body && body.left && body.right) {
    switch (body.operator) {
      case '+':
        return calculation(body.left, local, params, err, type) + calculation(body.right, local, params, err, type)
      case '-':
        return calculation(body.left, local, params, err, type) - calculation(body.right, local, params, err, type)
      case '/':
        return calculation(body.left, local, params, err, type) / calculation(body.right, local, params, err, type)
      case '*':
        return calculation(body.left, local, params, err, type) * calculation(body.right, local, params, err, type)
      case '%':
        return calculation(body.left, local, params, err, type) % calculation(body.right, local, params, err, type)
      case '**':
        return calculation(body.left, local, params, err, type) ** calculation(body.right, local, params, err, type)
    }
  } else if (body && body.hasOwnProperty('argument')) {
    switch (body.operator) {
      case '++':
        return getProperty(body.argument, local) + 1
      case '--':
        return getProperty(body.argument, local) - 1
      case '-':
        return -getProperty(body.argument, local)
    }
  }

  return getProperty(body, local)
}

function naibuKansu (body, local) {
  if (body.object && body.property) {
    return getProperty(body.object, local)
  }
}

function isBool (body, local, params, err, type) {
  if (err) {
    return 'err'
  }
  if (!local) {
    return 'err'
  }
  if (body.operator) {
    switch (body.operator) {
      case '!':
        return !isBool(body.argument, local, params, err, type)
      case '>':
        return isBool(body.left, local, params, err, type) > isBool(body.right, local, params, err, type)
      case '>=':
        return isBool(body.left, local, params, err, type) >= isBool(body.right, local, params, err, type)
      case '<':
        return isBool(body.left, local, params, err, type) < isBool(body.right, local, params, err, type)
      case '<=':
        return isBool(body.left, local, params, err, type) <= isBool(body.right, local, params, err, type)
      case '||':
        return isBool(body.left, local, params, err, type) || isBool(body.right, local, params, err, type)
      case '===':
        return isBool(body.left, local, params, err, type) === isBool(body.right, local, params, err, type)
      case '==':
        return isBool(body.left, local, params, err, type) == isBool(body.right, local, params, err, type)
      case '|':
        return isBool(body.left, local, params, err, type) | isBool(body.right, local, params, err, type)
      case '&&':
        return isBool(body.left, local, params, err, type) && isBool(body.right, local, params, err, type)
      case '&':
        return isBool(body.left, local, params, err, type) & isBool(body.right, local, params, err, type)
      case '!==':
        return isBool(body.left, local, params, err, type) !== isBool(body.right, local, params, err, type)
      case '!=':
        return isBool(body.left, local, params, err, type) !== isBool(body.right, local, params, err, type)
    }
    return calculation(body, local, params, err, type)
  }
  return calculation(body, local, params, err, type)
}

function scriptCreateAST (script) {
  const { parse } = require('@babel/parser')
  const ast = parse(script)
  if (ast && ast.program && ast.program.body && ast.program.body[0]) {
    // 一行解析
    return ast.program.body[0]
  }
}

function domProperty (text, params) {
  const type = typeof Boolean(text)
  const script = scriptCreateAST(text + ';')
  console.log('script', script, text, params)
  const ToParams = params || {}
  const toDomScript = Object.assign(ToParams, global)
  const scriptExpression = script.expression || script
  if (script && script.expression) {
    const returnBool = isBool(script.expression, toDomScript)
    return returnBool
  } else if (script && script.value) {
    const returnBool = isBool(script.value, toDomScript)
    return returnBool
  } else {
    const returnBool = isBool(script, toDomScript)
    return returnBool
  }
  // console.lo('checcer', script)
  // console.lo('scriptDom', script, toDomScript, isBool(script.expression, toDomScript))
}

function scriptCreateAST (script) {
  const { parse } = require('@babel/parser')
  try {
    const ast = parse(script)
    console.log('sccc', ast)
    if (ast && ast.program && ast.program.body && ast.program.body[0]) {
    // 一行解析
      return ast.program.body[0]
    }
    if (ast && ast.program && ast.program.directives && ast.program.directives[0]) {
      return ast.program.directives[0]
    }
  } catch (e) {
    console.log('error', e)
    const ast = parse('const a = ' + script)
    console.log('ast', ast)
    return ast.program.body[0].declarations[0].init
  }
}

function pureDomPreviewParse (domTree, fileName) {
  console.log('getDomPreviewParse', domTree)
  const output = []
  let stack = [domTree]
  const parentParam = {}
  output.push('<div id="previewDOM">')
  while (stack.length > 0) {
    const take = stack.pop()
    const parseDom = {}
    const yoyaku = {}
    if (take.hasOwnProperty('class')) {
      let targetDom = []
      targetDom.push('\'' + fileName + '\'')
      if (take.class.hasOwnProperty('variables')) {
        take.class.variables.forEach(key => {
          targetDom.push('\'' + key + '\'')
        })
      }
      parseDom['v-bind:style'] = 'classEvent(' + targetDom.join(',') + ')'
    }
    if (take.hasOwnProperty('v-for')) {
      const targetValue = []
      if (take['v-for'].target.hasOwnProperty('value')) {
        targetValue.push(take['v-for'].target.value)
        yoyaku[take['v-for'].target.value] = 'value'
      }
      if (take['v-for'].target.hasOwnProperty('index')) {
        targetValue.push(take['v-for'].target.index)
        yoyaku[take['v-for'].target.index] = 'index'
      }
      console.log('yoyaku', yoyaku)
      let targetInput = ''
      const targetDom = []
      if (take['v-for'].type) {
        targetDom.push('\'' + take['v-for'].right + '\'')
        targetDom.push('\'' + fileName + '\'')
        Object.keys(parentParam).forEach(key => {
          targetDom.push('{' + key + ': ' + key + '}')
        })
        targetInput = 'this.domEvent(' + targetDom.join(',') + ')'
      }
      // const targetOutput = '(' + targetValue.join(',') + ')' + ' of ' +
      parseDom['v-for'] = '(' + targetValue.join(',') + ') of ' + targetInput
    }
    if (take.hasOwnProperty('others')) {
      // 現状v-forとclassを分けたらいけるか...?
      for (let i = 0; i < take.others.length; i++) {
        if (take.others[i].left === 'v-for' || take.others[i].left === 'class' || take.others[i].left === 'href') {
          continue
        }
        let key = take.others[i].left
        if (take.others[i].directive) {
          key = ':' + key
        }
        let targetInput = ''
        const targetDom = []
        if (take.others[i].type) {
          console.log('otherright', take.others[i])
          let otherRight = take.others[i].right
          otherRight = otherRight.replace(/\'/g, '\\\'')
          targetDom.push('\'' + otherRight + '\'')
          targetDom.push('\'' + fileName + '\'')
          // targetDom.push(Object.keys(parentParam))
          Object.keys(parentParam).forEach(key => {
            targetDom.push('{' + key + ': ' + key + '}')
          })
          targetInput = 'domEvent(' + targetDom.join(',') + ')'
        }
        console.log('targetInput', targetInput)
        parseDom[key] = targetInput
      }
    }
    if (take.name === 'reserveText' && take.reserves) {
      const textOutput = []
      for (let i = 0; i < take.reserves.length; i++) {
        const reserveVal = take.reserves[i]
        if (reserveVal.type === 'direct') {
          textOutput.push(reserveVal.textRawValue)
        } else {
          const targetDom = []
          targetDom.push('\'' + reserveVal.textRawValue + '\'')
          targetDom.push('\'' + fileName + '\'')
          // targetDom.push(Object.keys(parentParam))
          Object.keys(parentParam).forEach(key => {
            targetDom.push('{' + key + ': ' + key + '}')
          })
          textOutput.push('{{ domEvent(' + targetDom.join(',') + ') }}')
        }
      }
      parseDom.reserveText = textOutput.join('')
    }
    // --各々の作用
    if (!parseDom.hasOwnProperty('reserveText')) {
      const pushOutput = []
      for (let i = 0; i < Object.keys(parseDom).length; i++) {
        const key = Object.keys(parseDom)[i]
        pushOutput.push(key + '="' + parseDom[key] + '"')
      }
      let endBlock = '>'
      if (!take.open && !take.enClose) {
        endBlock = '/>'
      }
      let startBlock = '<'
      if (take.enClose) {
        startBlock = '</'
      }
      if (take.closeParams && take.closeParams.length > 0) {
        take.closeParams.forEach(key => {
          delete parentParam[key]
        })
      }
      output.push(startBlock + take.name + ' ' + pushOutput.join(' ') + endBlock)
    } else {
      output.push(parseDom.reserveText)
    }
    // --parseしてpush

    if (take.open) {
      const enCloseTag = {}
      enCloseTag.name = take.name
      enCloseTag.enClose = true
      stack.push(enCloseTag)
      if (Object.keys(yoyaku).length > 0) {
        enCloseTag.closeParams = []
        Object.keys(yoyaku).forEach(key => {
          parentParam[key] = yoyaku[key]
          enCloseTag.closeParams.push(key)
        })
      }
      if (take.hasOwnProperty('children')) {
        for (let i = take.children.length - 1; i >= 0; i--) {
          const childVal = take.children[i]
          stack.push(childVal)
        }
      }
    }
    // --子供に対する作用
    // --whileEnd
  }
  console.log('output', output)
  output.push('</div>')
  return output.join('')
}
function domPreviewParse (domTree, fileName) {
  const output = []
  const parentParam = {}
  saveDomTree = domTree
  output.push('<div id="previewDOM">')
  const runVueCode = runVueDom(domTree)
  console.log('runVueCode', runVueCode)
  // ループが起きると困るので、userアクション(v-on:clickとか@clickとか)の時に最描画するようにする
  for (let i = 0; i < runVueCode.length; i++) {
    const take = runVueCode[i]
    const parseDom = {}
    const yoyaku = {}
    console.log('taker', take)
    if (take.name === 'router-link') {
      take.routerPush = true
      parseDom.routerPush = '@router'
    }
    if (take.hasOwnProperty('class')) {
      let targetDom = []
      targetDom.push('\'' + fileName + '\'')
      if (take.class.hasOwnProperty('variables')) {
        take.class.variables.forEach(key => {
          targetDom.push('\'' + key + '\'')
        })
      }
      parseDom['v-bind:style'] = 'classEvent(' + targetDom.join(',') + ')'
    }
    if (take.hasOwnProperty('others')) {
      // 現状v-forとclassを分けたらいけるか...?
      for (let i = 0; i < take.others.length; i++) {
        if (take.others[i].left === 'v-for' || take.others[i].left === 'class' || take.others[i].left === 'href') {
          continue
        }
        let key = take.others[i].left
        if (take.others[i].directive) {
          key = ':' + key
        }
        let targetInput = ''
        const targetDom = []
        if (take.others[i].type) {
          console.log('otherRight', take.others[i], take.others[i].right)
          let otherRight = take.others[i].right
          otherRight = otherRight.replace(/\'/g, '\\\'')
          targetDom.push('\'' + otherRight + '\'')
          targetDom.push('\'' + fileName + '\'')
          console.log('keey', key, key.match('click'))
          if (key.indexOf('click') >= 0) {
            targetDom.push('true')
          } else {
            targetDom.push('false')
          }
          console.log('takeer', targetDom)
          // targetDom.push(Object.keys(parentParam))
          if (take.parseParams) {
            Object.keys(take.parseParams).forEach(key => {
              let value = take.parseParams[key]
              const valueType = typeof value
              console.log('vallue', value, valueType)
              if (valueType !== 'number' && valueType !== 'boolean' && valueType !== 'object' && value && (!value.indexOf('[') > 0 && !value.indexOf(']') > 0)) {
                value = '\'' + value + '\''
              }
              if (typeof value === 'string' && value.indexOf('[') > 0) {
                value = 'parseEvent(' + '\'' + value + '\'' + ')'
              }
              if (valueType === 'object') {
                const output = []
                let stack = [...Object.keys(value)]
                // while (stack.length > 0) {
                //   const takeKey = stack.pop()
                //   output.push(takeKey + ': ')
                //   output.push(value[takeKey] + ', ')
                // }
                for (let i = 0; i < stack.length; i++) {
                  output.push(stack[i] + ': ')
                  let outVal = value[stack[i]]
                  const typeVal = typeof outVal
                  console.log('typeee', typeVal)
                  if (typeof outVal === 'string') {
                    outVal = '\'' + outVal + '\' '
                  }
                  if (i !== stack.length - 1) {
                    output.push(outVal + ', ')
                  } else {
                    output.push(outVal)
                  }
                }
                value = output.join('')
                value = '\{ ' + value + '\}'
              }
              targetDom.push('\{' + key + ': ' + value + '\}')
            })
          }
          targetInput = 'domEvent(' + targetDom.join(',') + ')'
        }
        console.log('targetInput', targetInput)
        parseDom[key] = targetInput
      }
    }
    if (take.name === 'reserveText' && take.reserves) {
      const textOutput = []
      for (let i = 0; i < take.reserves.length; i++) {
        const reserveVal = take.reserves[i]
        if (reserveVal.type === 'direct') {
          textOutput.push(reserveVal.textRawValue)
        } else {
          const targetDom = []
          targetDom.push('\'' + reserveVal.textRawValue + '\'')
          targetDom.push('\'' + fileName + '\'')
          targetDom.push('false')
          if (take.parseParams) {
            Object.keys(take.parseParams).forEach(key => {
              let value = take.parseParams[key]
              const valueType = typeof value
              console.log('targetDom:vif', valueType, value)
              if (valueType !== 'number' && valueType !== 'boolean' && valueType !== 'object' && value && (!value.indexOf('[') > 0 && !value.indexOf(']') > 0)) {
                value = '\'' + value + '\''
              }
              if (typeof value === 'string' && value.indexOf('[') > 0) {
                value = 'parseEvent(' + '\'' + value + '\'' + ')'
              }
              if (valueType === 'object') {
                const output = []
                let stack = [...Object.keys(value)]
                output.push('{ ')

                for (let i = 0; i < stack.length; i++) {
                  output.push(stack[i] + ': ')
                  let outVal = value[stack[i]]
                  const typeVal = typeof outVal
                  console.log('typeee', typeVal)
                  if (typeof outVal === 'string') {
                    outVal = '\'' + outVal + '\''
                  }
                  if (i !== stack.length - 1) {
                    output.push(outVal + ', ')
                  } else {
                    output.push(outVal)
                  }
                }
                output.push(' }')
                value = output.join('')
              }
              console.log('targetDom:v-if', key, value, take.parentParam, valueType)
              targetDom.push('\{' + key + ': ' + value + '\}')
            })
          }
          console.log('targetDom', targetDom, targetDom.join(','))
          textOutput.push('\{\{ domEvent\(' + targetDom.join(', ') + '\) \}\}')
        }
      }
      parseDom.reserveText = textOutput.join('')
    }
    // --各々の作用
    if (!parseDom.hasOwnProperty('reserveText')) {
      const pushOutput = []
      for (let i = 0; i < Object.keys(parseDom).length; i++) {
        const key = Object.keys(parseDom)[i]
        if (key === 'routerPush') {
          let toParam = {}
          if (Object.keys(parseDom).indexOf(':to') >= 0) {
            toParam = parseDom[':to']
          }
          if (Object.keys(parseDom).indexOf('to') >= 0) {
            toParam = parseDom['to']
          }
          if (Object.keys(toParam).length == 0) {
            continue
          }
          pushOutput.push('@click' + '="' + 'routerEvent(' + toParam + ')' + '"')
          continue
        }
        pushOutput.push(key + '="' + parseDom[key] + '"')
      }
      let endBlock = '>'
      if (!take.open && !take.close) {
        endBlock = '/>'
      }
      let startBlock = '<'
      if (take.close) {
        startBlock = '</'
      }
      output.push(startBlock + take.name + ' ' + pushOutput.join(' ') + endBlock)
    } else {
      output.push(parseDom.reserveText)
    }
  }
  console.log('output', output)
  output.push('</div>')
  return output.join('')
}

function dataProcess(body) {
  const output = {}
  for (const property of body.body.body[0].argument.properties) {
    const getter = getProperty(property)
    const snapGlobal = Object.assign({}, global)
    console.log('data::', property, getter, property.key.name, snapGlobal, global)
    output[property.key.name] = getter
  }
  return output
}

function computedProcess(body) {
  const output = {}
  for (const property of body.value.properties) {
    output[property.key.name] = property.body
    if (!property.body) {
      continue
    } else {

    }
    output[property.key.name].computed = true
    output[property.key.name].func = true
  }
  return output
}

