var http = require('http');

var data =JSON.stringify({  "Batch": [  {
                                        "ProgramName":"p1" ,
                                        "UserName":"U1" ,
                                        "IPaddress":" 10.200.208.44" ,
                                        "TimeStamp":"7:77" ,
                                        "PayLoad":"hello"
                                        } ,

                                        {
                                        "ProgramName":"p2" ,
                                        "UserName":"U2" ,
                                        "IPaddress":" 10.200.208.44" , 
                                        "TimeStamp":"2:22" ,
                                        "PayLoad":"hai"
                                        },
                                        {
                                        "ProgramName":"p3" ,
                                        "UserName":"U3" ,
                                        "IPaddress":" 10.200.208.44" ,
                                        "TimeStamp":"3:33" ,
                                        "PayLoad":"hello"
                                        } ,

                                        {
                                        "ProgramName":"p2" ,
                                        "UserName":"U2" ,
                                        "IPaddress":" 10.200.208.44" ,
                                        "TimeStamp":"7:22" ,
                                        "PayLoad":"hai"
                                        }
                                    ]
           } ) ;
  

var options = {
                host: '10.200.208.44',
                port: 8080,
                path: '/eventslogs',
                method: 'POST',
                headers: 
                {
                    // 'Content-Type': 'application/jsondata',
                    'Content-Type': 'text/plain',
                    'Content-Length': Buffer.byteLength(data)
    
                }
             };

var req = http.request(options, function(res) 
                        {
                                    res.setEncoding('utf8');
                                    res.on('data', function (chunk) {
                                    console.log('got response from server ' + ' \n body: ' + chunk);
                                });
     
res.on('error', function (err){
                                console.log(err);
                               });

                        });
//writing json data on the specified end points
req.write(data);
//request ends
req.end();

