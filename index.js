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

function createError (product, data, params) {
  var error

  // Is this a custom error?
  if (params.error && params.error.dadiCustomError) {
    error = params.error.dadiCustomError

    error.code = error.code || product.toUpperCase() + '-CUSTOM'
  } else {
    error = codes[product.toLowerCase()][data]

    if (!error) {
      error = {
        code: `${product.toUpperCase()}-${data}`
      }
    } else {
      delete error.params
      error.details = template(error.details, params)
    }

    error.docLink = 'https://docs.dadi.tech/#' + product + '/' + product.toLowerCase() + '-' + data
  }

  return error
}
