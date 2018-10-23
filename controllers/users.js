const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
    .populate('blogs', { likes: 1, author: 1, title: 1, url: 1 } )
  response.json(users.map(User.format))
})

usersRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    if (body.username === undefined) {
      return response.status(400).json({ error: 'username is missing' })
    }
    const existingUser = await User.find({username: body.username })
    if (existingUser.length>0) {
      return response.status(400).json({ error: 'username must be unique' })
    }
    if(body.password === undefined ) {
      return response.status(400).json({ error: 'password is missing' })
    }
    if(body.password.length < 3 ) {
      return response.status(400).json({ error: 'password too short' })
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    const user = new User({
      username: body.username,
      name: body.name,
      adult: body.adult === undefined ? true : body.adult,
      passwordHash
    })

    const savedUser = await user.save()
    response.json(User.format(savedUser))
  }catch(exception) {
    console.error(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})
module.exports = usersRouter