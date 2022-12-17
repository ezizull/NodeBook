const { SUCCESS } = require('../constants/status_code.const')
const { HEADERS } = require('../constants/header.const')

const { Books, Book } = require('../models/book/book.model')

function GetAllBooks (req, res) {
  return function () {
    res.writeHead(SUCCESS, HEADERS)
    res.end(JSON.stringify({
      status: 'success',
      data: {
        books: Books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    }))
  }
}

const AddBook = (req, res) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = req.payload

  const id = 1 // nanoid(16)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  const finished = pageCount === readPage

  const book = new Book(
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt)

  const isBookNameEmpty = name === undefined || name === null || name === ''
  const isReadPageLarger = readPage > pageCount

  if (isBookNameEmpty) {
    const response = res.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  if (isReadPageLarger) {
    const response = res.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  Books.push(book)
  const isSuccess = Books.filter((book) => book.id === id).length > 0

  if (isSuccess) {
    const response = res.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  }

  const response = res.response({
    status: 'error',
    message: 'Buku gagal ditambahkan'
  })
  response.code(500)
  return response
}

const GetBookByID = (req, res) => {
  const { bookId } = req.params
  const book = Books.filter((book) => book.id === bookId)[0]

  if (book !== undefined) {
    const response = res.response({
      status: 'success',
      data: {
        book
      }
    })
    response.code(200)
    return response
  }

  const response = res.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404)
  return response
}

const EditBookByID = (req, res) => {
  const { bookId } = req.params

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = req.payload
  const updatedAt = new Date().toISOString()

  const isBookNameEmpty = name === undefined || name === null || name === ''
  const isReadPageLarger = readPage > pageCount

  if (isBookNameEmpty) {
    const response = res.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  if (isReadPageLarger) {
    const response = res.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  const index = Books.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    Books[index] = {
      ...Books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    }

    const response = res.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
    response.code(200)
    return response
  }

  const response = res.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

const DeleteBookByID = (req, res) => {
  const { bookId } = req.params

  const index = Books.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    Book.splice(index, 1)
    const response = res.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }

  const response = res.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })

  response.code(404)
  return response
}

module.exports = { GetAllBooks, AddBook, GetBookByID, EditBookByID, DeleteBookByID }
