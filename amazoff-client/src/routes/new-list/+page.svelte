<script>
    import { openedLists } from "../stores";
    import { goto } from "$app/navigation";
    let name = "";

    function handleEnter(e) {
        if (e.key === "Enter") {
            // copy list link to the clip board
            // redirect to new list
            const newList = {
                id: Math.floor(Math.random() * 20),
                name: name,
            };
            openedLists.add(newList);
            openedLists.setCurrent(newList.id);
            goto(`/list/${newList.id}`);
            name = "";
        }
    }
</script>

{#if name === ""}
    <p>Chose List Name</p>
{:else}
    <p>{name}</p>
{/if}
<label>
    <input type="text" bind:value={name} on:keydown={(e) => handleEnter(e)} />
</label>
