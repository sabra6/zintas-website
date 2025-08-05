//Imported modules
const express=require('express');
const cors=require('cors');
const data=require('./db');
const cookieparser = require('cookie-parser');
const app=express();
const bcrypt=require('bcrypt');

//Middleware setup
app.use(cors());
app.use(cookieparser());
app.use(express.json());

console.log("Setting up app.js");

//Route: Signup
app.post('/signup', async (req, res) => {

  //Extract the following from the body of the request
  const{firstname, lastname, email, password, phonenumber}=req.body;

  //Hash the password using bcrypt
  const saltrounds=10;
  const codedpassword= await bcrypt.hash(password, saltrounds);

  //SQL query for inserting user and the following information into database
  const query='INSERT INTO users(first_name, last_name, email, password, phone_number) VALUES ($1,$2,$3,$4,$5)'
  
  //SQL query for inserting notification into database
  const query1='INSERT INTO notifications(date, content) VALUES ($1, $2)'

  try{

    //Retrieve the user_id from the database to determine whether the account exists
    const result3=await data.query('SELECT user_id FROM users WHERE email=$1', [email]);

    //If the user_id does exist, send the message over to the frontend. Else, continue with account creation
    if(result3.rows.length>0){
      res.json({message: 'Exists'})
    } else {
      //Generate the current timestamp for notification
      const currentdate=new Date()

      //Insert user and the corresponding information to the database
      const result=await data.query(query, [firstname, lastname, email, codedpassword, phonenumber]);

      //Retrieve user id from the database based on email used for creating cookie
      const result1=await data.query('SELECT user_id FROM users WHERE email=$1', [email]);
      const {user_id}=result1.rows[0];

      //Set up a secure cookie with the user_id
      res.cookie('user_id', user_id,{ 
          httpOnly:true,
          secure:false, //will be set to true when deployed.
      });

      //Insert notification to the database
      const result2=await data.query(query1, [currentdate, `${firstname} ${lastname} joined`]);

      //Send over the message to the frontend
      res.json({message: 'User Added'})
    }

  } catch (err){
    //Send over the message to the frontend if there are Database Errors
    res.json({error: "Entry failed"})
  }
});

//Route: Login
app.post('/login', async (req, res)=>{
  //Extract the following from the body of the request
  const {email, password:inputpassword}=req.body;

  try{
    //Retrieve user id and password from database based on email
    const result=await data.query('SELECT user_id, password FROM users WHERE email=$1', [email]); //gets user_id and password from database
    
    //Send this message to the frontend if there are no results
    if(result.rows.length==0){
      return res.status(401).json({message:"Your account doesn't exist"})
    }

    //Extract the user id and password from the result of the SQL query
    const{user_id, password}=result.rows[0]; 

    //Compare the password and the hashed password from the database using bcrypt
    const match= await bcrypt.compare(inputpassword, password); 

    //Send this message to the frontend if the passwords don't match
    if(match===false){
      return res.status(401).json({message:'Login failed'})

    } else{
      //Set up a secure cookie with user_id if the passwords match
      res.cookie('user_id', user_id,{
        httpOnly:true,
        secure:false, //will be set to true when deployed
      });

     //Send either message depending on the email entered by user
     if(email==="Zintasevents@gmail.com"){ 
        return res.json({message: 'manager'})
      } else{
        return res.json({message: 'success'})
      }
    }

  } catch(err){
    //Send this message to the frontend if there are any Database errors
    res.json({error:"Database Error"});
  }

});

//Route: Dashboard
app.post('/dashboard', async(req, res)=>{
  //Extract user id from cookie
  const user_id=req.cookies.user_id;
  
  try{
    //Retrieve event id and event name from database based on user id
    const result=await data.query('SELECT event_id, name FROM events WHERE user_id=$1 ORDER BY event_datetime ASC', [user_id]);
    
    //Send the result of the query to the frontend
    res.json({eventinfo: result.rows});

  } catch(err){
      //Send this message to the frontend if there are Database Errors
      res.json({error:"Database Error"});

  }
});

