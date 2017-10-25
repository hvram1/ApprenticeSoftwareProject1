# *************************************************
#   SERVER SIDE - Filter the data when it arrives
# *************************************************
## Assume the below details are available at server
#### main object contains the entire event data till the current time
#### Client_Obj = [CUID1,CUID2,CUID3,..] - Client_Obj is an array to store the client ids.
#### Client_UIDs = { CUID1 : [P1,IP1], CUID2 : [P1,IP1], CUID3 : [P1,IP1],..}

#### Time complexity of the program is O(n) , if Client_Obj.length is n. 

GET Event_data;
DO
    IF (Client not Present) 

        STORE Event_data in Main_Obj;

    END IF

    ELSE

        FOR (EACH Obj in Client_Obj)

            FETCH Filter_Variables(Values may be [P1(program_name),IP1(IP address),etc]);

            FOR ( i=0; i< (Filter_Variables.Length - 1 ) ; i++) 

                COMPARE Filter_Variables[i] with Event_data.KeyValue;

                    IF (Comparison is TRUE)
                        CONTINUE;
                    END IF

                    ELSE
                        SET FLAG TO 0
                        BREAK;
                    END ELSE 

            END FOR

            IF(FLAG) 
            SEND Event_data to Obj (it's Client id);
            END IF
        
         END FOR
        STORE Event_data in Main_Obj;

    END ELSE

END DO


