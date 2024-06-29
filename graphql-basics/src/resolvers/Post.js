const Post = {
    author(_root, args, {userData}, info) {
        const {userId} = _root;
        return userData.find((user) => user.id.toString() === userId.toString());
    },
    comments(_root, args, {commentData}, info) {
        const {id} = _root;
        return commentData.filter((comment) => comment.postId.toString() === id.toString());
    }
}
export default Post;