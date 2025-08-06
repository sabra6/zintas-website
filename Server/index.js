//Print this statement when server starts
console.log("Starting index.js");

//Imported files
const app=require('./app');

//Command app to listen through port 3000(local) or a port(in production) given by Railway for any changes or commands
const server=app.listen(process.env.PORT, () => console.log(`Server is listening through port`));

//Print the message if there are Server Errors
server.on('error', (err)=>{
  console.error('Server error:', err);
});
