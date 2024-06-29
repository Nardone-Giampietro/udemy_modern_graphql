import {GraphQLError} from "graphql";
import casual from "casual";

const Mutation = {
    createUser(_root, {input: {email, name, age}}, {userData}, info) {
        const emailTake = userData.some((user) => user.email === email);
        if (emailTake) {
            const error = new GraphQLError("Email already taken", {
                extensions: {
                    code: "EMAIL_TAKEN"
                }
            });
            return error;
        }
        const newUser = {id: casual.uuid, email, name, age, posts: [], comments: []};
        return newUser;
    },
    deleteUser(_root, {input: {userId}}, {userData, postData, commentData}, info) {
        const user = userData.find((user) => user.id.toString() === userId.toLowerCase());
        if (!user) {
            throw new GraphQLError("User not found", {extensions: {code: "NOT_FOUND"}});
        }
        userData = userData.filter((user) => user.id.toString() !== userId.toLowerCase());
        postData = postData.filter((post) => {
            const match = post.userId.toString() === userId.toLowerCase();
            if (match) {
                commentData = commentData.filter((comment) => comment.postId.toString() !== post.toString());
            }
            return !match
        });
        commentData = commentData.filter((comment) => comment.userId.toString() !== userId.toLowerCase());
        return user;
    },
    updateUser(_root, {input: {id, name, age, email}}, {userData}, info) {
        const user = userData.find((user) => user.id.toString() === id);
        if (!user) {
            throw new GraphQLError("User not found", {extensions: {code: "NOT_FOUND"}});
        }
        if (typeof email === "string") {
            const emailTake = userData.some((user) => user.email.toString() === email.toLowerCase());
            if (emailTake) {
                const error = new GraphQLError("Email already taken", {extensions: {code: "INVALID_INPUT"}});
                return error;
            }
            user.email = email;
        }
        if (typeof name === "string") {
            user.name = name;
        }
        if (typeof age !== "undefined") {
            user.age = age;
        }
        return user;
    },
    createPost(_root, {input: {title, body, published, author}}, {userData}, info) {
        const userExist = userData.some((user) => user.id.toString() === author.toLowerCase());
        if (!userExist) {
            throw new GraphQLError("User not found", {
                extensions: {
                    code: "USER_NOT_FOUND"
                }
            });
        }
        const newPost = {id: casual.uuid, body, title, published, userId: author};
        return newPost;
    },
    deletePost(_root, {input: {postId}}, {postData, commentData}, info) {
        const post = postData.find((post) => post.id.toString() === postId);
        if (!post) {
            throw new GraphQLError("Post not found", {extensions: {code: "NOT_FOUND"}});
        }
        postData = postData.filter((p) => p.id.toString() !== postId.toLowerCase());
        commentData = commentData.filter((comment) => comment.postId.toString() !== postId.toString());
        return post;
    },
    updatePost(_root, {input: {id, title, body, published}}, {postData}, info) {
        const post = postData.find((p) => p.id.toString() === id.toString());
        if (!post) {
            throw new GraphQLError("Post not found", {extensions: {code: "NOT_FOUND"}});
        }
        if (typeof title === "string") {
            post.title = title;
        }
        if (typeof body === "string") {
            post.body = body;
        }
        if (typeof published === "boolean") {
            post.published = published;
        }
        return post;
    },
    createComment(_root, {input: {text, post, author}}, {postData, userData}, info) {
        const userExist = userData.some((user) => user.id.toString() === author.toLowerCase());
        const postExist = postData.some((p) => p.id.toString() === post.toString() && p.published);
        if (!userExist) {
            throw new GraphQLError("User not found", {extensions: {code: "USER_NOT_FOUND"}});
        }
        if (!postExist) {
            throw new GraphQLError("Post not found", {extensions: {code: "POST_NOT_FOUND"}});
        }
        const newComment = {id: casual.uuid, text, userId: author, postId: post};
        return newComment;
    },
    deleteComment(_root, {input: {commentId}}, {commentData}, info) {
        const comment = commentData.find((comment) => comment.id.toString() === commentId);
        if (comment) {
            throw new GraphQLError("Comment not found", {extensions: {code: "NOT_FOUND"}});
        }
        commentData = commentData.filter((comment) => comment.id.toString() !== commentId.toLowerCase());
        return comment;
    },
    updateComment(_root, {input: {id, text}}, {commentData}, info) {
        const comment = commentData.find((comment) => comment.id.toString() === id.toString());
        if (!comment) {
            throw new GraphQLError("Comment not found", {extensions: {code: "NOT_FOUND"}});
        }
        if (typeof text === "string") {
            comment.text = text;
        }
        return comment;
    }
};

export default Mutation;