//Delete event
app.post('/deleteevent', async(req, res)=>{ 
  //Retrieve user id from cookie
  const user_id=req.cookies.user_id; 

  //Extract event id from body of the request
  const {event_id}=req.body;

  try{
    //Generate current Timestamp for notification
    const currentdate=new Date(); 

    //Retrieve user's full name from Database using user id
    const result4=await data.query('SELECT first_name, last_name FROM users WHERE user_id=$1', [user_id]); 
    const {first_name, last_name}=result4.rows[0]; 

    //Retrieve event name from Database using event id
    const result5=await data.query('SELECT name FROM events WHERE event_id=$1', [event_id]); 
    const {name}=result5.rows[0]; 

    //Delete event and services (selected by user for this event) from Database
    const result=await data.query('DELETE FROM events WHERE user_id=$1 AND event_id=$2', [user_id, event_id]); 
    const result1=await data.query('DELETE FROM eventservice WHERE event_id=$1', [event_id]); 

    //Insert notification into Database
    const result3=await data.query('INSERT INTO notifications(date, content) VALUES ($1, $2)', [currentdate, `${first_name} ${last_name} deleted ${name}`]) 
    
    //Send this message to the frontend
    res.json({message:'Event Deleted'}) 

  } catch(err){
    //Send this message to the frontend if there are Database Errors
    res.json({error:"Database Error"});
  }
})

//Logout
app.post('/logout', async(req, res)=>{
  //Delete the cookie
  res.clearCookie('user_id', {
    httpOnly:true,
    secure:false, //will be set to true when working on deployment
  })
  
  //Send this message to the frontend
  res.json({message:'You are logged out'})
})

//Route: Eventform
app.post('/eventform', async(req, res)=>{
  //Extract user id from cookie
  const user_id=req.cookies.user_id;

  //Extract the following from the body of the request
  const{eventname, eventkind, eventdatetime, venueaddress, numattendees, colortheme, itemslist, services}=req.body; 
  
  //SQL query for inserting event and the following information to the Database
  const query='INSERT INTO events(user_id, name, kind, event_datetime, address, number_of_attendees, color_theme, items_list) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING event_id'
  
  //SQL query for inserting services (which user selected for the event) into the Database
  const query1='INSERT INTO eventservice(event_id, service_id) VALUES ($1,$2)'
  
  try{
    //Generate current Timestamp for notification
    const currentdate=new Date();

    //Retrieve user's full name from the Database using user id
    const result4=await data.query('SELECT first_name, last_name FROM users WHERE user_id=$1', [user_id]); 
    const {first_name, last_name}=result4.rows[0]; 

    //Insert event and the following information to the Database
    const result=await data.query(query, [user_id, eventname, eventkind, eventdatetime,venueaddress, numattendees, colortheme, itemslist]); 
    const event_id=result.rows[0].event_id; 

    //Insert the services into the Database using the for loop
    for(const service of services){
      const result1=await data.query(query1, [event_id, service])
    }

    //Insert notification into the Database
    const result2=await data.query('INSERT INTO notifications(date, content) VALUES ($1, $2)', [currentdate, `${first_name} ${last_name} added an Event: ${eventname}`]) //adds notification to the notifications database.
    
    //Send over the message to the frontend
    res.json({message:'Event Added'})

  } catch(err){
    //Send over the message to the frontend if there are Database Errors
    res.json({message:'Error'})
  }
});

//Retrieve services
app.get('/getadditional', async(req,res)=>{
  //SQL query used for retrieving list of services from the Database
  const query="SELECT * FROM services";

  try{
    //Retrieve the list of services from the Database
    const result=await data.query(query);
    
    //Send the result of the SQL query to the frontend
    res.json(result.rows);

  } catch(err){
    //Send the message to the frontend if there are Database errors
    res.json({message: 'Failed to get services'})
  }
})

//Retrieve Event Data
app.post('/geteventdata', async(req, res)=>{
  //Extract event id from the body of the request
  const {event_id}=req.body; 

  //SQL query for retrieving event details from the Database
  const query="SELECT name, kind, event_datetime, address, number_of_attendees, color_theme, items_list FROM events WHERE event_id=$1;"
  
  try{
    //Retrieve event details from the Database based on event id
    const result=await data.query(query, [event_id]); 

    //Send the result of the query to the frontend
    res.json(result.rows[0]);

  } catch(err){
    //Send this message to the frontend if there are Database Errors
    res.json({message:"Failed to get user data"});
  }
})

//Retrieve event's service data
app.post('/getservicedata', async(req,res)=>{
  //Extract event id from the body of the request
  const {event_id}=req.body; 

  //SQL query for retrieving the event's list of services from the Database
  const query="SELECT service_id FROM eventservice WHERE event_id=$1";

  try{
    //Retrieve the list of services from the Database based on event id
    const result=await data.query(query, [event_id]);

    //Send the result of the query to the frontend
    res.json(result.rows);

  } catch(err){
    //Send this message to the frontend if there are Database Errors
    res.json({message: 'Failed to get service data'})
  }
})

