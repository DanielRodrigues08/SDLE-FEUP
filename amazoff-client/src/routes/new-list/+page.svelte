<script>
    import { openedLists } from "../stores";
    import { goto } from "$app/navigation";
    import { createNewList } from "../ShoppingListManager";

    let name = "";

    async function handleEnter(e) {
        if (e.key === "Enter") {
            // copy list link to the clip board
            // redirect to new list
            debugger;
            const newList = await createNewList(name);
            goto(`/list/${newList.id}`);
        }
    }
</script>

{#if name === ""}
    <p>Chose List Name</p>
{:else}
    <p>{name}</p>
{/if}
<label>
    <input type="text" bind:value={name} on:keydown={ async (e) => await handleEnter(e)} />
</label>
