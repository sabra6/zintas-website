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
  console.log("Email Recieved:", email)
  try{
    const result=await data.query('SELECT password FROM users WHERE email=$1', [email]);
    //console.log(result.rows)
    res.json(result.rows);
  } catch(err){
    res.json({error:"Database Error"});
    console.log("Database Error", err);
  }
});

app.get('/', (req, res)=>{
  console.log('Recieved GET /');
  res.send("Hi. Welcome to our Zintas website");
});

module.exports=app;