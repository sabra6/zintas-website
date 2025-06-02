import React from "react";
import './signup.css';
import logo from '../Zintaslogo.png';

const background={
  backgroundImage:`url(${logo})`
};

function Signup(){
  return(
    <div style={background}>
    <div className="signupbackground">
      <button> Back </button>
    </div>
    </div>
  )
}

export default Signup;