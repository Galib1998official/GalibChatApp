const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateData , locationTime} = require('./utils/message');
const {addUser,removeUser,getUser,getUserInRoom} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')
    socket.on('join' , ({username, room},callback) =>{
      const {error,user}= addUser({id:socket.id,username,room})
      if (error) {
        return callback(error);
      }
      socket.join(user.room)
      socket.emit('message', generateData('Admin','Welcome!'));
      socket.broadcast.to(user.room).emit('message' , generateData(`${user.username} has joined!`));

      io.to(user.room).emit('roomData',{
        room: user.room,
        users: getUserInRoom(user.room)
      })

      callback();

      //socket.emit, io.emit , socket.broadcast.emit from server to client
      //io.to.emit , socket.broadcast.to.emit these are pparticular room

    })

    socket.on('sendMessage', (message , callback) => {
      const filter = new Filter();
      const user = getUser(socket.id)
      
      if(filter.isProfane(message)){
        return callback('Profiniety isnot allowed!');
      }
        io.to(user.room).emit('message', generateData(user.username,message))
        callback()
    })

    socket.on('disconnect' ,()=>{
      const user= removeUser(socket.id)
      if(user){
        io.to(user.room).emit('message' , generateData('Admin',`${user.username} has left the room`))
        io.to(user.room).emit('roomData',{
          room: user.room,
          users: getUserInRoom(user.room)
        })
      }
     
    })

    socket.on('location' , (coords,callback)=>{
      const user = getUser(socket.id);
      io.to(user.room).emit('locationMessage' , locationTime(user.username,`https://google.com/maps?q=${coords.lat},${coords.long}`));
      callback()
    })

    
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})