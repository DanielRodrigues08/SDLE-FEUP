<script>
    import { openedLists } from "../../stores.js";
    export let data;
    openedLists.setCurrent(data.id);
</script>

<h1>List Page {data.name}</h1>
