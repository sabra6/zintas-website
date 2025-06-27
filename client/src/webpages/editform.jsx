import React, {useState} from "react";
import './editform.css';
import logo from '../Zintaslogo.png';
import { useNavigate } from "react-router-dom";
import {useParams} from 'react-router-dom';

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

  const background={
    backgroundImage:`url(${logo})`,
    backgroundRepeat:'no-repeat',
    backgroundSize:'cover',
    backgroundPosition:'center'
  };

  async function editevents(){

    const info={
      event_id:event_id, 
      eventname:eventname,
      eventkind:eventkind,
      eventdatetime:eventdatetime,
      venueaddress:venueaddress,
      numattendees:numattendees,
      colortheme:colortheme,
      itemslist:itemslist
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
    navigate('/dashboard')
  }

  return(
    <div style={background}>
      <div className="eventformpage">
        <div className="inputbox">
       <button className="button" onClick={()=>navigate('/dashboard')}> Cancel </button>
        <h1>Fill in the following information</h1>
        <input className="textbox" type="text" placeholder="Event Name" onChange={(e)=>seteventname(e.target.value)}></input>
        <input className="textbox" type="text" placeholder="Kind of Event" onChange={(e)=>seteventkind(e.target.value)}></input>
        <input className="textbox" type="text" placeholder="Date and Time of Event" onChange={(e)=>seteventdatetime(e.target.value)}></input>
        <input className="textbox" type="text" placeholder="Venue Address" onChange={(e)=>setvenueaddress(e.target.value)}></input>
        <input className="textbox" type="text" placeholder="Number of Attendees" onChange={(e)=>setnumattendees(e.target.value)}></input>
        <input className="textbox" type="text" placeholder="Color Theme" onChange={(e)=>setcolortheme(e.target.value)}></input>
        <input className="textbox" type="text" placeholder="List of Items Needed" onChange={(e)=>setitemslist(e.target.value)}></input>
        <label>
          <input type="checkbox"></input>
          DJ
        </label>
        <label>
          <input type="checkbox"></input>
          Live Food Stall
        </label>
        <label>
          <input type="checkbox"></input>
          Professional Photography
        </label>
        <label>
          <input type="checkbox"></input>
          Chenda Melam
        </label>
        <label>
          <input type="checkbox"></input>
          Table Rentals
        </label>
        <label>
          <input type="checkbox"></input>
          Chair Rentals
        </label>
        <button onClick={editevents} className="button"> Make Edits </button>
        </div>
      </div>
    </div>
  )

}
export default Editform;