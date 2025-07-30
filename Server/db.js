//Imported files
const { Pool } = require('pg');
require('dotenv').config();

//Database information in order to connect
const pool=new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:{
    rejectUnauthorized:false,
  }, 
});

module.exports=pool;