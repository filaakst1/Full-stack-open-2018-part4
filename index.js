const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')

const blogsRouter = require('./controllers/blogs')

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

app.use(express.static('build'))
app.use(middleware.logger)

app.use('/api/blogs', blogsRouter)

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
