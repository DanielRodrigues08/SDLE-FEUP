<script>
  import Permissions from "./Permissions.svelte";
  import SyncSettings from "./SyncSettings.svelte";
  import { openedLists } from "./stores.js";
  // This should be a a svelte store to be shared amongst other components
</script>

<nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid mx-5">
    <a class="navbar-brand" href="/">
      <img src="/logo.png" alt="Logo" class="d-inline-block align-text-top" />
    </a>
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="nav nav-tabs">
        {#if $openedLists.order.length > 0}
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              data-bs-toggle="dropdown"
              href="#"
              role="button"
              aria-expanded="false">Open Lists</a
            >

            <ul class="dropdown-menu">
              {#each $openedLists.order as id}
                {#if $openedLists.lists[id].id === $openedLists.current}
                  <li>
                    <p
                      class="dropdown-item"
                      href={`/list/${$openedLists.lists[id].id}`}
                    >
                      {$openedLists.lists[id].name}
                    </p>
                  </li>
                  <li><hr class="dropdown-divider" /></li>
                {:else}
                  <li>
                    <a
                      class="dropdown-item"
                      href={`/list/${$openedLists.lists[id].id}`}
                      >{$openedLists.lists[id].name}</a
                    >
                  </li>
                {/if}
              {/each}
            </ul>
          </li>
        {/if}
      </ul>
    </div>
    <Permissions />
    <SyncSettings />
    <a href="/add-list" class="btn btn-secondary">Add List</a>
  </div>
</nav>

<slot />
