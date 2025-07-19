import React, {useEffect, useState} from "react";
import './userlist.css';
import logo from '../Zintaslogo.png';
import {useNavigate} from "react-router-dom";

const background={
  backgroundImage:`url(${logo})`,
  backgroundRepeat:'no-repeat',
  backgroundSize:'cover',
  backgroundPosition:'center'
};

function Userlist(){
  const [data, setdata]=useState([]);
  const [selected, setselected]=useState(false);
  const [suser, setsuser]=useState([]);
  const [userinfo, setuserinfo]=useState([]);
  const navigate=useNavigate();

  const popup={
    position:'fixed',
    backgroundColor: '#C5FAA8',
    top: '50%',
    left: '50%',
    maxheight: '40vh',
    width: 'fit-content',
    transform: 'translate(-50%, -90%)'
  }

  async function getusers(){
    const response=await fetch('/getusers', {
      method: 'GET',
      headers: {
        'Content-Type':'application/json'
      },
      credentials: 'include'
    })

    const result=await response.json();
    setdata(result);
  }

  async function getuserinfo(userid){
    const info={
      userid:userid
    }

    const response=await fetch('/getuserinfo', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      credentials:'include',
      body: JSON.stringify(info)
    })

    const result=await response.json();
    console.log(result);
    setuserinfo(result);
  }


  useEffect(()=>{
    getusers();
  }, []);

  function todothings(user){
    setsuser(user);
    setselected(true);
    getuserinfo(user.user_id);
  }


  return(
    <div style={background}>
    <div className="userlistpage">
      <button onClick={()=>navigate('/mdashboard')} className="userbutton"> Back </button>
        <h1> Users </h1>
      <ul>
        {data.map((user, index)=>(
          <li className="user" key={index} onClick={()=>todothings(user)}> {user.first_name} {user.last_name}
          </li>
        ))}
      </ul>

        {selected && (
          <div style={popup}>
            <button className="userbutton" onClick={()=>setselected(false)}>Back</button>
            <p> First Name: {userinfo.first_name}</p>
            <p> Last Name: {userinfo.last_name}</p>
            <p> Email: {userinfo.email}</p>
            <p> Phone Number: {userinfo.phone_number}</p>
          </div>
        )}

    </div>
  </div>
  )
}

export default Userlist;