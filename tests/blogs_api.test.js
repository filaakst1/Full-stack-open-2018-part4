const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)

const Blog = require('../models/blog')
const helper= require('./test_helper')



describe('when there is initially some blogs saved', async () => {
  beforeAll(async () => {
    await Blog.remove({})
    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  describe('get request to /api/blogs for all blogs', async () => {
    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('there are six blogs', async () => {
      const response =await helper.blogsInDb()
      expect(response.length).toBe(helper.initialBlogs.length)
    })

    test('the first blog is about HTTP methods', async () => {
      const expected= {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10
      }
      const response = await helper.blogsInDb()
      const contents = response.map(helper.format)
      expect(contents).toContainEqual(expected)
    })
  })

  describe('post request to /api/blogs for adding entry', async() => {
    test('POST /api/blogs with valid data', async () => {
      const newBlog = {
        title: 'Hello World!',
        author: 'Foobar',
        url: 'http://foobar.com/',
        likes: 1
      }
      const allInitialBlogs = await helper.blogsInDb()
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await helper.blogsInDb()
      const contents = response.map(helper.format)
      expect(response.length).toBe(allInitialBlogs.length + 1)
      expect(contents).toContainEqual(newBlog)
    })

    test('POST /api/blogs without likes', async () => {
      const newBlog = {
        title: 'Hello World2!',
        author: 'Foobar',
        url: 'http://foobar.com/',
      }
      const allInitialBlogs = await helper.blogsInDb()
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await helper.blogsInDb()
      const contents = response.map(helper.format)
      expect(response.length).toBe(allInitialBlogs.length + 1)
      newBlog.likes = 0
      expect(contents).toContainEqual(newBlog)
    })

    test('blog without title is not added ', async () => {
      const newNote = {
        author: 'Foobar',
        url: 'http://foobar.com/',
        likes: 1
      }
      const intialNotes = await helper.blogsInDb()
      await api
        .post('/api/blogs')
        .send(newNote)
        .expect(400)
      const response = await helper.blogsInDb()
      expect(response.length).toBe(intialNotes.length)
    })

    test('blog without url is not added ', async () => {
      const newNote = {
        author: 'Foobar',
        title: 'Hello World!',
        likes: 1
      }
      const intialNotes = await helper.blogsInDb()
      await api
        .post('/api/blogs')
        .send(newNote)
        .expect(400)
      const response = await helper.blogsInDb()
      expect(response.length).toBe(intialNotes.length)
    })
  })

  afterAll(() => {
    server.close()
  })
})