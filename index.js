var codes = require('./codes.json')
var template = require('backtick-template')

module.exports.createApiError = function (code, params) {
  return createError('api', code, params)
}

module.exports.createCdnError = function (code, params) {
  return createError('cdn', code, params)
}

module.exports.createWebError = function (code, params) {
  return createError('web', code, params)
}

function createError (product, code, params) {
  var error = codes[product.toLowerCase()][code]

  if (!error) {
    error = {
      code: `${product.toUpperCase()}-${code}`
    }
  } else {
    delete error.params
    error.details = template(error.details, params)
  }

  error.docLink = 'http://docs.dadi.tech/errors/' + product + '/' + product.toUpperCase() + '-' + code
  return error
}
