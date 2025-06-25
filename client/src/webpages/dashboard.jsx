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

  const [data, setdata]=useState([]);
  const [name, setname]=useState('');

  async function getinfo(){
    const response= await fetch('/dashboard',{
    method:'POST',
    headers:{
      'Content-Type':'application/json',
    },
    credentials:'include',
    })
    const result=await response.json();
    setdata(result.names)
  }

  async function deleteevent(name){
    setname(name);
    const info={
      eventname:name
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
  getinfo();
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
              <div>
                <button onClick={()=>deleteevent(event.name)}> Delete </button>
                <button onClick={()=>navigate('/editform')}> Edit </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
export default Dashboard;