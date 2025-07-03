import React, {useEffect, useState} from "react";
import './editform.css';
import logo from '../Zintaslogo.png';
import { useNavigate } from "react-router-dom";
import {useParams} from 'react-router-dom';

const background={
    backgroundImage:`url(${logo})`,
    backgroundRepeat:'no-repeat',
    backgroundSize:'cover',
    backgroundPosition:'center'
  };


function Editform(){
  const {event_id}=useParams();
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

  async function geteventdata(){
    const info={
      event_id:event_id,
    }
    const response=await fetch('/geteventdata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(info)
    })
    const data=await response.json();
    
    if(data.eventdatetime){
      const date = new Date(data.eventdatetime);
      const formatted = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      seteventdatetime(formatted);
    } else{
      seteventdatetime('');
    }

    seteventname(data.name);
    seteventkind(data.kind);
    setvenueaddress(data.address);
    setnumattendees(data.number_of_attendees);
    setcolortheme(data.color_theme);
    setitemslist(data.items_list);
  }

  async function getservicedata(){
    const info={
      event_id:event_id,
    }
    const response=await fetch('/getservicedata', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json'
      },
      credentials:'include',
      body: JSON.stringify(info)
    })
    const data=await response.json();
  }

  getservices();
  geteventdata();
  getservicedata();
  }, []);


  async function editevents(){

    const selectedservices=Object.entries(sservices)
      .filter(([sid, checked]) => checked)
      .map(([sid])=> Number(sid));

    const info={
      event_id:event_id, 
      eventname:eventname,
      eventkind:eventkind,
      eventdatetime:eventdatetime,
      venueaddress:venueaddress,
      numattendees:numattendees,
      colortheme:colortheme,
      itemslist:itemslist,
      services:selectedservices,
    }
    const response=await fetch('/editform', {
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials:'include',
      body: JSON.stringify(info)
    });
    const result= await response.json();
    alert(result.message)
    navigate('/dashboard');
  }

  return(
    <div style={background}>
      <div className="eventformpage">
        <div className="inputbox">
       <button className="button" onClick={()=>navigate('/dashboard')}> Cancel </button>
        <h1>Fill in the following information</h1>
        <input className="textbox" type="text" value={eventname} onChange={(e)=>seteventname(e.target.value)}></input>
        <input className="textbox" type="text" value={eventkind} onChange={(e)=>seteventkind(e.target.value)}></input>
        <input className="textbox" type="datetime-local" value={eventdatetime || ''} onChange={(e)=>seteventdatetime(e.target.value)}></input>
        <input className="textbox" type="text" value={venueaddress} onChange={(e)=>setvenueaddress(e.target.value)}></input>
        <input className="textbox" type="text" value={numattendees} onChange={(e)=>setnumattendees(e.target.value)}></input>
        <input className="textbox" type="text" value={colortheme} onChange={(e)=>setcolortheme(e.target.value)}></input>
        <input className="textbox" type="text" value={itemslist} onChange={(e)=>setitemslist(e.target.value)}></input>
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
        <button onClick={editevents} className="button"> Make Edits </button>
        </div>
      </div>
    </div>
  )

}
export default Editform;