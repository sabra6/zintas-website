//Imported Files
import React, {useEffect, useState} from "react";
import './editform.css';
import logo from '../Zintaslogo.png';
import { useNavigate } from "react-router-dom";
import {useParams} from 'react-router-dom';

//Webpage background settings
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

//call getservices and geteventdata functions when the user gets to this webpage.
useEffect(()=>{
  //Retrieve the list of services and selectedservices(which the user chose)
  async function getservices(){
    //Send HTTP GET server request to backend.
    const response=await fetch('/getadditional',{
      method:'GET',
      headers: {
        'Content-Type':'application/json'
      },
      credentials: 'include'
    });

    //Form body of request.
    const info={
      event_id:event_id,
    }

    //Send HTTP POST server request to backend.
    const response1=await fetch('/getservicedata', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json'
      },
      credentials:'include',
      body: JSON.stringify(info)
    })

    //Retrieve the messages from backend.
    const data=await response.json();
    const data1=await response1.json();
    setservices(data);

    //Set up the list of services the user selected.
    const selected={};
    const selectedservices=data1.map(element=>element.service_id);
    data.forEach(service=>{
      selected[service.service_id.toString()]=selectedservices.includes(service.service_id);
    });
    setsservices(selected);

  }

  //Retrieve event data
  async function geteventdata(){
    //Form body of request.
    const info={
      event_id:event_id,
    }

    //Send HTTP POST server request to backend.
    const response=await fetch('/geteventdata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(info)
    })

    //Retrieve the message from backend.
    const data=await response.json();
    
    //Make the date more readable.
    if(data.event_datetime){
      const date = new Date(data.event_datetime);
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

  getservices();
  geteventdata();

  }, []);

  //Edit event info
  async function editevents(){

    //Form the list of services the user selected for the event.
    const selectedservices=Object.entries(sservices)
      .filter(([sid, checked]) => checked)
      .map(([sid])=> Number(sid));

    //Form the body of the request.
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

    //Send HTTP POST server request to backend.
    const response=await fetch('/editform', {
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials:'include',
      body: JSON.stringify(info)
    });

    //Retrieve the message from backend.
    const result= await response.json();

    //Print out the message from backend.
    alert(result.message)

    //Go to Dashboard.
    navigate('/dashboard');

  }

  return(
    <div style={background}>
      <div className="editformpage">
        <div className="editinputbox">

       {/* Cancel button to go back to Dashboard. */}
       <button className="editbutton" onClick={()=>navigate('/dashboard')}> Cancel </button>
        <h1>Fill in the following information</h1>

        {/* Getting user input */}
        <input className="edittextbox" type="text" value={eventname} onChange={(e)=>seteventname(e.target.value)}></input>
        <select className="eventtextbox" onChange={(e)=>seteventkind(e.target.value)} value={eventkind}>
          <option value= "Birthday">Birthday</option>
          <option value= "Baptism">Baptism</option>
          <option value= "Bridal Shower">Bridal Shower</option>
          <option value= "Baby Shower">Baby Shower</option>
          <option value= "Housewarming">Housewarming</option>
          <option value= "Holy Communion">Holy Communion</option>
          <option value= "Gender Reveal">Gender Reveal</option>
          <option value= "Wedding">Wedding</option>
        </select>         
        <input className="edittextbox" type="datetime-local" value={eventdatetime || ''} onChange={(e)=>seteventdatetime(e.target.value)}></input>
        <input className="edittextbox" type="text" value={venueaddress} onChange={(e)=>setvenueaddress(e.target.value)}></input>
        <input className="edittextbox" type="text" value={numattendees} onChange={(e)=>setnumattendees(e.target.value)}></input>
        <input className="edittextbox" type="text" value={colortheme} onChange={(e)=>setcolortheme(e.target.value)}></input>
        <input className="edittextbox" type="text" value={itemslist} onChange={(e)=>setitemslist(e.target.value)}></input>

        {/* Print out the list of services (set whether they're checked for not) and get user input */}
        <ul>
          {services.map(service=>(
          <div key={service.service_id}>
          <label>
            <input type="checkbox" name={service.service_id.toString()} checked={sservices[service.service_id.toString()] || false} onChange={(e)=>setsservices(prev=>({...prev, [e.target.name]:e.target.checked,}))}>
            </input>
             {service.service_name}
          </label>
          </div>
        ))}
        </ul>

        {/* Make Edits button for calling editevents function. */}
        <button onClick={editevents} className="editbutton"> Make Edits </button>
        </div>
        
      </div>
    </div>
  )

}
export default Editform;