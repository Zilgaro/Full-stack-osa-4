const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
    if (blogs === undefined) {
      return 0
    }
    const total = blogs.reduce((acc, currentValue) =>
      acc + currentValue.likes,
      0
    )
    return total
}

const formatBlog = (blog) => {
  const retBlog = {
    title: blog.title,
    author: blog.author,
    likes: blog.likes
  }
  return retBlog
}

const favouriteBlog = (blogs) => {
  const res = Math.max.apply(Math, blogs.map((blog) => {
    return blog.likes
  }))

  const retBlog = blogs.find((blog) => {
     return blog.likes === res
  })

 return formatBlog(retBlog)
}

module.exports = {
  dummy,
  totalLikes,
  formatBlog,
  favouriteBlog
}
