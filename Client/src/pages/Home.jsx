import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { SocketContext } from '../ContextApiProviders/SocketProvider'
import { useNavigate } from 'react-router-dom'

const Home = () => {

  const socket = useContext(SocketContext)
  const navigate = useNavigate()
  
  // socket.emit('join-room' , { roomId : '1' , userId : 'Raghav123'})

  const [email , setEmail] = useState('');
  const [roomId , setRoomId] = useState('');

  const handleJoinRoom = (e) => {
    e.preventDefault();
    socket.emit('join-room' , {roomId : roomId, userId : email});
    navigate(`/room/${roomId}`)
  }

  useEffect(() => {
    socket.on('joined-room' , (data) => console.log("Room Joined... \n credentials :  " , data) )
  } , [socket])
  return (
    <div className='HomePage-container'>
        <form action="submit" onSubmit={handleJoinRoom}>
            <input type="email" placeholder='Enter Your Email Id ' value={email} onChange={e => setEmail(e.target.value)} />
            <input type="text" value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder='Enter Room Code ' />
            <button type='submit'>Join Room</button>

        </form>
    </div>
  )
}

export default Home