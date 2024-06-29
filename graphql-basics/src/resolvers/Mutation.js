import {GraphQLError} from "graphql";
import casual from "casual";
import {createPubSub} from "graphql-yoga";

const Mutation = {
    createUser(_root, {input: {email, name, age}}, {db: {userData}}, info) {
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
    deleteUser(_root, {input: {userId}}, {db: {userData, postData, commentData}}, info) {
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
    updateUser(_root, {input: {id, name, age, email}}, {db: {userData}}, info) {
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
    createPost: async (_root, {input: {title, body, published, author}}, {db:{userData}, pubsub}, info) => {
        const userExist = userData.some((user) => user.id.toString() === author.toLowerCase());
        if (!userExist) {
            throw new GraphQLError("User not found", {
                extensions: {
                    code: "USER_NOT_FOUND"
                }
            });
        }
        const newPost = {id: casual.uuid, body, title, published, userId: author};
        if (published) {
            pubsub.publish("createPost", {onCreatePost: {data: newPost, mutation:"CREATED"}});
        }
        return newPost;
    },
    deletePost(_root, {input: {postId}}, {db:{postData, commentData}, pubsub}, info) {
        const post = postData.find((post) => post.id.toString() === postId);
        if (!post) {
            throw new GraphQLError("Post not found", {extensions: {code: "NOT_FOUND"}});
        }
        postData = postData.filter((p) => p.id.toString() !== postId.toLowerCase());
        commentData = commentData.filter((comment) => comment.postId.toString() !== postId.toString());
        if (post.published) {
            pubsub.publish("deletePost", {onDeletePost: {mutation: "DELETED", data: post}});
        }
        return post;
    },
    updatePost(_root, {input: {id, title, body, published}}, {db:{postData}, pubsub}, info) {
        const post = postData.find((p) => p.id.toString() === id.toString());
        const originalPost = {...post};
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
        if (originalPost.published && (!post.published)) {
            pubsub.publish("deletePost", {onDeletePost: {mutation: "DELETED", data: originalPost}});
        } else if (!originalPost.published && post.published) {
            pubsub.publish("createPost", {onCreatePost: {mutation: "CREATED", data: post}});
        } else if (originalPost.published) {
            pubsub.publish("updatePost", {onUpdatePost: {mutation: "UPDATED", data: post}});
        }
        return post;
    },
    createComment(_root, {input: {text, post, author}}, {db:{postData, userData}, pubsub}, info) {
        const userExist = userData.some((user) => user.id.toString() === author.toLowerCase());
        const postExist = postData.some((p) => p.id.toString() === post.toString() && p.published);
        if (!userExist) {
            throw new GraphQLError("User not found", {extensions: {code: "USER_NOT_FOUND"}});
        }
        if (!postExist) {
            throw new GraphQLError("Post not found", {extensions: {code: "POST_NOT_FOUND"}});
        }
        const newComment = {id: casual.uuid, text, userId: author, postId: post};
        pubsub.publish(`comment ${post}`, {comment: {mutation: "CREATED",data: newComment}});
        return newComment;
    },
    deleteComment(_root, {input: {commentId}}, {db:{commentData}, pubsub}, info) {
        const comment = commentData.find((comment) => comment.id.toString() === commentId);
        if (comment) {
            throw new GraphQLError("Comment not found", {extensions: {code: "NOT_FOUND"}});
        }
        commentData = commentData.filter((comment) => comment.id.toString() !== commentId.toLowerCase());
        pubsub.publish(`comment ${comment.postId}`, {comment: {mutation: "DELETED",data: comment}});
        return comment;
    },
    updateComment(_root, {input: {id, text}}, {db:{commentData}, pubsub}, info) {
        const comment = commentData.find((comment) => comment.id.toString() === id.toString());
        if (!comment) {
            throw new GraphQLError("Comment not found", {extensions: {code: "NOT_FOUND"}});
        }
        if (typeof text === "string") {
            comment.text = text;
        }
        pubsub.publish(`comment ${comment.postId}`, {comment: {mutation: "UPDATED",data: comment}});
        return comment;
    }
};

export default Mutation;