'use strict'

/*!
 * multer
 * Copyright(c) 2014 Hage Yaapa
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

const originalMulter = require('multer')

function multer (options) {
  const m = originalMulter(options)

  const _makeMiddleware = m._makeMiddleware.bind(m)
  m._makeMiddleware = makePromise(_makeMiddleware)

  const any = m.any.bind(m)
  m.any = makePromise(any)

  return m
}

function makePromise (fn) {
  return (fields, fileStrategy) => {
    return function * (next) {
      yield new Promise((resolve, reject) => {
        fn(fields, fileStrategy)(this.req, this.res, (err) => {
          err ? reject(err) : resolve()
        })
      })

      yield next
    }
  }
}

multer.diskStorage = originalMulter.diskStorage
multer.memoryStorage = originalMulter.memoryStorage

export default multer
