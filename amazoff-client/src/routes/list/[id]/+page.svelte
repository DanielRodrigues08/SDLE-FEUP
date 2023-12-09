<script>
    import { openedLists } from "../../stores.js";
    import { navigating } from "$app/stores";

    export let data;
    $: if ($navigating) openedLists.setCurrent(data.id);
    $: list = $openedLists.lists[data.id];
</script>

<h1>List Page {list.name}</h1>
