const generateData = (username,text)=>{
  return{
    username,
    text,
    createdAt: new Date().getTime()
  }
}

const locationTime = (username,url)=>{
  return{
    username,
    url,
    createdAt: new Date().getTime()
  }
}

module.exports = {
  generateData , locationTime
}