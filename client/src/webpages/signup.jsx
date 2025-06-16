import React, {useState} from "react";
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
  const [firstname, setfirstname]=useState('');
  const [lastname, setlastname]=useState('');
  const [email, setemail]=useState('');
  const [password, setpassword]=useState('');
  const [phonenumber, setphonenumber]=useState('');

  async function sendinfo(){

    const info={
      firstname:firstname,
      lastname:lastname,
      email:email,
      password:password,
      phonenumber:phonenumber,
    };

    const response=await fetch('/signup', {
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      credentials:'include',
      body:JSON.stringify(info)
    });

    const result=await response.json();
    navigate('/dashboard');
    console.log(result);

  }

  
  return(
    <div style={background}>
    <div className="signupbackground">
      <button onClick={()=>navigate('/')}className="button"> Back </button>
      <h1 className="title">Create your Account</h1>
      <input className="question" type="text" placeholder="First name" onChange={(e)=>setfirstname(e.target.value)}/>
      <input className="question" type="text" placeholder="Last name" onChange={(e)=>setlastname(e.target.value)}/>
      <input className="question" type="text" placeholder="Email" onChange={(e)=>setemail(e.target.value)}/>
      <input className="question" type="text" placeholder="Password" onChange={(e)=>setpassword(e.target.value)}/>
      <input className="question" type="text" placeholder="Phone Number" onChange={(e)=>setphonenumber(e.target.value)}/>
      <button onClick={sendinfo} className="button"> Sign Up </button>
    </div>

    </div>
  )
}

export default Signup;