const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')

const blogsRouter = require('./controllers/blogs')


morgan.token('content', function (req) {
  return JSON.stringify(req.body)
})

// Enable logging for requests
app.use(morgan(':method :url :content :status :res[content-length] - :response-time ms'))


if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config()
}
// use environment variables to pass user credentials
const mongoUrl = process.env.MONGO_DB_URI

mongoose.connect(mongoUrl, { useNewUrlParser: true })
  .then(() => {
    console.log('Database connection established')
  })
  .catch( err => {
    console.error(err)
  })



app.use(cors())
app.use(bodyParser.json())


app.use('/api/blogs', blogsRouter)

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
