//Imported files
import './mdashboard.css';
import logo from '../Zintaslogo.png';
import {useNavigate} from "react-router-dom";

//Manager Dashboard background settings
const background={
  backgroundImage:`url(${logo})`,
  backgroundRepeat:'no-repeat',
  backgroundSize:'cover',
  backgroundPosition:'center'
};

function Mdashboard(){
  //Hook to navigate to a different webpage
  const navigate=useNavigate();

  //Log out the user and then navigate to home page
  async function logout(){

    //Send a POST request to backend to delete the cookie
    const response=await fetch('/logout', {
      method:'POST', 
      headers:{
        'Content-Type':'application/json', 
      },
      credentials:'include',
    })

    //Retrieve the message from backend
    const result=await response.json();

    //Display the message from backend
    alert(result.message);

    //Navigate to the home page
    navigate('/');

  }

  return(
    <div style={background}>
      <div className="mdashboardpage">

        {/* Log Out Button for calling logout function */}
        <button onClick={logout} className="logoutbutton"> Log Out </button>

        <div className="topbuttonbox">
          <h1> Dashboard </h1>
        </div>

        {/* Format the manager options */}
        <div className="optionboxes">

          {/* Navigate to notifications page once notifications option is clicked */}
          <p className="options" onClick={()=>navigate('/notifications')}>Notifications</p>

        </div>
        
        <div className="optionboxes">

          {/* Navigate to userlist page once Users option is clicked */}
          <p className="options" onClick={()=>navigate('/userlist')}> Users </p>

          {/* Navigate to upevents page once Upcoming Events option is clicked */}
          <p className="options" onClick={()=>navigate('/upevents')}> Upcoming Events </p>
        </div>
      </div>
    </div>
  )
}

export default Mdashboard;