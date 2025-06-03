import React from "react";
import './login.css';
import logo from '../Zintaslogo.png';
import {useNavigate} from "react-router-dom";

const background={
  backgroundImage:`url(${logo})`,
  backgroundRepeat:'no-repeat',
  backgroundSize:'cover',
  backgroundPosition:'center'
};

function Login(){
 const navigate=useNavigate();

 return (
  <div style={background}>
    <div className="loginbackground">
       <button onClick={()=>navigate('/')}className="button">Back</button>
       <h1>Login</h1>
       <div className="loginsection">
        <p>Username</p>
        <input className="textbox" type="text"/>
        <p>Password</p>
        <input className="textbox" type="text"/>
       </div>
       <button className="button"> Login </button>
    </div>
  </div>
 )
}
export default Login;