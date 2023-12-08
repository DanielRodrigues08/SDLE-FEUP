<script>
    import NewListButton from "./NewListButton.svelte";
    // This should be a a svelte store to be shared amonsgt other components
    let openedLists = [
        {
            id: 1,
            name: "Blyat",
        },
        {
            id: 2,
            name: "Sucka",
        },
        {
            id: 3,
            name: "Lara",
        },
        {
            id: 4,
            name: "Daniel",
        },
    ];
</script>

<nav>
    <a href="/">home</a>
    <NewListButton />
    {#each openedLists as shoppingList}
        <a href={`/list/${shoppingList.id}`}>{shoppingList.name}</a>
    {/each}
</nav>

<slot />
