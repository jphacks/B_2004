export default function (text) {
  const tags = []
  const tagCount = {} // そのタグが開かれている時true
  // let hierarchy = 0
  // const err = []
  let unique = 0 // 各々のタグにuniqueIdを付与する
  let parentId = null
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
        unique++
        if (parentId && tags && tags[unique]) {
          console.log('parentId', parentId, tags, unique)
          tags[unique].parentId = parentId
        }
        if (info.open) {
          if (!tagCount[info.name]) {
            tagCount[info.name] = 0
          }
          tagCount[info.name]++
          parentId = unique - 1 // 今代入したもの(++してないもの)を親とする
        }
        if (info.close) {
          tagCount[info.name]--
        }
      }
    }
  }
  console.log('file', text, text.charAt(1), text.length, tags)
}

function DOMAnalysis (dom) {
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
  const tags = dom.split(' ')
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
  for (const other of others) {
    otherAnalysis(other)
  }
  info.other = others
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
    if (otherSplit[1].match('(') && otherSplit[1].match(')')) {
      // function
      target.type = 'function'
    } else {
      // variable
      target.type = 'variable'
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
