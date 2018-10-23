const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs.map(Blog.format))
})

blogsRouter.post('/', async (request, response) => {
  try {
    const body = request.body
    if(body.title === undefined) {
      return response.status(400).json({ error: 'title missing' })
    }
    if(body.url === undefined) {
      return response.status(400).json({ error: 'url missing' })
    }
    const userList = await User.find({})
    if(userList.length < 1) {
      return response.status(400).json({ error: 'No users' })
    }
    const user = userList[0]
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined ? 0 : body.likes,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog.id)

    await user.save()

    response.status(201).json(Blog.format(savedBlog))
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
    response.status(200).json(Blog.format(updatedBlog))
  }
  catch(exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }

})

module.exports = blogsRouter
