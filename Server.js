var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    http = require('http'), 
    uid = require('uid'),
    data = {},
    logs = {},
    logstream = {},
    connectedclients = {},
    count = 0,
    eid,
    keyfields,
    cid;
    
   // eid=uid();

var server = http.createServer(app).listen('8080','10.200.208.44');
var io = require('socket.io').listen(server);
//parsing the text or string
app.use(bodyParser.text());

server.on('listening', function ()
{
    console.log('server listening');

});

app.get('/', function (req, res)  
{
    res.send('HOME PAGE');
      
});

app.get('/socket.io/socket.io.js', function (req, res) 
{
    res.sendFile(__dirname + '/node_modules/socket.io-client/lib/socket.io.js');
  
});

// when a  client request, the below function works.it routes to an api /logdetails

app.get('/logdetails', function (req, res) 
{
     res.sendFile(__dirname + '/client1.html');
});


io.on('connection', function (socket) 
{
    count +=  1;
    console.log('.............................');
    console.log('A user is connected');
    console.log(count + ' '+ 'client connected with id ' +' '+ socket.id);
    cid = socket.id;
    createclientsids(cid);

    socket.on('initial',function(res)
    { 
        console.log('response from client', res);
        socket.emit('Eventlogs', data);

    });

    socket.on('disconnect',function()
    {
        count-=1;
        console.log('.............................');
        console.log('client disconnected with id' +' '+ socket.id);
        deleteclients(socket.id);

    });

});
 
app.post('/eventslogs' , function (req, res) 
{

    // parsing the request body
    keyfields = JSON.parse(req.body);
    console.log("req.body"+ JSON.stringify(keyfields,1,1));
    for(var key in  keyfields)
    {
        logs[key] = keyfields[key];
        console.log('key + logs.key'+ key + logs[key]);
    }

    eid = uid();
    //if (connectedclients && connectedclients =="undefined" || connectedclients == 'null')
    if (Object.keys(connectedclients).length)
    {
        /*  filtering checking code comes here */
        console.log('clients are connected');
        store(eid,logs);
    }

    else
    {
        console.log('clients are not connected');
        console.log('eid'+ eid)
        store(eid,logs);
    }

    res.end();
});

//creating clients ids
function createclientsids(d)
{
    connectedclients[d] = ' ';
    console.log('total clientsconnected'+' '+ count);
    console.log('the connected clients individual'+' '+JSON.stringify(connectedclients,null,2) );
}
// deleting disconnected clients
function deleteclients(dd)
{
    delete connectedclients[dd];
    console.log('total clientsconnected'+' '+ count);
    console.log('the connected clients'+ '  '+ JSON.stringify(connectedclients,null,2) );
}

//storing the data
function store(eid,logs)
{
    data[eid]=  data + logs;
    for(var key in data)
    {
    console.log('data.uid'+ key + JSON.stringify(data[key])); 
    }

}