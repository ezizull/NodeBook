const { Routers } = require('../routers/routers')

class Request {
  constructor (URL, method) {
    this.URL = URL
    this.method = method
  }

  // Get Request
  get (url, funct) {
    if (url === this.URL && this.method === 'GET') {
      Routers.push(`GET : ${url}`)
      return funct()
    }
  }

  // POST Request
  post (url, funct) {
    if (url === this.URL && this.method === 'POST') {
      Routers.push(`POST : ${url}`)
      return funct()
    }
  }

  // PUT Request
  put (url, funct) {
    if (url === this.URL && this.method === 'PUT') {
      Routers.push(`PUT : ${url}`)
      return funct()
    }
  }

  // DELETE Request
  del (url, funct) {
    if (url === this.URL && this.method === 'DELETE') {
      Routers.push(`DELETE : ${url}`)
      return funct()
    }
  }
}

module.exports = { Request }
