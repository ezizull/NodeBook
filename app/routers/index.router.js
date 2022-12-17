// initial
const http = require('http')
const router = require('./bookshelf.router')

const { Request } = require('../constants/request.const')
const { PAGE_NOT_FOUND } = require('../constants/status_code.const')
const { HEADERS } = require('../constants/header.const')

const server = http.createServer(async (req, res) => {
  // Inital Request
  const app = new Request(req.url, req.method)

  // Router Book
  router.book(app, req, res)

  if (!app.ROUTES.includes(`${req.method} : ${req.url}`)) {
    res.writeHead(PAGE_NOT_FOUND, HEADERS)
    res.end(JSON.stringify({ message: 'Page not found' }))
  }
})

module.exports = { server }
