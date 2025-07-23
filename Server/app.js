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
    const currentdate=new Date(); //generates the current date
    const result=await data.query(query, [firstname, lastname, email, codedpassword, phonenumber]); //added a user to users database
    const result1=await data.query('SELECT user_id FROM users WHERE email=$1', [email]);
    const {user_id}=result1.rows[0]; //extracts the user id from the result of query 1.
    res.cookie('user_id', user_id,{ //sets up a cookie in order to establish a connection between server and browser. 
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
    const{user_id, password}=result.rows[0];
    const match= await bcrypt.compare(inputpassword, password);
    if(match===false){
      return res.status(401).json({message:'Login failed'})

    } else{
      res.cookie('user_id', user_id,{
        httpOnly:true,
        secure:false,
      });

     if(email==="Zintasevents@gmail.com"){
        return res.json({message: 'manager'})
      }
      else{
        return res.json({message: 'success'})
      }
    }

  } catch(err){
    res.json({error:"Database Error"});
    console.error("Database Error", err);
  }
});

app.post('/dashboard', async(req, res)=>{
  const user_id=req.cookies.user_id;
  try{
    const result=await data.query('SELECT event_id, name FROM events WHERE user_id=$1', [user_id]);
    res.json({eventinfo: result.rows});
  } catch(err){
      res.json({error:"Database Error"});
  }
});

app.post('/deleteevent', async(req, res)=>{
  const user_id=req.cookies.user_id;
  const {event_id}=req.body;
  try{
    const currentdate=new Date();
    const result4=await data.query('SELECT first_name, last_name FROM users WHERE user_id=$1', [user_id]);
    const {first_name, last_name}=result4.rows[0];
    const result5=await data.query('SELECT name FROM events WHERE event_id=$1', [event_id]);
    const {name}=result5.rows[0];
    const result=await data.query('DELETE FROM events WHERE user_id=$1 AND event_id=$2', [user_id, event_id]);
    const result1=await data.query('DELETE FROM eventservice WHERE event_id=$1', [event_id]);
    const result3=await data.query('INSERT INTO notifications(date, content) VALUES ($1, $2)', [currentdate, `${first_name} ${last_name} deleted ${name}`])
    res.json({message:'Event Deleted'})
  } catch(err){
    res.json({error:"Database Error"});
  }
})

app.post('/logout', async(req, res)=>{
  res.clearCookie('user_id', {
    httpOnly:true,
    secure:false,
  }) 
  res.json({message:'You are logged out'})
})

app.post('/eventform', async(req, res)=>{
  const user_id=req.cookies.user_id;
  const{eventname, eventkind, eventdatetime, venueaddress, numattendees, colortheme, itemslist, services}=req.body;
  const query='INSERT INTO events(user_id, name, kind, event_datetime, address, number_of_attendees, color_theme, items_list) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING event_id'
  const query1='INSERT INTO eventservice(event_id, service_id) VALUES ($1,$2)'
  try{
    const currentdate=new Date();
    const result4=await data.query('SELECT first_name, last_name FROM users WHERE user_id=$1', [user_id]);
    const {first_name, last_name}=result4.rows[0];
    const result=await data.query(query, [user_id, eventname, eventkind, eventdatetime,venueaddress, numattendees, colortheme, itemslist]);
    const event_id=result.rows[0].event_id;
    for(const service of services){
      const result1=await data.query(query1, [event_id, service])
    }
    const result2=await data.query('INSERT INTO notifications(date, content) VALUES ($1, $2)', [currentdate, `${first_name} ${last_name} added an Event: ${eventname}`])
    res.json({message:'Event Added'})
  } catch(err){
    res.json({message:'Error'})
  }
});

app.get('/getadditional', async(req,res)=>{
  const user_id=req.cookies.user_id;
  const query="SELECT * FROM services";
  try{
    const result=await data.query(query);
    res.json(result.rows);
  } catch(err){
    res.json({message: 'Failed to get services'})
  }
})


app.post('/geteventdata', async(req, res)=>{
  const user_id=req.cookies.user_id;
  const {event_id}=req.body;
  const query="SELECT name, kind, event_datetime, address, number_of_attendees, color_theme, items_list FROM events WHERE event_id=$1;"
  try{
    const result=await data.query(query, [event_id]);
    console.log(result.rows[0])
    res.json(result.rows[0]);
  } catch(err){
    res.json({message:"Failed to get user data"});
  }
})

