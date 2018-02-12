const mongoose = require('mongoose')

const User = mongoose.model('User', {
  username: String,
  passwordHash: String,
  name: String,
  legalAge: Boolean
})

module.exports = User