console.log("Starting index.js");

const app=require('./app');


const server=app.listen(process.env.PORT || 3000, () => console.log(`Server is listening on port 3000`));

server.on('error', (err)=>{
  console.error('Server error:', err);
});
