// Importing the file,crypto,uid modules   
var fs = require('fs');
var crypto = require('crypto');
var uid = require('uid');
// node object contains the whole merkle tree structure
var Merkle_Tree = {};
// To store the unique id for each node
var node_Uid;
// To store the Hashes of leaf nodes
var Leaf_hash=[];

// Getting data from  a text file
var data = fs.readFileSync('testcases.txt');
var str = data.toString();
// splitting the data with delimiter as ','
var Merkle_Proof = str.split(',');
// Creating Hashes for the leaf nodes
for(var i=0; i<Merkle_Proof.length;i++)
{
    var hash = crypto.createHash('sha256');
    hash.update(Merkle_Proof[i]);
// Converting the hashed value into hex format 
    var hex = hash.digest('hex');

    console.log(hex +'');
// Storing the hash 
// Note : Index of the Leaf_hash array starts with 1 to access easily
    Leaf_hash[i+1] = hex ;
}


// Function to Create node Structure
// It takes two parameters, they are Indexes of the first and last element in the Leaf_hash array
function Node(start_Index,last_Index)
{
// Calculating the number of elements between the index
    var diff = (last_Index - start_Index) + 1 ;
// If statement executes only if the array contains more than 2 elements
    if((diff) != 2)
    {
// To store the Middle Vlaue for even cases
        var Mid_Val ;
// To store the Appended hashes 
        var Append_hash;

// Only for even number cases
        if((diff) % 2 == 0)
        {
// To store the Intermediate node hash
            var Inter_Left,Inter_Right;
// To store the number of remaining elements                   
            var mod = (diff) % 4 ;
// for the even values less than 4 and mod = 0 (says the array has to split into half )
// if statement is only for the no of elements 2 and 4
            if(mod == 0)
            {
// Finding the Middle Vlaue for even cases
            Mid_Val = (diff) / 2;
// Appending the hash of the different nodes
            Append_hash = (Inter_Left = Node(start_Index,Mid_Val)) +(Inter_Right = Node(Mid_Val+1,last_Index)); 
            
            }
// else statement for all even cases greater than 4
            else
            {

            Append_hash =(Inter_Left = Node(start_Index,last_Index-mod) )  +(Inter_Right = Node((last_Index-mod)+1,last_Index) ) ; 
        
            }
    
        }

// Only for odd number cases
        else
        {          
            var mod = (diff) % 4 ;
// if statement is only for the no of elements less and equal to 4.
// This will suits for the no of elements 3
            if(mod == 1 || mod < 4)
            {
                 Append_hash = (Inter_Left = Node(start_Index,last_Index-1)  ) + (Inter_Right = Leaf_hash[last_Index] );
            }
 // else statement for all odd cases greater than 4           
            else
            {
                Append_hash = (Inter_Left = Node(start_Index,last_Index-mod) ) +(Inter_Right = Node((last_Index-mod)+1,last_Index) ) ; 
            }
                
        }

        var hash = crypto.createHash('sha256');
        hash.update(Append_hash);
        var hex = hash.digest('hex');
        node_Uid = uid();
        Merkle_Tree[node_Uid] = {Hash_Value:hex,Left_Node:Inter_Left,Right_Node:Inter_Right};
    
        return hex ;

    }
// To calculate the hash of the appended hashes 
    else
    {

    var Append_hash =  Leaf_hash[start_Index] + Leaf_hash[last_Index];
    var hash = crypto.createHash('sha256');
    hash.update(Append_hash);
    var hex1 = hash.digest('hex');
    // Assigning unique id for each node structure
    node_Uid = uid();
    // Creating node structure
    // each node structure contains hash value , left node and Right node
    Merkle_Tree[node_Uid] = {Hash_Value:hex1,Left_Node:Leaf_hash[start_Index],Right_Node:Leaf_hash[last_Index]}
    // hex1 is the intermediate node value or hashed value or root value 
    return hex1 ;

    }

}

// Storing the root value of the Merkle tree

 var Root = Node(1,Leaf_hash.length-1);


console.log('the root is',Root);
console.log('the tree structure is',Merkle_Tree);

// Getting the record for which the merkle proof should be done
// Calculating the hash for the record
var data = fs.readFileSync('Record.txt');
var h = crypto.createHash('sha256');
h.update(data.toString());
var hx = h.digest('hex');
// Initialise the Check value with the hash of that record
var check = hx;
// To store the related hashes of the record from which Merkle proof can be derived 
var Merkle_Proof = [];
// Assuming that root value of the merkle tree is known
// Initialise 'r' with root value
var r = 'b115437cdfa29f88a24fa3b7d1c25d93f3751227ac022119abe083ad8355c3ee';
console.log('the value of check'+ check);
console.log('the value of r'+ r);

// Initially, the function takes the hash of the record as a parameter 
auditprocess(check);
// To check the hash value in node structure
function auditprocess(check)
{
// hex - to store the hash value 
// k -to store index of every occurrence 
// index - to store index of the last occurrence
// Lkey - to store key of the last occurrence 
// flag is to identify whether to get left node value or right node value from node structure
        var hex,k,index,Lkey,flag;
    
        for(key in Merkle_Tree)
        {
// Checking the hash value whether it is present in the Merkle Tree or not
// If it is not present , then it returns -1 . Otherwise it returns the index of that occurrence.
             k = Object.values(Merkle_Tree[key]).lastIndexOf(check);
             if(k > 0)
             {
                 index = k;
                 Lkey = key;
                
             }
            
        }
        console.log('the key and the index'+' ' +Lkey+' '+index);

           
                if(index == 1)
                {
                    flag = 1
                    Merkle_Proof += ' '+ (Merkle_Tree[Lkey].Right_Node).toString() ;
               
                   
                }
                else
                {
                    flag = 2 
                    Merkle_Proof += ' ' + (Merkle_Tree[Lkey].Left_Node).toString();
                    
                   

                }
             
                var hash = crypto.createHash('sha256');
                var Append_hash1;
                if(flag == 1)
                {
                    Append_hash1 = check + Merkle_Tree[Lkey].Right_Node ;
                }
                else
                {
                    Append_hash1 = check + Merkle_Tree[Lkey].Left_Node ;
                }

                hash.update(Append_hash1);
                hex = hash.digest('hex');
                                       
        
console.log('the value of hex '+ hex);
// Auditprocess function invokes , till the checking(hash) value does not match the root value, 
 if(hex != r)
 {
     auditprocess(hex);
 }

}


// the arr contains all the related hashes to calculate merkle proof
console.log('The proof of containing the record 1'+ Merkle_Proof);



