//Imported files
import {useEffect, useState} from "react";
import './eventform.css';
import logo from '../Zintaslogo.png';
import { useNavigate } from "react-router-dom";

//Eventform background settings
const background={
  backgroundImage:`url(${logo})`,
  backgroundRepeat:'no-repeat',
  backgroundSize:'cover',
  backgroundPosition:'center'
};

function Eventform(){
  const navigate=useNavigate();

  //State to store the eventname
  const [eventname, seteventname]=useState('');

  //State to store the kind of event
  const [eventkind, seteventkind]=useState('');

  //State to store the date and time of event
  const [eventdatetime, seteventdatetime]=useState('');

  //State to store the address of event
  const [venueaddress, setvenueaddress]=useState('');

  //State to store the number of attendees
  const [numattendees, setnumattendees]=useState('');

  //State to store the color theme
  const [colortheme, setcolortheme]=useState('');

  //State to store the list of items
  const [itemslist, setitemslist]=useState('');

  //State to store the list of services.
  const [sservices, setsservices]=useState({});

  //State to store the list of services the user chose for the event.
  const [services, setservices]=useState([]);

  //Call getservices function when the user gets to this webpage.
  useEffect(()=>{
  //Retrieve the list of services from the backend.
  async function getservices(){
    //Send GET server request to backend to retrieve the list of services.
    const response=await fetch('/getadditional',{
      method:'GET',
      headers: {
        'Content-Type':'application/json'
      },
      credentials: 'include'
    });

    //Retrieve the list of services from backend and update the state.
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
    //Check whether the user filled all the information.
    if(eventname.trim()===''|| eventkind.trim()===''|| eventdatetime.trim()===''|| venueaddress.trim()===''|| numattendees.trim()===''||colortheme.trim()===''||itemslist.trim()===''){
      alert("Make sure to fill in all the information")
    } else{
      //Form the list of services the user selected.
      const selectedservices=Object.entries(sservices)
        .filter(([sid, checked]) => checked)
        .map(([sid])=> Number(sid));

      //Create the body of the request.
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

      //Send a POST request to backend to add event and the corresponding info to database.
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

      //Navigate to Dashboard.
      navigate('/dashboard');
    }

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