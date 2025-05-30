import React from "react";
import './home.css';
import {useNavigate} from "react-router-dom";
import logo from "../Zintaslogo.png";

function home(){
  return(
    <div className="background">
      <img src={logo} className="companylogo"></img>
      <h1>Welcome to Zintas Website</h1>
    </div>
  )
}

export default home;
