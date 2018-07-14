*Title: Documentation of response codes  
Date: 2018-03-10  
Author: Nico Gießmann*

# Documentation of response codes
### Annotations:
**!0...** : Error  
**!1...** : Success

***
## Error List:

**!01:** username already taken  
**!02:** username did not exist  
**!03:** username exists, password not correct  
**!04:** last 4 digits are not correct  
**!05:** password not updated  
**!06:** username and resetcode do not exist in combination  
**!07:** email not updated  
**!08:** username and password do not exist in combination  
**!09:** error when generate table  
**!010:** daily limit reached or database error  
**!011:** no report could be made  
**!012:** user not matchable  
**!013:** username from cookie not correct
**!014** php error
**!015** mysql error
**!016:** empty table because user is not logged in  
**!017** not possible to load bonus-content because user matchability equals 0 or 2  
**!018** user-guess needs more than 2 letters for offering users, less than 3 given  
**!019** user has no image, but only matchable=1 is allowed
**!020** no possible to create a table without making repetions -> delete usedUsers Cookie  
**!021** error when trying to get friendlist entries  
**!022** data input error, not all necessary data transmitted -> check javascript 

***
## Check List:

**!11:** new user entry successfully created in datebase  
**!12:** username exists, password correct  
**!13:** username does not exist  
**!14:** profile updated  
**!15:** matchability updated  
**!16:** last 4 digits are correct  
**!17:** password updated  
**!18:** email send  
**!19:** username and resetcode are correct  
**!110:** email updated  
**!111:** report made  

***
## Image_uploaded states:

**0:** no image uploaded (default)  
**1:** image already uploaded  
**2:** image changed  

***
## Usernamevalid states:

**0:** no able  
**1:** the same  
**2:** correct and changed

***
## Matchable states:

**0:** not able  
**1:** on  
**2:** able but off

***
## Report reasons:

**0:** fake identity  
**1:** inappropriate image  
**2:** inappropriate username  
**3:** inappropriate description  
**4:** false gender
