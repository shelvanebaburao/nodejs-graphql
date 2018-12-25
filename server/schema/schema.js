const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');

const { 
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLSchema,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

/* var books = [
    {name:'book 1 ',genre:'Wi-fi',id:'1',authorid:'1'},
    {name:'book 2 ',genre:'History',id:'2',authorid:'1'},
    {name:'book 3 ',genre:'Wi-fi',id:'3',authorid:'3'},
    {name:'book 4 ',genre:'History',id:'4',authorid:'2'},
    {name:'book 5 ',genre:'Sports',id:'5',authorid:'1'}
];

var authors = [
    {name:'author 1 ',age:15,id:'1',bookid:1},
    {name:'author 2 ',age:18,id:'2',bookid:1},
    {name:'author 3 ',age:22,id:'3',bookid:1},
    {name:'author 4 ',age:25,id:'4',bookid:1},
    {name:'author 5 ',age:28,id:'5',bookid:1}
]; */

const BookType = new GraphQLObjectType({
    name:'Book',
    fields:()=>({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        genre:{type:GraphQLString},
        author:{
            type:AuthorType,
            resolve(parent,args){
                //return _.find(authors,{id:parent.authorid});
                return Author.findById(parent.authorid);
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name:'Author',
    fields:()=>({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        age:{type:GraphQLInt},
        books:{
            type: new GraphQLList(BookType),
            resolve(parent,args){
                //return _.filter(books,{authorid:parent.id});
                return Book.find({authorid:parent.id});
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        book:{
            type:BookType,
            args:{id:{type:GraphQLID}},
            resolve(parent,args){
                //code to retrive data from db/ other resource
                //return _.find(books,{id:args.id});
                return Book.findById(args.id);
            }
        },
        author:{
            type:AuthorType,
            args:{id:{type:GraphQLID}},
            resolve(parent,args){
                //code to retrive data from db/ other resource
                //return _.find(authors,{id:args.id});
                return Author.findById(args.id);
            }
        },
        books:{
            type:new GraphQLList(BookType),
            resolve(params,args){
                //return books;
                return Book.find({});
            }
        },
        authors:{
            type:new GraphQLList(AuthorType),
            resolve(params,args){
                //return authors;
                return Author.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name:"Mutation",
    fields:{
        addAuthor:{
            type:AuthorType,
            args:{
                name:{type:new GraphQLNonNull(GraphQLString)},
                age:{type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent,args, context, info){
                console.log(parent, args, context, info);
                let author = new Author({
                    name:args.name,
                    age:args.age
                });
                return author.save();
            }
        },
        addBook:{
            type:BookType,
            args:{
                name:{type:new GraphQLNonNull(GraphQLString)},
                genre:{type:new GraphQLNonNull(GraphQLString)},
                authorid:{type:new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent,args){
                let book = new Book({
                    name:args.name,
                    genre:args.genre,
                    authorid:args.authorid
                });
                return book.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query:RootQuery,
    mutation:Mutation
});