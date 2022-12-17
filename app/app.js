// Envoirenmet
require('dotenv').config()

// Setup
const { server } = require('./routers/index.router')
const PORT = process.env.PORT || 5000

// More Easy if USE Express
server.listen(PORT, () => {
  console.log(`server started on port: ${PORT}`)
})
