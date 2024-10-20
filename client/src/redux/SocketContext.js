// SocketContext.js
import React, { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

import { useSelector } from 'react-redux';

// Create Context
export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socketConnection, setSocketConnection] = useState(null);
  const user=useSelector(state=>state.user)
  useEffect(() => {
    if(user){

      const socket = io(process.env.REACT_APP_ENDPOINT_URL, {
        auth: {
        token: localStorage.getItem('token'),
      },
    });

    socket.on('connect', () => {
      console.log('Connected to socket');
    });
    socket.on('disconnect', () => {
      console.log('Disconnected from socket');
    });

    setSocketConnection(socket);

    // Cleanup when component is unmounted
    return () => {
      socket.disconnect();
    };
  }
  },[]);

  return (
    <SocketContext.Provider value={socketConnection}>
      {children}
    </SocketContext.Provider>
  );
};
