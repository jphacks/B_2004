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
        if (parentId) {
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
  if (dom.substr(0, 2) === '</') {
    info.close = true
  } else {
    info.close = false
  }
  const tags = dom.split(' ')
  // const info = {}
  if (tags.length === 1) {
    // tag一つのみ
    const tag = tags[0]
    info.name = tag.substr(1, tag.length - 2)
    if (tag.substr(tag.length - 2, 2) === '/>') {
      info.open = false
    }
  } else {
    info.name = tags[0].substr(1, tags[0].length)
    for (let i = 1; i < tags.length - 1; i++) {
      const tag = tags[i]
      others.push(tag)
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
  info.other = others
  console.log('analysis', tags, info, dom)
  return info
}
