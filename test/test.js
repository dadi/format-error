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
      err.details.should.eql("The hook 'slugify' failed: 'error'")
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
    it('should return a custom error object is the input is not a string', function (done) {
      var errorObject = {
        code: 'PUBLISH-AUTH',
        message: 'The authentication failed',
        remainingAttempts: 3
      }
      var err = formatError.createApiError(errorObject)

      JSON.stringify(err).should.eql(JSON.stringify(errorObject))

      done()
    })

    it('should attach a default code to a custom error if one is not provided', function (done) {
      var errorObject = {
        message: 'Something has failed'
      }
      var err = formatError.createApiError(errorObject)

      err.message.should.eql(errorObject.message)
      err.code.should.eql('API-CUSTOM')

      done()
    })
  })

  describe('Unknown Errors', function () {
    it('should return the code in place of an error', function (done) {
      var err = formatError.createApiError('1001', { field: 'author' })
      err.code.should.eql('API-1001')
      err.docLink.should.eql('http://docs.dadi.tech/errors/api/API-1001')
      done()
    })
  })
})