//Imported files
import './home.css';
import {useNavigate} from "react-router-dom";
import logo from "../Zintaslogo.png";
import picture from "../Eventslist.png";
import slogo from "../facebooklogo.png";
import inlogo from "../instagramlogo.png";
import elogo from "../emaillogo.jpg";
import plogo from "../phoneicon.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import pic1 from "../pic1decor.jpg";
import pic2 from "../pic2decor.jpg";
import pic3 from "../pic3decor.jpg";
import pic4 from "../pic4decor.jpg";
import pic5 from "../pic5decor.jpg";
import pic6 from "../pic6decor.jpg";

//Image slides settings and formatting
function Imageslides(){
  const imageslist=[pic1, pic2, pic3, pic4, pic5, pic6];
  const settings={ 
    dots:true,
    slidesToShow:2,
    autoplay:true,
    infinite:true,
    speed:2000,
    autoplaySpeed:1200
  }
  return(
    <div style={{width:"70%", margin:"auto", position: "relative"}}>
      <Slider {...settings}>
          {imageslist.map((image, index)=>(
            <div key={index}>
              <img src={image} alt={`Slide ${index}`} style={{height: "100%", width:"100%", borderRadius:"10px", objectFit: "cover"}}></img>
            </div>
          ))}
      </Slider>
    </div>
  )
}

function Home(){
  const navigate=useNavigate();
  return(
    <div className="background">

      <div className="topcontainer">
        <img src={logo} className="companylogo"></img>
      </div>
      
      {/* Display Images Slide */}
      <Imageslides/>

      {/* Display info about company */}
      <div className="informationbox">
        <p> We are professional event organizers, serving the Dallas Area, committed to helping you create a great and extraordinary event decor! <br /> <br /> <br />Sign up and book your event now! <br /> <br /> <br /> Contact Brayen Mathai and Sintu Brayen if you have any questions!
        </p>
        <img src={picture} className="imagestyle"></img>

        {/* Display social media info and contact info about company */}
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

      <div className="homebuttonbox">
            {/* Sign up button to navigate to sign up page */}
            <button onClick={() => navigate('/signup')} className="homebutton">Sign up</button>
            
            {/* Log in button to navigate to login page */}
            <button onClick={()=>navigate('/login')} className="homebutton">Log in</button>
      </div>

    </div>
  )
}

export default Home;
