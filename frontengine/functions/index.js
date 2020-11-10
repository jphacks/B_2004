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

function MainProcess (text, props, clear, option) {
  const templateLength = '<template>'.length
  const scriptLength = '<script>'.length
  const styleLength = '<style scoped>'.length
  const templates = text.substr(text.indexOf('<template>') + templateLength, text.indexOf('</template>') - templateLength)
  const script = text.substr(text.indexOf('<script>') + scriptLength, text.indexOf('</script>') - scriptLength - text.indexOf('<script>'))
  const style = text.substr(text.indexOf('<style scoped>') + styleLength, text.indexOf('</style>') - styleLength - text.indexOf('<style scoped>'))
  // ('解析 template:', templates, 'script:', script, 'style:', style)
  // ('解析script ', script)
  const domTree = DomProcess(templates)
  const scriptRe = ScriptProcess(script)
  // const data = execScript(global.testObject, ['userId'])
  const errors = []
  if (props) {
    // Object.keys(props || {}).forEach(key => {
    //   global[key] = props[key]
    // })
    global.input = props
  }
  // const getClear = clear
  const getClear = clear
  let checkClear = 0
  let targetIndex = 0
  let output = { status: 'WA', reason: '' }
  const vForGlobal = {}
  console.log('outputtt', props, clear, option, text)
  if (option && option.mode === 'answerDOM') {
    if (option.existString) {
      let tooru = true
      // let target = domTree
      const targets = []
      targets.push(domTree)
      while (targets.length > 0) {
        const getTar = targets.shift()
        const tar = Object.assign({}, getTar)
        if (tar.params) {
        }
        tooru = false
        // -- v-for
        if (tar['v-for']) {
          const target = tar['v-for']
          if (target.type === 'variable') {
            if (target.variableType === 'global') {
              if (global.hasOwnProperty(target.right)) {
                if (global[target.right]) {
                  let data = global[target.right]
                  if (data.func) {
                    // argumentはまだ未対応><
                    data = getScript(global[target.right], [])
                  }
                  for (let i = 0; i < global[target.right].length; i++) {
                    // tar.params = {}
                    let nextTarget = Object.assign({}, tar)
                    const params = {}
                    if (target && target.target && target.target.index) {
                      params.index = i
                    } else {
                    }
                    nextTarget.paramIndex = i
                    nextTarget.paramValue = global[target.right][i]
                    params.value = global[target.right][i]
                    nextTarget.params = Object.assign({}, params)
                    delete nextTarget['v-for']
                    targets.push(nextTarget)
                  }
                  continue
                }
              } else {
                return { status: 'WA', reason: 'no!!' + target.rights + ' is not defined!!' }
              }
            } else {
              return { status: 'WA', reason: 'sorry!! no use not Global v-for' }
            }
          } else {
            // func
          }
        }
        // 8-- v-for
        console.log('ppp', tar)
        if (tar.name === 'reserveText') {
          for (let reserve of Object.values(tar.reserves)) {
            const strValueStart = tar.value.substr(0, reserve.start)
            const strValueEnd = tar.value.substr(reserve.end + 1, tar.value.length)
            if (reserve.type === 'function') {
              // とりあえずglobalのみ対応
              const args = []
              for (let argument of reserve.functionArgument) {
                if (tar && tar.params && tar.params.hasOwnProperty(argument)) {
                  args.push(tar.params[argument])
                } else if (global.hasOwnProperty(argument)) {
                  args.push(global[argument])
                }
              }
              if (!global.hasOwnProperty(reserve.text)) {
                return { status: 'WA', reason: 'funtion no' }
              }
              const getReturn = getScript(global[reserve.text], args)
              const toStr = String(getReturn)
              tar.value = strValueStart + toStr + strValueEnd
            } else if (reserve.type === 'variable') {
              // tar.value = global[reserve.text]
              console.log('ppppp', reserve)
              let toStr = String(tar.value)
              if (global.hasOwnProperty(toStr)) {
                toStr = String(global[toStr])
              }
              tar.value = strValueStart + toStr + strValueEnd
            }
          }
        }
        if (tar.answer && tar.name === 'reserveText') {
          // とりあえずexistStringなので....
          if (tar.value === clear[targetIndex]) {
            checkClear++
          } else {
            return { status: 'WA', reason: 'noneClear', target: clear[targetIndex], targetNone: tar.value }
          }
          targetIndex++
          if (clear.length === checkClear) {
            return { status: 'AC', reason: 'all Accept' }
          }
        }
        // -- lastPropagate
        let i = 0
        Object.values(tar.children || {}).forEach(array => {
          array.forEach(value => {
            let nextObject = {}
            nextObject = Object.assign({}, value)
            if (tar.hasOwnProperty('params')) {
              nextObject.params = Object.assign({}, tar.params)
            }
            if (tar.hasOwnProperty('paramIndex')) {
              nextObject.paramIndex = tar.paramIndex
            }
            if (tar.name === 'answer') {
              nextObject.answer = true
              nextObject.answerIndex = i
              i = i + 1
            }
            targets.push(nextObject)
          })
        })
        // -- lastPrpagate
      }
    }
  } else {

  }
  // CreateAST(script)
  
  return { status: 'WA', reason: 'why?runendCode', info: checkClear }
};

