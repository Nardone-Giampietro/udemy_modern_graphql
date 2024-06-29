import {GraphQLError} from "graphql";

const Subscription = {
    comment: {
        subscribe: async (_, {postId}, {db:{postData}, pubsub}) => {
            const post = postData.find(post => {
                return post.id.toString() === postId.toString() && post.published;
            });
            if (!post){
                throw new GraphQLError('Post not found.', {extensions:{code:"NOT_FOUND"}});
            }
            return pubsub.subscribe(`comment ${postId}`);
        }
    },
    onCreatePost: {
        subscribe: async (_, __, { pubsub }) => {
            return pubsub.subscribe(`createPost`);
        }
    },
    onDeletePost: {
        subscribe: async (_, __, { pubsub }) => {
            return pubsub.subscribe(`deletePost`);
        }
    },
    onUpdatePost: {
        subscribe: async (_, __, { pubsub }) => {
            return pubsub.subscribe(`updatePost`);
        }
    }
}

export default Subscription