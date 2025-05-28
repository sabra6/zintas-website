import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from 'react';

function App() {
  const [message, setMessage]=useState('');

  useEffect(()=>{
    fetch('/api/message')
      .then(response=>response.json())
      .then(data=>setMessage(data.message))
      .catch(err => console.error("Error getting message", err));
  }, []);

  return <h1>{message}</h1>
}

export default App;
