import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { SocketContext } from '../ContextApiProviders/SocketProvider';
import { PeerContext } from '../ContextApiProviders/PeerProvider';
import ReactPlayer from 'react-player'
const Room = () => {

  const { roomId } = useParams();
  const socket = useContext(SocketContext);
  const [myStream, setMyStream] = useState(null);
  const { createOffer, createAnswer, setRemoteDescriptionAnswer, sendStream } = useContext(PeerContext)

  const handleNewUserConnected = useCallback(async (data) => {
    const { userId, roomId } = data;
    console.log(userId, " joined room ", roomId);
    const offer = await createOffer();
    // console.log(offer);
    socket.emit('signal-user', { userId, offer });
    console.log("Signal-user emitted")

  }, [createOffer, socket])

  const handleIncommingSignal = useCallback(async (data) => {
    console.log("incomming signal from ", data.from);
    console.log("Offer ", data.offer);
    const ans = await createAnswer(data.offer);
    socket.emit('signal-answer', { acceptedId: data.from, answer: ans });
  }, [createAnswer, socket])

  const handleSignalAnswer = useCallback(async (data) => {
    console.log("Into Signal Reply")
    console.log("Answer ", data.answer);
    await setRemoteDescriptionAnswer(data.answer);
  }, [])


  const getUserMediaStream = useCallback(async () => {
    // console.log(navigator.mediaDevices.getUserMedia({ audio: true}))
    // const stream = await navigator.language()
    // setMyStream(stream);
    // sendStream(stream);
  }, [])

  useEffect(() => {

    socket.on('user-connected', handleNewUserConnected);
    socket.on('incoming-signal', handleIncommingSignal)
    socket.on('signal-reply', handleSignalAnswer);
    return () => {
      socket.off('user-connected', handleNewUserConnected);
      socket.off('incoming-signal', handleIncommingSignal);
      socket.off('signal-reply', handleSignalAnswer);

    }
  }, [socket, handleNewUserConnected, handleIncommingSignal, handleSignalAnswer])

  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream])

  return (
    <div>
      <h1>Room Id : {roomId}</h1>
      Hello boii


      <h1>Video Streaming :")</h1>

      <ReactPlayer url={myStream} height={56} >

      </ReactPlayer>
    </div>
  )
}

export default Room