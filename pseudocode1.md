At server Side:
## SERVER SIDE - Store the Event_data in Hashmap with Event id as key.
##The Hasmap contains the whole event data from the source.
##The client requests are stored in a Hashmap with their respective Client_ids as key. 
## Client_id=[pname=p1,uname=u1,....]etc.
## SERVER SIDE - Filter the Event_data when it arrives from the source and stored in Hashmap.
## Assume the filtered data is stored in a Reverse_Hashmap with values(i) Of Event_id as keys and
## the Event_id's containing the values(i) as values.
## At Rerverse_Hashmap p1={eid1,eid2,...} u1={eid2,eid4,..} etc where eid is the Event_Id.


Get Event_data
DO
  Store it in a Hashmap;

  If(Client Present)
     Fetch Filter Variables from the client_id.
     Check if the Value-key pair exist in the Reverse_Hashmap
     THEN DO 
        FOR(Every value(i) in Client_id)
        
            Fetch Event_Id and CHECK next value(another filter variabl in Client_Id)

            CONTINUE to CHECK next value(another filter variable in Client_id) till you Check the last value(i).

         END FOR

          RETURN Event_id Common(Value(i)).

              THEN DO
              
                SEND Event_data to that Event_Id.

              END DO 

          ELSE IF (RETURN == NULL)

            SEND Error Report.
            
          END IF

      END DO

    END IF

END DO               
