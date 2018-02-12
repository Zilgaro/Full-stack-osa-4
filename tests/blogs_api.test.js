const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const initialBlogs = require('../utils/listOfBlogs')
const {format, blogsInDb} = require('./test_helper')


describe('when there is initially some notes saved', async () => {

    beforeAll(async () => {
        await Blog.remove({})

        const blogObjects = initialBlogs.map(b => new Blog(b))
        await Promise.all(blogObjects.map(b => b.save()))
    })

    test('all blogs are returned', async () => {
        const response = await api
            .get('/api/blogs')

        expect(response.body.length).toBe(initialBlogs.length)
    })

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
})

describe('addition of new blog', async () => {

    test('a valid blog can be added', async () => {
        const newBlog = {
            author: 'Verne',
            title: 'Testaamisen sietämätön keveys',
            url: 'http://myster.io',
            likes: 9001
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api
            .get('/api/blogs')

        const contents = response.body.map(r => r.title)

        expect(response.body.length).toBe(initialBlogs.length + 1)
        expect(contents).toContain('Testaamisen sietämätön keveys')
    })

    test('POST /api/blogs fails with proper statuscode if required fields are missing', async () => {
        const newBlog = {
            author: 'Verne'
        }

        const blogsAtStart = await blogsInDb()

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAfterOperation = await blogsInDb()

        expect(blogsAfterOperation.length).toBe(blogsAtStart.length)
    })

    test('If POST /api/blogs called with missing like field it is set to 0', async () => {
        const newBlog = {
            author: 'Verne',
            title: 'Nobody likes me',
            url: 'http://myster.io'
        }

        const blogsAtStart = await blogsInDb()

        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)

        expect(response.body.likes).toBe(0)

        const blogsAfterOperation = await blogsInDb()

        expect(blogsAfterOperation.length).toBe(blogsAtStart.length + 1)
    })
})

afterAll(() => {
    server.close()
})