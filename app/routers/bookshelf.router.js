const { HEADERS } = require('../constants/header.const')

const { SUCCESS } = require('../constants/status_code.const')

exports.book = (app, req, res) => {
  app.get('/books', () => {
    res.writeHead(SUCCESS, HEADERS)
    res.write(JSON.stringify({ message: 'Get Book' }))
    res.end()
  })
}
