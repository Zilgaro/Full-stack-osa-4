const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  legalAge: Boolean,
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
})

userSchema.statics.format = (user) => {
  return {
    _id: user._id,
    username: user.username,
    name: user.name,
    legalAge: user.legalAge,
    blogs: user.blogs
  }
}

const User = mongoose.model('User', userSchema)

module.exports = User