export default function (text) {
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
