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
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined ? 0 : body.likes
    })
    const savedBlog = await blog.save()
    response.status(201).json(formatBlog(savedBlog))
  }
  catch(exception) {
    console.error(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

module.exports = blogsRouter
