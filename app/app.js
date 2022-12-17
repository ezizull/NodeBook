// Envoirenmet
require('dotenv').config()

// Setup
const { server } = require('./routers/index.router')
const PORT = process.env.PORT || 5000

// More easy if use Express
server.listen(PORT, () => {
  console.log(`server started on port: ${PORT}`)
})
