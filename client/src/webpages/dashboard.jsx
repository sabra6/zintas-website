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


function Dashboard(){

  const [data, setdata]=useState([]);

  useEffect(()=>{
    async function getinfo(){
      const response= await fetch('/dashboard',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      credentials:'include',
      })
      const result=await response.json();
      setdata(result.eventinfo)
    }
    getinfo();
  }, []);

  async function deleteevent(event_id){
    const info={
      event_id:event_id
    }
    const response=await fetch('/deleteevent', {
      method: 'POST',
      headers:{
        'Content-Type':'application/json',
      },
      credentials:'include',
      body:JSON.stringify(info)
    });

    const result=await response.json();
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
  //getinfo();
  return(
    <div style={background}>
      <div className="dashboardpage">
        <div className="topbuttonbox">
          <button onClick={logout} className="button"> Log Out </button>
          <h1> Dashboard </h1>
          <button onClick={()=> navigate('/eventform')} className="button"> Book an Event </button>
        </div>
        <ul className="letterbox">
          {data.map((event, index)=>(
            <li className="event" key={index}>{event.name}
              <div className="dbuttonbox">
                <button className="button"onClick={()=>deleteevent(event.event_id)}> Delete </button>
                <button className="button" onClick={()=>navigate(`/editform/${event.event_id}`)}> Edit </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
export default Dashboard;