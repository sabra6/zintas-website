import React, {useEffect, useState} from "react";
import './upevents.css';
import logo from '../Zintaslogo.png';
import {useNavigate} from "react-router-dom";

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

  const popup={
    position:'fixed',
    backgroundColor: '#C5FAA8',
    top: '70%',
    left: '50%',
    height: '70vh',
    width: '30vh',
    transform: 'translate(-50%, -90%)'
  }

  async function getevents(){
    const response=await fetch('/getevents', {
      method: 'GET',
      headers: {
        'Content-Type':'application/json'
      },
      credentials:'include'
    })
    const result=await response.json();
    console.log(result);
    setdata(result);
  }

  async function geteventinfo(eventid){
    const info={
      eventid:eventid
    }
    const response=await fetch('/geteventinfo', {
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      credentials:'include',
      body:JSON.stringify(info)
    })

    const result=await response.json();
    console.log(result);
    seteventinfo(result);
    if(result.event_datetime){
      const date = new Date(result.event_datetime);
      const formatted = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      console.log(formatted)
      seteventdate(formatted);
    } else{
      seteventdate('');
    }
  }

  async function getuserinfo(userid){
    const info={
      userid:userid
    }
    const response=await fetch('/getuserinfo', {
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      credentials:'include',
      body:JSON.stringify(info)
    })

    const result=await response.json();
    console.log(result);
    setuserinfo(result);
  }

  async function getservicedata(eventid){
    const info={
      eventid:eventid
    }
    const response=await fetch('/getservicenames', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(info)
    })

    const result=await response.json();
    console.log(result);
    setservices(result);
  }



  useEffect(()=>{
    getevents();
  }, []);

  function afterclick(userid, eventid){
    geteventinfo(eventid);
    getservicedata(eventid);
    getuserinfo(userid);
    setselected(true);
  }

  return(
    <div style={background}>
      <div className="upeventspage">
        <button onClick={()=>navigate('/mdashboard')} className="upbutton"> Back </button>
        <h1> Upcoming Events </h1>
        <ul>
          {data.map((event, index)=>(
            <li onClick={()=>afterclick(event.user_id, event.event_id)}className="upevent" key={index}>{event.name}
            </li>
          ))}
        </ul>
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
              <li key={index}> {service} </li>
            ))}
          </div>
        )}

      </div>
    </div>
  )

}

export default Upcomingevents;