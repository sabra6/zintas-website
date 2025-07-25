//Imported files
import React, {useEffect, useState} from "react";
import './notifications.css';
import logo from '../Zintaslogo.png';
import {useNavigate} from "react-router-dom";

//Webpage background settings
const background={
  backgroundImage:`url(${logo})`,
  backgroundRepeat:'no-repeat',
  backgroundSize:'cover',
  backgroundPosition:'center'
};

function Notifications(){
    const navigate=useNavigate();
    const [data, setdata]=useState([]);

    //Retrieve the list of notifications
    async function getnotifications(){
        //Send HTTP GET server request to backend
        const response=await fetch('/notifications', {
            method: 'GET',
            headers: {
                'Content-Type':'application/json'
            },
            credentials: 'include'
        })

        //Retrieve the message from backend.
        const result=await response.json();
        setdata(result);

    }

    //Call function when the manager gets to this webpage.
    useEffect(()=>{
        getnotifications();
    }, [])

    return(
        <div style={background}>
            <div className="notificationspage">

                {/* Back button to go back to manager dashboard */}
                <button className="notifbutton" onClick={()=>navigate('/mdashboard')}>Back</button>

                <h1> Notifications </h1>

                {/* Print out the list of notifications */}
                <ul>
                    {data.map((notification, index)=>{
                        {/* Making the date readable. */}
                        const date1 = new Date(notification.date);
                        const formatted = date1.toLocaleString('en-US',{
                        year:'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                        });
                    
                        {/* Format of each notification listed from the list */}
                        return (
                            <li className="notification" key={index}> {formatted}   |   {notification.content}
                            </li>
                        );
                    })}
                </ul>
                
            </div>
        </div>
    )
}

export default Notifications;