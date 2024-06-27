import {createServer} from "node:http";
import {createYoga} from "graphql-yoga";
import { schema } from "./schema.js";

const yoga = createYoga({schema});

const server = createServer(yoga);

server.listen(3000, () => {
    console.log(`Server started on http://localhost:3000/graphql`);
})