export let commentData = [{
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

let userData = [{
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

let postData = [{
    id: 1,
    title: "Posto",
    body: "This is a post",
    published: true,
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

export const db = {
    userData,
    commentData,
    postData
}