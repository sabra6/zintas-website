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
  const [selected, setselected]=useState(false);
  const [eventinfo, seteventinfo]=useState([]);

  const popup={
    position:'fixed',
    backgroundColor: '#C5FAA8',
    top: '50%',
    left: '50%',
    height: '40vh',
    width: '30vh',
    transform: 'translate(-50%, -90%)'
  }

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

  async function geteventinfo(eventid){
    const info={
      eventid:eventid
    }
    const response=await fetch('/geteventinfo', {
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      credentials:'include',
      body:JSON.stringify(info)
    })

    const result=await response.json();
    console.log(result);
    seteventinfo(result);
  }

  useEffect(()=>{
    getevents();
  }, []);

  function afterclick(eventid){
    geteventinfo(eventid);
    setselected(true);
  }

  return(
    <div style={background}>
      <div className="upeventspage">
        <button onClick={()=>navigate('/mdashboard')} className="upbutton"> Back </button>
        <h1> Upcoming Events </h1>
        <ul>
          {data.map((event, index)=>(
            <li onClick={()=>afterclick(event.event_id)}className="upevent" key={index}>{event.name}
            </li>
          ))}
        </ul>
        {selected && (
          <div style={popup}>
            <button className="upbutton" onClick={()=>setselected(false)}> Back </button>
            <p> Event Name : {eventinfo.name}</p>
            <p> Event Kind: {eventinfo.kind}</p>
            <p> Event Datetime: {eventinfo.event_datetime}</p>
            <p> Venue Address: {eventinfo.address} </p>
            <p> Number of Attendees: {eventinfo.number_of_attendees}</p>
            <p> Color Theme: {eventinfo.color_theme}</p>
            <p> List of Items: {eventinfo.items_list}</p>
          </div>
        )}

      </div>
    </div>
  )

}

export default Upcomingevents;