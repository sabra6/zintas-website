//files which were imported
const express=require('express');
const cors=require('cors');
const data=require('./db');
const cookieparser = require('cookie-parser');
const app=express();
const bcrypt=require('bcrypt');

//the ones this file will use.
app.use(cors());
app.use(cookieparser());
app.use(express.json());

console.log("Setting up app.js"); //testing whether the server is working.

app.post('/signup', async (req, res) => { //for the signup page. 
  const{firstname, lastname, email, password, phonenumber}=req.body;
  const saltrounds=10;
  const codedpassword= await bcrypt.hash(password, saltrounds); //hashes the password in order to cover up the password.
  const query='INSERT INTO users(first_name, last_name, email, password, phone_number) VALUES ($1,$2,$3,$4,$5)'
  const query1='INSERT INTO notifications(date, content) VALUES ($1, $2)'
  try{
    const currentdate=new Date(); //generates the current date and time
    const result=await data.query(query, [firstname, lastname, email, codedpassword, phonenumber]); //added a user to users database
    const result1=await data.query('SELECT user_id FROM users WHERE email=$1', [email]);
    const {user_id}=result1.rows[0]; //extracts the user id from the result of query 1.
    res.cookie('user_id', user_id,{ //sets up a cookie in order to establish a connection between server and browser. The cookie stores the user_id.
        httpOnly:true,
        secure:false, //will be set to true when deployed.
    });
    const result2=await data.query(query1, [currentdate, `${firstname} ${lastname} joined`]); //added a notification to notifications database
    res.json({message: 'User Added'})
  } catch (err){ //if there is an error
    console.error('Database Error', err);
    res.json({error: "Entry failed"})
  }
});

app.post('/login', async (req, res)=>{ //for the login page
  const {email, password:inputpassword}=req.body;
  try{
    const result=await data.query('SELECT user_id, password FROM users WHERE email=$1', [email]); //gets user_id and password from database
    if(result.rows.length==0){ //added an if statement if there are no results.
      return res.status(401).json({message:"Your account doesn't exist"})
    }
    const{user_id, password}=result.rows[0]; //extracts user id and password from the result
    const match= await bcrypt.compare(inputpassword, password); //compares the hashed password and the hashed password from the database.
    if(match===false){ //if the passwords don't match
      return res.status(401).json({message:'Login failed'})

    } else{ //if the passwords do match
      res.cookie('user_id', user_id,{ //sets up a cookie which establishes connection between browser and server. Stores the user id.
        httpOnly:true,
        secure:false, //will be set to true when deployed. 
      });

     if(email==="Zintasevents@gmail.com"){ //if-else statements will determine whether the user goes to the manager side or client side. If email entered is the company email, then the user will be taken to the manager side.
        return res.json({message: 'manager'}) //sends over this message to the frontend.
      }
      else{
        return res.json({message: 'success'}) //sends over this message to the frontend.
      }
    }

  } catch(err){ //if there are any errors in getting the data.
    res.json({error:"Database Error"});
    console.error("Database Error", err);
  }
});

app.post('/dashboard', async(req, res)=>{ //used for client dashboard.
  const user_id=req.cookies.user_id; //extracts user id from cookie (established from login or sign up).
  try{
    const result=await data.query('SELECT event_id, name FROM events WHERE user_id=$1', [user_id]); //gets event id and event name from database based on user id.
    res.json({eventinfo: result.rows}); //sends over the results.
  } catch(err){
      res.json({error:"Database Error"});
  }
});

app.post('/deleteevent', async(req, res)=>{ //used when the client wants to delete an event.
  const user_id=req.cookies.user_id; //extracts user id from cookie (established from login or sign up)
  const {event_id}=req.body; //gets event_id from the body of the HTTP server request.
  try{
    const currentdate=new Date(); //generates current date and time.
    const result4=await data.query('SELECT first_name, last_name FROM users WHERE user_id=$1', [user_id]); //gets name of user from database.
    const {first_name, last_name}=result4.rows[0]; //extracts first and last name of user from the result.
    const result5=await data.query('SELECT name FROM events WHERE event_id=$1', [event_id]); //gets event name from database.
    const {name}=result5.rows[0]; //extracts name from the result.
    const result=await data.query('DELETE FROM events WHERE user_id=$1 AND event_id=$2', [user_id, event_id]); //deletes the event from events database.
    const result1=await data.query('DELETE FROM eventservice WHERE event_id=$1', [event_id]); //deletes the services from the eventservice database.
    const result3=await data.query('INSERT INTO notifications(date, content) VALUES ($1, $2)', [currentdate, `${first_name} ${last_name} deleted ${name}`]) //adds notification to notifications database.
    res.json({message:'Event Deleted'}) //sends over this message to the frontend.
  } catch(err){
    res.json({error:"Database Error"});
  }
})

