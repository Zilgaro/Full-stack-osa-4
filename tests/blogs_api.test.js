const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

afterAll(() => {
    server.close()
})
describe('when there is initially some notes saved', async () => {

    beforeAll(async () => {
        await Blog.remove({})

        const blogObjects = helper.initialBlogs.map(b => new Blog(b))
        await Promise.all(blogObjects.map(b => b.save()))
    })

    test('all blogs are returned', async () => {
        const response = await api
            .get('/api/blogs')

        expect(response.body.length).toBe(helper.initialBlogs.length)
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

        const blogsAtStart = await helper.blogsInDb()

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAfter = await helper.blogsInDb()

        const response = await api
            .get('/api/blogs')

        const contents = response.body.map(r => r.title)

        expect(blogsAfter.length).toBe(blogsAtStart.length + 1)
        expect(contents).toContain('Testaamisen sietämätön keveys')
    })

    test('POST /api/blogs fails with proper statuscode if required fields are missing', async () => {

        const newBlog = {
            author: 'Verne'
        }

        const blogsAtStart = await helper.blogsInDb()

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAfterOperation = await helper.blogsInDb()

        expect(blogsAfterOperation.length).toBe(blogsAtStart.length)
    })

    test('If POST /api/blogs called with missing like field it is set to 0', async () => {
        const newBlog = {
            author: 'Verne',
            title: 'Nobody likes me',
            url: 'http://myster.io'
        }

        const blogsAtStart = await helper.blogsInDb()

        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)

        expect(response.body.likes).toBe(0)

        const blogsAfterOperation = await helper.blogsInDb()

        expect(blogsAfterOperation.length).toBe(blogsAtStart.length + 1)
    })
})

describe('deletion of a blog', async () => {
    let addedBlog

    beforeAll(async () => {
     addedBlog = new Blog({
         author: 'poisto',
         title: 'poisto',
         url: 'poisto'
     })
        await addedBlog.save()
    })

    test('DELETE /api/blogs/:id succeeds with proper statuscode', async () => {
        const blogsAtStart = await helper.blogsInDb()


        await api
            .delete(`/api/blogs/${addedBlog._id}`)
            .expect(204)

        const blogsAfterOperation = await helper.blogsInDb()
        const authors = blogsAfterOperation.map(r => r.author)

        expect(blogsAfterOperation).not.toContain(addedBlog.author)
        expect(blogsAfterOperation.length).toBe(blogsAtStart.length - 1)
    })
})

describe('updating a blog', async () => {
    let addedBlog

    beforeAll(async () => {
        addedBlog = new Blog({
            author: 'päivitys',
            title: 'päivitys',
            url: 'päivitys'
        })
        await addedBlog.save()
    })

    test('PUT /api/blogs/:id successful updating of likes with proper statuscode', async () => {
        const updatedBlog = {
            ...helper.format(addedBlog),
            likes: 10
        }

        await api
            .put(`/api/blogs/${addedBlog._id}`)
            .send(updatedBlog)
            .expect(200) //ohjeistuksen mukaan, lähde: rfc2616 https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html

        const blogAfterUpdate = await helper.findInDbById(addedBlog._id)

        expect(blogAfterUpdate.likes).toBe(updatedBlog.likes)
    })
})