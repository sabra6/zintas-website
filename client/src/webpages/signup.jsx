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
    </div>
    </div>
  )
}

export default Signup;