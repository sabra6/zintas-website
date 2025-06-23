import React, {useState} from "react";
import './dashboard.css';
import logo from '../Zintaslogo.png';
import {useNavigate} from "react-router-dom";

const background={
  backgroundImage:`url(${logo})`,
  backgroundRepeat:'no-repeat',
  backgroundSize:'cover',
  backgroundPosition:'center'
};


function Dashboard(){

  const [data, setdata]=useState('');

  async function getinfo(){
    const response= await fetch('/dashboard',{
    method:'POST',
    headers:{
      'Content-Type':'application/json',
    },
    credentials:'include',
    })
    //const data=await response.json();
    setdata(await response.json())
  }

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

  const navigate=useNavigate();
  getinfo();
  return(
    <div style={background}>
      <div className="dashboardpage">
        <div className="topbuttonbox">
          <button onClick={logout} className="button"> Log Out </button>
          <h1> Dashboard </h1>
          <button onClick={()=> navigate('/eventform')} className="button"> Book an Event </button>
        </div>
        <div className="letterbox">
          <div className="event">
            <h1>{data.name}</h1>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Dashboard;