const commentRouter = require('express').Router()
const Comment = require('../models/comment')
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')



commentRouter.get('/:id/comments', async (request, response) => {
  const comments = await Comment.find({ blog: request.params.id })
  response.json(comments.map(Comment.format))

})

commentRouter.post('/:id/comments', async (request, response) => {
  const body = request.body
  try {
    const token = request.token
    if (!token ){
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    if(body.comment === undefined) {
      return response.status(400).json({ error: 'comment missing' })
    }
    const blog = await Blog.findById(request.params.id)
    const comment = new Comment({
      comment: body.comment,
      blog: blog._id
    })

    const savedComment = await comment.save()
    blog.comments = blog.comments.concat(savedComment.id)

    await blog.save()
    response.status(201).json(Comment.format(savedComment))
  }
  catch(exception) {
    if (exception.name === 'JsonWebTokenError' ) {
      response.status(401).json({ error: exception.message })
    }else {
      console.error(exception)
      response.status(500).json({ error: 'something went wrong...' })
    }
  }
})

module.exports = commentRouter