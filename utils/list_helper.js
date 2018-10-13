const dummy = (blogs) => {
  console.log('Running dummy test', blogs)
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (accumulator, currentValue) => accumulator + currentValue
  if(blogs) {
    return blogs.map(blog => blog.likes).reduce(reducer,0)
  }
  return 0
}

module.exports = {
  dummy, totalLikes
}
