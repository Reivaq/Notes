module.exports = (error, request, response, next) => {
  console.error(error)
  console.log(error.name)
  if (error.name === 'CastError') {
    response.status(400).send({ error: ' id used malformed' })
  } else {
    response.status(500).end()
  }
  response.status(404).end()
}
