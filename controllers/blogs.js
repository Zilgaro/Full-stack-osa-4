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

const getTokenFrom = (request) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}


blogsRouter.post('/', async (request, response) => {
    const body = request.body
    try {
        const token = getTokenFrom(request)
        const decodedToken = jwt.verify(token, process.env.SECRET)

        if (!token || !decodedToken.id) {
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
        if (exception.name === 'JsonWebTokenError' ) {
            response.status(401).json({error: exception.message})
        } else {
            console.log(exception)
            response.status(500).json({error: 'something went wrong...'})
        }
    }
})

blogsRouter.delete('/:id', async (request, response) => {
    try {
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
