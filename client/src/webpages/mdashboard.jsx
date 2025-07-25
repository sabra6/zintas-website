//Imported files
import React, {useEffect, useState} from "react";
import './mdashboard.css';
import logo from '../Zintaslogo.png';
import {useNavigate} from "react-router-dom";

//Webpage background settings
const background={
  backgroundImage:`url(${logo})`,
  backgroundRepeat:'no-repeat',
  backgroundSize:'cover',
  backgroundPosition:'center'
};

function Mdashboard(){
  const navigate=useNavigate();

  //Log out the user and then go to home page.
  async function logout(){

    //Send HTTP POST server request to backend.
    const response=await fetch('/logout', {
      method:'POST', 
      headers:{
        'Content-Type':'application/json', 
      },
      credentials:'include',
    })

    //Retrieve message from backend.
    const result=await response.json();

    //Print out the message from the backend.
    alert(result.message);

    //Go to the home page.
    navigate('/');

  }

  return(
    <div style={background}>
      <div className="mdashboardpage">
        {/* Log Out Button for calling logout function */}
        <button onClick={logout} className="logoutbutton"> Log Out </button>
        <div className="topbuttonbox">
          <h1> Dashboard </h1>
        </div>
        {/* Format the manager options */}
        <div className="optionboxes">
          {/* Go to notifications page once notifications option is clicked */}
          <p className="options" onClick={()=>navigate('/notifications')}>Notifications</p>
        </div>
        <div className="optionboxes">
          {/* Go to userlist page once Users option is clicked */}
          <p className="options" onClick={()=>navigate('/userlist')}> Users </p>
          {/* Go to upevents page once Upcoming Events option is clicked */}
          <p className="options" onClick={()=>navigate('/upevents')}> Upcoming Events </p>
        </div>
      </div>
    </div>
  )
}

export default Mdashboard;