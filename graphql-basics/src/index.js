import {createServer} from "node:http";
import {createSchema, createYoga} from "graphql-yoga";
import {resolvers} from './resolvers.js';
import fs from "node:fs";
import path from 'path';
import { fileURLToPath } from 'url';
import {db} from "./db.js"
function getContext ({req}) {
    return db;
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const typeDefs = fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf-8");
const schema = createSchema({typeDefs, resolvers});
const yoga = createYoga({
    schema,
    context: getContext
});
const server = createServer(yoga);
server.listen(3000, () => {
    console.log(`Server started on http://localhost:3000/graphql`);
})