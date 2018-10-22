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
    if(body.title === undefined) {
      return response.status(400).json({ error: 'title missing' })
    }
    if(body.url === undefined) {
      return response.status(400).json({ error: 'url missing' })
    }
    const savedBlog = await blog.save()
    response.status(201).json(formatBlog(savedBlog))
  }
  catch(exception) {
    console.error(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

blogsRouter.delete('/:id',async (request, response) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  }catch(exception) {
    console.error(exception)
    response.status(400).send({ error: 'malformatted id' })
  }

})
blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {}

  if(body.title !== undefined) {
    blog.title = body.title
  }
  if(body.title !== undefined) {
    blog.title = body.title
  }
  if(body.author !== undefined) {
    blog.author = body.author
  }
  if(body.url !== undefined) {
    blog.url = body.url
  }
  if (body.likes !== undefined) {
    blog.likes = body.likes
  }
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true } )
    response.status(200).json(formatBlog(updatedBlog))
  }
  catch(exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }

})

module.exports = blogsRouter
