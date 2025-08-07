//Imported Files
import {useEffect, useState} from "react";
import './editform.css';
import logo from '../Zintaslogo.png';
import { useNavigate } from "react-router-dom";
import {useParams} from 'react-router-dom';

const serverurl=process.env.REACT_APP_SERVER_URL;

//Editform background settings
const background={
    backgroundImage:`url(${logo})`,
    backgroundRepeat:'no-repeat',
    backgroundSize:'cover',
    backgroundPosition:'center'
};

function Editform(){
  //Extract the event id from the route parameter
  const {event_id}=useParams();

  //Hook to navigate to a different webpage
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

  //State to store the list of services the user chose for the event
  const [sservices, setsservices]=useState({});

  //State to store the list of services
  const [services, setservices]=useState([]);

  //Call getservices and geteventdata functions when the user gets to this webpage
  useEffect(()=>{
    //Retrieve the list of services and selected services (which the user chose for the event) from the backend
    async function getservices(){
      //Send a GET request to backend to retrieve the list of services
      const response=await fetch(`${serverurl}/getadditional`,{
        method:'GET',
        headers: {
          'Content-Type':'application/json'
        },
        credentials: 'include'
      });

      //Create the body of request
      const info={
        event_id:event_id,
      }

      //Send a POST request to backend to retrieve the list of services the user chose
      const response1=await fetch(`${serverurl}/getservicedata`, {
        method: 'POST',
        headers: {
          'Content-Type':'application/json'
        },
        credentials:'include',
        body: JSON.stringify(info)
      })

      //Retrieve the list of services from backend
      const data=await response.json();

      //Retrieve the list of services (selected by user) from backend
      const data1=await response1.json();

      //Update the state
      setservices(data);

      //Set up the list of services the user selected and update state
      const selected={};
      const selectedservices=data1.map(element=>element.service_id);
      data.forEach(service=>{
        selected[service.service_id.toString()]=selectedservices.includes(service.service_id);
      });
      setsservices(selected);

    }

    //Retrieve event data
    async function geteventdata(){
      //Create the body of request
      const info={
        event_id:event_id,
      }

      //Send a POST request to backend to retrieve event information from backend
      const response=await fetch(`${serverurl}/geteventdata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(info)
      })

      //Retrieve event information from backend
      const data=await response.json();
    
      //Make the date more readable and update state
      if(data.event_datetime){
        const date = new Date(data.event_datetime);
        const formatted = new Date(date.getTime() - date.getTimezoneOffset()*60000)
          .toISOString()
          .slice(0, 16);
        seteventdatetime(formatted);
      } else{
        seteventdatetime('');
      }

      //Update the states
      seteventname(data.name);
      seteventkind(data.kind);
      setvenueaddress(data.address);
      setnumattendees(data.number_of_attendees);
      setcolortheme(data.color_theme);
      setitemslist(data.items_list);

    }

    getservices();
    geteventdata();

  }, [event_id]);

  //Edit event info
  async function editevents(){
    //Check whether the user filled all the information
    if(eventname.trim()===''|| eventkind.trim()===''|| eventdatetime.trim()===''|| venueaddress.trim()===''|| numattendees===''||colortheme.trim()===''||itemslist.trim()===''){
      alert("Make sure to fill in all the information")
    } else{
      //Form the list of services the user selected for the event
      const selectedservices=Object.entries(sservices)
        .filter(([sid, checked]) => checked)
        .map(([sid])=> Number(sid));

      //Create the body of request
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

      //Send a POST request to backend to send changes to event information
      const response=await fetch(`${serverurl}/editform`, {
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials:'include',
        body: JSON.stringify(info)
      });

      //Retrieve the message from backend
      const result= await response.json();

      //Display the message from backend
      alert(result.message)

      //Navigate to Dashboard
      navigate('/dashboard');
    }

  }

  return(
    <div style={background}>
      <div className="editformpage">
        <div className="editinputbox">
          {/* Cancel button to navigate to Dashboard */}
          <button className="editbutton" onClick={()=>navigate('/dashboard')}> Cancel </button>
          <h1>Fill in the following information</h1>

          {/* Display previous input and get user input */}
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

          {/* Display the list of services (will be displayed checked or unchecked) and get user input */}
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

          {/* Make Edits button for calling editevents function */}
          <button onClick={editevents} className="editbutton"> Make Edits </button>
        
        </div>  
      </div>
    </div>
  )
}
export default Editform;