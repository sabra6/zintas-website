import React, {useState} from "react";
import './mlogin.css';
import logo from '../Zintaslogo.png';
import {useNavigate} from "react-router-dom";

const background={
  backgroundImage:`url(${logo})`,
  backgroundRepeat:'no-repeat',
  backgroundSize:'cover',
  backgroundPosition:'center'
};

function Mlogin(){
  const navigate=useNavigate();
  return (
  <div style={background}>
    <div className="mloginbackground">
       <button onClick={()=>navigate('/')}className="mloginbutton">Back</button>
       <h1>Manager Login</h1>
       <div className="mloginsection">
        <p>Email</p>
        <input className="mlogintextbox" type="text"/>
        <p>Password</p>
        <input className="mlogintextbox" type="text"/>
        <button className="mloginbutton"> Login </button>
       </div>
    </div>
  </div>
  )
}

export default Mlogin;