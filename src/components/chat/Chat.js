import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from "socket.io-client";

import './chat.css';
import Messages from '../messages/Messages'
import TextContainer from '../../containers/textContainer/TextContainer';
import InfoBar from '../../containers/infoBar/InfoBar';
import Input from '../../containers/input/Input';

let socket;

const Chat = (props) => {
  const {location} = props

  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const ENDPOINT = 'http://localhost:5000/';

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setRoom(room);
    setName(name)

    socket.emit('join', { name, room }, (error) => {
      if(error) {
        alert(error);
      }
    });
  }, [ENDPOINT, location.search]);


  useEffect(() => {
    socket.on('message', (message) => {
      console.log(message)
      console.log(messages)
      setMessages([...messages, message ]);
      console.log(messages)
    });

    socket.on('roomData', ({ users }) => {
      setUsers(users);
    })

    return () => {
      socket.emit('disconnect');

      socket.off();
    }
  }, [messages])

  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  return (
    <div className="outerContainer">
      <div className="container">
          <InfoBar room={room} />
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      <TextContainer users={users}/>
    </div>
  );
}

export default Chat;

