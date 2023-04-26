import { createSchema, createYoga } from "graphql-yoga";
import { createServer } from "node:http";

let todos = [
  {
    id: "1",
    text: "Learn GraphQL and SolidJS.",
    done: false,
  },
  {
    id: "2",
    text: "Build Server.",
    done: false,
  },
  {
    id: "3",
    text: "Build SolidJS client.",
    done: false,
  },
];

const yoga = createYoga({
  schema: createSchema({
    typeDefs: /* GraphQL */ `
      type Todo {
        id: ID!
        done: Boolean!
        text: String!
      }

      type Config {
        id: ID!
        name: String!
        value: String!
      }

      type Query {
        getTodos: [Todo]!
        getConfigs: [Config]!
        getConfig(name: String): Config
      }
      type Mutation {
        addTodo(text: String!): Todo
        setDone(id: ID!, done: Boolean): Todo
        setConfig(name: String, value: String): Config
      }
    `,
    resolvers: {
      Query: {
        getTodos: () => {
          return todos;
        },
      },
      Mutation: {
        addTodo: (_: unknown, { text }: { text: string }) => {
          const newTodo = {
            id: String(todos.length + 1),
            text,
            done: false,
          };
          todos.push(newTodo);
          return newTodo;
        },
        setDone: (_: unknown, { id, done }: { id: string; done: boolean }) => {
          const todo = todos.find((todo) => todo.id === id);
          if (!todo) {
            throw new Error("Todo not found");
          }
          todo.done = done;
          return todo;
        },
      },
    },
  }),
});

const server = createServer(yoga);

server.listen(4000, () => {
  console.info("Server is running on http://localhost:4000/graphql");
});
