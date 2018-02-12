const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    try {
        const blog = new Blog(request.body)

        if (blog.title === undefined || blog.author === undefined || blog.url === undefined) {
            return response.status(400).json({ error: 'required fields are missing' })
        }

        if (blog.likes === undefined) {
            blog.likes = 0
        }

        const savedBlog = await blog.save()
        response.status(201).json(savedBlog)
    } catch (exception) {
        console.log(exception)
        response.status(500).json({ error: 'something went wrong...' })
    }
    
})

module.exports = blogsRouter
