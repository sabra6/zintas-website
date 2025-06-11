import React, {useState} from "react";
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
 const [email, setemail]=useState('');
 const [password, setpassword]=useState('');
 
 async function ismatch(){
    const result= await fetch(`/login?email=${email}`,{
      method:'GET',
      headers:{
        'Content-Type':'application/json',
      },
    });
      const data=await result.json()
      console.log("Response from Server", data)

      if(data.length>0){
        const actualpassword=data[0].password;
        if(actualpassword==password){
          navigate('/dashboard');
        } else{
          alert('Login failed');
        }
      } else{
        alert('Login Failed. Your account does not exist.')
      }

  }

 return (
  <div style={background}>
    <div className="loginbackground">
       <button onClick={()=>navigate('/')}className="button">Back</button>
       <h1>Login</h1>
       <div className="loginsection">
        <p>Email</p>
        <input className="textbox" type="text" onChange={(e)=>setemail(e.target.value)}/>
        <p>Password</p>
        <input className="textbox" type="text" onChange={(e)=>setpassword(e.target.value)}/>
        <button onClick={ismatch} className="button"> Login </button>
       </div>
    </div>
  </div>
 )
}
export default Login;