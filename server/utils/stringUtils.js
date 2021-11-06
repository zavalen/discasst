module.exports.jsonToHtml = string => {
  // string = string.replace(//r/g,'')
  string = string
    .split('\n')
    .join('</p><p>')
    .split('\r')
    .join('')

  return '<p>' + string + '</p>'
}
