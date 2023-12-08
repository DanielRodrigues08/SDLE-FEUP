<script>
  import { openedLists } from "./stores.js";
  // This should be a a svelte store to be shared amongst other components
</script>

<nav class="navbar bg-body-tertiary">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">
      <img
        src="/logo.png"
        alt="Logo"
        class="d-inline-block align-text-top"
      />
      Amazoff
    </a>
  </div>
</nav>

<nav>
  <a href="/">home</a>
  <a href="/new-list">+</a>
  {#each $openedLists.order as id}
    <a href={`/list/${id}`}>{$openedLists.lists[id].name}</a>
  {/each}
</nav>

<slot />
