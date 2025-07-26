//Imported files
import {useEffect, useState} from "react";
import './userlist.css';
import logo from '../Zintaslogo.png';
import {useNavigate} from "react-router-dom";

//Userlist background settings
const background={
  backgroundImage:`url(${logo})`,
  backgroundRepeat:'no-repeat',
  backgroundSize:'cover',
  backgroundPosition:'center'
};

function Userlist(){
  //State to store the list of users
  const [data, setdata]=useState([]);

  //State to store the state of whether the user is selected
  const [selected, setselected]=useState(false);

  //State to store what user was selected.
  const [suser, setsuser]=useState([]);

  //State to store user information.
  const [userinfo, setuserinfo]=useState([]);
  const navigate=useNavigate();

  //Popup settings
  const popup={
    position:'fixed',
    backgroundColor: '#C5FAA8',
    top: '50%',
    left: '50%',
    maxheight: '40vh',
    width: 'fit-content',
    transform: 'translate(-50%, -90%)'
  }

  //Retrieve the list of users from backend.
  async function getusers(){

    //Send a GET request to backend to retrieve the list of users. 
    const response=await fetch('/getusers', {
      method: 'GET',
      headers: {
        'Content-Type':'application/json'
      },
      credentials: 'include'
    })

    //Retrieve the list of users from backend and update state.
    const result=await response.json();
    setdata(result);

  }

  //Retrieve the corresponding info of user from backend.
  async function getuserinfo(userid){
    //Create body of request.
    const info={
      userid:userid
    }

    //Send a POST request to backend to retrieve corresponding user information.
    const response=await fetch('/getuserinfo', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      credentials:'include',
      body: JSON.stringify(info)
    })

    //Retrieve the corresponding user information from backend and update state
    const result=await response.json();
    setuserinfo(result);

  }

  //Call getusers function when the user gets to this webpage.
  //Do this one time.
  useEffect(()=>{
    getusers();
  }, []);

  //Set variables and call function.
  function todothings(user){
    setsuser(user);
    setselected(true);
    getuserinfo(user.user_id);
  }

  return(
    <div style={background}> 
    <div className="userlistpage">

      {/* Back button to navigate to manager dashboard. */}
      <button onClick={()=>navigate('/mdashboard')} className="userbutton"> Back </button>

        <h1> Users </h1>

      {/* Display the list of users */}
      <ul>
        {data.map((user, index)=>(
          <li className="user" key={index} onClick={()=>todothings(user)}> {user.first_name} {user.last_name}
          </li>
        ))}
      </ul>
      
        {/* The popup if customer's name was clicked */}
        {selected && (
          <div style={popup}>
            <button className="userbutton" onClick={()=>setselected(false)}>Back</button>
            <p> First Name: {userinfo.first_name}</p>
            <p> Last Name: {userinfo.last_name}</p>
            <p> Email: {userinfo.email}</p>
            <p> Phone Number: {userinfo.phone_number}</p>
          </div>
        )}

    </div>
  </div>
  )
}

export default Userlist;