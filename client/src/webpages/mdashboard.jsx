import React, {useEffect, useState} from "react";
import './dashboard.css';
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
      <div className="dashboardpage">
        <div className="topbuttonbox">
          <button onClick={logout} className="dashbutton"> Log Out </button>
          <h1> Dashboard </h1>
        </div>
      </div>
    </div>
  )
}

export default Mdashboard;