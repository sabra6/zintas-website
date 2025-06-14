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
  return(
    <div style={background}>
      <div className="eventformpage">
        <div className="inputbox">
       <button className="button" onClick={()=>navigate('/dashboard')}>Back</button>
        <h1>Fill in the following information</h1>
        <input className="textbox" type="text" placeholder="Event Name"></input>
        <input className="textbox" type="text" placeholder="Kind of Event"></input>
        <input className="textbox" type="text" placeholder="Date and Time of Event"></input>
        <input className="textbox" type="text" placeholder="Venue Address"></input>
        <input className="textbox" type="text" placeholder="Number of Attendees"></input>
        <input className="textbox" type="text" placeholder="Color Theme"></input>
        <input className="textbox" type="text" placeholder="List of Items Needed"></input>
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
        <button className="button">Book Event</button>
        </div>
      </div>
    </div>
  )

}

export default Eventform;