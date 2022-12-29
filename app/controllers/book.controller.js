const { nanoid } = require('nanoid')

const { SUCCESS, EMPTY_REQUEST_BODY, READ_PAGE_MORE_THAN_COUNTED, GENERIC_ERROR, BOOKID_NOT_FOUND } = require('../constants/status_code.const')
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
  return function () {
    const bookId = req.url.substring(7, 23)

    const book = Books.filter((book) => book.id === bookId)[0]

    if (book !== undefined) {
      res.writeHead(SUCCESS, HEADERS)
      return res.end(JSON.stringify({
        status: 'success',
        data: { book }
      }))
    }

    res.writeHead(BOOKID_NOT_FOUND, HEADERS)
    return res.end(JSON.stringify({
      status: 'fail',
      message: 'Buku tidak ditemukan'
    }))
  }
}

const EditBookByID = (req, res) => {
  return function () {
    const bookId = req.url.substring(7, 23)

    let data = ''

    req.on('data', function (dataChunk) {
      data += dataChunk
    })

    req.on('end', function () {
      req.rawBody = data

      if (data && data.indexOf('{') > -1) {
        data = JSON.parse(data)
      }

      const [
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
      ] = [
        data.name,
        data.year,
        data.author,
        data.summary,
        data.publisher,
        data.pageCount,
        data.readPage,
        data.reading
      ]

      const updatedAt = new Date().toISOString()

      const isBookNameEmpty = name === undefined || name === null || name === ''
      const isReadPageLarger = readPage > pageCount

      if (isBookNameEmpty) {
        res.writeHead(EMPTY_REQUEST_BODY, HEADERS)
        return res.end(JSON.stringify({
          status: 'fail',
          message: 'Gagal memperbarui buku. Mohon isi nama buku'
        }))
      }

      if (isReadPageLarger) {
        res.writeHead(EMPTY_REQUEST_BODY, HEADERS)
        return res.end(JSON.stringify({
          status: 'fail',
          message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        }))
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

        res.writeHead(SUCCESS, HEADERS)
        return res.end(JSON.stringify({
          status: 'success',
          message: 'Buku berhasil diperbarui'
        }))
      }

      res.writeHead(BOOKID_NOT_FOUND, HEADERS)
      return res.end(JSON.stringify({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
      }))
    })
  }
}

const DeleteBookByID = (req, res) => {
  return function () {
    const bookId = req.url.substring(7, 23)

    const index = Books.findIndex((book) => book.id === bookId)

    if (index !== -1) {
      Books.splice(index, 1)
      res.writeHead(SUCCESS, HEADERS)
      return res.end(JSON.stringify({
        status: 'success',
        message: 'Buku berhasil dihapus'
      }))
    }

    res.writeHead(BOOKID_NOT_FOUND, HEADERS)
    return res.end(JSON.stringify({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan'
    }))
  }
}

module.exports = { GetAllBooks, AddBook, GetBookByID, EditBookByID, DeleteBookByID }
