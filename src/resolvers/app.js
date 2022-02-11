const mongoose= require('mongoose');
const express= require('express');
const app = express();

const bodyParser= require('body-parser');
app.use(bodyParser.json());

const types='type Event {_id: ID! title: String! description: String! price: Float! date: String!} type User{ _id: ID! name: String! password: String! company: [Company] } type Company{ _id: ID! name: String! inventory: [Product]} type Product{ _id: ID! name: String! price: Float! size: Float! color: String! sold: Int! instock: Int!}'
const inputs=' input EventInput { title: String! description: String! price: Float!} input UserInput { name: String! password: String! } input CompanyInput { name: String!}';
const queries=' type RootQuery { events:[Event!]! users:[User!]! companies:[Company!]! products:[Product!]!}';
const mutations=' type RootMutation { createEvent(eventInput: EventInput!): Event createUser(userInput: UserInput!): User createCompany(companyInput: CompanyInput!): Company}';
const schemas=' schema {query: RootQuery mutation: RootMutation}';
const query=types+inputs+queries+mutations+schemas;

const User=require('../model/user');
const Event=require('../model/event');
const Company=require('../model/company');
const Product=require('../model/product');

//const users=[];
const jwt = require('express-jwt');
const bcrypt= require('bcryptjs');
// authentication middleware
const authMiddleware = jwt({
  secret: 'secretsanta',
  algorithms: ['RS256'],
  credentialsRequired: false
})

app.use(authMiddleware)

const gqlHTTP =require('express-graphql');
const { buildSchema }= require('graphql');
app.use('/graphql', gqlHTTP.graphqlHTTP({
  schema: buildSchema(query),
  rootValue:{
    events: ()=>{
      return Event.find().then( events=>{
        return events.map(event =>{
          return {...event._doc, _id: event._doc._id.toString()};
        });
      }).catch( err =>{console.log(err)});
    },
    createEvent:(args) => {
      const event= new Event({
        _id: Math.random().toString(),
        title:args.eventInput.title,
        description:args.eventInput.description,
        price: args.eventInput.price,
        date: Date.now()
      });
      event.save().then(result => {
        console.log(result);
        return {...result.doc};
      }).catch(err => {
        console.log(err);
      });
    },
    users: ()=>{
    return User.find().then( users=>{
      return users.map(user =>{
        return {...user._doc, _id: user._doc._id.toString()};
      });
    }).catch( err =>{console.log(err)});
    },
    createUser:(args) => {
      return User.findOne({name: args.userInput.name}).then(user =>{
        if (user) {
          throw new Error('User exists already.')
        }
        return bcrypt.hash(args.userInput.password, 12);
      }).then( hashedPassword =>{
        const user= new User({
         _id: Math.random().toString(),
          name:args.userInput.name,
          password: hashedPassword,
          company:[]
      });
        user.save().then(result => {
          console.log(result);
          return {...result.doc};
        }).catch(err => {
          console.log(err);
        })
      });},
    Login:(args)=>{
      return User.findOne({name: args.userInput.name}).
      then(user =>{
          if (user!==true) {
            throw new Error('User not found.')
          } else{
            User.findById(args.userInput.name)
            if (user && args.userInput.password!==user.password){
            throw new Error('Password mismatch.')
          }
        }}).catch(err=> {
        console.log(err);
        });},
    companies: ()=>{
      return Company.find().then( companies=>{
        return companies.map(company =>{
          return {...company._doc, _id: company._doc._id.toString()};
        });
      }).catch( err =>{console.log(err)});
    },
    createCompany:(args) => {
      const company= new Company({
        _id: Math.random().toString(),
        name:args.companyInput.name,
        inventory: []
      });
      company.save().then(result => {
        console.log(result);
        return {...result.doc};
      }).catch(err => {
        console.log(err);
      });},
    addProduct:(args)=>{

}
      },
  graphiql: true}));

app.get('/',(req, res, next) => {res.send('Hello World!');
})

mongoose.connect('mongodb+srv://ric:0lang@cluster0.ewjef.mongodb.net/users?retryWrites=true&w=majority').then(()=>{app.listen(3000);}).catch(err =>{
  console.log(err);
})
