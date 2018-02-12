const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const User = require('../models/user')
const helper = require('./test_helper')

afterAll(() => {
    server.close()
})

describe('addition of new user', async () => {

    beforeAll(async () => {
        await User.remove({})
    })

    test('a valid user can be added', async () => {
        const newUser = {
            username: 'testi',
            name: 'testi',
            password: 'testi',
            legalAge: true
        }
        const usersAtStart = await helper.usersInDb()

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)

        const usersAfter = await helper.usersInDb()

        expect(usersAfter.length).toBe(usersAtStart.length + 1)
    })

    test('user with shorter than 3 character password is not added', async () => {
        const newUser = {
            username: 'testi',
            name: 'testi',
            password: 'te',
            legalAge: true
        }

        const usersAtStart = await helper.usersInDb()

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAfter = await helper.usersInDb()

        expect(usersAfter.length).toBe(usersAtStart.length)
    })

    test('User is not added when they choose existing username', async () => {
        const newUser = {
            username: 'testi2',
            name: 'testi',
            password: 'testi',
            legalAge: true
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)

        const usersAtStart = await helper.usersInDb()

        const anotherUser = {
            username: 'testi2',
            name: 'itset',
            password: 'itset',
            legalAge: true
        }

        await api
            .post('/api/users')
            .send(anotherUser)
            .expect(400)

        const usersAfter = await helper.usersInDb()

        expect(usersAfter.length).toBe(usersAtStart.length)
    })

    test('when no indication of legal age is provided, default to true', async () => {
        const newUser = {
            username: 'testi3',
            name: 'testi3',
            password: 'testi3',
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(201)

        expect(response.body.legalAge).toBe(true)
    })
})