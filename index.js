var format = require('string-template')
var codes = require('./codes.json')

module.exports.createApiError = function (code, params) {
  return createError('api', code, params)
}

module.exports.createWebError = function (code, params) {
  return createError('web', code, params)
}

function createError (product, code, params) {
  var error = codes[product.toLowerCase()][code]
  delete error.params
  error.details = format(error.details, params)
  error.docLink = 'http://docs.dadi.tech/' + product + '/errors/' + product.toUpperCase() + '-' + code
  return error
}