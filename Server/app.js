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

app.post('/login', async (req, res)=>{
  const {email, password:inputpassword}=req.body;
  try{
    const result=await data.query('SELECT user_id, password FROM users WHERE email=$1', [email]);
    //res.json(result.rows);
    if(result.rows.length==0){
      return res.status(401).json({message:"Your account doesn't exist"})
    }
    //const password=result.rows[0].password;

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