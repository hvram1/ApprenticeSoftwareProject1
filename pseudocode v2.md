# *************************************************
#   SERVER SIDE - Filter the data when it arrives
# *************************************************
## Assume the below details are available at server
#### main object contains the entire event data till the current time
#### Client_Obj = [CUID1,CUID2,CUID3,..] - Client_Obj is an array to store the client ids.
#### Client_UIDs = { CUID1 : { PropertyName:P1, IPaddress:IP1,etc}, 
####                 CUID2 : [IPaddress:IP1,PropertyName:P1,etc], 
####                 CUID3 : [UserName: U1, IPaddress:IP1],..}

#### Time complexity of the program is O(n) , if Client_Obj.length is n. 

GET Event_data;
DO
    IF (Client not Present) 

        STORE Event_data in Main_Obj;

    END IF

    ELSE

        FOR EACH Obj in Client_Obj
            
            FOR EACH key in Obj

            
             IF ( CHECK key in Event_data  )
                COMPARE obj.key with Event_data.key
                CONTINUE; 
             END IF
             ELSE
                SET FLAG = 0;
                BREAK; // coming out of the property checking since it failed in comparison
            
             END ELSE
            END FOR

        IF (FLAG)
            SEND Event_data to Obj (it's Client id);      
        END

        END FOR
                
    STORE Event_data in Main_Obj;
               
    END ELSE

END DO


