const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', {name: 1, username: 1})

    response.json(blogs.map(Blog.format))
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body
    try {
        const decodedToken = jwt.verify(request.token, process.env.SECRET)

        if (!request.token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }

        if (body.title === undefined || body.author === undefined || body.url === undefined) {
            return response.status(400).json({ error: 'required fields are missing' })
        }

        if (body.likes === undefined) {
            body.likes = 0
        }

        const user = await User.findById(decodedToken.id)

        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes,
            user: user._id
        })


        const savedBlog = await blog.save()

        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()

        response.status(201).json(savedBlog)
    } catch (exception) {
            console.log(exception)
            response.status(500).json({error: 'something went wrong...'})
    }
})

blogsRouter.delete('/:id', async (request, response) => {
    try {
        const decodedToken = jwt.verify(request.token, process.env.SECRET)

        const blog = await Blog.findById(request.params.id)

        if (decodedToken.id !== blog.user.toString()) {
            return response.status(401).send({error: 'Unauthorised access'})
        }
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } catch (exception) {
        console.log(exception)
        response.status(400).send({ error: 'malformatted id' })
    }
})

blogsRouter.put('/:id', async (request, response) => {
    try {
        await Blog.findByIdAndUpdate(request.params.id, request.body)
        response.status(200).end()
    } catch (exception) {
        console.log(exception)
        response.status(400).send({ error: 'malformatted id' })
    }
})

module.exports = blogsRouter
