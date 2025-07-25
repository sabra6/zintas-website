//Imported files
import React, {useEffect, useState} from "react";
import './userlist.css';
import logo from '../Zintaslogo.png';
import {useNavigate} from "react-router-dom";

//Webpage background settings
const background={
  backgroundImage:`url(${logo})`,
  backgroundRepeat:'no-repeat',
  backgroundSize:'cover',
  backgroundPosition:'center'
};

function Userlist(){
  const [data, setdata]=useState([]);
  const [selected, setselected]=useState(false);
  const [suser, setsuser]=useState([]);
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

  //Retrieve the list of users.
  async function getusers(){

    //Send a HTTP GET request to server. 
    //Included credentials since server has cookies.
    const response=await fetch('/getusers', {
      method: 'GET',
      headers: {
        'Content-Type':'application/json'
      },
      credentials: 'include'
    })

    //Retrieve the server's response.
    const result=await response.json();
    setdata(result);

  }

  //Retrieve the corresponding info of user.
  async function getuserinfo(userid){
    //Form body of request.
    const info={
      userid:userid
    }

    //Send HTTP POST request to server.
    const response=await fetch('/getuserinfo', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      credentials:'include',
      body: JSON.stringify(info)
    })

    //Retrieve the server's response.
    const result=await response.json();
    setuserinfo(result);

  }

  //call getusers function when the user gets to this webpage.
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

      {/* Back button to go back to the manager dashboard. */}
      <button onClick={()=>navigate('/mdashboard')} className="userbutton"> Back </button>

        <h1> Users </h1>

      {/* Print out each user from the list of users */}
      <ul>
        {data.map((user, index)=>(
          <li className="user" key={index} onClick={()=>todothings(user)}> {user.first_name} {user.last_name}
          </li>
        ))}
      </ul>
      
        {/* The popup if the manager clicked on the customer's name */}
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