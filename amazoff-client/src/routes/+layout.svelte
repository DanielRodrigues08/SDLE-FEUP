<script>
    import { openedLists } from "./list/[id]/openedLists";
    // This should be a a svelte store to be shared amonsgt other components
</script>

<nav>
    <a href="/">home</a>
    <a href="/new-list">+</a>
    {#each $openedLists as shoppingList}
        <a href={`/list/${shoppingList.id}`}>{shoppingList.name}</a>
    {/each}
</nav>

<slot />
