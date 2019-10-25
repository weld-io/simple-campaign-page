const config = require('./lib/config')
const app = require('./app')

const portNumber = process.env.PORT || config.port
console.log(`simple-campaign-page running on http://localhost:${portNumber}/?password=${process.env.API_PASSWORD}`)
app.listen(portNumber)
