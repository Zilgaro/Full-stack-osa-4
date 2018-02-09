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

const mostBlogs = (blogs) => {
  const res = blogs.map((blog) => {
    return blog.author
  })

  let mostFreq = { author: '', blogs: 0}
  //itken sisäisesti
  for (let i = 0; i < res.length; i++) {
    let found = 1
    for (let j = i + 1; j < res.length; j++) {
      if (res[i] === res[j]) {
        found = found + 1
      }
    }
    if (found > mostFreq.blogs) {
      mostFreq = {author: res[i], blogs: found}
    }
  }
  return mostFreq
}

const mostLikes = (blogs) => {

  let mostLikes = {author: '', likes: 0}

  for (let i = 0; i < blogs.length; i++) {
    let likes = blogs[i].likes
    for (let j = i + 1; j < blogs.length; j++) {
      if (blogs[i].author === blogs[j].author) {
        likes = likes + blogs[j].likes
      }
    }

    if (likes > mostLikes.likes) {
      mostLikes = {author: blogs[i].author, likes: likes}
    }
  }
  return mostLikes 
}

module.exports = {
  dummy,
  totalLikes,
  formatBlog,
  favouriteBlog,
  mostBlogs,
  mostLikes
}