const logger = (request, response, next) => {
  if ( process.env.NODE_ENV === 'test' ) {
    return next()
  }
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const error = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

const tokenExtractor = (request, response, next) => {
  try {
    const token = getTokenFrom(request)

    request.token = token

    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return response.status(401).json({
        error: error.message
      })
    }
  }
}

module.exports = {
  logger,
  error,
  tokenExtractor
}