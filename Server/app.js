const express=require('express');
const cors=require('cors');

console.log("Setting up app.js")

const app=express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res)=>{
  console.log('Recieved GET /');
  res.send("Hi. Welcome to our Zintas website");
});

module.exports=app;