const Blog = require('../models/blog')
const initialBlogs = require('../utils/listOfBlogs')



const format = (blog) => {
    return {
        author: blog.author,
        title: blog.title,
        url: blog.url,
        likes: blog.likes
    }
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(format)
}

module.exports = {
     format, blogsInDb
}