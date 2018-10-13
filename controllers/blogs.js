const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// Output formatting
const formatBlog = (blog) => {
  return {
    id: blog._id,
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes
  }
}
blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs.map(formatBlog))
    })
})

blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(formatBlog)
    .then(formattedResult => {
      response.status(201).json(formattedResult)
    })
})

module.exports = blogsRouter
