import React from "react";
import './App.css';
import Home from './webpages/home';
import Signup from './webpages/signup';
import Login from './webpages/login';

import {BrowserRouter as Router, Route, Routes} from "react-router-dom";


function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/login" element={<Login/>}/>
        </Routes>
      </Router>
  );
  
}

export default App;
