const express=require('express');
const cors=require('cors');
const data=require('./db');
const cookieparser = require('cookie-parser');

console.log("Setting up app.js")

const app=express();

app.use(cors());
app.use(cookieparser());
app.use(express.json());

app.post('/signup', async (req, res) => {
  const{firstname, lastname, email, password, phonenumber}=req.body;
  const query='INSERT INTO users(first_name, last_name, email, password, phone_number) VALUES ($1,$2,$3,$4,$5)'
  try{
    const result=await data.query(query, [firstname, lastname, email, password, phonenumber]);
    const result1=await data.query('SELECT user_id FROM users WHERE email=$1', [email]);
    const {user_id}=result1.rows[0];
    res.cookie('user_id', user_id,{
        httpOnly:true,
        secure:false,
    });
    res.json({message: 'User Added'})
  } catch (err){
    console.error('Database Error', err);
    res.json({error: "Entry failed"})
  }
});

app.post('/login', async (req, res)=>{
  const {email, password:inputpassword}=req.body;
  try{
    const result=await data.query('SELECT user_id, password FROM users WHERE email=$1', [email]);
    if(result.rows.length==0){
      return res.status(401).json({message:"Your account doesn't exist"})
    }

    const{user_id, password}=result.rows[0];

    if(password!==inputpassword){
      return res.status(401).json({message:'Login failed'})
    } else{
      res.cookie('user_id', user_id,{
        httpOnly:true,
        secure:false,
      });
      return res.json({message: 'success'})
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
    const result=await data.query('DELETE FROM events WHERE user_id=$1 AND event_id=$2', [user_id, event_id]);
    const result1=await data.query('DELETE FROM eventservice WHERE event_id=$1', [event_id]);
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
    const result=await data.query(query, [user_id, eventname, eventkind, eventdatetime,venueaddress, numattendees, colortheme, itemslist]);
    const event_id=result.rows[0].event_id;
    for(const service of services){
      const result1=await data.query(query1, [event_id, service])
    }
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
    const result=await data.query(query, [eventname, eventkind, eventdatetime, venueaddress, numattendees,colortheme,itemslist,event_id])
    const result1=await data.query(query1, [event_id])
    for(const service of services){
      const result2=await data.query(query2, [event_id, service])
    }
    res.json({message:'Event Edited'})
  } catch(err){
    res.json({error:'Database Error'})
  }
})

app.get('/', (req, res)=>{
  console.log('Recieved GET /');
  res.send("Hi. Welcome to our Zintas website");
});

module.exports=app;