function DomProcess (text) {
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

  // const info = {}
  if (tags.length === 1) {
    // tag一つのみ
    const tag = tags[0]
    info.name = tag.substr(1 + nameLength, tag.length - 2 - nameLength)
    if (tag.substr(tag.length - 2, 2) === '/>') {
      info.open = false
      info.name = tag.substr(1 + nameLength, tag.length - 3 - nameLength)
    }
  } else {
    info.name = tags[0].substr(1 + nameLength, tags[0].length - nameLength)
    // let blank = false
    // let blanckCount = []
    //
    const candidateOthers = []
    for (let i = 1; i < tags.length - 1; i++) {
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
    }
    if (otherInfo.hasOwnProperty('key')) {
      info.key = otherInfo
    }
  }
  //
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
      target.right = otherSplit[1].split('(')[0]
      const argument = otherSplit[1].split('(')[1].substr(0, otherSplit[1].split('(')[1].length - 1)
      //
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
          depths[i - 1][seed.parentId].children = {}
        }
        if (!depths[i - 1][seed.parentId].children[seed.name]) {
          depths[i - 1][seed.parentId].children[seed.name] = []
        }
        depths[i - 1][seed.parentId].children[seed.name].push(seed)
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
  output.reserves = {}
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
      const targetCheck = targetTexts.join('')
      target.text = targetCheck
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
      output.reserves[target.text] = target
    }
  }
  return output
}

