import React from "react";
import './signup.css';
import logo from '../Zintaslogo.png';
import {useNavigate} from "react-router-dom";

const background={
  backgroundImage:`url(${logo})`,
  backgroundRepeat:'no-repeat',
  backgroundSize:'cover',
  backgroundPosition:'center'
};

function Signup(){
  const navigate=useNavigate();
  return(
    <div style={background}>
    <div className="signupbackground">
      <button onClick={()=>navigate('/')}className="button"> Back </button>
      <h1 className="title">Create your Account</h1>
      <input className="question" type="text" placeholder="First name"/>
      <input className="question" type="text" placeholder="Last name"/>
      <input className="question" type="text" placeholder="Email"/>
      <input className="question" type="text" placeholder="Password"/>
      <input className="question" type="text" placeholder="Phone Number"/>
      <button className="button"> Sign Up </button>
    </div>

    </div>
  )
}

export default Signup;