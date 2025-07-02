import React, {useEffect, useState} from "react";
import './eventform.css';
import logo from '../Zintaslogo.png';
import { useNavigate } from "react-router-dom";

const background={
  backgroundImage:`url(${logo})`,
  backgroundRepeat:'no-repeat',
  backgroundSize:'cover',
  backgroundPosition:'center'
};

function Eventform(){
  const navigate=useNavigate();
  const [eventname, seteventname]=useState('');
  const [eventkind, seteventkind]=useState('');
  const [eventdatetime, seteventdatetime]=useState('');
  const [venueaddress, setvenueaddress]=useState('');
  const [numattendees, setnumattendees]=useState('');
  const [colortheme, setcolortheme]=useState('');
  const [itemslist, setitemslist]=useState('');
  const [sservices, setsservices]=useState({});
  const [services, setservices]=useState([]);

  useEffect(()=>{
  async function getservices(){
    const response=await fetch('/getadditional',{
      method:'GET',
      headers: {
        'Content-Type':'application/json'
      },
      credentials: 'include'
    });

    const data=await response.json();
    setservices(data);
    const selected={};
    data.forEach(service=>{
      selected[service.service_id.toString()]=false;
    });
    setsservices(selected);
  }
  getservices();
  }, []);

  async function sendinfo(){

    const selectedservices=Object.entries(sservices)
      .filter(([sid, checked]) => checked)
      .map(([sid])=> Number(sid));

    console.log(selectedservices);

    const info={
      eventname:eventname,
      eventkind:eventkind,
      eventdatetime:eventdatetime,
      venueaddress:venueaddress,
      numattendees:numattendees,
      colortheme:colortheme,
      itemslist:itemslist,
      services:selectedservices,
    };

    const response=await fetch('/eventform',{
      method: 'POST',
      headers: {
        'Content-Type':'application/json'
      },
      body:JSON.stringify(info)
    });
    
    const data=await response.json();
    alert(data.message);
    navigate('/dashboard');
  }

  return(
    <div style={background}>
      <div className="eventformpage">
        <div className="inputbox">
       <button className="button" onClick={()=>navigate('/dashboard')}>Back</button>
        <h1>Fill in the following information</h1>
        <input className="textbox" type="text" placeholder="Event Name" onChange={(e)=>seteventname(e.target.value)}></input>
        <input className="textbox" type="text" placeholder="Kind of Event" onChange={(e)=>seteventkind(e.target.value)}></input>
        <input className="textbox" type="text" placeholder="Date and Time of Event" onChange={(e)=>seteventdatetime(e.target.value)}></input>
        <input className="textbox" type="text" placeholder="Venue Address" onChange={(e)=>setvenueaddress(e.target.value)}></input>
        <input className="textbox" type="text" placeholder="Number of Attendees" onChange={(e)=>setnumattendees(e.target.value)}></input>
        <input className="textbox" type="text" placeholder="Color Theme" onChange={(e)=>setcolortheme(e.target.value)}></input>
        <input className="textbox" type="text" placeholder="List of Items Needed" onChange={(e)=>setitemslist(e.target.value)}></input>
        <ul>
          {services.map(service=>(
          <div key={service.service_id}>
          <label>
            <input type="checkbox" name={service.service_id} checked={sservices[service.service_id] || false} onChange={(e)=>setsservices(prev=>({...prev, [e.target.name]:e.target.checked,}))}>
            </input>
             {service.service_name}
          </label>
          </div>
        ))}
        </ul>
        <button className="button" onClick={sendinfo}>Book Event</button>
        </div>
      </div>
    </div>
  )

}

export default Eventform;