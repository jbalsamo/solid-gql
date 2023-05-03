import type { Component } from "solid-js";
import { For, Show } from "solid-js";

const Todos: Component = (props) => {
  return (
    <div class="todo-group">
      <div class="list-title">Todos Items - {props.count}</div>
      <For each={props.todos}>
        {({ id, done, text }) => (
          <Show when={!props.hidden || (props.hidden && !done)} fallback={""}>
            <div>
              <input
                type="checkbox"
                checked={done}
                onclick={() => props.toggle(id)}
              />
              <span> {text}</span>
            </div>
          </Show>
        )}
      </For>
    </div>
  );
};

export default Todos;
