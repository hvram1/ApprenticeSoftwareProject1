var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    http = require('http'), 
    uid = require('uid'),
    data = {},
    logstream = {},
    connectedclients = {},
    objectvalue = {},
    filtervar = [],
    Eventids =[],
    count = 0,
    eid,
    keyfields,
    cid;
var fdata={};
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

//creating clients ids
function createclientsids(d)
{
    connectedclients[d] = ['p1','U2'];
    console.log('total clientsconnected'+' '+ count);
    console.log('the connected clients individual'+' '+JSON.stringify(connectedclients,null,2) );
}

io.on('connection', function (socket) 
{
    count +=  1;
    console.log('.............................');
    console.log('A user is connected');
    console.log(count + ' '+ 'client connected with id ' +' '+ socket.id);
    cid = socket.id;
    createclientsids(cid);
    // connectedclients[cid] = ['p1','U2'];
    var t = 0;
    var shortestarr = [];// storing event arrays of  filter variable which is having smaller array length 
     var shortestarrno;

    for(var j = 0; j < connectedclients[cid].length;j++)
    { 
       
        Eventids = objectvalue[connectedclients[cid][j]];
        console.log('the Eventids '+ ' ' +Eventids);
        if(t == 0)
        {
            t = Eventids.length;
            shortestarrno = j;
          
        }
        else
        {
            if( t > Eventids.length)
            {
                 t = Eventids.length;
                 shortestarrno = j;  

            }

        }

        
    }
    
    shortestarr =  objectvalue[connectedclients[cid][shortestarrno]];// storing the event ids 
    console.log('the shortest array index and value of that index'+ shortestarrno+' '+shortestarr);

 
    for(var k = 0;k < shortestarr.length;k++)
    {
        var val = 0, count1 = 1;
        for(var j = 0; j < connectedclients[cid].length;j++)
        {
            var compare = objectvalue[ connectedclients[cid][j] ];
          
            if(j == shortestarrno )
            {
            continue;
            }
            val = compare.indexOf(shortestarr[k]);
            if(val)
            {
                count1++;
            }
            else
            {
                break;
            }
        }
        if(count1 == (connectedclients[cid].length))
        {
            if(data.hasOwnProperty(shortestarr[k]))
            {
                console.log('filtered data id to the client'+' '+ shortestarr[k]+' '+ JSON.stringify(data[shortestarr[k]],null,2));
                socket.emit('eid',shortestarr[k]);
                socket.emit('filtered data',JSON.stringify(data[shortestarr[k]],null,2));
            }

        }
        
    }

    console.log('total clientsconnected'+' '+ count);
    console.log('the connected clients individual'+' '+JSON.stringify(connectedclients,null,2) );

 
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
    var logs = {};

    // parsing the request body
    keyfields = JSON.parse(req.body);
    console.log("req.body"+ JSON.stringify(keyfields,1,1));
    for(var key in  keyfields)
    {
        logs[key] = keyfields[key];
        console.log('key + logs.key'+ key + logs[key]);
    }

    eid = uid();

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
console.log('the log data'+ JSON.stringify(logs,null,2));
    res.end();
});



// deleting disconnected clients
function deleteclients(dd)
{
    delete connectedclients[dd];
    console.log('total clientsconnected'+' '+ count);
    console.log('the connected clients'+ ' '+ JSON.stringify(connectedclients,null,2) );
}

//storing the data
function store(eid,logs)
{
   
        data[eid]=logs;
   
        console.log('data with data id' + ' '+ eid +' '+JSON.stringify(data[eid],null,2) );
       
        var temp = logs;

        if(!Object.keys(objectvalue).length)
        {
        
            for(k in temp)
            {  
                console.log('enter into the if case to create a new one');
                objectvalue[temp[k]] = [];
                objectvalue[temp[k]].push(eid);

            }
          
        }
        else
        {
            for(k in temp)
            {
                if(objectvalue.hasOwnProperty(temp[k]))
                {
                    console.log('enter into the has own property');

                    objectvalue[temp[k]].push(eid);
                }
                else
                {
                    console.log('enter into else part of has own property');
                    objectvalue[temp[k]] = [];
                    objectvalue[temp[k]].push(eid);
                }
            }
        }
    

    console.log('object value'+JSON.stringify(objectvalue,null,2));

}