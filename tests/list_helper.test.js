const listHelper = require('../utils/list_helper')
const blogs = require('../utils/listOfBlogs')

test('dummy is called', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  const empty = []

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('when list has multiple blogs equals total of likes', () => {
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(36)
  })

  test('when given no blogs return zero', () => {
    const result = listHelper.totalLikes()
    expect(result).toBe(0)
  })

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(empty)
    expect(result).toBe(0)
  })
})

describe('favourite blog', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog equals that blog', () => {
    const result = listHelper.favouriteBlog(listWithOneBlog)
    //tää vois olla kivampaa jos testais kans ton formatointihommelin ja sitä kaut
    const expected = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5
    }

    expect(result).toEqual(expected)
  })

  test ('when list has multiple blogs gives one blog with highest likes', () => {
    const result = listHelper.favouriteBlog(blogs)

    const expected = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes : 12
    }

    expect(result).toEqual(expected)
  }
  )
})
