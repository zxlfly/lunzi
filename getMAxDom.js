function getMAxDom() {
  var nodelist = Array.from(document.querySelectorAll('*'))
  var list = {}
  for (var el of nodelist) {
    var tag = el.tagName
    list[tag] = (list[tag] || 0) + 1
  }
  var res = Object.entries(list).sort((a, b) => b[1] - a[1])
  return res[0][0]
}