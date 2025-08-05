//Imported files
import {useEffect, useState} from "react";
import './notifications.css';
import logo from '../Zintaslogo.png';
import {useNavigate} from "react-router-dom";

//Notifications background settings
const background={
  backgroundImage:`url(${logo})`,
  backgroundRepeat:'no-repeat',
  backgroundSize:'cover',
  backgroundPosition:'center'
};

function Notifications(){
    //Hook to navigate to a different webpage
    const navigate=useNavigate();

    //State to store the list of notifications
    const [data, setdata]=useState([]);

    //Retrieve the list of notifications
    async function getnotifications(){
        //Send a GET request to backend to retrieve the list of notifications
        const response=await fetch('/notifications', {
            method: 'GET',
            headers: {
                'Content-Type':'application/json'
            },
            credentials: 'include'
        })

        //Retrieve the list of notifications from backend and update the state
        const result=await response.json();
        setdata(result);

    }

    //Call getnotifications function when the manager gets to this webpage
    useEffect(()=>{
        getnotifications();
    }, [])

    return(
        <div style={background}>
            <div className="notificationspage">

                {/* Back button to navigate to manager dashboard */}
                <button className="notifbutton" onClick={()=>navigate('/mdashboard')}>Back</button>

                <h1> Notifications </h1>

                {/* Display the list of notifications */}
                <ul>
                    {data.map((notification, index)=>{
                        // Make the date readable
                        const date1 = new Date(notification.date);
                        const formatted = date1.toLocaleString('en-US',{
                        year:'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                        });
                    
                        // Display format for each notification
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