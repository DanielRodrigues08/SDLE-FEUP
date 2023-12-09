<script>
	import { openedLists } from "./stores.js";

	export let data;

  $: openedLists.setCurrent(null);
</script>

<h1 class="text-center">Amazoff</h1>

<div class="card-group m-5">
  {#each data.lists as list}
    <div class="card" style="max-width: 20rem">
      <div class="card-header text-center">{list.name}</div>
      <div class="card-body">ID: {list.id}</div>
      <div class="card-footer">
        <button class="btn btn-primary">View</button>
        <button class="btn btn-danger">Delete</button>
      </div>
    </div>
  {/each}
</div>

