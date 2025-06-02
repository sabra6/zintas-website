import React from "react";
import './home.css';
import {useNavigate} from "react-router-dom";
import logo from "../Zintaslogo.png";
import picture from "../Eventslist.png";
import slogo from "../facebooklogo.png";
import inlogo from "../instagramlogo.png";
import elogo from "../emaillogo.jpg";
import plogo from "../phoneicon.png";

function Home(){
  const navigate=useNavigate();
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
        <img src={picture} className="imagestyle"></img>

        <div className="firstrow">
        <div className="socialmedia">
        <img src={slogo} className="otherlogos"></img>
        <p className="socialinfotext">Zintas Events and Rentals</p>
        </div>
        <div className="socialmedia">
        <img src={elogo} className="otherlogos"></img>
        <p className="socialinfotext">Zintasevents@gmail.com</p>
        </div>
        </div>
        <div className="secondrow">
        <div className="socialmedia">
        <img src={inlogo} className="otherlogos"></img>
        <p className="socialinfotext">zintasevents</p>
        </div>
        <div className="socialmedia">
        <img src={plogo} className="otherlogos"></img>
        <p className="socialinfotext">214-940-0358</p>
        </div>
        </div>

      </div>
      <div className="buttonbox">
            <button onClick={() => navigate('/signup')} className="button">Sign up</button>
            <button onClick={()=>navigate('/login')} className="button">Log in</button>
        </div>

    </div>
  )
}

export default Home;
