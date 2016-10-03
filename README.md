# DADI Error Formatter

> Create JSON error objects for DADI applications

[![npm (scoped)](https://img.shields.io/npm/v/@dadi/format-error.svg?maxAge=10800&style=flat-square)](https://www.npmjs.com/package/@dadi/format-error)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)

## Overview

## Install

```
npm install --save @dadi/format-error
```

## Usage

### createApiError(code, params)

```js
var formatError = require('@dadi/format-error')
var error = formatError.createApiError('0001', { field: 'publicationDate' })
```

```json
{
  "code": "API-0001",
  "title": "Missing Index Key",
  "details": "'publicationDate' is specified as the primary sort field, but is missing from the index key collection.",
  "docLink": "http://docs.dadi.io/api/errors/API-0001"
}
```