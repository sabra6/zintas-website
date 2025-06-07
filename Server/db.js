const { Pool } = require('pg');

const pool=new Pool({
  connectionString: 'postgresql://postgres:WoXomSFbRvZPLFMiJrTJWzOuUfAXZNkE@yamabiko.proxy.rlwy.net:50455/railway', 
  ssl:{
    rejectUnauthorized:false,
  }, 
});

module.exports=pool;