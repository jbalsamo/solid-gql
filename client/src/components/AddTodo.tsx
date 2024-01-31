import type { Component } from "solid-js";

/**
 * Component for adding a todo item.
 *
 * @param {object} props - The properties for the component
 * @return {JSX.Element} The rendered component
 */
const AddTodo: Component = (props) => {
  const toggleHide = () => {
    let hide = document.getElementsByName("hide")[0];
    props.setHidden(hide.checked);
  };

  return (
    <div class='add-group'>
      <input
        class='addinput'
        type='text'
        size={40}
        maxLength={40}
        value={props.text}
        oninput={(evt) => props.setText(evt.currentTarget.value)}
      />
      <button class='addbutton' onclick={() => props.onAdd()}>
        Add
      </button>
      <div class='hidecheck'>
        <input
          type='checkbox'
          name='hide'
          id='hd'
          onclick={() => toggleHide()}
        />
        <label for='hd'>Hide Finished Items</label>
      </div>
    </div>
  );
};

export default AddTodo;
