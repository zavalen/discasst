module.exports.jsonToHtml = string => {
  if (!string) return ''

  if (typeof string != 'string') {
    string = string.toString()
  }

  string = string
    .trim()
    .split('\n')
    .join('</p><p>')
    .split('\r')
    .join('')
    .split('<p>&nbsp;</p>')
    .join('')
    .split('<p> </p>')
    .join('')
    .split('<p><br></p>')
    .join('')
    .split('</p><p></p><p>')
    .join('</p><p>')
    // .replace(/<[/]{0,1}(a)[^><]*>/g, ' ')
    .replace(/ +/g, ' ')

  if (!string.startsWith('<p>')) {
    string = '<p>' + string + '</p>'
  }

  if (!string.includes('</a>')) {
    string = formatLinks(string)
  } else {
    string = addNoFollowsToExternal(string)
  }

  return string
}

function formatLinks(text) {
  var re = /(\(.*?)?\b((?:https?|ftp|file):\/\/[-a-z0-9+&@#\\/%?=~_()|!:,.;]*[-a-z0-9+&@#/%=~_()|])/gi
  return text.replace(re, function(match, lParens, url) {
    var rParens = ''
    lParens = lParens || ''

    var lParenCounter = /\(/g
    while (lParenCounter.exec(lParens)) {
      var m
      if ((m = /(.*)(\.\).*)/.exec(url) || /(.*)(\).*)/.exec(url))) {
        url = m[1]
        rParens = m[2] + rParens
      }
    }
    return (
      lParens +
      "<a target='_blank' rel='noreferrer nofollow' href='" +
      url +
      "'>" +
      url +
      '</a>' +
      rParens
    )
  })
}

function addNoFollowsToExternal(html) {
  var whiteList = ['([^/]+.)?discasst.com']
  var str =
    '(<as*(?!.*\brel=)[^>]*)(href="https?://)((?!(?:' +
    whiteList.join('|') +
    '))[^"]+)"((?!.*\brel=)[^>]*)(?:[^>]*)>'

  return html.replace(
    new RegExp(str, 'igm'),
    '$1$2$3"$4 rel="nofollow noreferrer">'
  )
}
