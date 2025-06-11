import React from "react";
import './eventform.css';
import logo from '../Zintaslogo.png';
import { useNavigate } from "react-router-dom";

const background={
  backgroundImage:`url(${logo})`,
  backgroundRepeat:'no-repeat',
  backgroundSize:'cover',
  backgroundPosition:'center'
};

function Eventform(){
  return(
    <div style={background}>
      <div className="eventformpage">
        <p>Event form</p>
      </div>
  
    </div>
  )

}

export default Eventform;