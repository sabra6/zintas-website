//Imported files
import {useEffect, useState} from "react";
import './upevents.css';
import logo from '../Zintaslogo.png';
import {useNavigate} from "react-router-dom";

//Upevents background settings
const background={
  backgroundImage:`url(${logo})`,
  backgroundRepeat:'no-repeat',
  backgroundSize:'cover',
  backgroundPosition:'center'
};

function Upcomingevents(){
  //Hook to navigate to a different webpage
  const navigate=useNavigate();

  //State to store list of events
  const [data, setdata]=useState([]);

  //State to store the state of whether the user clicked on the event or not
  const [selected, setselected]=useState(false);

  //State to store event information
  const [eventinfo, seteventinfo]=useState([]);

  //State to store the list of services
  const [services, setservices]=useState([]);

  //State to store user information
  const [userinfo, setuserinfo]=useState([]);

  //State to store the event date and time
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

  //Retrieve the list of events from backend
  async function getevents(){

    //Send a GET request to backend to retrieve the list of events
    const response=await fetch('/getevents', {
      method: 'GET',
      headers: {
        'Content-Type':'application/json'
      },
      credentials:'include'
    })

    //Retrieve the list of events from backend and update the state
    const result=await response.json();
    setdata(result);

  }

  //Retrieve the event information from backend
  async function geteventinfo(eventid){

    //Create the body of request
    const info={
      eventid:eventid
    }

    //Send a POST request to backend to retrieve event information
    const response=await fetch('/geteventinfo', {
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      credentials:'include',
      body:JSON.stringify(info)
    })

    //Retrieve the event information from backend and update state
    const result=await response.json();
    seteventinfo(result);

    //Make the Date and Time format of event readable and update state
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

  //Retrieve user's information from backend
  async function getuserinfo(userid){
    //Create the body of request
    const info={
      userid:userid
    }

    //Send POST request from backend to retrieve user information
    const response=await fetch('/getuserinfo', {
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      credentials:'include',
      body:JSON.stringify(info)
    })

    //Retrieve user information from backend and update state
    const result=await response.json();
    setuserinfo(result);

  }

  //Retrieve the event's list of services from backend
  async function getservicedata(eventid){
    //Create body of request
    const info={
      eventid:eventid
    }

    //Send a POST request to backend to retrieve the list of services selected for this event
    const response=await fetch('/getservicenames', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(info)
    })

    //Retrieve list of services selected for event and update state
    const result=await response.json();
    setservices(result);

  }

  //Call function once the manager gets to the webpage
  useEffect(()=>{
    getevents();
  }, []);

  //Call the following functions after manager clicks on the event
  function afterclick(userid, eventid){
    geteventinfo(eventid);
    getservicedata(eventid);
    getuserinfo(userid);
    setselected(true);
  }

  return(
    <div style={background}>
      <div className="upeventspage">
        {/* Back button to navigate to manager dashboard */}
        <button onClick={()=>navigate('/mdashboard')} className="upbutton"> Back </button>
        <h1> Upcoming Events </h1>
        {/* Display the list of events */}
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