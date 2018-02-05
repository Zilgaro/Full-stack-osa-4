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

module.exports = {
  dummy,
  totalLikes
}
