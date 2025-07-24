//Print this statement when server starts. Used to make sure server starts properly.
console.log("Starting index.js");

//Imported files
const app=require('./app');

//Command app to listen through port 3000 for any changes or commands. If server starts listening, the statement should be printing.
const server=app.listen(process.env.PORT || 3000, () => console.log(`Server is listening on port 3000`));

//Print the message if there are Server Errors.
server.on('error', (err)=>{
  console.error('Server error:', err);
});