app.post('/logout', async(req, res)=>{ //used when the user wants to log out.
  res.clearCookie('user_id', { //gets rid of the cookie (established from login or sign up)
    httpOnly:true,
    secure:false, //will be set to true when working on deployment.
  }) 
  res.json({message:'You are logged out'}) //sends over this message to the frontend.
})

app.post('/eventform', async(req, res)=>{ //used when the user wants to add an event.
  const user_id=req.cookies.user_id; //extracts user id from cookie.
  const{eventname, eventkind, eventdatetime, venueaddress, numattendees, colortheme, itemslist, services}=req.body; //extracts the following things from the body of the HTTP server request.
  const query='INSERT INTO events(user_id, name, kind, event_datetime, address, number_of_attendees, color_theme, items_list) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING event_id'
  const query1='INSERT INTO eventservice(event_id, service_id) VALUES ($1,$2)'
  try{
    const currentdate=new Date();
    const result4=await data.query('SELECT first_name, last_name FROM users WHERE user_id=$1', [user_id]); //gets user's name from database.
    const {first_name, last_name}=result4.rows[0]; //extracts user's name from result.
    const result=await data.query(query, [user_id, eventname, eventkind, eventdatetime,venueaddress, numattendees, colortheme, itemslist]); //adds the event to the events database.
    const event_id=result.rows[0].event_id; //gets the event id from the result.
    for(const service of services){ //for loops through the list of services and adds each service to the eventservice database.
      const result1=await data.query(query1, [event_id, service])
    }
    const result2=await data.query('INSERT INTO notifications(date, content) VALUES ($1, $2)', [currentdate, `${first_name} ${last_name} added an Event: ${eventname}`]) //adds notification to the notifications database.
    res.json({message:'Event Added'}) //sends over this message to the frontend.
  } catch(err){
    res.json({message:'Error'})
  }
});

app.get('/getadditional', async(req,res)=>{ //used for getting the following services listed from the services database.
  //const user_id=req.cookies.user_id;
  const query="SELECT * FROM services";
  try{
    const result=await data.query(query); //gets the services from the database
    res.json(result.rows); //sends over the results to the frontend.
  } catch(err){
    res.json({message: 'Failed to get services'})
  }
})


app.post('/geteventdata', async(req, res)=>{ //used for getting information of the corresponding event.
  //const user_id=req.cookies.user_id;
  const {event_id}=req.body; //extracts event id from the body of the HTTP server request.
  const query="SELECT name, kind, event_datetime, address, number_of_attendees, color_theme, items_list FROM events WHERE event_id=$1;"
  try{
    const result=await data.query(query, [event_id]); //gets the event data from database based on event id.
    //console.log(result.rows[0])
    res.json(result.rows[0]); //sends over the results to the frontend.
  } catch(err){
    res.json({message:"Failed to get user data"});
  }
})

app.post('/getservicedata', async(req,res)=>{ //used for getting the list of services of the corresponding event.
  //const user_id=req.cookies.user_id;
  const {event_id}=req.body; //extracts event id from body of HTTP server request.
  const query="SELECT service_id FROM eventservice WHERE event_id=$1";
  try{
    const result=await data.query(query, [event_id]); //gets the list of services from eventservice database based on event id.
    //console.log(result.rows);
    res.json(result.rows); //sends over the results to the frontend.
  } catch(err){
    res.json({message: 'Failed to get service data'})
  }
})


app.post('/editform', async(req, res)=>{ //used for editing the following event information.
  const user_id=req.cookies.user_id; //extracts user id from the cookie (established during login or sign up)
  const {event_id, eventname, eventkind, eventdatetime, venueaddress, numattendees, colortheme, itemslist, services}=req.body; //extracts the following things from the body of the HTTP server request.
  const query='UPDATE events SET name=$1, kind=$2, event_datetime=$3, address=$4, number_of_attendees=$5, color_theme=$6, items_list=$7 WHERE event_id=$8'
  const query1='DELETE FROM eventservice WHERE event_id=$1'
  const query2='INSERT INTO eventservice(event_id, service_id) VALUES ($1, $2)'
  try{
    const currentdate=new Date(); //generates current date and time.
    const result4=await data.query('SELECT first_name, last_name FROM users WHERE user_id=$1', [user_id]); //gets user's name from the database.
    const {first_name, last_name}=result4.rows[0]; //extracts user's name from the result.
    const result=await data.query(query, [eventname, eventkind, eventdatetime, venueaddress, numattendees,colortheme,itemslist,event_id]) //updates information of the following event.
    const result1=await data.query(query1, [event_id]) //deletes services from the eventservice database based on event id.
    for(const service of services){ //for loops through the list of services and adds the service to the eventservice database.
      const result2=await data.query(query2, [event_id, service])
    }
    const result3=await data.query('INSERT INTO notifications(date, content) VALUES ($1, $2)', [currentdate, `${first_name} ${last_name} edited ${eventname}`]) //adds notification to the notifications database.
    res.json({message:'Event Edited'}) //sends over message to the frontend.
  } catch(err){
    res.json({error:'Database Error'})
  }
})

