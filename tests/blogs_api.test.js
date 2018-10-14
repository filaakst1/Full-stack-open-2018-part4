const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)

const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2
  }
]

describe('when there is initially some blogs saved', async () => {
  beforeAll(async () => {
    await Blog.remove({})
    const blogObjects = initialBlogs.map(blog => new Blog(blog))
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
      const response = await api.get('/api/blogs')
      expect(response.body.length).toBe(initialBlogs.length)
    })

    test('the first blog is about HTTP methods', async () => {
      const expected= {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10
      }
      const response = await api.get('/api/blogs')
      const contents = response.body.map(blog => {
        return {
          title: blog.title,
          author: blog.author,
          url: blog.url,
          likes: blog.likes
        }
      })
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
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/blogs')
      const contents = response.body.map(blog => {
        return {
          title: blog.title,
          author: blog.author,
          url: blog.url,
          likes: blog.likes
        }
      })
      expect(response.body.length).toBe(initialBlogs.length + 1)
      expect(contents).toContainEqual(newBlog)
    })
    test('POST /api/blogs without body', async () => {
      await api
        .post('/api/blogs')
        .send()
        .expect(201)
        .expect('Content-Type', /application\/json/)
    })
  })

  afterAll(() => {
    server.close()
  })
})