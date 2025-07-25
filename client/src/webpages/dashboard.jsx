//Imported files
import React, {useEffect, useState} from "react";
import './dashboard.css';
import logo from '../Zintaslogo.png';
import {useNavigate} from "react-router-dom";

//Webpage background settings
const background={
  backgroundImage:`url(${logo})`,
  backgroundRepeat:'no-repeat',
  backgroundSize:'cover',
  backgroundPosition:'center'
};


function Dashboard(){

  const [data, setdata]=useState([]);

  //Retrieve the list of events the user booked.
  async function getinfo(){

    //Send HTTP POST server request to backend.
    const response= await fetch('/dashboard',{
    method:'POST',
    headers:{
      'Content-Type':'application/json',
    },
    credentials:'include',
    })

    //Retrieve the message from backend.
    const result=await response.json();
    setdata(result.eventinfo);

  }

  //Call getinfo function when the user gets to this webpage.
  useEffect(()=>{
    getinfo();
  }, []);

  //Delete event
  async function deleteevent(event_id){
    //Form body of request
    const info={
      event_id:event_id
    }

    //Send HTTP POST request to backend.
    const response=await fetch('/deleteevent', {
      method: 'POST',
      headers:{
        'Content-Type':'application/json',
      },
      credentials:'include',
      body:JSON.stringify(info)
    });

    //Retrieve the message from backend.
    const result=await response.json();

    //Call getinfo function
    getinfo();

  }

  //Logout the user
  async function logout(){

    //Send the HTTP POST server request to backend.
    const response=await fetch('/logout', {
      method:'POST', 
      headers:{
        'Content-Type':'application/json', 
      },
      credentials:'include',
    })

    //Retrieve the message from backend.
    const result=await response.json();

    //Print the message from backend.
    alert(result.message);

    //Go to homepage.
    navigate('/');

  }

  const navigate=useNavigate();
  return(
    <div style={background}>
      <div className="dashboardpage">
        <div className="topbuttonbox">

          {/* Log Out button to call logout functions */}
          <button onClick={logout} className="dashbutton"> Log Out </button>
          <h1> Dashboard </h1>

          {/* Book an Event button to go eventform page. */}
          <button onClick={()=> navigate('/eventform')} className="dashbutton"> Book an Event </button>

        </div>

        <div className="letterbox">
          <p> Our Team is so excited to be part of your memorable experience!</p>
          <p> To book an event, click "Book an Event".</p>
          <p> To make edits to your event, click "Edit". To delete your event, click "Delete".</p>
        </div>

        {/* Print out the list of events the user booked. */}
        <ul>
          {data.map((event, index)=>(
            <li className="event" key={index}>{event.name}
              <div className="dbuttonbox">

                {/* Delete button to delete the event */}
                <button className="dbutton"onClick={()=>deleteevent(event.event_id)}> Delete </button>

                {/* Edit button to edit the event details */}
                <button className="dbutton" onClick={()=>navigate(`/editform/${event.event_id}`)}> Edit </button>
                
              </div>
            </li>
          ))}
        </ul>

      </div>
    </div>
  )
}
export default Dashboard;