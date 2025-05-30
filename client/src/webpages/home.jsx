import React from "react";
import './home.css';
import {useNavigate} from "react-router-dom";
import logo from "../Zintaslogo.png";

function home(){
  return(
    <div className="background">
      <dix className="container">
      <img src={logo} className="companylogo"></img>
      </dix>
    </div>
  )
}

export default home;
