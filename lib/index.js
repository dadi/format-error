'use strict'

const defaultCodes = require('../codes.json')
const template = require('backtick-template')

module.exports.createApiError = function (code, params) {
  return module.exports.createError('api', code, params)
}

module.exports.createCdnError = function (code, params) {
  return module.exports.createError('cdn', code, params)
}

module.exports.createWebError = function (code, params) {
  return module.exports.createError('web', code, params)
}

module.exports.createError = function (product, data, params, codes) {
  params = params || {}

  let error

  // Is this a custom error?
  if (params.error && params.error.dadiCustomError) {
    error = params.error.dadiCustomError

    error.code = error.code || product.toUpperCase() + '-CUSTOM'

    Object.keys(params).forEach(param => {
      if (param !== 'error') error[param] = params[param]
    })
  } else {
    error = Object.assign({}, codes ? codes[data] : defaultCodes[product.toLowerCase()][data])

    if (!error.code) {
      error = {
        code: `${product.toUpperCase()}-${data}`
      }
    } else {
      Object.keys(params).forEach(param => {
        if (!Object.keys(error.params).includes(param)) {
          error[param] = error[param] || params[param]
        }
      })

      delete error.params
      delete error.error
      delete error.errorMessage

      error.details = template(error.details, params)
    }

    error.docLink = error.docLink || `https://docs.dadi.cloud/${product}/#${product.toLowerCase()}-${data}`
  }

  return error
}
