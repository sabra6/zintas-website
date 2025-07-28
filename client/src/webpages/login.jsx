//Imported files
import {useState} from "react";
import './login.css';
import logo from '../Zintaslogo.png';
import {useNavigate} from "react-router-dom";

//Login background settings
const background={
  backgroundImage:`url(${logo})`,
  backgroundRepeat:'no-repeat',
  backgroundSize:'cover',
  backgroundPosition:'center'
};

function Login(){
 //Hook to navigate to a different webpage 
 const navigate=useNavigate();

 //State to store the email
 const [email, setemail]=useState('');
 
 //State to store the password
 const [password, setpassword]=useState('');
 
 //Send the entered login information to backend to determine accuracy
 async function ismatch(){
    //Make sure the user doesn't leave blanks
    if(email.trim()==='' || password.trim()===''){
      alert('Make sure to fill in all the information');
    } else{
      //Create the body of request
      const info={
        email:email,
        password:password,
      }

      //Send a POST request to backend to determine login information accuracy
      const result= await fetch(`/login`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        credentials:'include',
        body: JSON.stringify(info)
      });

      //Retrieve the message from the backend
      const data=await result.json()

      //Depending on the message from the backend, the user will either go to dashboard, go to manager dashboard, or display the message
      if(data.message==="success"){
        navigate('/dashboard');
      } else if(data.message==="manager"){
        navigate('/mdashboard');
      }else{
        alert(data.message)
      }
    }
    
  }

 return (
  <div style={background}>
    <div className="loginbackground">

       {/* Back button to navigate to home page */}
       <button onClick={()=>navigate('/')}className="loginbutton">Back</button>
       <h1>Login</h1>

       <div className="loginsection">

        {/* Retrieve user input */}
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