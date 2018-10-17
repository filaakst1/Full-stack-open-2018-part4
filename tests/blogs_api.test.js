const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)

const Blog = require('../models/blog')
//const helper= require('./test_helper')
const { format, initialBlogs, blogsInDb,formatWithoutId } = require('./test_helper')


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

      const formattedBlogs = blogsAfterOperation.map(formatWithoutId)
      expect(formattedBlogs).toContainEqual(newBlog)
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
      testValidBlogEntry(newBlog)
    })

    test('POST /api/blogs without likes', async () => {
      const newBlog = {
        title: 'Hello World2!',
        author: 'Foobar',
        url: 'http://foobar.com/',
      }
      testValidBlogEntry(newBlog)
    })

    test('POST /api/blogs without title should not be added ', async () => {
      const newBlog = {
        author: 'Foobar',
        url: 'http://foobar.com/',
        likes: 1
      }
      testInvalidBlogEntry(newBlog)
    })

    test('POST /api/blogs without url should not be added ', async () => {
      const newBlog = {
        author: 'Foobar',
        title: 'Hello World!',
        likes: 1
      }
      testInvalidBlogEntry(newBlog)
    })
  })

  afterAll(() => {
    server.close()
  })
})