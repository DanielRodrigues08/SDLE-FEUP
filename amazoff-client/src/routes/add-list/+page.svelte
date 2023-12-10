<script>
  import { openedLists, storageSettings } from "../stores";
  import { goto } from "$app/navigation";
  import { createNewList } from "../ShoppingListManager";
  let name = "";
  let listID = "";

  async function handleClick() {
    const proccessedName = name == "" ? "New List" : name;
    listID = listID.trim();
    const processedListId = listID === "" ? null : listID;
    const list = await createNewList(proccessedName, listID);
    const link = `/list/${list.id}`;
    goto(link);
  }

  $: openedLists.setCurrent(null);
</script>

<div class="container">
  <div class="row justify-content-center">
    <div class="col-6">
      <h1 class="text-center mt-3">Add List</h1>
      <form>
        <label for="inputName" class="form-label">Name</label>
        <input
          type="text"
          class="form-control"
          id="inputName"
          aria-describedby="inputNameHelp"
          bind:value={name}
        />
        <div id="inputNameHelp" class="form-text">
          Enter the name of the list you want to create. Only you will be able
          to see this name.
        </div>

        <label for="inputID" class="form-label">ID</label>
        <input
          type="text"
          class="form-control"
          id="inputID"
          bind:value={listID}
        />
        <div id="inputID" class="form-text">
          Provide the list's identifying number to create it. This ID will be
          used to share the list with others.
        </div>
        <div class="alert alert-warning mt-2" role="alert">
          If you provide an ID that exists in the cloud, you will modify the
          corresponding list.
        </div>
        <button
          type="submit"
          class="btn btn-primary float-end"
          on:click={handleClick}>Add</button
        >
      </form>
    </div>
  </div>
</div>
