<script>
  import { openedLists } from "./stores.js";

  export let data;

  $: openedLists.setCurrent(null);
</script>

<h1 class="text-center mt-3">Amazoff</h1>

<div class="row row-cols-1 row-cols-md-5 g-4 m-5">
  {#each data.lists as list}
    <div class="col">
      <div class="card" style="max-width: 20rem">
        <div class="card-header text-center">{list.name}</div>
        <div class="card-body">ID: {list.id}</div>
        <div class="card-footer">
          <a class="btn btn-primary" href="/list/{list.id}">View</a> 
          <button class="btn btn-danger">Delete</button>
        </div>
      </div>
    </div>
  {/each}
</div>