app.post('/getservicedata', async(req,res)=>{
  const user_id=req.cookies.user_id;
  const {event_id}=req.body;
  const query="SELECT service_id FROM eventservice WHERE event_id=$1";
  try{
    const result=await data.query(query, [event_id]);
    console.log(result.rows);
    res.json(result.rows);
  } catch(err){
    res.json({message: 'Failed to get service data'})
  }
})


app.post('/editform', async(req, res)=>{
  const user_id=req.cookies.user_id;
  const {event_id, eventname, eventkind, eventdatetime, venueaddress, numattendees, colortheme, itemslist, services}=req.body;
  const query='UPDATE events SET name=$1, kind=$2, event_datetime=$3, address=$4, number_of_attendees=$5, color_theme=$6, items_list=$7 WHERE event_id=$8'
  const query1='DELETE FROM eventservice WHERE event_id=$1'
  const query2='INSERT INTO eventservice(event_id, service_id) VALUES ($1, $2)'
  try{
    const currentdate=new Date();
    const result4=await data.query('SELECT first_name, last_name FROM users WHERE user_id=$1', [user_id]);
    const {first_name, last_name}=result4.rows[0];
    const result=await data.query(query, [eventname, eventkind, eventdatetime, venueaddress, numattendees,colortheme,itemslist,event_id])
    const result1=await data.query(query1, [event_id])
    for(const service of services){
      const result2=await data.query(query2, [event_id, service])
    }
    const result3=await data.query('INSERT INTO notifications(date, content) VALUES ($1, $2)', [currentdate, `${first_name} ${last_name} edited ${eventname}`])
    res.json({message:'Event Edited'})
  } catch(err){
    res.json({error:'Database Error'})
  }
})

app.get('/getusers', async(req, res)=>{
  const query='SELECT user_id, first_name, last_name FROM users ORDER BY last_name ASC;'
  try{
    const result=await data.query(query);
    res.json(result.rows)
    console.log(result.rows)
  } catch(err){
    res.json({error: 'Database Error'})
  }
})

app.get('/getevents', async(req, res)=>{
  const query='SELECT user_id, event_id, name FROM events ORDER BY event_datetime ASC;'
  try{
    const result=await data.query(query);
    res.json(result.rows);
  } catch(err){
    res.json({Error: 'Database Error'});
  }
})

app.get('/notifications', async(req, res)=>{
  const query='SELECT date, content FROM notifications ORDER BY date DESC;'
  try{
    const result=await data.query(query);
    console.log(result.rows);
    res.json(result.rows);
  } catch(err){
    res.json({error: 'Database Error'});
  }
})

app.post('/getuserinfo', async(req, res)=>{
  const {userid}=req.body;
  const query='SELECT first_name, last_name, email, phone_number FROM users WHERE user_id=$1;'
  try{
    const result=await data.query(query, [userid]);
    res.json(result.rows[0]);
  } catch(err){
    res.json({error: 'Database Error'});
  }
})

app.post('/geteventinfo', async(req, res)=>{
  const {eventid}=req.body;
  console.log(eventid);
  const query='SELECT user_id, name, kind, event_datetime, address, number_of_attendees, color_theme, items_list FROM events WHERE event_id=$1;'
  try{
    const result=await data.query(query, [eventid]);
    console.log(result.rows);
    res.json(result.rows[0]);
  } catch(err){
    res.json({error: 'Database Error'})
  }
})

app.post('/getservicenames', async(req, res)=>{
  const {eventid}=req.body;
  const query='SELECT * FROM services;'
  const query1='SELECT service_id FROM eventservice WHERE event_id=$1'
  try{
    const result=await data.query(query);
    const result1=await data.query(query1, [eventid]);
    const services=result.rows;
    const selectedservices=result1.rows;
    const serviceslist=[];
    for(const service of services){
      for(const service1 of selectedservices){
        if(service.service_id===service1.service_id){
          console.log('Putting in the array')
          serviceslist.push(service.service_name);
        }
      }
    }
    res.json(serviceslist);
  } catch(err){
    res.json({error: 'Database Error'})
  }
})


app.get('/', (req, res)=>{
  console.log('Recieved GET /');
  res.send("Hi. Welcome to our Zintas website");
});

module.exports=app;