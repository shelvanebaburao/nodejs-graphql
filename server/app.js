const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
//const Book = require('./models/book');
//const Author = require('./models/author');
const mongoose = require('mongoose');
const app = express();

// connect to the mlab database

//mongodb://<dbuser>:<dbpassword>@ds243054.mlab.com:43054/nodejs-graphql
//make sure to replace mydb string & creds with you own
mongoose.connect('mongodb://nguser:nguser123@ds243054.mlab.com:43054/nodejs-graphql')
mongoose.connection.once('open',()=>{
    console.log('connected to mlab database');
})
app.use('/graphql',graphqlHTTP({
    schema,
    graphiql:true
}))
app.listen(3000,()=>console.log('server listing of port 3000'));