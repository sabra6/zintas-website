//Imported files
import React, {useEffect, useState} from "react";
import './eventform.css';
import logo from '../Zintaslogo.png';
import { useNavigate } from "react-router-dom";

//Webpage background settings
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

  //Call getservices function when the user gets to this webpage.
  useEffect(()=>{
  //Retrieve the list of services.
  async function getservices(){
    //Send HTTP GET server request to backend.
    const response=await fetch('/getadditional',{
      method:'GET',
      headers: {
        'Content-Type':'application/json'
      },
      credentials: 'include'
    });

    //Retrieve message from backend.
    const data=await response.json();
    setservices(data);

    //Set each service option as unchecked.
    const selected={};
    data.forEach(service=>{
      selected[service.service_id.toString()]=false;
    });
    setsservices(selected);

  }
  getservices();
  }, []);

  //Send event information to the backend.
  async function sendinfo(){

    //Form the list of services the user selected.
    const selectedservices=Object.entries(sservices)
      .filter(([sid, checked]) => checked)
      .map(([sid])=> Number(sid));

    //Form the body of the request.
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

    //Send HTTP POST server request to backend.
    const response=await fetch('/eventform',{
      method: 'POST',
      headers: {
        'Content-Type':'application/json'
      },
      body:JSON.stringify(info)
    });
    
    //Retrieve the message from backend.
    const data=await response.json();

    //Print out the message sent by backend.
    alert(data.message);

    //Go back to Dashboard.
    navigate('/dashboard');

  }

  return(
    <div style={background}>
      <div className="eventformpage">
        <div className="eventinputbox">

        {/* Back button to go back to dashboard */}
       <button className="eventbutton" onClick={()=>navigate('/dashboard')}>Back</button>

        <h1>Fill in the following information</h1>
        
        {/* Getting user's input */}
        <input className="eventtextbox" type="text" placeholder="Event Name" onChange={(e)=>seteventname(e.target.value)}></input>
        <select className="eventtextbox" onChange={(e)=>seteventkind(e.target.value)}>
          <option value= "">Kind</option>
          <option value= "Birthday">Birthday</option>
          <option value= "Baptism">Baptism</option>
          <option value= "Bridal Shower">Bridal Shower</option>
          <option value= "Baby Shower">Baby Shower</option>
          <option value= "Housewarming">Housewarming</option>
          <option value= "Holy Communion">Holy Communion</option>
          <option value= "Gender Reveal">Gender Reveal</option>
          <option value= "Wedding">Wedding</option>
        </select>        
        <input className="eventtextbox" type="datetime-local" placeholder="Date and Time of Event" onChange={(e)=>seteventdatetime(e.target.value)}></input>
        <input className="eventtextbox" type="text" placeholder="Venue Address" onChange={(e)=>setvenueaddress(e.target.value)}></input>
        <input className="eventtextbox" type="number" placeholder="Number of Attendees" onChange={(e)=>setnumattendees(e.target.value)}></input>
        <input className="eventtextbox" type="text" placeholder="Color Theme" onChange={(e)=>setcolortheme(e.target.value)}></input>
        <input className="eventtextbox" type="text" placeholder="List of Items Needed" onChange={(e)=>setitemslist(e.target.value)}></input>

        {/* Print out the list of services and get the user's input*/}
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

        {/* Book event button to call sendinfo function */}
        <button className="eventbutton" onClick={sendinfo}>Book Event</button>
        
        </div>
      </div>
    </div>
  )

}

export default Eventform;