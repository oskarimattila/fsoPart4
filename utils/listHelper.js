const _ = require('lodash')

const totalLikes = (blogs) => {
  return blogs.reduce((acc, blog) => acc + blog.likes, 0)
}
const favoriteBlog = (blogs) => {
  const determineBetter = (a, b) => {
    return a.likes >= b.likes ? a : b
  }
  const result = blogs.reduce(determineBetter)
  let {_id, url, __v, ...ret} = {...result}
  return ret
}
const mostBlogs = (blogs) => {
  const help = (arr) => {
    return arr[1]
  }
  const count = _.countBy(blogs, 'author')
  const max = _.maxBy(Object.entries(count), help)
  const ret = {author: max[0], blogs: max[1]}
  return ret
}
const mostLikes = (blogs) => {
  const help = (arr) => {
    return arr[1]
  }
  const grouped = _.groupBy(blogs, 'author')
  const arr = Object.entries(grouped)
  //arr.map(elem => _.sumBy(elem[1], 'likes'))
  const test = arr.map(elem => [elem[0], _.sumBy(elem[1], 'likes')])
  const ret = _.maxBy(test, help)
  return {author: ret[0], likes: ret[1]}
}

module.exports = {totalLikes, favoriteBlog, mostBlogs, mostLikes}