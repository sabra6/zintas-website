//Imported files
import React, {useState} from "react";
import './signup.css';
import logo from '../Zintaslogo.png';
import {useNavigate} from "react-router-dom";

//Website background settings
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

  //Send user's entered information to backend.
  async function sendinfo(){
    //Form the body of request
    const info={
      firstname:firstname,
      lastname:lastname,
      email:email,
      password:password,
      phonenumber:phonenumber,
    };

    //Send HTTP POST server request to backend.
    const response=await fetch('/signup', {
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      credentials:'include',
      body:JSON.stringify(info)
    });

    //Retrieve message from server.
    const result=await response.json();

    //Go to Dashboard after signing up.
    navigate('/dashboard');

  }

  
  return(
    <div style={background}>
      <div className="signupbackground">

        {/* Back button for going back to home page. */}
        <button onClick={()=>navigate('/')}className="signupbutton"> Back </button>
        <h1 className="title">Create your Account</h1>

        {/* Taking user's information */}
        <input className="question" type="text" placeholder="First name" onChange={(e)=>setfirstname(e.target.value)}/>
        <input className="question" type="text" placeholder="Last name" onChange={(e)=>setlastname(e.target.value)}/>
        <input className="question" type="text" placeholder="Email" onChange={(e)=>setemail(e.target.value)}/>
        <input className="question" type="password" placeholder="Password" onChange={(e)=>setpassword(e.target.value)}/>
        <input className="question" type="text" placeholder="Phone Number" onChange={(e)=>setphonenumber(e.target.value)}/>

        {/* Sign up button for calling function sendinfo */}
        <button onClick={sendinfo} className="signupbutton"> Sign Up </button>
        
      </div>
    </div>
  )
}

export default Signup;