const { nanoid } = require('nanoid')

const { SUCCESS, EMPTY_REQUEST_BODY, READ_PAGE_MORE_THAN_COUNTED, GENERIC_ERROR } = require('../constants/status_code.const')
const { HEADERS } = require('../constants/header.const')

const { Books } = require('../models/book/book.model')

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
  return function () {
    let data = ''

    req.on('data', function (dataChunk) {
      data += dataChunk
    })

    req.on('end', function () {
      req.rawBody = data

      if (data && data.indexOf('{') > -1) {
        data = JSON.parse(data)
      }

      const id = nanoid(16)
      const insertedAt = new Date().toISOString()
      const updatedAt = insertedAt
      const finished = data.pageCount === data.readPage

      const Book = {
        id,
        name: data.name,
        year: data.year,
        author: data.author,
        summary: data.summary,
        publisher: data.publisher,
        pageCount: data.pageCount,
        readPage: data.readPage,
        finished,
        reading: data.reading,
        insertedAt,
        updatedAt
      }

      const isBookNameEmpty = data.name === undefined || data.name === null || data.name === ''
      const isReadPageLarger = data.readPage > data.pageCount

      if (isBookNameEmpty) {
        res.writeHead(EMPTY_REQUEST_BODY, HEADERS)
        return res.end(JSON.stringify({
          status: 'fail',
          message: 'Gagal menambahkan buku. Mohon isi nama buku'
        }))
      }

      if (isReadPageLarger) {
        res.writeHead(READ_PAGE_MORE_THAN_COUNTED, HEADERS)
        return res.end(JSON.stringify({
          status: 'fail',
          message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        }))
      }

      Books.push(Book)
      const isSuccess = Books.filter((book) => book.id === id).length > 0

      if (isSuccess) {
        res.writeHead(SUCCESS, HEADERS)
        return res.end(JSON.stringify({
          status: 'success',
          message: 'Buku berhasil ditambahkan',
          data: {
            bookId: id
          }
        }))
      }

      res.writeHead(GENERIC_ERROR, HEADERS)
      return res.end(JSON.stringify({
        status: 'error',
        message: 'Buku gagal ditambahkan'
      }))
    })
  }
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
    Books.splice(index, 1)
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
