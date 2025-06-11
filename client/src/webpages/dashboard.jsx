import React from "react";
import './dashboard.css';
import logo from '../Zintaslogo.png';
import {useActionData, useNavigate} from "react-router-dom";

const background={
  backgroundImage:`url(${logo})`,
  backgroundRepeat:'no-repeat',
  backgroundSize:'cover',
  backgroundPosition:'center'
};


function Dashboard(){
  const navigate=useNavigate();
  return(
    <div style={background}>
      <div className="dashboardpage">
        <div className="topbuttonbox">
          <button className="button"> Log Out </button>
          <h1> Dashboard </h1>
          <button onClick={()=> navigate('/eventform')} className="button"> Book an Event </button>
        </div>
      </div>
    </div>
  )
}
export default Dashboard;