//Route: Editform
app.post('/editform', async(req, res)=>{
  //Extract user id from the cookie
  const user_id=req.cookies.user_id;

  //Extract the following from the body of the request
  const {event_id, eventname, eventkind, eventdatetime, venueaddress, numattendees, colortheme, itemslist, services}=req.body;
  
  //SQL query for updating the event datails to the Database
  const query='UPDATE events SET name=$1, kind=$2, event_datetime=$3, address=$4, number_of_attendees=$5, color_theme=$6, items_list=$7 WHERE event_id=$8'
  
  //SQL queries for updating the event's list of services to the Database
  const query1='DELETE FROM eventservice WHERE event_id=$1'
  const query2='INSERT INTO eventservice(event_id, service_id) VALUES ($1, $2)'

  try{
    //Generate the current Timestamp for notification
    const currentdate=new Date();

    //Retrieve the user's full name from the Database based on user id
    const result4=await data.query('SELECT first_name, last_name FROM users WHERE user_id=$1', [user_id]);
    const {first_name, last_name}=result4.rows[0];

    //Update the event details to the Database
    const result=await data.query(query, [eventname, eventkind, eventdatetime, venueaddress, numattendees,colortheme,itemslist,event_id])
    
    //Delete the event's list of services from the Database
    const result1=await data.query(query1, [event_id])

    //Insert the event's list of services to the Database using the for loop
    for(const service of services){
      const result2=await data.query(query2, [event_id, service])
    }

    //Insert the notification to the Database
    const result3=await data.query('INSERT INTO notifications(date, content) VALUES ($1, $2)', [currentdate, `${first_name} ${last_name} edited ${eventname}`])
    
    //Send the message to the frontend
    res.json({message:'Event Edited'})

  } catch(err){
    //Send the message if there are Database Errors
    res.json({error:'Database Error'})
  }
})

//Delete the user's account
app.post('/deleteaccount', async(req, res)=>{
  //Retrieve user id from cookie
  const user_id=req.cookies.user_id;

  //SQL query to delete event's services
  const query="DELETE FROM eventservice WHERE event_id=$1"

  //SQL query to delete events booked by user
  const query1="DELETE FROM events WHERE event_id=$1"

  //SQL query to delete user
  const query2="DELETE FROM users WHERE user_id=$1"
  try{
    //Generate the current date and time
    const currentdate=new Date();

    //Retrieve the list of events (event id) which the user booked
    const result=await data.query('SELECT event_id FROM events WHERE user_id=$1', [user_id]);
    const events=result.rows;

    //Retrieve the user's first and last name from database
    const result5=await data.query('SELECT first_name, last_name FROM users WHERE user_id=$1', [user_id]);
    const{first_name, last_name}=result5.rows[0];

    //Delete each event and its services (which the user booked) from the database
    for(const event of events){
      const result1=await data.query(query, [event.event_id]);
      const result2=await data.query(query1, [event.event_id]);
    }

    //Delete the user from the database
    const result3=await data.query(query2, [user_id])

    //Insert notification to database
    const result4=await data.query('INSERT INTO notifications(date, content) VALUES ($1,$2)', [currentdate, `${first_name} ${last_name} deleted account`])

    //Delete the cookie
    res.clearCookie('user_id', {
      httpOnly:true,
      secure:false, //will be set to true when working on deployment
    })

    //Send the message over to the frontend
    res.json({message: 'Your Account is Deleted'})

  } catch(err){
    //Send the message over to the frontend if there are any database errors
    res.json({message: 'Database Error'})
  }
})

//Retrieve the list of users
app.get('/getusers', async(req, res)=>{
  //SQL query for retrieving the list of users from the Database
  const query='SELECT user_id, first_name, last_name FROM users ORDER BY last_name ASC;'

  try{
    //Retrieve the list of users from the Database
    const result=await data.query(query);

    //Send the result of the query to the frontend
    res.json(result.rows)

  } catch(err){
    //Send this message to the frontend if there are Database Errors
    res.json({error: 'Database Error'})
  }
})

