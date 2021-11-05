export default function toHHMMSS(seconds) {
  if (!seconds) {
    return '00:00'
  }

  var sec_num = parseInt(seconds, 10) // don't forget the second param
  var hours = Math.floor(sec_num / 3600)
  var minutes = Math.floor((sec_num - hours * 3600) / 60)
  seconds = sec_num - hours * 3600 - minutes * 60

  if (hours < 10) {
    hours = '0' + hours
  }
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  if (seconds < 10) {
    seconds = '0' + seconds
  }

  if (hours != '00') {
    return hours + ':' + minutes + ':' + seconds
  } else {
    return minutes + ':' + seconds
  }
}
