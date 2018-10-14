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
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map(formatBlog))
})

blogsRouter.post('/', async (request, response) => {
  try {
    const body = request.body
    if(body === undefined) {
      return response.status(400).json({ error: 'request body missing' })
    }
    const blog = new Blog(request.body)
    const savedBlog = await blog.save()
    response.status(201).json(formatBlog(savedBlog))
  }
  catch(exception) {
    console.error(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

module.exports = blogsRouter
