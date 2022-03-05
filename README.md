Hello, lets get started:
//Terminate all processes on port/  sudo lsof -i :3000
1. Start downloading/cloning project 
2. Once openned in IDE suggest running by entering "npm start" in terminal
3, Next Open up web browser and go to http://localhost:3000/graphql
   
Here are some done test queries however more specific and secure versions are called under User Model/createUser

#To create Company/Advance testing is being called User
mutation {
createCompany(companyInput:{name:"Add a name"}){
_id
name
}
}

#ADVANCED
mutation {
createUser(userInput:{name:"New", password:"namm"}){
_id
name
}
}

DATA from Database shows in terminal and advance will not allow more than one of same user, also password saved is encrypted

There are still more methods to build in new graphql however, built the persistence models for mongo parsing and look to have company found and password checked next.
