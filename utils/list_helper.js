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


const favoriteBlog = (blogs) => {
  if(blogs) {
    if(blogs.length === 0 ) {
      return undefined
    }
    const reducer = (accumulator, currentValue) => accumulator.likes >= currentValue.likes ? accumulator : currentValue

    const mapper = (blog) => {
      return {
        title: blog.title,
        author: blog.author,
        likes: blog.likes
      }
    }
    return blogs.map(mapper).reduce(reducer)
  }
  return undefined
}

module.exports = {
  dummy, totalLikes,favoriteBlog
}
