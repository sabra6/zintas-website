import React from "react";
import './App.css';
import Home from './webpages/home';

import {BrowserRouter as Router, Route, Routes} from "react-router-dom";


function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
        </Routes>
      </Router>
  );
  
}

export default App;
