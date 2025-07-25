//Imported files
import React, {useState} from "react";
import './login.css';
import logo from '../Zintaslogo.png';
import {useNavigate} from "react-router-dom";

//Webpage background settings
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
 
 //Send the entered login info to backend to determine if there is a match with database.
 async function ismatch(){
    //Form the body of request.
    const info={
      email:email,
      password:password,
    }

    //Send the HTTP POST server request to backend.
    const result= await fetch(`/login`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      credentials:'include',
      body: JSON.stringify(info)
    });

    //Retrieve the message from backend.
    const data=await result.json()

    //Depending on the message from the backend, the user will either go to dashboard, go to manager dashboard, or recieve an alert.
    if(data.message==="success"){
      navigate('/dashboard');
    } else if(data.message==="manager"){
      navigate('/mdashboard');
    }else{
      alert(data.message)
    }
  }

 return (
  <div style={background}>
    <div className="loginbackground">

       {/* Back button to go back to home page */}
       <button onClick={()=>navigate('/')}className="loginbutton">Back</button>
       <h1>Login</h1>
       <div className="loginsection">

        {/* Retrieve login input from user */}
        <p>Email</p>
        <input className="logintextbox" type="text" onChange={(e)=>setemail(e.target.value)}/>
        <p>Password</p>
        <input className="logintextbox" type="password" onChange={(e)=>setpassword(e.target.value)}/>

        {/* Login button to call ismatch function */}
        <button onClick={ismatch} className="loginbutton"> Login </button>
        
       </div>
    </div>
  </div>
 )
}
export default Login;