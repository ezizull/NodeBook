// initial
const http = require('http')
const router = require('./bookshelf.router')

const { PAGE_NOT_FOUND } = require('../constants/status_code.const')
const { HEADERS } = require('../constants/header.const')
const { Routers } = require('./routers')

const server = http.createServer(async (req, res) => {
  // Router Book
  router.book(req, res)

  // Page Not Found
  if (!Routers.includes(`${req.method} : ${req.url}`)) {
    res.writeHead(PAGE_NOT_FOUND, HEADERS)
    res.end(JSON.stringify({ message: 'Page not found' }))
  }
})

module.exports = { server }
