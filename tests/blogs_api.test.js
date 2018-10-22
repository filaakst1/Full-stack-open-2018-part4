const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')
const { format, formatWithoutId, initialBlogs, blogsInDb,blogsInDbUnformatted,formatWithoutIdAndLike,usersInDb,formatUser } = require('./test_helper')


describe('when there is initially some blogs saved', async () => {
  beforeAll(async () => {
    await Blog.remove({})
    const blogObjects = initialBlogs.map(blog => new Blog(blog))
    await Promise.all(blogObjects.map(blog => blog.save()))
  })

  describe('GET /api/blogs tests', async () => {

    test('blogs are returned as json', async () => {
      const blogsInDataBase =await blogsInDb()
      const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
      expect(response.body.length).toBe(blogsInDataBase.length)
      const returnedContents = response.body.map(format)
      blogsInDataBase.map(format).forEach(blog => {
        expect(returnedContents).toContainEqual(blog)
      })
    })
  })

  describe('POST /api/blogs: add entry', async() => {
    const testValidBlogEntry = async (newBlog) => {
      const blogsAtStart = await blogsInDb()
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAfterOperation = await blogsInDb()
      expect(blogsAfterOperation.length).toBe(blogsAtStart.length + 1)

      const formattedBlogs = blogsAfterOperation.map(formatWithoutIdAndLike)
      expect(formattedBlogs).toContainEqual(formatWithoutIdAndLike(newBlog))
    }

    const testInvalidBlogEntry = async (newBlog) => {
      const blogsAtStart = await blogsInDb()
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
      const blogsAfterOperation = await blogsInDb()
      expect(blogsAfterOperation.length).toBe(blogsAtStart.length)
      blogsAtStart.forEach(blog => {
        expect(blogsAtStart).toContainEqual(blog)
      })
    }

    test('POST /api/blogs succeeds with valid data', async () => {

      const newBlog = {
        title: 'Hello World!',
        author: 'Foobar',
        url: 'http://foobar.com/',
        likes: 1
      }
      await testValidBlogEntry(newBlog)
    })

    test('POST /api/blogs without likes', async () => {
      const newBlog = {
        title: 'Hello World2!',
        author: 'Foobar',
        url: 'http://foobar.com/',
      }
      await testValidBlogEntry(newBlog)
    })

    test('POST /api/blogs without title should not be added ', async () => {
      const newBlog = {
        author: 'Foobar',
        url: 'http://foobar.com/',
        likes: 1
      }
      await testInvalidBlogEntry(newBlog)
    })

    test('POST /api/blogs without url should not be added ', async () => {
      const newBlog = {
        author: 'Foobar',
        title: 'Hello World!',
        likes: 1
      }
      await testInvalidBlogEntry(newBlog)
    })
  })
  describe('DELETE /api/blogs/:id - delete entry', async() => {
    let addedBlog

    beforeAll(async () => {
      addedBlog =new Blog({
        title: 'Hello World!',
        author: 'Foobar',
        url: 'http://foobar.com/',
        likes: 1
      })
      await addedBlog.save()
    })

    test('DELETE /api/blogs/:id succeeds with proper statuscode ', async () => {
      const blogsAtStart = await blogsInDb()

      await api
        .delete(`/api/blogs/${addedBlog._id}`)
        .expect(204)
      const blogsAfterOperation = await blogsInDb()
      const contents = blogsAfterOperation.map(format)
      expect(contents).not.toContainEqual(addedBlog)
      expect(blogsAfterOperation.length).toBe(blogsAtStart.length - 1)
    })
  })
  describe('PUT /api/blogs/:id - update likes', async() => {

    test('PUT /api/blogs/:id succeeds with valid request ', async () => {
      const blogsAtStart = await blogsInDbUnformatted()

      const blogAtStart = blogsAtStart[0]
      const originalLikes = blogAtStart.likes
      const updatedLikes = originalLikes +1
      const response = await api
        .put(`/api/blogs/${blogAtStart._id}`)
        .send( {
          likes: updatedLikes
        })
        .expect(200)
      const blogsAfterOperation = await blogsInDb()
      const formattedBlogsAterOperation = blogsAfterOperation.map(formatWithoutId)
      expect(blogsAfterOperation.length).toBe(blogsAtStart.length)
      expect(response.body.likes).toBe(updatedLikes)
      expect(formattedBlogsAterOperation).not.toContainEqual(formatWithoutId(blogAtStart))
      expect(formattedBlogsAterOperation).toContainEqual(formatWithoutId(response.body))
    })


    test('PUT /api/blogs/:id fails with invalid id', async () => {
      const blogsAtStart = await blogsInDb()
      await api
        .put('/api/blogs/123456')
        .send( {
          likes: 0
        })
        .expect(400)
      const blogsAfterOperation = await blogsInDb()
      expect(blogsAfterOperation.length).toBe(blogsAtStart.length)
      blogsAtStart.forEach(blog => {
        expect(blogsAtStart).toContainEqual(blog)
      })
    })
  })

  describe('when there is initially one user at db', async () => {
    beforeAll(async () => {
      await User.remove({})
      const user = new User({ username: 'root', password: 'sekret', adult: true })
      await user.save()
    })

    test('users are returned as json', async () => {
      const usersInDataBase =await usersInDb()
      const response = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)
      expect(response.body.length).toBe(usersInDataBase.length)

      const returnedContents = response.body.map(u => u.username)

      usersInDataBase.map(u => u.username).forEach(username => {
        expect(returnedContents).toContainEqual(username)
      })
    })

    test('POST /api/users succeeds with a fresh username', async () => {
      const usersBeforeOperation = await usersInDb()
      const newUser = {
        username: 'filaakst',
        name: 'Tomi Laakso',
        password: 'salainen',
        adult: true
      }
      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const usersAfterOperation = await usersInDb()
      expect(usersAfterOperation.length).toBe(usersBeforeOperation.length+1)
      const usernames = usersAfterOperation.map(u => u.username)
      expect(usernames).toContainEqual(newUser.username)
    })

  })


  afterAll(() => {
    server.close()
  })
})
