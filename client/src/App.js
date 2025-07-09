import React from "react";
import './App.css';
import Home from './webpages/home';
import Signup from './webpages/signup';
import Login from './webpages/login';
import Dashboard from "./webpages/dashboard";
import Eventform from "./webpages/eventform";
import Editform from "./webpages/editform";
import Mdashboard from "./webpages/mdashboard";
import Userlist from "./webpages/userlist";
import Upcomingevents from "./webpages/upevents";

import {BrowserRouter as Router, Route, Routes} from "react-router-dom";


function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/eventform" element={<Eventform/>}/>
          <Route path="/editform/:event_id" element={<Editform/>}/>
          <Route path="/mdashboard" element={<Mdashboard/>}/>
          <Route path="/userlist" element={<Userlist/>}/>
          <Route path="/upevents" element={<Upcomingevents/>}/>
        </Routes>
      </Router>
  );
  
}

export default App;
