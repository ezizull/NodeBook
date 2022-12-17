class Request {
  constructor (URL, method) {
    this.URL = URL
    this.method = method
    this.URLS = []
  }

  get (url, funct) {
    this.URLS.push(url)
    if (this.URLS.includes(this.URL) && this.method === 'GET') {
      return funct()
    }
  }

  post (url, funct) {
    this.URLS.push(url)
    if (this.URLS.includes(this.URL) && this.method === 'POST') {
      return funct()
    }
  }

  put (url, funct) {
    this.URLS.push(url)
    if (this.URLS.includes(this.URL) && this.method === 'PUT') {
      return funct()
    }
  }

  del (url, funct) {
    this.URLS.push(url)
    if (this.URLS.includes(this.URL) && this.method === 'DELETE') {
      return funct()
    }
  }
}

module.exports = { Request }
