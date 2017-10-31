# Two Stage Smart Crawler:

#### *Prioritising the most relevant links and achieving wide coverage is the main goal.

#### *It is basically a java code that has 2 stages.1.Site locating 2. Insite exploring.

#### *It has a admin and a user where the admin crawls the data and makes it available for the user.

#### *Admin searches for a keyword using normal search engine such as bing,google and gets the search results(urls).This is site locating.

#### *Now he clicks on one link for insite exploring and we get the links present in the first link and here we do the ranking process to get the top 10 most relevant links based on the similarity score.This data crawled by the admin is made available to the user.

#### *User when searches for that particular data he will get the top 10 most relevant sites along with other url.


## ----------------------------------------------------------------------------------------------------------------------------


# Web Crawler with asyncio coroutines:

#### *Performance improvement by designing a non blocking code is the main goal.

#### *A web crawler finds and downloads all pages on a website.Beginning with a root url, it fetches each page,parses it for links to unseen pages and adds these to a queue. 

#### *It is a python code which uses coroutines with generators to build a async programming model without spaghetti callbacks.

#### *It uses callback functions.

#### *Coroutine is a routine that is cooperatively scheduled with other routines in the program.

#### *It mainatins a queue and reads chunks of data(4096 bytes) and puts it in the queue.

#### *When fetch() puts new links in the queue , it increments the count of unfinished tasks and keeps the main coroutine which is waiting for q.join paused.

#### *If there are no unseen links and this was the last URL in the queue then when work calls task-done that count of unfinished tasks falls to zero.Event unpauses join and the main coroutine completes.

#### *Unlike threads co-routine displays where our code can be interrupted and where it cannot.