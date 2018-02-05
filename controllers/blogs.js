const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const mostBlogs = require('../utils/list_helper').mostBlogs

blogsRouter.get('/', (request, response) => {

  Blog
    .find({})
    .then(blogs => {
      console.log(mostBlogs(blogs))
      response.json(blogs)
    })
})

blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

module.exports = blogsRouter
