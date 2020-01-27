var array = [{
  "language": "Python1",
  "created": "2018-8-27 14:50:31",
  "evaluated": true,
  "hiddenCode": false
}, {
  "language": "Python2",
  "created": "2018-8-27 14:50:31",
  "evaluated": true,
  "hiddenCode": false
}]

array.map((item, index) => Object.assign(item, { index }))

