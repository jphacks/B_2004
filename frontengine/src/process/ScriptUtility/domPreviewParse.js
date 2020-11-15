export { domPreviewParse }
function domPreviewParse (domTree, fileName) {
  console.log('getDomPreviewParse', domTree)
  const output = []
  let stack = [domTree]
  output.push('<div id="previewDOM">')
  while (stack.length > 0) {
    const take = stack.pop()
    const parseDom = {}
    if (take.hasOwnProperty('class')) {
      const targetDom = []
      targetDom.push('\'' + fileName + '\'')
      if (take.class.hasOwnProperty('variables')) {
        targetDom.push(...take.class.variables)
      }
      targetDom.map(x => '\'' + x + '\'')
      parseDom['v-bind:style'] = 'this.classEvent(' + targetDom.join(',') + ')'
    }
    if (take.hasOwnProperty('v-for')) {
      const targetValue = []
      if (take['v-for'].target.hasOwnProperty('value')) {
        targetValue.push(take['v-for'].target.value)
      }
      if (take['v-for'].target.hasOwnProperty('index')) {
        targetValue.push(take['v-for'].target.index)
      }
      let targetInput = ''
      const targetDom = []
      if (take['v-for'].type) {
        targetDom.push('\'' + take['v-for'].right + '\'')
        targetDom.push('\'' + fileName + '\'')
        targetInput = 'this.domEvent(' + targetDom.join(',') + ')'
      }
      // const targetOutput = '(' + targetValue.join(',') + ')' + ' of ' +
      parseDom['v-for'] = '(' + targetValue.join(',') + ') of ' + targetInput
    }
    if (take.hasOwnProperty('others')) {
      // 現状v-forとclassを分けたらいけるか...?
      for (let i = 0; i < take.others.length; i++) {
        if (take.others[i].left === 'v-for' || take.others[i].left === 'class') {
          continue
        }
        const key = take.others[i].left
        let targetInput = ''
        const targetDom = []
        if (take.others[i].type) {
          targetDom.push('\'' + take.others[i].right + '\'')
          targetDom.push('\'' + fileName + '\'')
          targetInput = 'this.domEvent(' + targetDom.join(',') + ')'
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
          targetDom.push(fileName)
          textOutput.push('{{ this.domEvent(' + targetDom.join(',') + ') }}')
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
