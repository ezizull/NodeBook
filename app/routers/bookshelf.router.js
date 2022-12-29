const { GetAllBooks, AddBook, GetBookByID } = require('../controllers/book.controller')
const { Request } = require('../constants/request.const')

exports.book = (req, res) => {
  const app = new Request(req.url, req.method)

  // Get All Book
  app.get('/books', GetAllBooks(req, res))

  // Add Book
  app.post('/books', AddBook(req, res))

  // Get Book By ID
  app.get('/books/', GetBookByID(req, res))
}
