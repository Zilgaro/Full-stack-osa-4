const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const listOfBlogs = require('../utils/listOfBlogs')
const formatBlog = require('../utils/list_helper').formatBlog

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

const initialBlogs = listOfBlogs.slice(0,2  )

beforeAll(async () => {
    await Blog.remove({})

    let blogObject = new Blog(formatBlog(initialBlogs[0]))
    await blogObject.save()

    blogObject = new Blog(formatBlog(initialBlogs[1]))
    await blogObject.save()
})

afterAll(() => {
    server.close()
})

test('all blogs are returned', async () => {
    const response = await api
        .get('/api/blogs')

    expect(response.body.length).toBe(initialBlogs.length)
})