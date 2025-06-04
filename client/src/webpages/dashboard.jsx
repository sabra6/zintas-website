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
        <p>dashboard</p>
      </div>
    </div>
  )
}
export default Dashboard;