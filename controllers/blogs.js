const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const validateToken = (token) => {
  if (!token) return res.status(401).json({error: 'Could not extract token'})
  const decodedToken = jwt.verify(token, process.env.SECRET)
  return decodedToken
}

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})
blogRouter.get('/:id', async (req, res, next) => {
  const blog = await Blog.findById(req.params.id)
    if (!blog) {
      return res.status(404).json({ error: 'blog not found' })
    }
    else res.json(blog)
})

blogRouter.delete('/:id', async (req, res, next) => {
  const auth = validateToken(req.token)
  const blog = await Blog.findById(req.params.id)
  const user = req.user
  if (!blog) return res.status(404).json({ error: 'blog not found' })
  if (blog.user.toString() !== user.id.toString()) return res.status(401).json({error: "blog not created by user"})
  await Blog.findByIdAndRemove(blog.id)
  console.log('Blog id: ', blog.id.toString())
  user.blogs = user.blogs.filter(id => id.toString() !== blog.id.toString())
  await user.save()
  res.status(204).end()
})

blogRouter.post('/', async (req, res, next) => {
  const body = req.body
  const auth = validateToken(req.token)
  const user = req.user
  console.log('req.user', user)
  
  const newblog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id
  })
  const savedBlog = await newblog.save()
  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()
  res.json(savedBlog)
})

blogRouter.put('/:id', async (req, res, next) => {
  const { title, author, url, likes } = req.body
  const newBlog = {
    title: title,
    author: author,
    url: url,
    likes: likes
  }
  const updatedBlog =  await Blog.findByIdAndUpdate(
    req.params.id,
    newBlog,
    { new: true, runValidators: false, context: 'query' }
  )
  res.json(updatedBlog)
})

module.exports = blogRouter