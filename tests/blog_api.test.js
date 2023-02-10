const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')


const api = supertest(app)

test('notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('Notes have an identifying value id', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[3].id).toBeDefined()
})

test('Adding a blog increments the length of response array by 1', async () => {
  const firstResponse = await api.get('/api/blogs')
  const length = firstResponse.body.length
  const newBlog = new Blog({
    title: "Testaus",
    author: "okko",
    url: "http://google.com",
    likes: 0
  })
  await newBlog.save()
  const secondResponse = await api.get('/api/blogs')
  expect(secondResponse.body.length).toBe(length + 1)
})

test('Leaving out content responds with status code 400, bad request', async () => {
  const reqBody = {
    title: '',
    author:'',
    url: '',
    likes: 0,
  }
  await api
    .post('/api/blogs')
    .send(reqBody)
    .expect(400)
})

test('Deleting', async () => {
  const res = await api.get('/api/blogs')
  const id = res.body[0].id
  await api
    .delete(`/api/blogs/${id}`)
    .expect(204)
})

test('Adding like', async () => {
  const res = await api.get('/api/blogs')
  const [id, likes] = [res.body[0].id, res.body[0].likes]
  const updated = {...res.body[0], likes: likes + 1}
  const response = await api.put(`/api/blogs/${id}`).send(updated)
  console.log(response.body.likes)
  expect(response.body.likes).toBe(likes + 1)
})


afterAll(async () => {
  await mongoose.connection.close()
})
