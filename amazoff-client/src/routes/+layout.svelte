<script>
    import { openedLists } from "./stores.js";
    // This should be a a svelte store to be shared amonsgt other components
</script>

<nav>
    <a href="/">home</a>
    <a href="/new-list">+</a>
    {#each $openedLists.order as id}
        <a href={`/list/${id}`}>{$openedLists.lists[id].name}</a>
    {/each}
</nav>

<slot />
