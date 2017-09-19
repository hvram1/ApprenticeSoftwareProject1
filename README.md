# ApprenticeSoftwareProject1
This is a project that will help new software developers tune their software skills. This project is the first in the series of projects . This project will be the base line and will create a working project baseline . The subsequent projects will contain fine tuning of the design 
# Software Engineering 
I read a book [Apprenticeship Patterns: Guidance for the Aspiring Software Craftsman] (https://www.amazon.in/Apprenticeship-Patterns-Guidance-Aspiring-Craftsman/dp/8184048459?tag=googinhydr18418-21&tag=googinkenshoo-21&ascsubtag=82d37f98-b848-4dc5-9da4-1ccc0b811d3c) and have been inspired by it . This project is an attempt to create something on the same lines for the team of software engineers
Engineering is always about making the trade offs for the use case . Engineering is also about mastering the set of tools used in day to day jobs . A modern software engineer is expected to not only write the code but test and deploy it to production .  This should give you an idea of the expectation of what is required 

## What is the problem
A Logstream consists of a set of events / records . A record typically contains a header which includes the following identifiers ` programName UserName IPAddress TimeStamp `  and the `payload` . Assume the identifers are json strings and have a maximum length of 255 bytes . All records longer than 255 bytes are truncated .

The task is to write a server which will accept multiple of these Logstreams and then serves them to requesting clients ( browsers ). Assume the server stores all the LogStreams in memory .  

### The user interface expected at the browser should at contain atleast the following : 
      1. Time the last event occurred 
      2. Number of events available in the server after 1 . 
      3. Basic filtering capabilities ( by each of the parameters in the header of the record )
### Not in scope
      1. No need to provide pagination ( back / forward ). 

## What is expected output 
     1. Requirements document outlining the problem and the assumptions 
     2. Github project structure containing server . 
     3. Github project sub structure containing code to generate events to the server
     4. README containing instructions to checkout build install and test  
# How long should this take
      2 weeks 

# Typical workflow 
   1. Fork this project 
   2. Check in the code and send it a Git Pull Request
   
