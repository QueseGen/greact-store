const mongoose= require('mongoose');
const express= require('express');
const app = express();

const bodyParser= require('body-parser');
app.use(bodyParser.json());

const types='type Event {_id: ID! title: String! description: String! price: Float! date: String!} type User{ _id: ID! name: String! password: String! company: [Company] } type Company{ _id: ID! name: String! inventory: [Product] members: [User]} type Product{ _id: ID! name: String! description: String! price: Float! size: String! color: String! sold: Int! inventory: Int!}';
const inputs=' input EventInput { title: String! description: String! price: Float!} input UserInput { name: String! password: String! } input CompanyInput { name: String!} input ProductInput { name: String! description: String! price: Float! size: String! color: String! inventory: Int!}';
const queries=' type RootQuery { events:[Event!]! users:[User!]! companies:[Company!]! products:[Product!]!}';
const mutations=' type RootMutation { createEvent(eventInput: EventInput!): Event createUser(userInput: UserInput!): User createCompany(companyInput: CompanyInput!): Company createProduct(productInput: ProductInput!): Product Login(userInput: UserInput!): User addProduct(name: String! size: String! color: String! howmany: Int!): String}';
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
let currentuser = null;
let currentcompany=null;

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
        date: Date.now().getl
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
      return User.find({name: args.userInput.name}).
      then(user =>{
          if (user==null || typeof user === "undefined" || Object.keys(user).length === 0) {
            throw new Error('User not found.')
          } else{ //args.userInput.password!==user[0].password){//
            if (bcrypt.compare(args.userInput.password,user[0].password,(err, res) => {
              if (err) {
                console.error(err)
                return
              }
              console.log(res+ " "+ args.userInput.password) //true or false
            })){
            throw new Error('Password mismatch. Entered: ' + args.userInput.password + '\n'+user[0])
          } else { currentuser=user; console.log("Welcome "+ user[0].name+ "!")}
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
      return Company.findOne({name: args.companyInput.name}).then(comp =>{
        if (comp) {
          throw new Error('Company exists already.')
        } else if(currentuser!=null){
          throw new Error('Please login first.')
        }
        return args.companyInput.name()
      }).then( comp=>{
      const company= new Company({
        _id: Math.random().toString(),
        name:comp,
        members: [currentuser]
      });
      company.save()}).then(result => {
        console.log(result);
        return {...result.doc};
      }).catch(err => {
        console.log(err);
      });},
    products: ()=>{
      return Product.find().then( products=>{
        return products.map(product =>{
          return {...product._doc, _id: product._doc._id.toString()};
        });
      }).catch( err =>{console.log(err)});
    },
    createProduct:(args)=>{
      return Product.findOne({name: args.productInput.name}).then(product =>{
        if (product) {
          throw new Error('User exists already.')
        }
        return args.productInput.name
      }).then( pname =>{
        const product= new User({
          _id: Math.random().toString(),
          name:pname,
          description: args.productInput.description,
          price: args.productInput.price,
          size: args.productInput.size,
          color: args.productInput.color,
          instock: args.productInput.instock
        });
        product.save().then(result => {
          console.log(result);
          return {...result.doc};
        }).catch(err => {
          console.log(err);
        })
      });
     }},
    addProduct:(args)=>{//Check for: name: String!, size: Float!, color: String!, || add: amount: Int!
      if(currentcompany!=null){
        throw new Error('Please login first.')
      } else {

      }
},
  graphiql: true}));
// createEvent users /createUser
app.get('/',(req, res, next) => {res.send('Hello World!');
}) //add

mongoose.connect('mongodb+srv://ric:0lang@cluster0.ewjef.mongodb.net/users?retryWrites=true&w=majority').then(()=>{
  app.listen(3000);}).catch(err =>{
  console.log(err);
})
