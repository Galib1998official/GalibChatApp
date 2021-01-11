const users = []

//addUser , removeUser , getUser , getUserName

const addUser = ({id, username, room})=>{
  //clean the data
  username = username.trim().toLowerCase()
  room = room.trim().toLowerCase()

  //Validate the data
  if (!username || !room) {
    return{
      error: 'Username and room are required'
    }
    
  }
  
  //check for existing users
  const existUser = users.find((user)=>{
      return user.room === room && user.username ===username
  })

  // Validate username
  if(existUser){
    return{
      error:'User is in the room'
    }
  }

  //Finally store it
 const user = {id, username ,room}
 users.push(user)
 return {user}
}
//REMOVE User

const removeUser = (id)=>{
  const index = users.findIndex((user)=>user.id === id)
  if(index !=-1){
    return users.splice(index, 1)[0]
  }

}

//Get User 
const getUser =(id) =>{
  return users.find((user)=> user.id === id)
}

//GetUser in a room

const getUserInRoom = (room) =>{
  return users.filter((user)=>user.room ===room)
  
}



// addUser({id: 98 , username: 'Galib' , room: '  classgroup  '})
// addUser({id: 8 , username: 'Gali' , room: '  classgroup  '})
// addUser({id: 8 , username: 'Galib' , room: '  classgroup  '})
// addUser({id: 8 , username: 'Galib' , room: '  classgroup2  '})
// addUser({id: 983 , username: 'Galib2' , room: '  classgroup2 '})

// const userList = getUserInRoom('classgroup4')
// console.log(userList)
module.exports= {addUser, removeUser,getUser,getUserInRoom}


