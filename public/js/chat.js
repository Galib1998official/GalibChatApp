// const e = require("express");


// const socket = io();

// socket.on('countUpdated' , (count)=>{
//   console.log("The count has been updated", count)
// })

// document.querySelector('#increment').addEventListener('click' , ()=>{
//   console.log('Clicked');
//   socket.emit('increment');
// })

// socket.on('Greet' , (msg)=>{
//   console.log(msg);
// })

// document.querySelector('#message-forms').addEventListener('submit' , (m)=>{
//   m.preventDefault();

//   const message = document.querySelector('input').value;


const socket = io()
const $form = document.querySelector('#message-form')
const $input =$form.querySelector('input')
const $button = $form.querySelector('button');
const $location = document.querySelector('#location')
const $messages = document.querySelector('#messages')
const $sidebar = document.querySelector('#sidebar')
// const $locate = document.querySelector('#locate')


///Tempaltes
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate =document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
//Options

const{username , room}=Qs.parse(location.search,{ignoreQueryPrefix: true})

const autoScroll = () =>{
  //New Message Elements
  const $newMessage = $messages.lastElementChild

  //Height of the new element
  const newMessageStyle = getComputedStyle($newMessage)
  
  
  const newMessageMargin = parseInt(newMessageStyle.marginBottom)
  const newMessageHeight = $newMessage.offsetHeight+newMessageMargin

  //visible Height
  const visibleHeight = $messages.offsetHeight

  //Height of message container
  const containerHeight = $messages.scrollHeight

  //How far have i scrolled
  const scrolloffset = $messages.scrollTop + visibleHeight

  if(containerHeight-newMessageHeight<=scrolloffset){
      $messages.scrollTop = $messages.scrollHeight
  }

  console.log(newMessageMargin)
}

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate ,{
      username: message.username,
      message:message.text,
      createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})
socket.on('locationMessage', (a)=>{
  console.log(a);
  const html = Mustache.render(locationTemplate, {
    username: a.username,
    a: a.url,
    createdAt: moment(a.createdAt).format('h:mm a')
  })
  $messages.insertAdjacentHTML('beforeend', html)
  autoScroll()
})

socket.on('roomData' , ({room,users})=>{
  const html = Mustache.render(sidebarTemplate,{
    room,
    users
  })
  $sidebar.innerHTML = html
})

$form.addEventListener('submit', (e) => {
    e.preventDefault()

    //Disable for sometime
    $button.setAttribute('disabled' , 'diabled');

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message ,(error)=>{
      $button.removeAttribute('disabled')
      $input.value = ''
      $input.focus()
      
      console.log('Message delivered!')
      
    })
})

$location.addEventListener('click' , ()=>{
  if(!navigator.geolocation){
    return alert('Geo location is not there in your browser!');
  }
  $location.setAttribute('disabled' , 'disabled');

  navigator.geolocation.getCurrentPosition((position)=>{
      // console.log(position);
      socket.emit('location' ,  
      {
       
        long: position.coords.longitude,
        lat: position.coords.latitude
      },()=>{
        $location.removeAttribute('disabled')
        console.log("Location Shared!")
      });
  })
})
//for join
socket.emit('join' , {username , room},(error)=>{
    if(error){
      alert(error);
      location.href='/'
    }
})
