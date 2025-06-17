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
    const result=await data.query('SELECT first_name FROM users WHERE user_id=$1', [user_id]);
    const {first_name}=result.rows[0];  
    res.json({name:first_name})
  } catch(err){
      res.json({error:"Database Error"});
  }
});

app.post('/logout', async(req, res)=>{
  res.clearCookie('user_id', {
    httpOnly:true,
    secure:false,
  }) 
  res.json({message:'You are logged out'})
})

app.post('/eventform', async(req, res)=>{
  
});

app.get('/', (req, res)=>{
  console.log('Recieved GET /');
  res.send("Hi. Welcome to our Zintas website");
});

module.exports=app;