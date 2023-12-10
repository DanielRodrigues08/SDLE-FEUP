<script>
  import { openedLists, userLists } from "./stores.js";
  import { goto } from "$app/navigation";
  import { pollForNewLists } from "./ShoppingListManager.js";

  pollForNewLists();
  setInterval(pollForNewLists, 5 * 1000);
  $: openedLists.setCurrent(null);
</script>

<h1 class="text-center mt-3">Amazoff</h1>

<div class="row row-cols-1 row-cols-md-5 g-4 m-5">
  {#each Object.keys($userLists) as link}
    <div class="col">
      <div class="card" style="max-width: 20rem">
        <div class="card-header text-center">{$userLists[link]}</div>
        <div class="card-body">ID: {link}</div>
        <div class="card-footer">
          <button
            class="btn btn-primary"
            on:click={() => {
              goto(`/list/${link}`);
            }}>View</button
          >
          <button class="btn btn-danger">Delete</button>
        </div>
      </div>
    </div>
  {/each}
</div>
