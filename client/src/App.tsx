import { createClient } from "@urql/core";
import {
  Component,
  For,
  Show,
  createEffect,
  createMemo,
  createResource,
  createSignal,
} from "solid-js";
import AddTodo from "./components/AddTodo";
import Header from "./components/Header";
import Todos from "./components/Todos";

const client = createClient({
  url: "http://localhost:4000/graphql",
});

const [todos, { refetch }] = createResource(() =>
  client
    .query(
      `
    query {
      getTodos {
        done
        id
        text
      }
    } `,
      {}
    )
    .toPromise()
    .then(({ data }) => data.getTodos)
);

const App: Component = () => {
  const [text, setText] = createSignal("");
  const [hidden, setHidden] = createSignal(false);

  const toggle = async (id: string) => {
    await client
      .mutation(
        `
          mutation($id: ID!, $done: Boolean) {
            setDone(id:$id,done:$done) {
              id
            }
          }
        `,
        {
          id,
          done: !todos().find((todo) => todo.id === id).done,
        }
      )
      .toPromise();
    refetch();
  };

  const onAdd = async () => {
    await client
      .mutation(
        `
      mutation($text: String!) {
        addTodo(text: $text) {
          id
        }
      }`,
        { text: text() }
      )
      .toPromise();
    refetch();
    setText("");
  };

  const [count, setCount] = createSignal(0);
  createEffect(() => setCount(todos().length));
  return (
    <div class="app">
      <Header />
      <Todos
        todos={todos()}
        hidden={hidden()}
        toggle={toggle}
        count={count()}
      />
      <AddTodo
        text={text()}
        setText={setText}
        setHidden={setHidden}
        onAdd={onAdd}
      />
    </div>
  );
};

export default App;
