const BN = require('bn.js')

function leftPad(string, chars, sign) {
  var hasPrefix = /^0x/i.test(string) || typeof string === 'number'
  string = string.toString(16).replace(/^0x/i, '')

  var padding = chars - string.length + 1 >= 0 ? chars - string.length + 1 : 0

  return (hasPrefix ? '0x' : '') + new Array(padding).join(sign ? sign : '0') + string
}

function uint8ToHex(uint8) {
  const uint8Bn = new BN(uint8)
  const size = 8
  return '0x' + leftPad(uint8Bn.toString('hex'), size / 8 * 2)
}

module.exports = {
  uint8ToHex: uint8ToHex
}
