var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http');  
var io = require('socket.io')(server);
var logs={};
var logstream={};
// creating a global variables
var pname, uname, ip, time, pload, logs;

//parsing the text or string
app.use(bodyParser.text());
app.use(express.static('public'));

// Server listening to port 8080 
var server = http.createServer(app).listen(8080,function call()
{
    console.log('server address '+ server.address().address + ' listening to port '+ server.address().port ) ;
});


// home page returns
app.get('/', function (req, res) 
{
    res.send('HOME PAGE');
})




app.post('/eventslogs' , function (req, res) 
{


// parsing the data
// pname = logs.programName; uname = logs.UserName;ip = logs.IPaddress;time = logs.TimeStamp; pload = logs.PayLoad;


// parsing the request body
logs = JSON.parse(req.body);
console.log('the log stream data'+JSON.stringify(logs,null,2) );


// access the each event object
var Eventobj = logs.Batch[0];
console.log('log details'+ JSON.stringify(Eventobj,null,1) );


// extracting the each property or  key of an event object
console.log('pgm name'+ Eventobj.ProgramName);
console.log('*************************************')


for (var i = 0; i < logs.Batch.length; i++) {
    var c = i+1;
    var counter = logs.Batch[i];
    console.log('Event'+ c);
    console.log("Program name:"+counter.ProgramName);
    console.log("User name"+counter.UserName);
    console.log("IP address"+counter.IPaddress);
    console.log("Time stamp"+counter.TimeStamp);
    console.log("Payload"+counter.PayLoad);
  console.log('----------------------------------');
}

res.end();
//logstream = logstream + logs;
//console.log('different logtream'+JSON.stringify(logstream,null,2) );

})


// when a  client request, the below function works.it routes to an api /logdetails
app.get('/logdetails', function (req, res) 
{
  res.sendfile(__dirname + '/client.html');
});

// io socket connection 

io.on('connection', function (socket) 
{
  socket.on('initial',function(data)
    { 
      console.log('response from client', data);
      socket.emit('Eventlogs', logs);
    }       )
       
  // have to  emit when an update occurs
  socket.emit('updates',logs);

}    );
      
