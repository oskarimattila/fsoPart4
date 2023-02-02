const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', (req, res) => {
  Blog.find({}).then(blogs => {
    res.json(blogs)
  })
})
blogRouter.get('/:id', (req, res, next) => {
  Blog.findById(req.params.id)
    .then(blog => {
      if (!blog) {
        return res.status(404).json({ error: 'blog not found' })
      }
      else res.json(blog)
    })
    .catch(error => next(error))
})

// blogRouter.delete('/:id', (req, res, next) => {
//   blog.findByIdAndRemove(req.params.id)
//     .then(blog => {
//       if (!blog) return res.status(404).json({ error: 'blog not found' })
//       else res.status(204).end()
//     })
//     .catch(error => next(error))
// })

blogRouter.post('/', (req, res, next) => {
  const body = req.body
  const newblog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })
  newblog.save()
    .then(savedblog => {
      res.json(savedblog)
    })
    .catch(error => next(error))
})

blogRouter.put('/:id', (req, res, next) => {
  const { title, author, url, likes } = req.body
  const blog = {
    title: title,
    author: author,
    url: url,
    likes: likes
  }
  Blog.findByIdAndUpdate(
    req.params.id,
    blog,
    { new: true, runValidators: false, context: 'query' }
  )
    .then(updatedblog => {
      res.json(updatedblog)
    })
    .catch(error => next(error))
})

module.exports = blogRouter