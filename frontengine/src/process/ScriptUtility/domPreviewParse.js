import { global } from '../moduleProcess.js'
import { runVueDom } from '../MainProcess.js'
let saveDomTree = {}
export { pureDomPreviewParse, domPreviewParse, saveDomTree }
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
  output.push('</div>')
  return output.join('')
}
function domPreviewParse (domTree, fileName) {
  const output = []
  const parentParam = {}
  saveDomTree = domTree
  output.push('<div id="previewDOM">')
  const runVueCode = runVueDom(domTree)
  // ループが起きると困るので、userアクション(v-on:clickとか@clickとか)の時に最描画するようにする
  for (let i = 0; i < runVueCode.length; i++) {
    const take = runVueCode[i]
    const parseDom = {}
    const yoyaku = {}
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
          let otherRight = take.others[i].right
          otherRight = otherRight.replace(/\'/g, '\\\'')
          targetDom.push('\'' + otherRight + '\'')
          targetDom.push('\'' + fileName + '\'')
          if (key.indexOf('click') >= 0) {
            targetDom.push('true')
          } else {
            targetDom.push('false')
          }
          // targetDom.push(Object.keys(parentParam))
          if (take.parseParams) {
            Object.keys(take.parseParams).forEach(key => {
              let value = take.parseParams[key]
              const valueType = typeof value
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
              targetDom.push('\{' + key + ': ' + value + '\}')
            })
          }
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
