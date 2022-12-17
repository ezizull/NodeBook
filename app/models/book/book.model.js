
const Books = []

const Book = ({
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
  updatedAt
}) => {
  return {
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
    updatedAt
  }
}

module.exports = { Book, Books }
