var fs = require('fs');
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    http = require('http'), 
    uid = require('uid'),
    data = {}, // for appending the event data
    connectedclients = {}, // for appending connectedclients ids as keys with filter variables as values
    objectvalue = {}, // storing each eventdata value(say p1, u1,...) in the variable 'data object' with Eventids as values
    Eventids =[], // store the Eventids(sy eid1,..) corresponding to the event value (say - p1 / u1 / ip1,...)
    count = 0, // total clients connected status
    cid;
var fdata={};
var server = http.createServer(app).listen('8080','10.200.208.44');
var io = require('socket.io').listen(server);

//parsing the text or string
app.use(bodyParser.text());

// server listening function
server.on('listening', function ()
{
    console.log('server listening');               
});

// server sends data whenever Client connects to the server
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


// Below function starts when socket connection happens 
io.on('connection', function (socket) 
{
    count +=  1;
    console.log('.............................');
    console.log('A user is connected');
    console.log(count + ' '+ 'client connected with id ' +' '+ socket.id);
    cid = socket.id;
    // createclientsids(cid);
    var t = 0;
    var shortestarr = []; // storing event arrays of  filter variable which is having smaller array length 
    var shortestarrno;
    

    socket.on('filterVariable',function(da)
    {
        console.log('the parameters'+ ' '+da);
        createclientsids(cid,da);
        console.log('the fuction returns again');
        socket.emit('calculate',cid);
        console.log('after the socket');
       
    })
    socket.on('calculateSmallestArray',function(cid)
    {
        console.log('its entering into calculate');

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

        /* storing the event ids of the smallest array among all the filter variables say  p1 = [eid1,eid2] , U1 = [eid2,eid3,eid6].
        so the shortestarr will contains the filter variable p1's value    */

        shortestarr =  objectvalue[connectedclients[cid][shortestarrno]];
        console.log('the shortest array index and value of that index'+ shortestarrno+' '+shortestarr);
        for(var k = 0;k < shortestarr.length;k++)
        {
            var val = 0, count1 = 1;
            // connectedclients[cid].length shows the no of filter variables of that particular client.
            for(var j = 0; j < connectedclients[cid].length;j++)
            {
                // compare is an array contains the eids of that corresponding filter variable

                var compare = objectvalue[ connectedclients[cid][j] ];

                if(j == shortestarrno )
                {
                    // if the shortest array value is going to compare,skip the remaining steps and move on to next filter variable
                    continue;
                }

                /* if the eid or (shortestarr[k]) is present in the compare array then it will return the index of that eid 
                otherwise it will return ' -1 ' as the value */

                val = compare.indexOf(shortestarr[k]);

                if(val)
                {
                    /* if the compare array has the eid then count variable get incremented by one 
                    -> this one to ensure that all the filter variables array contains that particular eid
                    if all the variables contains that eid then count1 will have the same value equal to no of filter variables
                    */
                    count1++;
                }
                else
                {
                    /* if any filter variables array does not contain the eid,
                    then the checking for that particular eid comes to an end 
                    And it goes to check next eid in the shortest arr value
                    */
                    break;
                }
            }

            // checking there is any event id in all the filter Variables array

            if(count1 == (connectedclients[cid].length))
            {
                // after getting eid , checking that eid is present in the data object.
                if(data.hasOwnProperty(shortestarr[k]))
                {
                    console.log('filtered data id to the client'+' '+ shortestarr[k]+' '+ JSON.stringify(data[shortestarr[k]],null,2));
                    // sending the eid of that event to the client side
                    socket.emit('eid',shortestarr[k]);
                    // sending the that particular event data to the client
                    socket.emit('filtered data',JSON.stringify(data[shortestarr[k]],null,2));
                }

            }

        }



    });

    

    // Socket disconnection function
    socket.on('disconnect',function()
    {
        count-=1;
        console.log('.............................');
        console.log('client disconnected with id' +' '+ socket.id);
        deleteclients(socket.id);

    });
  

   

});

