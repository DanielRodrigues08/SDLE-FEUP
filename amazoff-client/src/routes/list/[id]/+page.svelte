<script>
  import { openedLists } from "../../stores.js";
  import { navigating } from "$app/stores";

  export let data;
  $: if ($navigating) openedLists.setCurrent(data.id);
</script>

<h1 class="text-center">{data.name}</h1>
<button class="btn btn-danger float-end mx-5">Close</button>

<div class="row row-cols-1 row-cols-md-5 g-4 my-5 mx-4">
  <div class="col">
    <div class="card">
      <div class="card-header text-center">Add Item</div>
      <div class="card-body">
        <form>
          <div class="mb-3">
            <label for="name" class="form-label">Item Name</label>
            <input
              type="text"
              class="form-control"
              id="name"
              placeholder="Enter item name"
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
            />
          </div>
          <button type="submit" class="btn btn-primary">Add</button>
        </form>
      </div>
    </div>
  </div>
  {#each data.items as item}
    <div class="col">
      <div class="card">
        <div class="card-header text-center">{item.name}</div>
        <div class="card-body">
          <ul class="list-group list-group-flush">
            <li class="list-group-item">
              Desired: <strong>{item.desired}</strong>
              <button
                class="btn btn-info btn-sm float-end ms-1"
                style="width:1.5rem;">+</button
              >
              <button
                class="btn btn-info btn-sm float-end"
                style="width:1.5rem;">-</button
              >
            </li>
            <li class="list-group-item">
              Purchased: <strong>{item.purchased}</strong>
              <button
                class="btn btn-info btn-sm float-end ms-1"
                style="width:1.5rem;">+</button
              >
              <button
                class="btn btn-info btn-sm float-end"
                style="width:1.5rem;">-</button
              >
            </li>
          </ul>
        </div>
        <div class="card-footer">
          <button class="btn btn-danger">Delete</button>
        </div>
      </div>
    </div>
  {/each}
</div>
