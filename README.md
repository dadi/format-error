# DADI Error Formatter

> Create JSON error objects for DADI applications

[![npm (scoped)](https://img.shields.io/npm/v/@dadi/format-error.svg?maxAge=10800&style=flat-square)](https://www.npmjs.com/package/@dadi/format-error)
[![Coverage Status](https://coveralls.io/repos/github/dadi/format-error/badge.svg?branch=master)](https://coveralls.io/github/dadi/format-error?branch=master)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)

## Overview

format-error is designed to streamline the process of creating errors to be returned from a DADI product. 

## Install

```
npm install @dadi/format-error
```

## Usage

### createApiError(code, params)

```js
const formatError = require('@dadi/format-error')
let error = formatError.createApiError('0001', { field: 'publicationDate' })
```

```json
{
  "code": "API-0001",
  "title": "Missing Index Key",
  "details": "'publicationDate' is specified as the primary sort field, but is missing from the index key collection.",
  "docLink": "http://docs.dadi.tech/errors/api/API-0001"
}
```

### createError(product, code, params, codes)

```js
const formatError = require('@dadi/format-error')
const codes = {
  "0001": {
    "code": "API-0001",
    "title": "Missing Index Key",
    "details": "'${field}' is specified as the primary sort field, but is missing from the index key collection.",
    "params": ["field"]
  },
  "0002": {
    "code": "API-0002",
    "title": "Hook Error",
    "details": "${hookName} - ${errorMessage}",
    "params": ["hookName", "errorMessage"]
  }
}

let error = formatError.createError('api', '0001', { field: 'publicationDate' }, codes)
```

