class Request {
  constructor (URL, method) {
    this.URL = URL
    this.method = method
    this.ROUTES = []
  }

  // Get Request
  get (url, funct) {
    if (url === this.URL && this.method === 'GET') {
      this.ROUTES.push(`GET : ${url}`)

      return funct()
    }
  }

  // POST Request
  post (url, funct) {
    if (url === this.URL && this.method === 'POST') {
      this.ROUTES.push(`POST : ${url}`)

      return funct()
    }
  }

  // PUT Request
  put (url, funct) {
    if (url === this.URL && this.method === 'PUT') {
      this.ROUTES.push(`PUT : ${url}`)

      return funct()
    }
  }

  // DELETE Request
  del (url, funct) {
    if (url === this.URL && this.method === 'DELETE') {
      this.ROUTES.push(`DELETE : ${url}`)

      return funct()
    }
  }
}

module.exports = { Request }
