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

    const info={
      email:email,
      password:password,
    }
    const result= await fetch(`/login`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      credentials:'include',
      body: JSON.stringify(info)
    });

      const data=await result.json()
      
      console.log("Response from Server", data)

      if(data.message==="success"){
        navigate('/dashboard');
      } else if(data.message==="manager"){
        navigate('/mdashboard');
      }else{
        alert(data.message)
      }
      

      // if(data.length>0){
      //   const actualpassword=data[0].password;
      //   if(actualpassword==password){
      //     navigate('/dashboard');
      //   } else{
      //     alert('Login failed');
      //   }
      // } else{
      //   alert('Login Failed. Your account does not exist.')
      // }

  }

 return (
  <div style={background}>
    <div className="loginbackground">
       <button onClick={()=>navigate('/')}className="loginbutton">Back</button>
       <h1>Login</h1>
       <div className="loginsection">
        <p>Email</p>
        <input className="logintextbox" type="text" onChange={(e)=>setemail(e.target.value)}/>
        <p>Password</p>
        <input className="logintextbox" type="password" onChange={(e)=>setpassword(e.target.value)}/>
        <button onClick={ismatch} className="loginbutton"> Login </button>
       </div>
    </div>
  </div>
 )
}
export default Login;