//Retrieve the list of events
app.get('/getevents', async(req, res)=>{
  //SQL query for retrieving the list of events from the Database
  const query='SELECT user_id, event_id, name FROM events ORDER BY event_datetime ASC;'

  try{
    //Retrieve the list of events from the Database
    const result=await data.query(query);

    //Send the result of the query to the frontend
    res.json(result.rows);

  } catch(err){
    //Send the message to the frontend if there are Database Errors
    res.json({Error: 'Database Error'});
  }
})

//Retrieve the list of notifications
app.get('/notifications', async(req, res)=>{
  //SQL query for retrieving the list of notifications from the Database
  const query='SELECT date, content FROM notifications ORDER BY date DESC;'

  try{
    //Retrieve the list of notifications from the Database
    const result=await data.query(query);

    //Send the result of the query to the frontend
    res.json(result.rows);
  
  } catch(err){
    //Send the message to the frontend if there are Database Errors
    res.json({error: 'Database Error'});
  }
})

//Retrieve user info
app.post('/getuserinfo', async(req, res)=>{
  //Extract the user id from the body of the request
  const {userid}=req.body;

  //SQL query for retrieving user details from Database
  const query='SELECT first_name, last_name, email, phone_number FROM users WHERE user_id=$1;'
 
  try{
    //Retrieve the user's details from the Database based on user id
    const result=await data.query(query, [userid]); 

    //Send the result of the query to the frontend
    res.json(result.rows[0]);
    
  } catch(err){
    //Send the message to the frontend if there are Database Errors
    res.json({error: 'Database Error'});
  }
})

//Retrieve event details
app.post('/geteventinfo', async(req, res)=>{
  //Extract event id from the body of the request
  const {eventid}=req.body; 

  //SQL query for retrieving event details from the Database
  const query='SELECT user_id, name, kind, event_datetime, address, number_of_attendees, color_theme, items_list FROM events WHERE event_id=$1;'
  
  try{
    //Retrieve the event details from the Database using event id
    const result=await data.query(query, [eventid]);

    //Send the result of the query to the frontend
    res.json(result.rows[0]);

  } catch(err){
    //Send the message to the frontend if there are Database Errors
    res.json({error: 'Database Error'})
  }
})

//Retrieve list of services for event
app.post('/getservicenames', async(req, res)=>{
  //Extract event id from the body of request 
  const {eventid}=req.body;

  //SQL query for retrieving the list of services from the Database
  const query='SELECT * FROM services;'

  //SQL query for retrieving the event's list of services from the Database
  const query1='SELECT service_id FROM eventservice WHERE event_id=$1'

  try{
    //Retrieve the list of services from the Database
    const result=await data.query(query); 

    //Retrieve the list of services from the Database based on event id
    const result1=await data.query(query1, [eventid]); 

    const services=result.rows;
    const selectedservices=result1.rows; 
    const serviceslist=[];

    //Add the names of the services that the user selected for the event into the array
    for(const service of services){ 
      for(const service1 of selectedservices){
        if(service.service_id===service1.service_id){
          serviceslist.push(service.service_name); 
        }
      }
    }

    //Send the list of services the user selected for the event to the frontend
    res.json(serviceslist);

  } catch(err){
    //Send the message to the frontend if there are Database Errors
    res.json({error: 'Database Error'})
  }
})

//Delete event from database under manager's instruction
app.post('/mdeleteevent', async(req, res)=>{
  //Retrieve event_id from body of request
  const {name, event_id}=req.body;

  //SQL query to delete event's services
  const query="DELETE FROM eventservice WHERE event_id=$1"

  //SQL query to delete events booked by user
  const query1="DELETE FROM events WHERE event_id=$1"

  try{
    //Generate the current date and time
    const currentdate=new Date();

    //Delete event's services from database based on event id
    const result=await data.query(query, [event_id]);

    //Delete event from database based on event id
    const result1=await data.query(query1, [event_id]);

    //Insert notification to database
    const result2=await data.query('INSERT INTO notifications (date, content) VALUES ($1,$2)',[currentdate, `Manager deleted ${name}`])

    //Send the message to frontend
    res.json({message: 'Event Deleted'})

  } catch (err){
    //Send over the message if there are any Database Errors
    res.json({message: 'Database Error'});
  }
})

//Route: Home
app.get('/', (req, res)=>{ 
  //Send the message to the frontend when the server starts
  res.send("Hi. Welcome to our Zintas website");
});

//Send over the app object to the file index.js
module.exports=app;