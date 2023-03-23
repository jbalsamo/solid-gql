import { createClient } from "@urql/core";
import type { Component } from "solid-js";
import { createResource, createSignal, For, Show } from "solid-js";

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

  console.log("Default Hidden: ", hidden());
  const toggleHide = () => {
    let hide = document.getElementsByName("hide")[0];
    setHidden(hide.checked);
    console.log("Clicked Hidden: ", hidden());
  };

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
  return (
    <div class="app">
      <div>
        <span class="heading">Todo-List</span>
      </div>
      <div class="todo-group">
        <div class="list-title">Todos</div>
        <For each={todos()}>
          {({ id, done, text }) => (
            <Show when={!hidden() || (hidden() && !done)} fallback={""}>
              <div>
                <input
                  type="checkbox"
                  checked={done}
                  onclick={() => toggle(id)}
                />
                <span> {text}</span>
              </div>
            </Show>
          )}
        </For>
      </div>
      <div class="add-group">
        <input
          class="addinput"
          type="text"
          size={40}
          maxLength={40}
          value={text()}
          oninput={(evt) => setText(evt.currentTarget.value)}
        />
        <button class="addbutton" onclick={onAdd}>
          Add
        </button>
        <div class="hidecheck">
          <input
            type="checkbox"
            name="hide"
            id="hd"
            onclick={() => toggleHide()}
          />
          <label for="hd">Hide Finished Items</label>
        </div>
      </div>
    </div>
  );
};

export default App;
