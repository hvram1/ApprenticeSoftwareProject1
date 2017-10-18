#******************************************************************************************************************
#                   SERVER SIDE - Filter the data when it arrives
#******************************************************************************************************************
## Assume the below details are available at sever
### main object contains the entire event data till that time
### Client_Obj = [CUID1,CUID2,CUID3,..] - Client_Obj is an array to store the client ids.
### Client_UIDs = { CUID1 : [P1,IP1], CUID2 : [P1,IP1], CUID3 : [P1,IP1],..}

#### Time complexity of the program is O(n) , if Client_Obj.length is n. 

GET Event_data;
Do
    IF (Client not Present) 
        STORE Event_data in Main_Obj;
    END IF

    ELSE

        FOR(EACH Obj in Client_Obj)

            FETCH filter variables(assume two values [P1(program_name),IP1(IP address)]);
            STORE the filter variable values in local variables(pgmname,ipadd);
            COMPARE pgmname with Event_data.programname;

            IF(TRUE)

                IF(COMPARE pgmname with Event_data.ipaddress)
                    SEND Event_data to Obj (it's Client id);
                END IF                
            END IF

         END FOR
        STORE Event_data in Main_Obj;
    END ELSE
END DO



#.........................................................................................................................

#**************************************************************************************************************************
#                  SERVER SIDE - Storing the Event_data in Main_obj
#**************************************************************************************************************************

## Assume the below details are available at sever
### main object contains the entire event data till that time
### Client_Obj = [CUID1,CUID2,CUID3,..] - Client_Obj is an array to store the client ids and CUID - Client UID
### LEI - Last Event Index , LEI = 0 , if client is created first. 
### Client_UIDs = { CUID1 : [ P1, IP1, LEI1], CUID2 : [ P1, IP1, LEI2], CUID3 : [ P1, IP1, LEI3 ],..}
### programname_Object ={ p1 : [ EUID1, EUID2, EUID3] , p2 : [ EUID1, EUID2, EUID3] , p3 : [ EUID1, EUID2, EUID3]  } and EUID - event UID
### EUID refers the Main_Obj
### Main_Obj structure - { EUID1:{ProgramName: p1, IPaddress : IP1, UserName :U1, TimeStamp : "7.77", Payload :"text" },
###                        EUID2:{ProgramName: p3 IPaddress : IP2, UserName :U2, TimeStamp : "5.87", Payload :"happy" },..}

#### Time complexity of the program is O(n*lei) , if Client_Obj.length is n and programname_Object.length is lei. 


GET Event_data
DO 
    STORE it in Main_Obj;
    
    IF (Client Present)
    
        FOR(EACH obj in Client_Obj)
            FETCH filter variables and LEI of that particular client (assume two values for filter and 
            last one - LEI { P1 (program_name), IP1 (IP address), LEI (Last Event Index) } );
            STORE the filter variable values in local variables( pgmname, ipadd, LEI);
            'lei' variable to store the last event index of that client.
            CHECK the ' Key-Value Pair ' exist in  programname_Object , according to the value of pgmname 
            THEN DO
                    FOR ( i = LEI ; i <= programname_Object.length)
                        FETCH EID and CHECK for IP address  (another filter variable) is same

                        IF(TRUE)

                            SEND Event_data to that obj ( CUID in Client_Obj)
                         
                        END IF

                    END FOR
                   lei = programname_Object.length;
                   WRITE the lei to that CUID.LEI--> lei
            END DO
        END FOR
    END IF

    END DO
#.............................................................................................................................                  
