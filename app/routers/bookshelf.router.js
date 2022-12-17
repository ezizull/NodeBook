const { GetAllBooks } = require('../controllers/book.controller')

exports.book = (app, req, res) => {
  // Get all Book
  app.get('/books', GetAllBooks(req, res))
}
