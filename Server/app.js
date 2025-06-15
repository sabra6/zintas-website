const express=require('express');
const cors=require('cors');
const data=require('./db');

console.log("Setting up app.js")

const app=express();

app.use(cors());
app.use(express.json());

app.post('/signup', async (req, res) => {
  const{firstname, lastname, email, password, phonenumber}=req.body;
  const query='INSERT INTO users(first_name, last_name, email, password, phone_number) VALUES ($1,$2,$3,$4,$5)'
  try{
    const result=await data.query(query, [firstname, lastname, email, password, phonenumber])
    res.json({message: 'User Added'})
  } catch (err){
    console.error('Database Error', err);
    res.json({error: "Entry failed"})
  }
});

app.get('/login', async (req, res)=>{
  const email=req.query.email;
  try{
    const result=await data.query('SELECT password FROM users WHERE email=$1', [email]);
    res.json(result.rows);
    console.log("Sent to Frontend:", result.rows);
  } catch(err){
    res.json({error:"Database Error"});
    console.error("Database Error", err);
  }
});

app.get('/eventform', async(req, res)=>{
  const eventname=req.query.eventname;
  const eventkind=req.query.eventkind;
  const eventdatetime=req.query.eventdatetime;
  const venueaddress=req.query.venueaddress;
  const numattendees=req.query.numattendees;
  const colortheme=req.query.colortheme;
  const itemslist=req.query.itemslist;

});

app.get('/', (req, res)=>{
  console.log('Recieved GET /');
  res.send("Hi. Welcome to our Zintas website");
});

module.exports=app;