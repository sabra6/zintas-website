import React, {useEffect, useState} from "react";
import './notifications.css';
import logo from '../Zintaslogo.png';
import {useNavigate} from "react-router-dom";

const background={
  backgroundImage:`url(${logo})`,
  backgroundRepeat:'no-repeat',
  backgroundSize:'cover',
  backgroundPosition:'center'
};

function Notifications(){
    const navigate=useNavigate();
    const [data, setdata]=useState([]);

    async function getnotifications(){
        const response=await fetch('/notifications', {
            method: 'GET',
            headers: {
                'Content-Type':'application/json'
            },
            credentials: 'include'
        })

        const result=await response.json();
        console.log(result);
        setdata(result);
    }

    useEffect(()=>{
        getnotifications();
}, [])

    return(
        <div style={background}>
            <div className="notificationspage">
                <button className="notifbutton" onClick={()=>navigate('/mdashboard')}>Back</button>
                <h1> Notifications </h1>
                <ul>
                    {data.map((notification, index)=>{
                        const date1 = new Date(notification.date);
                        const formatted = date1.toLocaleString('en-US',{
                        year:'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                        });
                        console.log(formatted);
                    
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