function moduleProcess(ast) {
  // 
  
  const firstBody = ast.program.body[0].declaration.properties
  const modules = {}
  for (const body of firstBody) {
    // 
    modules[body.key.name] = body
  }
  for (const key of Object.keys(modules)) {
    switch (key) {
      case 'props':
        mergeObject(propsProcess(modules[key]))
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
  // 
  
  // const output = execScript(global.testObject, global.text)
  
  // 
  return modules
}
function mergeObject (obj) {
  Object.keys(obj).forEach(key => {
    global[key] = obj[key]
  })
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

function ScriptProcess (text) {
  // const generate = require('@babel/generator').default
  const ast = CreateAST(text)
  const module = moduleProcess(ast)
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

function strict (text) {
  'use strict'
  eval(text)
}

function CreateAST (script) {
  // var esprima = require('esprima')
  // const code = 
  const { parse } = require('@babel/parser')
  const ast = parse(script, { sourceType: 'module' })
  // 
  return ast
  // 引数のコードをASTに変換する
  // var ast = esprima.parseModule(script)
  // 
  // 引数のコードをTokenの一覧を取得する
  // var tokens = esprima.tokenize(code)
  // 
}

function CheckProperty (body, option) {
  // name,valueは予約されている??
  // output {name: name, value: value}

  const output = {}
  if (body && body.key && body.key.name) {
    output.name = body.key.name
  }
  let bodyType = body.value && body.value.type ? body.value.type : body.type
  let bodyValue = body.value || body
  if (bodyType === 'ArrayExpression') {
    output.value = []
    const targetElement = bodyValue.elements || body.elements
    for (const element of targetElement) {
      const get = CheckProperty(element)
      output.value.push(Object.values(get || {})[0])
    }
  } else if (bodyType === 'ObjectExpression') {
    for (const property of bodyValue.properties) {
      const get = CheckProperty(property)
      
      for (const key of Object.keys(get || {})) {
        if (key !== 'noneDataEDEKQWLDCOLASXMW') {
          output[key] = get[key]
        }
      }
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
    if (key !== 'name' && key !== 'value' && key !== 'noneDataEDEKQWLDCOLASXMW') {
      out[key] = output[key]
    }
  }

  if (output.name) {
    return { [output.name || 'name']: out }
  } else {
    return { name: out }
  }
}

function getProperty (body, local, funcArguments) {
  
  if (!body) {
    console.error('maybe body is null or undifiend?', body, local)
    return false
  }
  const key = Object.keys(body || {})[0]
  if (body && body.type === 'ThisExpression') {
    return global
  } else if (body.type && body.type === 'Identifier' && body.name) {
    
    if (local.hasOwnProperty(body.name)) {
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
    }
  } else if (body.type && body.type === 'MemberExpression' && body.object) {
    
    if (body.name) {
      return getProperty(body.object, local)[body.name]
    } else if (body.property) {
      const outputData = getProperty(body.object, local)
      // 
      // 
      if (!!funcArguments) {
        return outputData[body.property.name](...funcArguments)
      } else if (body.property.name) {
        
        if (!outputData[body.property.name]) {
          return outputData[getProperty(body.property, local)]
        } else {
          return outputData[body.property.name]
        }
      } else if (body.property.extra) {
        return outputData[getProperty(body.property, local)]
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
        
        const outputData = getProperty(body.callee, local, propertyArguments)
        
        return outputData
      }
    }
  } else {
    let data = CheckProperty(body)
    let key = 'key'
    if (typeof data === 'object') {
      key = Object.keys(data || {})[0]
    }
    
    return data[key]
  }
}

function  propsProcess (body) {
  const output = {}
  
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
  if (!body) {
    return { returnArguments: {}, returnLocal: { ...preLocal }, returnOrder: 'noneBody' }
  }
  if (preLocal) {
    
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
  
  for (let key of Object.keys(local || {})) {
    
  }
  //
  //
  // 実際に読み込む
  //
  
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
        
        if (access.body[i].expression && access.body[i].expression.type === 'CallExpression') {
          const target = access.body[i].expression.callee
          if (target.object && target.object.type === 'ThisExpression') {
            execScript(global[target.property.name], access.body[i].expression.arguments)
          }
        } else if (access.body[i].expression && access.body[i].expression.type === 'AssignmentExpression') {
          
          if (access.body[i].expression.left.name && local.hasOwnProperty(access.body[i].expression.left.name)) {
            local[access.body[i].expression.left.name] = calculation(access.body[i].expression.right, local)
            
          } else if (access.body[i].expression.left.property && access.body[i].expression.left.property.name) {
            global[access.body[i].expression.left.property.name] = calculation(access.body[i].expression.right, local)
          }
        } else if (access.body[i].expression && access.body[i].expression.type === 'UpdateExpression') {
          
          const targetUpate = access.body[i].expression.argument
          if (targetUpate.name && local.hasOwnProperty(targetUpate.name)) {
            
            local[targetUpate.name] = calculation(access.body[i].expression, local)
          } else if (targetUpate.name && global.hasOwnProperty(targetUpate.name)) {
            
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
        
        let updateName = ''
        if (readyupdate.left) {
          updateName = readyupdate.left.name
        } else {
          // argument
          updateName = readyupdate.argument.name
        }
        // const updateName = readyupdate.left.name
        const readyBool = target.test
        
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
          if (!isBool(targetGO.test, local)) {
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
          
          if (!testValue) {
            // maybeDefault
            const get = execScript(takeCase, array, local)
            
            if (get.returnOrder === 'break') {
              break
            }
            continue
          }
          const createBool = scriptCreateAST(String(discriminantValue) + '===' + String(testValue)).expression
          const check = isBool(createBool, local)
          
          
          if (check) {
            // このケースに該当する
            
            const get = execScript(takeCase, array, local)
            
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

function dataProcess (body) {
  const output = {}
  for (const property of body.body.body[0].argument.properties) {
    const getter = CheckProperty(property)
    for (const key of Object.keys(getter)) {
      // O(1)
      output[key] = getter[key]
    }
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