const express=require('express');
const cors=require('cors');
const data=require('./db');

console.log("Setting up app.js")

const app=express();

app.use(cors());
app.use(express.json());

app.get('/test', async (req, res) => {
  try {
    const result = await data.query('SELECT NOW()');
    res.json(result.rows);
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).send('Database error');
  }
});

app.get('/', (req, res)=>{
  console.log('Recieved GET /');
  res.send("Hi. Welcome to our Zintas website");
});

module.exports=app;