import React, {useEffect, useState} from "react";
import './upevents.css';
import logo from '../Zintaslogo.png';
import {useNavigate} from "react-router-dom";

const background={
  backgroundImage:`url(${logo})`,
  backgroundRepeat:'no-repeat',
  backgroundSize:'cover',
  backgroundPosition:'center'
};

function Upcomingevents(){
  const navigate=useNavigate();
  const [data, setdata]=useState([]);

  async function getevents(){
    const response=await fetch('/getevents', {
      method: 'GET',
      headers: {
        'Content-Type':'application/json'
      },
      credentials:'include'
    })
    const result=await response.json();
    console.log(result);
    setdata(result);
  }

  useEffect(()=>{
    getevents();
  }, []);

  return(
    <div style={background}>
      <div className="upeventspage">
        <button onClick={()=>navigate('/mdashboard')} className="upbutton"> Back </button>
        <h1> Upcoming Events </h1>
        <ul>
          {data.map((event, index)=>(
            <li className="upevent" key={index}>{event.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )

}

export default Upcomingevents;