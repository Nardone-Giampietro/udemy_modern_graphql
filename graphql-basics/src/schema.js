import {createSchema} from "graphql-yoga";

const commentData = [{
    id: 1,
    text: 'Hello World!',
    userId: 2,
    postId: 1,
},{
    id: 2,
    text: 'Hello World! 2',
    userId: 1,
    postId: 2,
},{
    id: 3,
    text: 'Hello World! 3',
    userId: 2,
    postId: 2,
}, {
    id: 4,
    text: 'Hello World! 4',
    userId: 1,
    postId: 1,
}];

const userData = [{
    id: 1,
    name: "John",
    email: "john@example.com",
    age: 33
},{
    id: 2,
    name: "January",
    email: "january@example.com",
    age: 35
}];

const postData = [{
    id: 1,
    title: "Posto",
    body: "This is a post",
    published: false,
    userId: 1
},{
    id: 2,
    title: "Catecumeno",
    body: "This is also a post",
    published: true,
    userId: 2
},{
    id: 3,
    title: "Cavolo",
    body: "This is also a post 3",
    published: true,
    userId: 1
}];

export const schema = createSchema({
    typeDefs: `
    #graphql
    type Query {
        comments: [Comment]!
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        me: User!
        post: Post!
    }
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post]!
        comments: [Comment]!
    }
    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
    type Product {
        title: String!
        price: Float!
        releaseYear: Int
        rating: Float
        inStock: Boolean
    }
    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment]!
    }
    `,
    resolvers: {
        Query: {
            comments(_root,args, context, info){
                return commentData;
            },
            users(_root, {query}, context, info){
                if(query){
                    const data = userData.filter((user) => user.name.toLowerCase().includes(query.toLowerCase()));
                    return data;
                }
                return userData;
            },
            posts(_root, {query}, context, info){
                if(query){
                    const data = postData.filter((post) => {
                        const cond1 = post.title.toLowerCase().includes(query.toLowerCase());
                        const cond2 = post.body.toLowerCase().includes(query.toLowerCase());
                        return cond1 || cond2;
                    });
                    return data;
                }
                return postData;
            },
            me(_root, args, context, info) {
                const me = {
                    id: "skgl2882",
                    name: "Giampietro",
                    email: "giampietro@gmail.com",
                    age: 33,
                };
                return me;
            },
            post(_root, args, context, info) {
                const post = {
                    id: "ldsfklsdkfml",
                    title: "This is a Post",
                    body: "Body of the Post",
                    published: true
                }
                return post
            }
        },
        Post: {
            author(_root, args, context, info){
                const {userId} = _root;
                return  userData.find((user) => user.id.toString() === userId.toString());
            },
            comments(_root, args, context, info){
                const {id} = _root;
                return commentData.filter((comment) => comment.postId.toString() === id.toString());
            }
        },
        User: {
            posts(_root, args, context, info){
                const {id} = _root;
                return postData.filter((post) => post.userId.toString() === id.toString());
            },
            comments(_root, args, context, info){
                const {id} = _root;
                return commentData.filter((comment) => comment.userId.toString() === id.toString());
            }
        },
        Comment: {
           author(_root, args, context, info){
               const {userId} = _root;
               return userData.find((user) => user.id.toString() === userId.toString());
           },
           post(_root, args, context, info){
               const {postId} = _root;
               return postData.find((post) => post.id.toString() === postId.toString());
           }
        }
    }
});