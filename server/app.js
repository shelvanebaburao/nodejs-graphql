const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const app = express();
app.use('/graphql',graphqlHTTP({
    schema,
    graphiql:true
}))
app.listen(2000,()=>console.log('server listing of port 2000'));