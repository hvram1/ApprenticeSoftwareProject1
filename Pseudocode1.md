# *************************************************
#   SERVER SIDE - Filter the data when it arrives
# *************************************************
## Assume the below details are available at server
#### main object contains the entire event data till the current time
#### Client_Obj = [CUID1,CUID2,CUID3,..] - Client_Obj is an array to store the client ids.
#### Client_UIDs = { CUID1 : { PropertyName:P1, IPaddress:IP1}, 
####                 CUID2 : [ PropertyName:P1, IPaddress:IP1], 
####                 CUID3 : [PropertyName:P1, IPaddress:IP1],..}

#### Time complexity of the program is O(n) , if Client_Obj.length is n. 

GET Event_data;
DO
    IF (Client not Present) 

        STORE Event_data in Main_Obj;

    END IF

    ELSE

        FOR EACH Obj in Client_Obj
            
            FOR EACH key in Obj

             IF obj.hasOwnProperty(key)

                key == Program_Name

                         IF ( COMPARE obj.key with Event_data.Program_Name )
                               
                         END IF
                         ELSE
                         SET FLAG = 0;
                         BREAK;// coming out of the property checking since it failed in comparison

                key ==  IPaddress

                        IF ( COMPARE obj.key with Event_data.IPaddress)
                              
                        END IF
                        ELSE
                         SET FLAG = 0;
                    BREAK;
                 key == UserName
                         IF ( COMPARE obj.key with Event_data.UserName )
                                
                         END IF
                         ELSE
                         SET FLAG = 0;
                         BREAK;

                        END IF
                END FOR

                // we can have the above module for any number of variables.

                
                IF (FLAG)
                 SEND Event_data to Obj (it's Client id);      
                END 
        END FOR
                
                 STORE Event_data in Main_Obj;
               


           
    END ELSE

END DO


