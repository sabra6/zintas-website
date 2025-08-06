//Imported files
import {useState} from "react";
import './signup.css';
import logo from '../Zintaslogo.png';
import {useNavigate} from "react-router-dom";

const serverurl=process.env.REACT_APP_SERVER_URL;

//Signup background settings
const background={
  backgroundImage:`url(${logo})`,
  backgroundRepeat:'no-repeat',
  backgroundSize:'cover',
  backgroundPosition:'center'
};

function Signup(){
  //Hook to navigate to a different webpage
  const navigate=useNavigate();

  //State to store user's first name
  const [firstname, setfirstname]=useState('');

  //State to store user's last name
  const [lastname, setlastname]=useState('');

  //State to store user's email
  const [email, setemail]=useState('');

  //State to store user's password
  const [password, setpassword]=useState('');
  
  //State to store user's phone number
  const [phonenumber, setphonenumber]=useState('');

  //Send user's entered information to backend
  async function sendinfo(){
    //Check whether the user filled all the information
    if(firstname.trim()==='' || lastname.trim()==='' || email.trim()==='' || password.trim()==='' || phonenumber.trim()===''){
      alert("Make sure to fill in all the information.");
    } else{
      //Create the body of request
      const info={
        firstname:firstname,
        lastname:lastname,
        email:email,
        password:password,
        phonenumber:phonenumber,
      };

      //Send a POST request to backend to add the user and corresponding info
      const response=await fetch(`${serverurl}/signup`, {
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        credentials:'include',
        body:JSON.stringify(info)
      });

      //Retrieve message from server
      const result=await response.json();

      //Depending on the message from the backend, the user will either navigate to dashboard or an alert will be displayed
      if(result.message==='Exists'){
        alert('Account already exists');
      } else{
        navigate('/dashboard');
      }

    }
    
  }

  
  return(
    <div style={background}>
      <div className="signupbackground">

        {/* Back button to navigate to home page */}
        <button onClick={()=>navigate('/')}className="signupbutton"> Back </button>
        <h1 className="title">Create your Account</h1>

        {/* Get user's input */}
        <input className="question" type="text" placeholder="First name" onChange={(e)=>setfirstname(e.target.value)}/>
        <input className="question" type="text" placeholder="Last name" onChange={(e)=>setlastname(e.target.value)}/>
        <input className="question" type="text" placeholder="Email" onChange={(e)=>setemail(e.target.value)}/>
        <input className="question" type="password" placeholder="Password" onChange={(e)=>setpassword(e.target.value)}/>
        <input className="question" type="text" placeholder="Phone Number (XXX-XXX-XXXX)" onChange={(e)=>setphonenumber(e.target.value)}/>

        {/* Sign up button for calling function sendinfo */}
        <button onClick={sendinfo} className="signupbutton"> Sign Up </button>
        
      </div>
    </div>
  )
}

export default Signup;