//creating clients ids
function createclientsids(cid,da)
{
    // reading a file to get the filter variables for the connected client
    var data = da;
    var str = data.toString();
    var arr = str.split(',');
    console.log(str);
    console.log(arr);
    connectedclients[cid] = arr;
    console.log('total clientsconnected'+' '+ count);
    console.log('the connected clients individual'+' '+JSON.stringify(connectedclients,null,2) );
}
// deleting disconnected clients 

function deleteclients(dd)
{
    // deleting disconnected clients in the stored connectedclients
    delete connectedclients[dd];
    console.log('total clientsconnected'+' '+ count);
    console.log('the connected clients'+ ' '+ JSON.stringify(connectedclients,null,2) );
}
app.post('/eventslogs' , function (req, res) 
{
   
    var keyfields; //to receive the event data
    var logs = {}; // to store the eventdata with unique id
    var eid; //to store unique Event id
   
    // parsing the request body
    keyfields = JSON.parse(req.body);
    console.log("req.body"+ JSON.stringify(keyfields,1,1));

    // to store the key with value from received data in new object to append
    for(var key in  keyfields)
    {
        logs[key] = keyfields[key];
        console.log('key + logs.key'+ key + logs[key]);
    }

    // creating unique id for the event
    eid = uid();
    
    /* Checking for Client is present or not.
     Object.keys(connectedclients) is an array contains the keys(client ids) of that object 'connectedclients'
    */
   if (Object.keys(connectedclients).length)
    {
        // /*  filtering checking code comes here */
        
        for(var obj in connectedclients)
        {
            var c = 1;
            console.log('initial c value'+ c);
            var propertyvalues = connectedclients[obj];
            for(var i = 0; i < propertyvalues.length ; i++)
            {

            console.log('the property values of the client'+ ' '+ obj +' '+propertyvalues[i])
            console.log('Object.values(logs).indexOf(propertyvalues[i])'+' '+ Object.values(logs).indexOf(propertyvalues[i]));
            if(Object.values(logs).indexOf(propertyvalues[i]) > -1)
            {
                continue;

            }
            else
            {
                c = 0;
                console.log('the data is not matching')
                break;
               
            }
           
           
            }

            console.log('the value of c after enter into the loop'+' '+c);

            if(c)
            {
                console.log('the  data is matching '+ ' '+ logs);
                 // sending the eid of that event to the client side
                io.to(obj).emit('eid',eid);
                // sending the that particular event data to the client
                io.to(obj).emit('filtered data',JSON.stringify(logs,null,2));
            }
            


        }
    
        console.log('clients are connected');
        store(eid,logs);
    }
    else
    {
        console.log('clients are not connected');
        console.log('eid'+ eid);
      
        store(eid,logs);
    }
    console.log('the log data'+ JSON.stringify(logs,null,2));
    res.end();
});



//Appending the data with Unique Event id 
function store(eid,logs)
{
    data[eid]=logs;
    console.log('data with data id' + ' '+ eid +' '+JSON.stringify(data[eid],null,2) );
    var temp = logs;

    /* If there is no property values as key in the object
     Initially or for the first time , Creating key as data property value 
     And values of that will be unique ids ,corresponds to that key */

    if(!Object.keys(objectvalue).length)
    {
        for(k in temp)
        {  
        console.log('enter into the if case to create a new one');
        // creating a new array for each property value
        objectvalue[temp[k]] = [];
        // adding the Event id to the newly created array
        objectvalue[temp[k]].push(eid);
        }
    }
    // If some property values as key in the object, it comes to the else part
    else
    {
        for(k in temp)
        {
            // checking the property value or key is present in that object
            if(objectvalue.hasOwnProperty(temp[k]))
            {
                console.log('enter into the has own property');
                // adding the new Event id to the existed array
                objectvalue[temp[k]].push(eid);
            }
            // the property value or key is not present in that object
            else
            {
                console.log('enter into else part of has own property since it has to create a new array for that property value');
                // creating an array for each property value
                objectvalue[temp[k]] = [];
                // adding the new Event id to the array
                objectvalue[temp[k]].push(eid);
            }
        }
    }
    console.log('object value'+JSON.stringify(objectvalue,null,2));
}