app.get('/getusers', async(req, res)=>{ //used for getting the list of customers.
  const query='SELECT user_id, first_name, last_name FROM users ORDER BY last_name ASC;'
  try{
    const result=await data.query(query); //gets the list of users from the users database. Orders them by last name A to Z.
    res.json(result.rows) //sends over the results to the frontend.
    //console.log(result.rows)
  } catch(err){
    res.json({error: 'Database Error'})
  }
})

app.get('/getevents', async(req, res)=>{ //used for getting the list of events booked.
  const query='SELECT user_id, event_id, name FROM events ORDER BY event_datetime ASC;'
  try{
    const result=await data.query(query); //gets the list of events from the events database. Ordered by event_datetime from the most recent to the oldest.
    res.json(result.rows); //sends over the results to the frontend.
  } catch(err){
    res.json({Error: 'Database Error'});
  }
})

app.get('/notifications', async(req, res)=>{ //used for getting the list of notifications.
  const query='SELECT date, content FROM notifications ORDER BY date DESC;'
  try{
    const result=await data.query(query); //gets the list of notifications from the database. Ordered by date from recent to the oldest.
    //console.log(result.rows);
    res.json(result.rows); //sends over the results to the frontend.
  } catch(err){
    res.json({error: 'Database Error'});
  }
})

app.post('/getuserinfo', async(req, res)=>{ //used for getting the information of the following customer.
  const {userid}=req.body; //extracts the user id from the body of the HTTP server request.
  const query='SELECT first_name, last_name, email, phone_number FROM users WHERE user_id=$1;'
  try{
    const result=await data.query(query, [userid]); //gets the customer's information from the users database.
    res.json(result.rows[0]); //sends over the results to the frontend.
  } catch(err){
    res.json({error: 'Database Error'});
  }
})

app.post('/geteventinfo', async(req, res)=>{ //used for getting the information of the following event.
  const {eventid}=req.body; //extracts the event id from the body of the HTTP server request.
  //console.log(eventid);
  const query='SELECT user_id, name, kind, event_datetime, address, number_of_attendees, color_theme, items_list FROM events WHERE event_id=$1;'
  try{
    const result=await data.query(query, [eventid]); //gets the information of the following event from the database.
    //console.log(result.rows);
    res.json(result.rows[0]); //sends over the results to the frontend.
  } catch(err){
    res.json({error: 'Database Error'})
  }
})

app.post('/getservicenames', async(req, res)=>{ //used for getting the list of services (selected by the user) for this event.
  const {eventid}=req.body; //extracts event id from the body of the HTTP server request.
  const query='SELECT * FROM services;'
  const query1='SELECT service_id FROM eventservice WHERE event_id=$1'
  try{
    const result=await data.query(query); //gets the list of services from the services database.
    const result1=await data.query(query1, [eventid]); //gets the list of service ids from eventservice database based on event id.
    const services=result.rows; //had services equal to the result from first query.
    const selectedservices=result1.rows; //had selectedservices equal to the result from second query.
    const serviceslist=[]; //created an empty array. Will be used for sending over the list of services selected to the frontend.
    for(const service of services){ //used a nested for loop. 
      for(const service1 of selectedservices){
        if(service.service_id===service1.service_id){ //if the service is in selectedservices, then the service will be added to serviceslist.
          //console.log('Putting in the array')
          serviceslist.push(service.service_name); 
        }
      }
    }
    res.json(serviceslist); //sends over the serviceslist to the frontend.
  } catch(err){
    res.json({error: 'Database Error'})
  }
})


app.get('/', (req, res)=>{ 
  console.log('Recieved GET /');
  res.send("Hi. Welcome to our Zintas website");
});

module.exports=app; //this sends over the app object to the file index.js.