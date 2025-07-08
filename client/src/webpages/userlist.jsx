import React, {useEffect, useState} from "react";
import './userlist.css';
import logo from '../Zintaslogo.png';
import {useNavigate} from "react-router-dom";

const background={
  backgroundImage:`url(${logo})`,
  backgroundRepeat:'no-repeat',
  backgroundSize:'cover',
  backgroundPosition:'center'
};

function Userlist(){
  const [data, setdata]=useState([]);
  const navigate=useNavigate();

  async function getusers(){

  }

  return(
    <div style={background}>
    <div className="userlistpage">
      <button onClick={navigate('/mdashboard')} className="backbutton"> Back </button>
      <div className="mutopbuttonbox">
        <h1> Dashboard </h1>
      </div>
      <div className="userlist">
        <p className="user">User1</p>
      </div>
      <div className="userlist">
          <p className="user"> User2 </p>
          <p className="user"> User3 </p>
      </div>
    </div>
  </div>
  )
}

export default Userlist;