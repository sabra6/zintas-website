//Imported files
import React, {useEffect, useState} from "react";
import './upevents.css';
import logo from '../Zintaslogo.png';
import {useNavigate} from "react-router-dom";

//Webpage background settings
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
  const [services, setservices]=useState([]);
  const [userinfo, setuserinfo]=useState([]);
  const [eventdate, seteventdate]=useState('');

  //Popup settings
  const popup={
    position:'fixed',
    backgroundColor: '#C5FAA8',
    top: '80%',
    left: '50%',
    height: 'fit-content',
    width: 'fit-content',
    transform: 'translate(-50%, -90%)'
  }

  //Retrieve the list of events
  async function getevents(){

    //Send a HTTP GET server request to server.
    const response=await fetch('/getevents', {
      method: 'GET',
      headers: {
        'Content-Type':'application/json'
      },
      credentials:'include'
    })

    //Retrieve the message from server.
    const result=await response.json();
    setdata(result);

  }

  //Retrieve the event information
  async function geteventinfo(eventid){

    //Form the body of request
    const info={
      eventid:eventid
    }

    //Send a HTTP POST server request to server.
    const response=await fetch('/geteventinfo', {
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      credentials:'include',
      body:JSON.stringify(info)
    })

    //Retrieve the result from server.
    const result=await response.json();
    seteventinfo(result);

    //Make the Date and Time format of event readable.
    //Set the readable version as the event date and time.
    if(result.event_datetime){
      const date = new Date(result.event_datetime);
      const formatted = date.toLocaleString('en-US',{
        year:'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      seteventdate(formatted);
    } else{
      seteventdate('');
    }
  }

  //Retrieve user's information
  async function getuserinfo(userid){
    //Form the body of request
    const info={
      userid:userid
    }

    //Send HTTP POST server request to server.
    const response=await fetch('/getuserinfo', {
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      credentials:'include',
      body:JSON.stringify(info)
    })

    //Retrieve message from server.
    const result=await response.json();
    setuserinfo(result);

  }

  //Retrieve the event's list of services.
  async function getservicedata(eventid){
    //Form body of request
    const info={
      eventid:eventid
    }

    //Send HTTP POST server request to server.
    const response=await fetch('/getservicenames', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(info)
    })

    //Retrieve message from server.
    const result=await response.json();
    setservices(result);

  }

  //Call function once the manager gets to the webpage.
  //Do this once.
  useEffect(()=>{
    getevents();
  }, []);

  //Call the following functions after manager clicks on the event. 
  function afterclick(userid, eventid){
    geteventinfo(eventid);
    getservicedata(eventid);
    getuserinfo(userid);
    setselected(true);
  }

  return(
    <div style={background}>
      <div className="upeventspage">
        {/* Back button to go back to manager dashboard */}
        <button onClick={()=>navigate('/mdashboard')} className="upbutton"> Back </button>
        <h1> Upcoming Events </h1>
        {/* Print out the list of events */}
        <ul>
          {data.map((event, index)=>(
            <li onClick={()=>afterclick(event.user_id, event.event_id)}className="upevent" key={index}>{event.name}
            </li>
          ))}
        </ul>

        {/* Popup after the manager clicks on the event name */}
        {selected && (
          <div style={popup}>
            <button className="upbutton" onClick={()=>setselected(false)}> Back </button>
            <p> First Name: {userinfo.first_name}</p>
            <p> Last Name: {userinfo.last_name}</p>
            <p> Event Name : {eventinfo.name}</p>
            <p> Event Kind: {eventinfo.kind}</p>
            <p> Event Datetime: {eventdate}</p>
            <p> Venue Address: {eventinfo.address} </p>
            <p> Number of Attendees: {eventinfo.number_of_attendees}</p>
            <p> Color Theme: {eventinfo.color_theme}</p>
            <p> List of Items: {eventinfo.items_list}</p>
            <p> List of services: </p>
            {services.map((service, index)=>(
              <p key={index}> - {service} </p>
            ))}
          </div>
        )}

      </div>
    </div>
  )

}

export default Upcomingevents;