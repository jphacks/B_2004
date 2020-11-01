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
          console.log('check err?', info, unique)
        }
        console.log('check err?::', parentId, info, unique, tags[unique])
        if (parentId || parentId === 0) {
          console.log('parentId', parentId, tags, unique)
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
          console.log('open処理', unique, tagCount, info)
        }
        if (info.close) {
          tagCount[info.name]--
          tags[unique].depth--
          depth--
          parentId = tags[parentId].parentId
          console.log('close処理', tagCount, info)
        }
        if (!depths[tags[unique].depth]) {
          depths[tags[unique].depth] = {}
        }
        depths[tags[unique].depth][unique] = tags[unique]
        unique++
      }
    }
  }
  const tree = createDomTree(depths)
  console.log('file', text, text.charAt(1), text.length, tags, tree)
}

function DOMAnalysis (dom) {
  console.log('getDom', dom)
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
    console.log('tag', tag, tag.split('\n'))
    tags.push(...tag.split('\n'))
  }
  console.log('tags', tags, candidateTags)
  // const info = {}
  if (tags.length === 1) {
    // tag一つのみ
    const tag = tags[0]
    info.name = tag.substr(1 + nameLength, tag.length - 2 - nameLength)
    if (tag.substr(tag.length - 2, 2) === '/>') {
      info.open = false
    }
  } else {
    info.name = tags[0].substr(1 + nameLength, tags[0].length - nameLength)
    // let blank = false
    // let blanckCount = []
    console.log('name:getDom', info.name, tags[0])
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
      console.log('確認', other)
      const quoteLength = (other.match(/"/g) || []).length
      // console.log('奇数', other.match(/"/g).length)
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
          console.log('奇数', quoteLength)
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
  console.log('others', others)
  for (const other of others) {
    info.others.push(otherAnalysis(other))
  }
  console.log('analysis', tags, info, dom)
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
    } else {
      target.directive = false
    }
    if (otherSplit[1].indexOf('(') > 0 && otherSplit[1].indexOf(')') > 0) {
      // function
      target.type = 'function'
      target.right = otherSplit[1].split('(')[0]
      const argument = otherSplit[1].split('(')[1].substr(0, otherSplit[1].split('(')[1].length - 1)
      console.log('arguments', argument)
      target.functionArgument = argument.split(',')
    } else {
      // variable
      target.type = 'variable'
      if ((otherSplit[1].match(/'/g) || []).length > 2 || target.left.indexOf(':') !== 0) {
        target.variableType = 'String'
      } else if ((otherSplit[1].match(/[0-9]/g) || []).length === otherSplit[1].length) {
        target.variableType = 'Integer'
      } else if (otherSplit[1] === 'true' || otherSplit[1] === 'false') {
        target.variableType = 'boolean'
      } else {
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
  console.log('target', target)
  return target
}

function createDomTree (depths) {
  const length = Object.keys(depths).length - 1
  for (let i = length; i > 0; i--) {
    for (const seed of Object.values(depths[i])) {
      if (!seed.close && seed.parentId && seed.parentId >= 0) {
        if (!depths[i - 1][seed.parentId].children) {
          depths[i - 1][seed.parentId].children = {}
        }
        depths[i - 1][seed.parentId].children[seed.name] = seed
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
