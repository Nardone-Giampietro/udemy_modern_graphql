const Query= {
    comments(_root, args, {commentData}, info) {
        return commentData;
    },
    users(_root, {query}, {userData}, info) {
        if (query) {
            const data = userData.filter((user) => user.name.toLowerCase().includes(query.toLowerCase()));
            return data;
        }
        return userData;
    },
    posts(_root, {query}, {postData}, info) {
        if (query) {
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
};

export default Query;