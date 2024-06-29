const User = {
    posts(_root, args, {postData}, info) {
        const {id} = _root;
        return postData.filter((post) => post.userId.toString() === id.toString());
    },
    comments(_root, args, {commentData}, info) {
        const {id} = _root;
        return commentData.filter((comment) => comment.userId.toString() === id.toString());
    }
};

export default User