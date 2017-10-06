var path = require('path')
var should = require('should')
// var sinon = require('sinon')

var formatError = require('../index.js')

describe('Error Formatting', function (done) {
  beforeEach(function(done) {
    done()
  })

  afterEach(function(done) {
    done()
  })

  describe('API Errors', function () {
    it('should return Missing Index Key error', function (done) {
      var err = formatError.createApiError('0001', { field: 'author' })
      err.code.should.eql('API-0001')
      err.details.should.eql("'author' is specified as the primary sort field, but is missing from the index key collection.")
      done()
    })

    it('should return Hook error', function (done) {
      var err = formatError.createApiError('0002', { hookName: 'slugify', errorMessage: 'error' })
      err.code.should.eql('API-0002')
      //err.details.should.eql("The hook 'slugify' failed: 'error'")
      err.details.indexOf('error').should.not.eql(-1)
      done()
    })
  })

  describe('Web Errors', function () {
    it('should return Datasource Not Found error', function (done) {
      var datasource = {
        name: 'books',
        endpoint: '1.0/library/books'
      }

      var response = {
        statusMessage: 'Not Found',
        statusCode: 404
      }

      var err = formatError.createWebError('0004', { datasource: datasource, response: response })
      err.code.should.eql('WEB-0004')
      err.details.should.eql("The datasource 'books' failed: Not Found (404): Endpoint: '1.0/library/books'")
      done()
    })

    it('should return Datasource Timed Out error', function (done) {
      var datasource = {
        name: 'books',
        endpoint: '1.0/library/books'
      }

      var response = {
        statusMessage: 'Timed Out',
        statusCode: 504
      }

      var err = formatError.createWebError('0005', { datasource: datasource, response: response })
      err.code.should.eql('WEB-0005')
      err.details.should.eql("The datasource 'books' timed out: Timed Out (504): Endpoint: '1.0/library/books'")
      done()
    })
  })

  describe('Custom Errors', function () {
    it('should return a custom error object if the error contains a `dadiCustomError` property', function (done) {
      var customError1 = new Error('Custom error 1')

      customError1.dadiCustomError = {
        code: 'SLUG_ALREADY_EXISTS',
        document: {
          _id: 123456
        }
      }

      var formattedError = formatError.createApiError('0002', {
        error: customError1,
        hookName: 'myHook1'
      })

      JSON.stringify(formattedError).should.eql(JSON.stringify(customError1.dadiCustomError))

      done()
    })

    it('should attach a default code property to a custom error if one is not provided', function (done) {
      var customError1 = new Error('Custom error 1')

      customError1.dadiCustomError = {
        document: {
          _id: 123456
        }
      }

      var formattedError = formatError.createApiError('0002', {
        error: customError1,
        hookName: 'myHook1'
      })

      formattedError.code.should.eql('API-CUSTOM')
      JSON.stringify(formattedError.document).should.eql(JSON.stringify(customError1.dadiCustomError.document))

      done()
    })
  })

  describe('Unknown Errors', function () {
    it('should return the code in place of an error', function (done) {
      var err = formatError.createApiError('1001', { field: 'author' })
      err.code.should.eql('API-1001')
      err.docLink.should.eql('https://docs.dadi.tech/#api/api-1001')
      done()
    })
  })
})