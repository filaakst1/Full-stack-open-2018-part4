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

const mostBlogs = (blogs) => {
  if(blogs) {
    if(blogs.length === 0 ) {
      return undefined
    }
    let blogAmountMap = []
    blogs.map(blog => blog.author)
      .forEach(author => {
        const index = blogAmountMap.map(mapItem => mapItem.author).indexOf(author)
        if(index !== -1 ){
          blogAmountMap[index].blogs += 1
        }else {
          const newEntry = {
            author: author,
            blogs: 1
          }
          blogAmountMap= blogAmountMap.concat(newEntry)
        }
      })
    return blogAmountMap.reduce((a,b) => a.blogs >= b.blogs ? a: b)

  }
  return undefined
}

const mostLikes = (blogs) => {
  if(blogs) {
    if(blogs.length === 0 ) {
      return undefined
    }
    let blogAmountMap = []
    blogs.forEach(blog => {
      const index = blogAmountMap.map(mapItem => mapItem.author).indexOf(blog.author)
      if(index !== -1 ){
        blogAmountMap[index].likes += blog.likes
      }else {
        const newEntry = {
          author: blog.author,
          likes: blog.likes
        }
        blogAmountMap= blogAmountMap.concat(newEntry)
      }
    })
    return blogAmountMap.reduce((a,b) => a.likes >= b.likes ? a: b)

  }
  return undefined
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs,mostLikes
}
