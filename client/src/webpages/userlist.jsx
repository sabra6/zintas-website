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
    const response=await fetch('/getusers', {
      method: 'GET',
      headers: {
        'Content-Type':'application/json'
      },
      credentials: 'include'
    })

    const result=await response.json();
    setdata(result);
  }

  useEffect(()=>{
    getusers();
  }, []);

  return(
    <div style={background}>
    <div className="userlistpage">
      <button onClick={()=>navigate('/mdashboard')} className="userbutton"> Back </button>
        <h1> Users </h1>
      <ul>
        {data.map((user, index)=>(
          <li className="user" key={index}> {user.first_name} {user.last_name}
          </li>
        ))}
      </ul>
    </div>
  </div>
  )
}

export default Userlist;