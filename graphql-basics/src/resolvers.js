import Query from "./resolvers/Query.js";
import Mutation from "./resolvers/Mutation.js";
import User from "./resolvers/User.js";
import Post from "./resolvers/Post.js";
import Comment from "./resolvers/Comment.js";
import Subscription from "./resolvers/Subscription.js";

export const resolvers = {Query, Mutation, User, Post, Comment, Subscription};