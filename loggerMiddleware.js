const logger = (resquest, response, next) => {
  console.log(resquest.method)
  console.log(resquest.path)
  console.log(resquest.body)
  console.log('-----')
  next()
}

module.exports = logger
