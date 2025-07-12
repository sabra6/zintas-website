import React, {useEffect, useState} from "react";
import './mdashboard.css';
import logo from '../Zintaslogo.png';
import {useNavigate} from "react-router-dom";

const background={
  backgroundImage:`url(${logo})`,
  backgroundRepeat:'no-repeat',
  backgroundSize:'cover',
  backgroundPosition:'center'
};

function Mdashboard(){
  const navigate=useNavigate();

  async function logout(){
    const response=await fetch('/logout', {
      method:'POST', 
      headers:{
        'Content-Type':'application/json', 
      },
      credentials:'include',
    })
    const result=await response.json();
    alert(result.message);
    navigate('/');
  }

  return(
    <div style={background}>
      <div className="mdashboardpage">
        <button onClick={logout} className="logoutbutton"> Log Out </button>
        <div className="topbuttonbox">
          <h1> Dashboard </h1>
        </div>
        <div className="optionboxes">
          <p className="options" onClick={()=>navigate('/notifications')}>Notifications</p>
        </div>
        <div className="optionboxes">
            <p className="options" onClick={()=>navigate('/userlist')}> Users </p>
            <p className="options" onClick={()=>navigate('/upevents')}> Upcoming Events </p>
        </div>
      </div>
    </div>
  )
}

export default Mdashboard;