const app=require('./app');

app.listen(process.env.PORT || 5000, () => console.log(`Server is listening on port 5000`));

process.on('exit', (code)=>{
  console.log(`Process existing with code ${code}`);
});

process.on('SIGINT', ()=>{
  console.log('Server Interrupted');
  process.exit();
});