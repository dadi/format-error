const should = require('should')
const formatError = require('../../index.js')

describe('Error Formatting', function (done) {
  beforeEach(function (done) {
    done()
  })

  afterEach(function (done) {
    done()
  })

  it('should retain backwards compatibility for API errors when not passing codes', function (done) {
    let err = formatError.createApiError('0001', { field: 'author' })
    err.code.should.eql('API-0001')
    err.details.should.eql("'author' is specified as the primary sort field, but is missing from the index key collection.")
    done()
  })

  it('should retain backwards compatibility for CDN errors when not passing codes', function (done) {
    let err = formatError.createCdnError('0001', {})
    err.code.should.eql('CDN-0001')
    err.title.should.eql('CDN Error')
    done()
  })

  it('should retain backwards compatibility for Web errors when not passing codes', function (done) {
    let err = formatError.createWebError('0006', { sourcePath: './' })
    err.code.should.eql('WEB-0006')
    err.details.should.eql("The path './' could not be found")
    done()
  })

  describe('API Errors', function () {
    let codes = require('../../codes.json').api

    it('should return Missing Index Key error', function (done) {
      let err = formatError.createError('api', '0001', { field: 'author' }, codes)
      err.code.should.eql('API-0001')
      err.details.should.eql("'author' is specified as the primary sort field, but is missing from the index key collection.")
      done()
    })

    it('should return Hook error', function (done) {
      let err = formatError.createError('api', '0002', { hookName: 'slugify', errorMessage: 'error' }, codes)
      err.code.should.eql('API-0002')
      // err.details.should.eql("The hook 'slugify' failed: 'error'")
      err.details.indexOf('error').should.not.eql(-1)
      done()
    })

    it('should return DB unavailable error', function (done) {
      var err = formatError.createApiError('0004')
      err.code.should.eql('API-0004')
      err.title.should.eql('Database unavailable')

      done()
    })
  })

  describe('Web Errors', function () {
    let codes = require('../../codes.json').web

    it('should return Datasource Not Found error', function (done) {
      let datasource = {
        name: 'books',
        endpoint: '1.0/library/books'
      }

      let response = {
        statusMessage: 'Not Found',
        statusCode: 404
      }

      let err = formatError.createError('web', '0004', { datasource: datasource, response: response }, codes)
      err.code.should.eql('WEB-0004')
      err.details.should.eql("The datasource 'books' failed: Not Found (404): Endpoint: '1.0/library/books'")
      done()
    })

    it('should return Datasource Timed Out error', function (done) {
      let datasource = {
        name: 'books',
        endpoint: '1.0/library/books'
      }

      let response = {
        statusMessage: 'Timed Out',
        statusCode: 504
      }

      let err = formatError.createError('web', '0005', { datasource: datasource, response: response }, codes)

      err.code.should.eql('WEB-0005')
      err.details.should.eql("The datasource 'books' timed out: Timed Out (504): Endpoint: '1.0/library/books'")
      done()
    })
  })

  describe('Custom Errors', function () {
    let codes = require('../../codes.json').api

    it('should return a custom error object if the error contains a `dadiCustomError` property', function (done) {
      let customError1 = new Error('Custom error 1')

      customError1.dadiCustomError = {
        code: 'SLUG_ALREADY_EXISTS',
        document: {
          _id: 123456
        }
      }

      let formattedError = formatError.createError('api', '0002', {
        error: customError1,
        hookName: 'myHook1'
      }, codes)

      JSON.stringify(formattedError).should.eql(JSON.stringify(customError1.dadiCustomError))

      done()
    })

    it('should attach a default code property to a custom error if one is not provided', function (done) {
      let customError1 = new Error('Custom error 1')

      customError1.dadiCustomError = {
        document: {
          _id: 123456
        }
      }

      let formattedError = formatError.createError('api', '0002', {
        error: customError1,
        hookName: 'myHook1'
      }, codes)

      formattedError.code.should.eql('API-CUSTOM')
      JSON.stringify(formattedError.document).should.eql(JSON.stringify(customError1.dadiCustomError.document))

      done()
    })
  })

  describe('Unknown Errors', function () {
    let codes = require('../../codes.json').api

    it('should return the code in place of an error', function (done) {
      let err = formatError.createError('api', '1001', { field: 'author' }, codes)
      err.code.should.eql('API-1001')
      err.docLink.should.eql('https://docs.dadi.cloud/api/#api-1001')
      done()
    })
  })

  describe('Documentation Link', function () {
    let codes = require('../../codes.json').api

    it('should allow override of the docLink', function (done) {
      let err = formatError.createError('api', '0001', { field: 'author', docLink: 'https://google.com' }, codes)
      err.code.should.eql('API-0001')
      err.docLink.should.eql('https://google.com')
      done()
    })

    it('should not override a docLink from the imported codes', function (done) {
      codes['0001'].docLink = 'https://dadi.cloud'
      let err = formatError.createError('api', '0001', { field: 'author', docLink: 'https://google.com' }, codes)
      err.code.should.eql('API-0001')
      err.docLink.should.eql('https://dadi.cloud')
      done()
    })
  })
})
