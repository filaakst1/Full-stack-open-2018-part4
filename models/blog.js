const mongoose = require('mongoose')


if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config()
}
// use environment variables to pass user credentials
const mongoUrl = process.env.MONGO_DB_URI

mongoose.connect(mongoUrl, { useNewUrlParser: true })

const Blog = mongoose.model('Blog', {
  title: String,
  author: String,
  url: String,
  likes: Number
})

module.exports = Blog