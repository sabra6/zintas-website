import React from "react";
import './dashboard.css';
import logo from '../Zintaslogo.png';
import {useNavigate} from "react-router-dom";

const background={
  backgroundImage:`url(${logo})`,
  backgroundRepeat:'no-repeat',
  backgroundSize:'cover',
  backgroundPosition:'center'
};


function Dashboard(){
  return(
    <div style={background}>
      <div className="dashboardpage">
        <div className="topbuttonbox">
          <button className="button"> Log Out </button>
          <h1> Dashboard </h1>
          <button className="button"> Book an Event </button>
        </div>
      </div>
    </div>
  )
}
export default Dashboard;