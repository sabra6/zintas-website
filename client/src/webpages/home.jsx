import React from "react";
import './home.css';
import {useNavigate} from "react-router-dom";
import logo from "../Zintaslogo.png";

function home(){
  return(
    <div className="background">

      <div className="topcontainer">
        <img src={logo} className="companylogo"></img>
        <button className="managerbutton">Log in as Manager</button>
      </div>
      
      <div className="picturecontainer">
        <h1>Pictures</h1>
      </div>

      <div className="informationbox">
        <p> We are professional event organizers, serving the Dallas Area, committed to helping you create a great and extraordinary event decor! <br /> <br /> <br />Sign up and book your event now! <br /> <br /> <br /> Contact Brayen Mathai and Sintu Brayen if you have any questions!
        </p>

      </div>

    </div>
  )
}

export default home;
