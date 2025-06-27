import React, {useState} from "react";
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
  const [additional, setadditional]=useState({
    DJ: false,
    LiveFoodStall:false,
    PPhotography:false,
    Cmelam:false,
    Trentals:false,
    Crentals:false,
  });

  async function sendinfo(){

    const info={
      eventname:eventname,
      eventkind:eventkind,
      eventdatetime:eventdatetime,
      venueaddress:venueaddress,
      numattendees:numattendees,
      colortheme:colortheme,
      itemslist:itemslist,
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
        <label>
          <input type="checkbox" name="DJ" checked={additional.DJ} onChange={(e)=>setadditional(change=>({...change, [e.target.name]:e.target.checked}))}></input>
          DJ
        </label>
        <label>
          <input type="checkbox" name="LiveFoodStall" checked={additional.LiveFoodStall} onChange={(e)=>setadditional(change=>({...change, [e.target.name]:e.target.checked}))}></input>
          Live Food Stall
        </label>
        <label>
          <input type="checkbox" name="PPhotography" checked={additional.PPhotography} onChange={(e)=>setadditional(change=>({...change, [e.target.name]:e.target.checked}))}></input>
          Professional Photography
        </label>
        <label>
          <input type="checkbox" name="Cmelam" checked={additional.Cmelam} onChange={(e)=>setadditional(change=>({...change, [e.target.name]:e.target.checked}))}></input>
          Chenda Melam
        </label>
        <label>
          <input type="checkbox" name="Trentals" checked={additional.Trentals} onChange={(e)=>setadditional(change=>({...change, [e.target.name]:e.target.checked}))}></input>
          Table Rentals
        </label>
        <label>
          <input type="checkbox" name="Crentals" checked={additional.Crentals} onChange={(e)=>setadditional(change=>({...change, [e.target.name]:e.target.checked}))}></input>
          Chair Rentals
        </label>
        <button className="button" onClick={sendinfo}>Book Event</button>
        </div>
      </div>
    </div>
  )

}

export default Eventform;