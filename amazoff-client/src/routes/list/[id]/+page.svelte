<script>
  import { openedLists } from "../../stores.js";
  import { navigating } from "$app/stores";
  import { goto } from "$app/navigation";
  import { saveList } from "../../ShoppingListManager.js";
  import { BAWMap } from "crdts";
  import { userSettings } from "../../stores.js";

  export let data;
  $: if ($navigating) openedLists.setCurrent(data.id);

  let list;

  let newItem = {
    name: "",
    desired: 1,
    purchased: 0,
  };

  function closeList() {
    goto("/");
    openedLists.close(data.id);
  }

  function updateList(f) {
    return (params = []) => {
      f(...params);
      list = list;
      saveList(list);
    };
  }
  const changeQuantity = updateList((type, name, amount) =>
    list.changeQuantity(name, type, amount),
  );

  const addNewItem = updateList(() => {
    newItem.name = newItem.name.trim();
    if (newItem.name === "") {
      return;
    }
    list.addItem(newItem.name);
    list.items.get(newItem.name).get("desired").increment(newItem.desired);
    list.items.get(newItem.name).get("purchased").increment(newItem.purchased);
    document.getElementById("closeModalDoDani")?.click();
  });

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      addNewItem();
    }
  }
  function syncList() {
    if (!$userSettings.server) {
      return;
    }

    fetch($userSettings.server + "/postList", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: list.id,
        payload: list.items.toJSON(),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const crdt = BAWMap.fromJSON(data);
        list.items.merge(crdt);
        list = list;
        saveList(list);
      })
      .catch((err) => console.log(err));
  }
  let items;
  $: {
    if (data.id === $openedLists.current && $openedLists.lists[data.id]) {
      list = $openedLists.lists[data.id];
      items = [];
      for (const [key, value] of list.items.entries()) {
        items.push({
          name: key,
          desired: value.get("desired").value(),
          purchased: value.get("purchased").value(),
        });
      }
    }
  }

  $: {
    console.log(list);
  }
  let syncButton;
  $: {
    if ($userSettings.server) {
      syncButton = "btn-success";
    } else {
      syncButton = "btn-danger";
    }
  }
</script>

<h1 class="text-center mt-3">{list.name}</h1>
<button class="btn btn-danger float-end me-5" on:click={closeList}
  >Close List</button
>
<button
  class="btn btn-primary float-end me-2"
  data-bs-toggle="modal"
  data-bs-target="#addItem">Add Item</button
>
<button class="btn {syncButton} float-end mx-2" on:click={syncList}
  >Sync List</button
>

<!-- Modal for add item -->

<div class="modal fade" id="addItem" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5">Add item</h1>
        <button
          id="closeModalDoDani"
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div class="modal-body">
        <form>
          <div class="mb-3">
            <label for="name" class="form-label">Item Name</label>
            <input
              type="text"
              class="form-control"
              id="name"
              placeholder="Enter item name"
              bind:value={newItem.name}
              on:keydown={(e) => handleKeyDown(e)}
            />
          </div>
          <div class="mb-3">
            <label for="desired" class="form-label">Desired</label>
            <input
              type="number"
              class="form-control"
              id="quantity"
              placeholder="Desired quantity"
              min="1"
              bind:value={newItem.desired}
              on:keydown={(e) => handleKeyDown(e)}
            />
          </div>
          <div class="mb-3">
            <label for="purchased" class="form-label">Purchased</label>
            <input
              type="number"
              class="form-control"
              id="purchased"
              placeholder="Purchased quantity"
              min="0"
              bind:value={newItem.purchased}
              on:keydown={(e) => handleKeyDown(e)}
            />
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
          >Close</button
        >
        <button
          type="button"
          class="btn btn-primary"
          on:click={() => addNewItem([])}>Add</button
        >
      </div>
    </div>
  </div>
</div>

<!--  END add item -->

<div class="row row-cols-1 row-cols-md-5 g-4 my-5 mx-4">
  {#each items as item}
    <div class="col">
      <div class="card">
        <div class="card-header text-center">{item.name}</div>
        <div class="card-body">
          <ul class="list-group list-group-flush">
            <li class="list-group-item">
              Desired: <strong>{item.desired}</strong>
              <button
                class="btn btn-info btn-sm float-end ms-1"
                style="width:1.5rem;"
                on:click={() =>
                  changeQuantity(["desired", item.name, "increment"])}>+</button
              >
              <button
                class="btn btn-info btn-sm float-end"
                style="width:1.5rem;"
                on:click={() =>
                  changeQuantity(["desired", item.name, "decrement"])}>-</button
              >
            </li>
            <li class="list-group-item">
              Purchased: <strong>{item.purchased}</strong>
              <button
                class="btn btn-info btn-sm float-end ms-1"
                style="width:1.5rem;"
                on:click={() =>
                  changeQuantity(["purchased", item.name, "increment"])}
                >+</button
              >
              <button
                class="btn btn-info btn-sm float-end"
                style="width:1.5rem;"
                on:click={() =>
                  changeQuantity(["purchased", item.name, "decrement"])}
                >-</button
              >
            </li>
          </ul>
        </div>
        <div class="card-footer">
          <button
            class="btn btn-danger"
            on:click={() =>
              updateList(() => {
                list.removeItem(item.name);
                list = list;
              })([])}>Delete</button
          >
        </div>
      </div>
    </div>
  {/each}
</div>
