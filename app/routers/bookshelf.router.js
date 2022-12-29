const { GetAllBooks, AddBook, GetBookByID, EditBookByID, DeleteBookByID } = require('../controllers/book.controller')
const { Request } = require('../constants/request.const')

exports.book = (req, res) => {
  const app = new Request(req.url, req.method)

  // Get All Book
  app.get('/books', GetAllBooks(req, res))

  // Add Book
  app.post('/books', AddBook(req, res))

  // Get Book By ID
  app.get(`/books/${req.url.substring(7, 23)}`, GetBookByID(req, res))

  // Update Book By ID
  app.put(`/books/${req.url.substring(7, 23)}`, EditBookByID(req, res))

  // Delete Book By ID
  app.del(`/books/${req.url.substring(7, 23)}`, DeleteBookByID(req, res))
}
