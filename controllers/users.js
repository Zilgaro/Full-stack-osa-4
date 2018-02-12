const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
    try {
        const body = request.body

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        const user = new User({
            username: body.username,
            name: body.name,
            passwordHash,
            legalAge: body.legalAge
        })

        const savedUser = await user.save()

        response.json(savedUser)
    } catch (exception) {
        console.log(exception)
        response.status(500).json({ error: 'something went wrong...' })
    }
})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    const newArray = users.map((u) => {
        return {
            _id: u.id,
            username: u.username,
            name: u.name,
            legalAge: u.legalAge
        }
    })
    response.json(newArray)
})

module.exports = usersRouter