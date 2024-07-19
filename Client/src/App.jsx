import logo from './logo.svg';
import React, { useContext, useEffect, useState } from 'react';
import { nanoid } from 'nanoid'
// import io from 'socket.io-client'
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SocketProvider, { SocketContext } from './ContextApiProviders/SocketProvider';
import Room from './pages/Room';
import PeerProvider from './ContextApiProviders/PeerProvider';

// const socket = io.connect('http://localhost:4000');

function App() {



  return (
    <div className="App">
      <SocketProvider>
        <PeerProvider>
        <Routes>

          <Route path='/' Component={Home} />
          < Route path='/room/:roomId' Component={Room}/>
        </Routes>
        </PeerProvider>
      </SocketProvider>
    </div>
  );
}

export default App;
