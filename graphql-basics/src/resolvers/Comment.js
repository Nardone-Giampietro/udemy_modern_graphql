const Comment = {
    author(_root, args, {userData}, info) {
        const {userId} = _root;
        return userData.find((user) => user.id.toString() === userId.toString());
    },
    post(_root, args, {postData}, info) {
        const {postId} = _root;
        return postData.find((post) => post.id.toString() === postId.toString());
    }
}

export default Comment;