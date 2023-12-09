<script>
    import Permissions from "./Permissions.svelte";
    import { openedLists } from "./stores.js";
    // This should be a a svelte store to be shared amongst other components
</script>

<nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
        <a class="navbar-brand" href="/">
            <img
                src="/logo.png"
                alt="Logo"
                class="d-inline-block align-text-top"
            />
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
            <ul class="navbar-nav">
                {#each $openedLists.order as id}
                    <li
                        class="nav-item"
                        aria-current={$openedLists.current === id}
                    >
                        <a class="nav-link" href={`/list/${id}`}
                            >{$openedLists.lists[id].name}</a
                        >
                    </li>
                {/each}
            </ul>
        </div>
        <button class="btn btn-secondary mx-2">Sync</button>
        <a href="/add-list" class="btn btn-secondary">Add List</a>
    </div>
</nav>

<Permissions />
<slot />

<style>
    li.nav-item[aria-current="true"] {
        background-color: grey;
    }
    li.nav-item[aria-current="true"] > a {
        color: white;
    }
</style>

